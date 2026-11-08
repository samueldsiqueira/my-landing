// Biblioteca mínima de pixel art: tela RGBA, primitivas, contorno automático e PNG.
// Sem dependências (zlib do Node). Usada por scripts/pixel/build.mjs.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { deflateSync } from 'node:zlib';

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};

/** PNG RGBA de 8 bits, sem filtro (as imagens são pequenas e o deflate resolve). */
export function encodePNG(width, height, rgba) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    Buffer.from(rgba.buffer, rgba.byteOffset + y * stride, stride).copy(raw, y * (stride + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** '#rrggbb' ou '#rrggbbaa' → [r, g, b, a]. */
export const hex = (value) => {
  const v = value.replace('#', '');
  return [0, 2, 4, 6].map((i, k) => (k === 3 && v.length === 6 ? 255 : parseInt(v.slice(i, i + 2), 16)));
};

const toRGBA = (c) => (typeof c === 'string' ? hex(c) : c);

/** Mistura duas cores (t = 0 → a, 1 → b). */
export const mix = (a, b, t) => {
  const [x, y] = [toRGBA(a), toRGBA(b)];
  return x.map((v, i) => Math.round(v + (y[i] - v) * t));
};

/** Gerador pseudoaleatório determinístico (mulberry32). */
export const rng = (seed) => {
  let s = typeof seed === 'number' ? seed : [...seed].reduce((h, ch) => Math.imul(h ^ ch.charCodeAt(0), 2654435761), 7);
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Matriz de Bayer 4×4 para pontilhado ordenado. */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
export const bayer = (x, y) => BAYER[(y & 3) * 4 + (x & 3)];

export class Pix {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.d = new Uint8Array(w * h * 4);
  }

  inside(x, y) {
    return x >= 0 && y >= 0 && x < this.w && y < this.h;
  }

  get(x, y) {
    if (!this.inside(x, y)) return [0, 0, 0, 0];
    const i = (y * this.w + x) * 4;
    return [this.d[i], this.d[i + 1], this.d[i + 2], this.d[i + 3]];
  }

  alpha(x, y) {
    return this.inside(x, y) ? this.d[(y * this.w + x) * 4 + 3] : 0;
  }

  set(x, y, c) {
    x = Math.round(x);
    y = Math.round(y);
    if (!this.inside(x, y) || c == null) return this;
    const [r, g, b, a] = toRGBA(c);
    const i = (y * this.w + x) * 4;
    this.d[i] = r;
    this.d[i + 1] = g;
    this.d[i + 2] = b;
    this.d[i + 3] = a;
    return this;
  }

  clear(x, y) {
    return this.set(x, y, [0, 0, 0, 0]);
  }

  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
    return this;
  }

  line(x0, y0, x1, y1, c) {
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.set(x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y0 += sy;
      }
    }
    return this;
  }

  /** Elipse cheia (teste no centro do pixel). `c` pode ser função (x, y) → cor. */
  ellipse(cx, cy, rx, ry, c) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const nx = (x + 0.5 - cx) / rx;
        const ny = (y + 0.5 - cy) / ry;
        if (nx * nx + ny * ny <= 1) this.set(x, y, typeof c === 'function' ? c(x, y) : c);
      }
    return this;
  }

  /** Polígono cheio (par-ímpar, teste no centro do pixel). */
  poly(points, c) {
    const ys = points.map((p) => p[1]);
    for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++) {
      const py = y + 0.5;
      const xs = [];
      for (let i = 0; i < points.length; i++) {
        const [x1, y1] = points[i];
        const [x2, y2] = points[(i + 1) % points.length];
        if ((y1 <= py && y2 > py) || (y2 <= py && y1 > py)) xs.push(x1 + ((py - y1) / (y2 - y1)) * (x2 - x1));
      }
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2)
        for (let x = Math.ceil(xs[k] - 0.5); x <= Math.floor(xs[k + 1] - 0.5); x++)
          this.set(x, y, typeof c === 'function' ? c(x, y) : c);
    }
    return this;
  }

  /** Desenha uma grade de texto: cada caractere é uma chave da paleta ('.' e ' ' = vazio). */
  grid(rows, palette, ox = 0, oy = 0) {
    rows.forEach((row, y) =>
      [...row].forEach((ch, x) => {
        if (ch === '.' || ch === ' ') return;
        const color = palette[ch];
        if (color === undefined) throw new Error(`cor sem paleta: "${ch}"`);
        this.set(ox + x, oy + y, color);
      }),
    );
    return this;
  }

  /** Copia outra tela (pixels opacos), opcionalmente espelhada. */
  blit(src, dx, dy, { flipX = false } = {}) {
    for (let y = 0; y < src.h; y++)
      for (let x = 0; x < src.w; x++) {
        const c = src.get(flipX ? src.w - 1 - x : x, y);
        if (c[3]) this.set(dx + x, dy + y, c);
      }
    return this;
  }

  /** Contorno de 1 px em volta dos pixels opacos (vizinhança 4, ou 8 com diagonal). */
  outline(c, { diagonal = false } = {}) {
    const mark = [];
    const n4 = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const n8 = diagonal ? [...n4, [1, 1], [1, -1], [-1, 1], [-1, -1]] : n4;
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++)
        if (!this.alpha(x, y) && n8.some(([dx, dy]) => this.alpha(x + dx, y + dy))) mark.push([x, y]);
    mark.forEach(([x, y]) => this.set(x, y, c));
    return this;
  }

  /** Aplica fn(cor, x, y) → cor | null a cada pixel opaco. */
  map(fn) {
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        const c = this.get(x, y);
        if (!c[3]) continue;
        const out = fn(c, x, y);
        if (out) this.set(x, y, out);
      }
    return this;
  }

  /** Troca uma cor exata por outra (para variações de quadro e paleta). */
  swap(from, to) {
    const f = toRGBA(from).join();
    return this.map((c) => (c.join() === f ? to : null));
  }

  clone() {
    const p = new Pix(this.w, this.h);
    p.d.set(this.d);
    return p;
  }

  /** Recorte retangular. */
  crop(x, y, w, h) {
    const p = new Pix(w, h);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) p.set(i, j, this.get(x + i, y + j));
    return p;
  }

  /** Ampliação inteira (só para prévias). */
  scaled(n, bg) {
    const p = new Pix(this.w * n, this.h * n);
    for (let y = 0; y < p.h; y++)
      for (let x = 0; x < p.w; x++) {
        const c = this.get(Math.floor(x / n), Math.floor(y / n));
        p.set(x, y, c[3] ? c : bg ?? c);
      }
    return p;
  }

  save(path) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, encodePNG(this.w, this.h, this.d));
    return this;
  }
}

/** Folha de sprites: quadros lado a lado, na ordem. */
export const sheet = (frames) => {
  const { w, h } = frames[0];
  const out = new Pix(w * frames.length, h);
  frames.forEach((f, i) => out.blit(f, i * w, 0));
  return out;
};
