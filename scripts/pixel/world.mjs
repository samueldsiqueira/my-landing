// Cenários da jornada: para cada etapa, uma camada distante (silhuetas sobre o céu, que é
// gradiente em CSS) e uma faixa de chão que se repete na horizontal. Tudo é periódico na
// largura da peça, então as camadas emendam sem costura (background-repeat: repeat-x).
// Mundo virtual: 180 px de altura; o chão começa em y = 140 e o herói pisa em y ≈ 160.
import { Pix, bayer, mix, rng } from './lib.mjs';
import { C } from './palette.mjs';

export const FAR_W = 320;
export const FAR_H = 150;
export const GROUND_W = 160;
export const GROUND_H = 40;

const TAU = Math.PI * 2;
/** Soma de senoides com períodos inteiros na largura w: emenda perfeita nas bordas. */
const wave = (x, w, parts) => parts.reduce((s, [k, amp, ph = 0]) => s + amp * Math.sin((TAU * k * x) / w + ph), 0);

/** Cordilheira/colina: preenche de h(x) até o fundo, com borda iluminada e pontilhado. */
function ridge(p, { base, parts, color, rim, low, lowFrom = 30 }) {
  for (let x = 0; x < p.w; x++) {
    const top = Math.round(base + wave(x, p.w, parts));
    for (let y = top; y < p.h; y++) {
      let c = color;
      if (rim && y === top) c = rim;
      else if (low && y - top > lowFrom) c = bayer(x, y) < Math.min(1, (y - top - lowFrom) / 24) ? low : color;
      p.set(x, y, c);
    }
  }
}

/** Montanhas pontudas (picos em posições fixas, periódicas). */
function peaks(p, { base, list, color, rim, snow }) {
  for (let x = 0; x < p.w; x++) {
    let top = p.h;
    for (const [px, height, half] of list) {
      for (const off of [-p.w, 0, p.w]) {
        const d = Math.abs(x - (px + off));
        if (d < half) top = Math.min(top, Math.round(base - height * (1 - d / half)));
      }
    }
    for (let y = top; y < p.h; y++) {
      let c = color;
      if (snow && y < top + 3 && top < base - 14) c = snow;
      else if (rim && y === top) c = rim;
      p.set(x, y, c);
    }
  }
}

function pine(p, x, y, h, color, light) {
  for (let i = 0; i < h; i++) {
    const half = Math.max(0, Math.floor((i * 0.45) % (h * 0.34)) + Math.floor(i / 4));
    for (let dx = -half; dx <= half; dx++) p.set(x + dx, y - h + i, dx < 0 && light ? light : color);
  }
  p.rect(x, y, 1, 2, color);
}

function roundTree(p, x, y, r, color, light, trunk) {
  p.rect(x, y - 3, 2, 4, trunk);
  p.ellipse(x + 1, y - 3 - r, r + 1, r, (xx, yy) => (xx < x && yy < y - 3 - r ? light : color));
}

function cloud(p, x, y, w, color, shade) {
  const blobs = [
    [0.2, 0.55, 0.22],
    [0.45, 0.35, 0.28],
    [0.72, 0.5, 0.24],
  ];
  for (const off of [-p.w, 0, p.w])
    for (const [bx, by, br] of blobs)
      p.ellipse(x + off + bx * w, y + by * w * 0.5, br * w, br * w * 0.55, (xx, yy) => (yy > y + w * 0.28 ? shade : color));
}

function stars(p, seed, count, maxY, colors) {
  const r = rng(seed);
  for (let i = 0; i < count; i++) {
    const x = Math.floor(r() * p.w);
    const y = Math.floor(r() * maxY);
    const c = colors[Math.floor(r() * colors.length)];
    p.set(x, y, c);
    if (r() < 0.08) {
      p.set(x - 1, y, mix(c, '#00000000', 0.5)).set(x + 1, y, mix(c, '#00000000', 0.5));
      p.set(x, y - 1, mix(c, '#00000000', 0.5)).set(x, y + 1, mix(c, '#00000000', 0.5));
    }
  }
}

function disc(p, x, y, r, color, shade) {
  p.ellipse(x, y, r, r, (xx, yy) => (xx > x + r * 0.3 && yy > y - r * 0.2 ? shade : color));
}

function windows(p, x0, y0, w, h, color, seed, density = 0.35) {
  const r = rng(seed);
  for (let y = y0 + 2; y < y0 + h - 2; y += 4)
    for (let x = x0 + 2; x < x0 + w - 2; x += 3) if (r() < density) p.set(x, y, color).set(x, y + 1, color);
}

/* ------------------------------------------------------------------------------------------
   Camadas distantes por bioma
   ------------------------------------------------------------------------------------------ */

const far = {
  // Vila inicial ao amanhecer: sol nascendo, montanhas lilases, colinas com pinheiros.
  inicio(p) {
    disc(p, 210, 112, 22, '#ffd98a', '#ffc66b');
    cloud(p, 40, 40, 46, '#f7b8c4', '#e597b0');
    cloud(p, 250, 26, 38, '#f7b8c4', '#e597b0');
    peaks(p, { base: 112, list: [[30, 38, 46], [120, 52, 58], [230, 30, 50], [290, 44, 44]], color: '#7a5aa8', rim: '#9a7cc6' });
    ridge(p, { base: 122, parts: [[2, 5], [5, 2, 1]], color: '#5b4b8c', rim: '#7464a6' });
    ridge(p, { base: 132, parts: [[3, 4, 2], [7, 1.5]], color: '#2f6450', rim: '#3f7f5f' });
    for (const x of [14, 22, 70, 77, 150, 158, 200, 262, 270, 300]) pine(p, x, 134 + (x % 3), 12 + (x % 5), '#234c3c', '#2f6450');
  },

  // Origem: noite de MMO, lua grande, castelo com janelas acesas.
  origem(p) {
    stars(p, 'origem', 110, 100, ['#ffffff', '#cfd8ff', '#ffe9a8']);
    disc(p, 64, 38, 15, '#f4f0d0', '#d7d0a8');
    p.set(60, 34, '#d7d0a8').set(66, 42, '#d7d0a8').set(67, 41, '#d7d0a8');
    peaks(p, { base: 118, list: [[40, 40, 60], [160, 30, 50], [260, 46, 64]], color: '#1f2858', rim: '#2b3772' });
    // Castelo
    const cx = 196;
    p.rect(cx - 30, 92, 60, 40, '#161d44');
    for (const tx of [cx - 32, cx - 8, cx + 18]) {
      p.rect(tx, 72, 14, 30, '#161d44');
      p.poly([[tx - 2, 72], [tx + 7, 58], [tx + 16, 72]], '#2a2060');
      p.set(tx + 7, 57, C.gold);
    }
    for (let x = cx - 30; x < cx + 30; x += 4) p.rect(x, 89, 2, 3, '#161d44');
    windows(p, cx - 28, 94, 56, 34, '#ffcf5a', 'castle', 0.3);
    for (const tx of [cx - 29, cx - 5, cx + 21]) p.set(tx + 3, 80, '#ffcf5a').set(tx + 3, 81, '#ffcf5a');
    ridge(p, { base: 128, parts: [[2, 4], [6, 2, 1]], color: '#121a3a', rim: '#1c2550' });
    for (const x of [20, 30, 100, 110, 118, 260, 280, 300]) pine(p, x, 132, 14, '#0c1230', null);
  },

  // Guilda do Suporte: dia claro, cidade portuária com prédios e janelas.
  indra(p) {
    cloud(p, 30, 22, 52, '#ffffff', '#dfe9f7');
    cloud(p, 180, 36, 40, '#ffffff', '#dfe9f7');
    peaks(p, { base: 116, list: [[60, 34, 60], [190, 40, 70], [290, 28, 50]], color: '#93b5df', rim: '#b4cdee' });
    const r = rng('skyline');
    for (let x = 0; x < p.w; ) {
      const w = 10 + Math.floor(r() * 14);
      const h = 14 + Math.floor(r() * 30);
      const top = 126 - h;
      p.rect(x, top, w, h + 24, '#6d8fbf');
      p.rect(x, top, 1, h + 24, '#86a6d2');
      windows(p, x, top, w, h, '#e8f1ff', `win${x}`, 0.4);
      if (r() < 0.3) p.rect(x + Math.floor(w / 2), top - 6, 1, 6, '#6d8fbf');
      x += w + 2;
    }
    ridge(p, { base: 132, parts: [[3, 3], [8, 1.5, 2]], color: '#4f9a58', rim: '#6bb86a' });
    for (const x of [10, 60, 95, 150, 210, 250, 300]) roundTree(p, x, 136, 5 + (x % 3), '#3c8048', '#5aa860', '#5d3a1e');
  },

  // Academia: tarde dourada, montanhas, livros voando.
  kenzie(p) {
    cloud(p, 70, 30, 44, '#fff3d9', '#f5d9a8');
    cloud(p, 250, 18, 30, '#fff3d9', '#f5d9a8');
    peaks(p, { base: 116, list: [[30, 30, 50], [140, 46, 60], [250, 38, 56]], color: '#9a86c9', rim: '#b6a4de', snow: '#ece4ff' });
    ridge(p, { base: 126, parts: [[2, 5, 1], [5, 2]], color: '#6aa25e', rim: '#86bd6c' });
    ridge(p, { base: 136, parts: [[4, 3], [9, 1]], color: '#4f8a4c', rim: '#62a05a' });
    for (const x of [30, 90, 170, 220, 300]) roundTree(p, x, 138, 6, '#3f7a40', '#59a050', '#5d3a1e');
    // Livros voando (capas coloridas, páginas claras)
    for (const [x, y, c] of [[120, 50, '#c0392b'], [150, 38, '#2e86de'], [200, 60, '#8e44ad'], [40, 72, '#16a085']]) {
      p.rect(x, y, 7, 5, c).rect(x + 1, y + 1, 5, 3, '#fdf6e3').set(x + 3, y + 1, c).set(x + 3, y + 2, c).set(x + 3, y + 3, c);
      p.set(x - 2, y + 1, c).set(x - 3, y, c).set(x + 9, y + 1, c).set(x + 10, y, c);
    }
  },

  // Torres de transmissão: pôr do sol, rochas e antenas treliçadas com luz vermelha.
  tim(p) {
    disc(p, 90, 110, 26, '#ffb35c', '#ff9a4a');
    cloud(p, 200, 40, 50, '#ff9f8a', '#e0718a');
    peaks(p, { base: 118, list: [[20, 40, 50], [130, 30, 60], [240, 54, 60]], color: '#7d3a5e', rim: '#a24f6e' });
    const antenna = (x, base, h) => {
      for (let y = base - h; y < base; y++) {
        const half = Math.floor(((y - (base - h)) / h) * 4);
        p.set(x - half, y, '#3a1f36').set(x + half, y, '#3a1f36');
        if ((y - base) % 4 === 0) for (let dx = -half; dx <= half; dx++) p.set(x + dx, y, '#3a1f36');
      }
      p.set(x, base - h - 1, '#ff3b3b').set(x, base - h - 2, '#ff8a8a');
      p.rect(x - 2, base - h + 4, 5, 2, '#3a1f36');
    };
    ridge(p, { base: 126, parts: [[2, 6], [5, 3, 1]], color: '#4b2343', rim: '#66304f' });
    antenna(60, 124, 40);
    antenna(180, 126, 54);
    antenna(276, 122, 34);
    ridge(p, { base: 136, parts: [[4, 2], [11, 1, 2]], color: '#33182f', rim: '#4b2343' });
  },

  // Santuário de saúde e IA: aurora, cristais altos e plantas que brilham.
  senai(p) {
    stars(p, 'senai', 40, 60, ['#d6fffa', '#ffffff']);
    for (let x = 0; x < p.w; x++) {
      const y0 = Math.round(30 + wave(x, p.w, [[2, 8], [5, 3, 1]]));
      for (let y = y0; y < y0 + 16; y++) if (bayer(x, y) < 0.55 - (y - y0) / 32) p.set(x, y, y - y0 < 6 ? '#7dffc2' : '#5be3b0');
      const y1 = Math.round(52 + wave(x, p.w, [[3, 6, 2], [7, 2]]));
      for (let y = y1; y < y1 + 10; y++) if (bayer(x, y) < 0.4 - (y - y1) / 30) p.set(x, y, '#b48cff');
    }
    const spire = (x, base, h, w) => {
      p.poly([[x - w, base], [x, base - h], [x + w, base]], (xx) => (xx < x ? '#7ee0e6' : '#3c9fb0'));
      p.line(x, base - h + 2, x, base - 4, '#c9fbff');
    };
    peaks(p, { base: 122, list: [[50, 26, 60], [200, 34, 70]], color: '#2c6a7a', rim: '#3e8c9a' });
    for (const [x, h, w] of [[40, 50, 7], [70, 36, 5], [150, 62, 8], [175, 40, 5], [250, 54, 7], [300, 30, 5]]) spire(x, 128, h, w);
    ridge(p, { base: 132, parts: [[3, 3], [7, 1.5, 1]], color: '#24584e', rim: '#2f7466' });
    const r = rng('glow');
    for (let i = 0; i < 26; i++) p.set(Math.floor(r() * p.w), 134 + Math.floor(r() * 12), r() < 0.5 ? '#7dffc2' : '#c9a6ff');
  },

  // Biblioteca arcana: crepúsculo roxo, torres com janelas em arco.
  grimorio(p) {
    stars(p, 'grimorio', 50, 70, ['#ffffff', '#e3d4ff']);
    peaks(p, { base: 120, list: [[60, 30, 70], [220, 38, 70]], color: '#3a2a6e', rim: '#4d3a8a' });
    const tower = (x, base, h, w) => {
      p.rect(x, base - h, w, h + 10, '#241a4d');
      p.poly([[x - 2, base - h], [x + w / 2, base - h - 14], [x + w + 2, base - h]], '#3b2a72');
      for (let y = base - h + 6; y < base - 4; y += 9) {
        p.rect(x + 3, y, 3, 5, '#ffcf6a').set(x + 4, y - 1, '#ffcf6a');
        p.rect(x + w - 6, y, 3, 5, '#ffcf6a').set(x + w - 5, y - 1, '#ffcf6a');
      }
    };
    tower(40, 128, 46, 16);
    tower(120, 128, 60, 20);
    tower(205, 128, 40, 14);
    tower(270, 128, 52, 18);
    p.rect(56, 110, 64, 4, '#241a4d');
    ridge(p, { base: 132, parts: [[2, 3], [6, 1.5, 1]], color: '#1b1438', rim: '#2b2058' });
  },

  // Praça do mural: dia de feira, telhados e chaminés.
  projetos(p) {
    cloud(p, 120, 24, 48, '#ffffff', '#e3ecf8');
    cloud(p, 270, 44, 32, '#ffffff', '#e3ecf8');
    ridge(p, { base: 112, parts: [[2, 6], [4, 3, 2]], color: '#8fbf7a', rim: '#a7d38e' });
    const r = rng('roofs');
    for (let x = 0; x < p.w; ) {
      const w = 16 + Math.floor(r() * 12);
      const h = 14 + Math.floor(r() * 10);
      const top = 130 - h;
      const roof = ['#c2553b', '#d9783f', '#a8443a'][Math.floor(r() * 3)];
      p.rect(x, top, w, h + 20, '#e9dcc0');
      p.rect(x + w - 2, top, 2, h + 20, '#d4c4a2');
      p.poly([[x - 2, top], [x + w / 2, top - 9], [x + w + 2, top]], roof);
      p.rect(x + 3, top + 4, 3, 4, '#5b88b8').rect(x + w - 7, top + 4, 3, 4, '#5b88b8');
      if (r() < 0.5) p.rect(x + 4, top - 8, 3, 6, '#8a5a4a');
      x += w + 3;
    }
    ridge(p, { base: 138, parts: [[5, 1.5]], color: '#5e9a52', rim: '#78b466' });
  },

  // Acampamento: noite estrelada, estrela cadente, floresta e vaga-lumes.
  contato(p) {
    stars(p, 'contato', 160, 110, ['#ffffff', '#cfd8ff', '#ffe9a8', '#c9a6ff']);
    for (let i = 0; i < 14; i++) p.set(220 + i, 20 + Math.floor(i / 2), i > 10 ? '#ffffff' : mix('#ffffff', '#0e0a1c', 1 - i / 14));
    peaks(p, { base: 118, list: [[80, 34, 70], [230, 44, 70]], color: '#1a1f44', rim: '#252c5c' });
    ridge(p, { base: 126, parts: [[3, 3], [7, 1.5, 1]], color: '#121834', rim: '#1a2148' });
    for (let x = 0; x < p.w; x += 9) pine(p, x + (x % 4), 134 + (x % 5), 16 + (x % 7), '#0b1026', null);
    const r = rng('fireflies');
    for (let i = 0; i < 18; i++) p.set(Math.floor(r() * p.w), 100 + Math.floor(r() * 40), '#fff38a');
  },
};

/* ------------------------------------------------------------------------------------------
   Chão: borda de grama atrás, caminho no meio (onde o herói pisa), terra/grama na frente.
   ------------------------------------------------------------------------------------------ */

function groundBase(p, { back, backRim, path, pathLight, pathDark, front, frontDark, edge, pebbles = true, seed }) {
  const r = rng(seed);
  for (let x = 0; x < p.w; x++) {
    const edgeTop = 2 + Math.round(wave(x, p.w, [[8, 1], [3, 0.8, 1]]));
    const pathTop = 8 + Math.round(wave(x, p.w, [[5, 0.8, 2]]));
    const pathBottom = 28 + Math.round(wave(x, p.w, [[4, 1, 1]]));
    for (let y = 0; y < p.h; y++) {
      let c = null;
      if (y < edgeTop) c = null;
      else if (y === edgeTop) c = backRim;
      else if (y < pathTop) c = back;
      else if (y === pathTop) c = edge;
      else if (y < pathBottom) c = bayer(x, y) < 0.18 ? pathLight : bayer(x, y) > 0.9 ? pathDark : path;
      else if (y === pathBottom) c = edge;
      else c = bayer(x, y) < (y - pathBottom) / 14 ? frontDark : front;
      if (c) p.set(x, y, c);
    }
  }
  if (pebbles)
    for (let i = 0; i < 14; i++) {
      const x = Math.floor(r() * p.w);
      const y = 12 + Math.floor(r() * 13);
      p.set(x, y, pathDark).set(x + 1, y, pathLight);
    }
  // tufos de grama na borda de trás e na frente
  for (let i = 0; i < 18; i++) {
    const x = Math.floor(r() * p.w);
    p.set(x, 2, backRim).set(x + 1, 1, backRim);
    const fx = Math.floor(r() * p.w);
    p.set(fx, 31, front).set(fx, 30, front);
  }
}

const grassy = (seed, tint = {}) => (p) =>
  groundBase(p, {
    back: C.grass,
    backRim: C.grassLight,
    path: C.dirt,
    pathLight: C.dirtLight,
    pathDark: C.dirtDark,
    front: C.grassDark,
    frontDark: '#1f5030',
    edge: '#7a5530',
    seed,
    ...tint,
  });

function cobbles(p, { stone, light, dark, mortar }) {
  for (let y = 9; y < 28; y += 5)
    for (let x = (y / 5) % 2 ? 0 : 4; x < p.w + 8; x += 8) {
      p.rect(x, y, 7, 4, stone);
      p.rect(x, y, 7, 1, light);
      p.rect(x + 6, y, 1, 4, dark);
      p.rect(x, y + 4, 8, 1, mortar);
    }
}

const ground = {
  inicio: grassy('g-inicio'),
  origem: grassy('g-origem', {
    back: '#1f4a3c',
    backRim: '#2c6650',
    path: '#5d4a3a',
    pathLight: '#75604c',
    pathDark: '#43352a',
    front: '#163428',
    frontDark: '#0e241c',
    edge: '#3a2c22',
  }),
  indra(p) {
    grassy('g-indra')(p);
    cobbles(p, { stone: '#a9a7b8', light: '#c9c7d6', dark: '#7d7b91', mortar: '#6a687c' });
  },
  kenzie(p) {
    grassy('g-kenzie')(p);
    const r = rng('flowers');
    for (let i = 0; i < 20; i++) {
      const x = Math.floor(r() * p.w);
      const y = r() < 0.5 ? 4 + Math.floor(r() * 3) : 31 + Math.floor(r() * 6);
      p.set(x, y, ['#ffd84a', '#ff7aa8', '#ffffff', '#b48cff'][i % 4]);
    }
  },
  tim: grassy('g-tim', {
    back: '#6b4a3a',
    backRim: '#86604a',
    path: '#9a7458',
    pathLight: '#b48c6c',
    pathDark: '#73533e',
    front: '#4d3326',
    frontDark: '#38241a',
    edge: '#5a3e2e',
  }),
  senai(p) {
    grassy('g-senai', { back: '#2f7466', backRim: '#45a08a', front: '#1f5248', frontDark: '#163c35', path: '#b9c8c4', pathLight: '#dbe8e4', pathDark: '#8fa29e', edge: '#5d7a74' })(p);
    for (const x of [12, 58, 101, 140]) {
      p.set(x, 1, '#c9fbff').rect(x - 1, 2, 3, 3, '#7ee0e6').set(x + 1, 3, '#3c9fb0');
    }
  },
  grimorio(p) {
    grassy('g-grimorio', { back: '#3b2f5e', backRim: '#4f4080', front: '#241c40', frontDark: '#18122e', edge: '#2a2048' })(p);
    cobbles(p, { stone: '#6b6488', light: '#857ea2', dark: '#4e4868', mortar: '#3e3856' });
  },
  projetos(p) {
    grassy('g-projetos')(p);
    cobbles(p, { stone: '#c9b48e', light: '#e0cfab', dark: '#a28c68', mortar: '#8a7656' });
  },
  contato: grassy('g-contato', {
    back: '#1d3d34',
    backRim: '#2a5446',
    path: '#4a3e34',
    pathLight: '#5e5044',
    pathDark: '#362c24',
    front: '#122a24',
    frontDark: '#0b1c18',
    edge: '#2e261f',
  }),
};

export const BIOMES = Object.keys(far);

export function farLayer(id) {
  const p = new Pix(FAR_W, FAR_H);
  far[id](p);
  return p;
}

export function groundTile(id) {
  const p = new Pix(GROUND_W, GROUND_H);
  ground[id](p);
  return p;
}
