// Marcos de cada etapa (ficam na borda de trás do caminho), pequenos personagens e ícones da
// interface. Cada função devolve uma Pix já contornada, fundo transparente.
import { Pix, mix, rng } from './lib.mjs';
import { C } from './palette.mjs';

const OUT = C.outline;

const planks = (p, x, y, w, h, light, dark) => {
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) p.set(x + i, y + j, j % 4 === 3 ? dark : i % 11 === 0 && j % 8 < 4 ? dark : light);
};

const bricks = (p, x, y, w, h, stone, light, dark) => {
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      const row = Math.floor(j / 4);
      const off = row % 2 ? 3 : 0;
      const edge = j % 4 === 3 || (i + off) % 7 === 0;
      p.set(x + i, y + j, edge ? dark : j % 4 === 0 ? light : stone);
    }
};

/* ----------------------------------- marcos ----------------------------------- */

/** Início: a casa do herói, telhado roxo, janela acesa e chaminé. */
export function cottage() {
  const p = new Pix(76, 70);
  // chaminé
  bricks(p, 50, 8, 8, 20, C.stone, C.stoneLight, C.stoneDark);
  // paredes
  planks(p, 10, 34, 56, 34, '#c8915c', '#94643a');
  // telhado
  p.poly([[4, 36], [38, 10], [72, 36]], (x, y) => ((y - 10) % 4 === 0 ? C.purpleDark : x < 38 ? C.purpleLight : C.purple));
  for (let x = 4; x <= 72; x++) p.set(x, 36, C.purpleDeep);
  // janela redonda acesa
  p.ellipse(38, 24, 5, 5, C.woodDark).ellipse(38, 24, 3.6, 3.6, '#ffd77a');
  p.line(38, 20, 38, 28, C.woodDark).line(34, 24, 42, 24, C.woodDark);
  // porta
  p.rect(32, 46, 12, 22, C.woodDark).rect(33, 47, 10, 21, '#6e4426');
  p.rect(33, 47, 10, 1, '#8a5a32');
  p.set(41, 57, C.gold);
  // janela lateral
  p.rect(16, 44, 10, 9, C.woodDark).rect(17, 45, 8, 7, '#ffd77a').line(21, 45, 21, 51, C.woodDark);
  p.rect(50, 44, 10, 9, C.woodDark).rect(51, 45, 8, 7, '#ffd77a').line(55, 45, 55, 51, C.woodDark);
  // floreira
  p.rect(15, 53, 12, 3, '#8a5a32');
  for (const [x, c] of [[16, '#ff7aa8'], [19, '#ffd84a'], [22, '#ffffff'], [25, '#ff7aa8']]) p.set(x, 52, c).set(x, 51, C.grassDark);
  p.outline(OUT);
  return p;
}

/** Placa de madeira com uma seta (o texto vem por cima, em HTML). */
export function signpost({ boards = 1, w = 30 } = {}) {
  const h = 12 + boards * 9 + 10;
  const p = new Pix(w + 6, h);
  const cx = Math.floor((w + 6) / 2);
  p.rect(cx - 1, 6, 3, h - 6, C.wood).rect(cx + 1, 6, 1, h - 6, C.woodDark);
  for (let b = 0; b < boards; b++) {
    const y = 4 + b * 9;
    const right = b % 2 === 0;
    const x0 = 2;
    const x1 = w + 2;
    p.poly(
      right
        ? [[x0, y], [x1 - 4, y], [x1, y + 3.5], [x1 - 4, y + 7], [x0, y + 7]]
        : [[x0 + 4, y], [x1, y], [x1, y + 7], [x0 + 4, y + 7], [x0, y + 3.5]],
      (x, yy) => (yy === y ? C.woodHi : yy >= y + 6 ? C.woodDark : C.wood),
    );
  }
  p.outline(OUT);
  return p;
}

/** Origem: escrivaninha com um PC de tubo mostrando código (o fórum do MMO). */
export function retroPc() {
  const p = new Pix(66, 52);
  // mesa
  p.rect(2, 30, 62, 5, C.wood).rect(2, 30, 62, 1, C.woodHi).rect(2, 34, 62, 1, C.woodDark);
  p.rect(5, 35, 4, 16, C.woodDark).rect(57, 35, 4, 16, C.woodDark);
  // monitor de tubo
  p.rect(14, 4, 34, 24, '#d8d0b8').rect(14, 4, 34, 1, '#efe8d2').rect(47, 4, 1, 24, '#a8a088');
  p.rect(17, 7, 28, 17, '#0d1f14');
  const r = rng('code');
  for (let y = 9; y < 23; y += 2) {
    const indent = Math.floor(r() * 3) * 2;
    const len = 6 + Math.floor(r() * 16);
    for (let x = 0; x < len; x++) p.set(19 + indent + x, y, r() < 0.15 ? '#ffd84a' : '#4cff7a');
  }
  p.set(19, 21, '#c8ffd6').set(20, 21, '#c8ffd6'); // cursor
  p.rect(26, 28, 10, 2, '#a8a088');
  // teclado
  p.rect(16, 27, 30, 3, '#cfc6ac');
  for (let x = 17; x < 45; x += 2) p.set(x, 28, '#8f876e');
  // caneca
  p.rect(52, 22, 6, 8, '#c0392b').rect(58, 24, 2, 4, '#c0392b').rect(53, 23, 4, 1, '#3b2516');
  // pergaminho do fórum caído
  p.rect(4, 24, 9, 6, '#f3e3b8').rect(4, 24, 9, 1, '#d8c48e');
  p.line(5, 26, 11, 26, '#9a8a6a').line(5, 28, 9, 28, '#9a8a6a');
  p.outline(OUT);
  return p;
}

/** Monstrinho de MMO: um slime verde. 2 quadros (amassa e estica). */
export function slime(frame = 0) {
  const p = new Pix(16, 14);
  const h = frame ? 8 : 10;
  const w = frame ? 7.5 : 6.5;
  p.ellipse(8, 13 - h / 2, w, h / 2, (x, y) => (x < 6 && y < 13 - h / 1.6 ? '#b6ff9a' : y > 11 ? '#2f9a4a' : '#5ad66a'));
  p.set(5, 13 - h + 3, OUT).set(10, 13 - h + 3, OUT);
  p.set(5, 13 - h + 4, OUT).set(10, 13 - h + 4, OUT);
  p.set(7, 13 - h + 6, '#2f9a4a').set(8, 13 - h + 6, '#2f9a4a');
  p.outline(OUT);
  return p;
}

/** Indra: barraca da Guilda do Suporte, toldo listrado, globo e fone de atendimento. */
export function guildBooth() {
  const p = new Pix(90, 74);
  // postes
  p.rect(8, 18, 3, 56, C.woodDark).rect(79, 18, 3, 56, C.woodDark);
  // toldo listrado
  for (let x = 2; x < 88; x++) {
    const stripe = Math.floor((x - 2) / 7) % 2 ? C.purple : '#f4efff';
    for (let y = 10; y < 22; y++) p.set(x, y, y > 18 ? mix(stripe, C.outline, 0.25) : stripe);
    if ((x - 2) % 7 === 3) p.set(x, 22, stripe).set(x, 23, stripe);
  }
  p.poly([[2, 10], [45, 0], [88, 10]], (x) => (Math.floor(x / 7) % 2 ? C.purpleDark : '#ded4f8'));
  // placa com fone de ouvido
  p.rect(32, 26, 26, 14, C.wood).rect(33, 27, 24, 12, '#f3e3b8');
  p.ellipse(45, 35, 5, 5, C.purpleDark).ellipse(45, 35, 3.4, 3.4, '#f3e3b8');
  p.rect(39, 33, 3, 5, C.purple).rect(48, 33, 3, 5, C.purple).rect(44, 38, 4, 1, C.purple);
  // balcão
  planks(p, 6, 50, 78, 24, '#b98552', '#8a5a32');
  p.rect(4, 48, 82, 3, '#d9a56a').rect(4, 50, 82, 1, '#8a5a32');
  // globo no balcão
  p.ellipse(22, 40, 8, 8, (x, y) => ((x + y) % 5 < 2 && x < 24 ? '#4caa4a' : x > 24 ? '#2c6db0' : '#3d8fd8'));
  p.rect(20, 48, 5, 1, C.gold).rect(22, 47, 1, 1, C.gold);
  // pilha de chamados (papéis)
  p.rect(60, 42, 14, 7, '#ffffff').rect(61, 41, 12, 1, '#e8e8f0').rect(62, 44, 9, 1, '#9aa0c0').rect(62, 46, 7, 1, '#9aa0c0');
  p.outline(OUT);
  return p;
}

/** Faculdade: torre da universidade, telhado cônico, bandeirola com livro, janelas acesas. */
export function academyTower() {
  const p = new Pix(70, 108);
  bricks(p, 14, 34, 42, 74, '#a7a3c4', '#c4c0dc', '#7c7898');
  // telhado
  p.poly([[8, 36], [35, 0], [62, 36]], (x, y) => (y % 5 === 0 ? C.purpleDark : x < 35 ? C.purpleLight : C.purple));
  p.set(35, 0, C.gold).set(35, 1, C.gold);
  for (let x = 8; x <= 62; x++) p.set(x, 36, C.purpleDeep);
  // janelas em arco acesas
  for (const [x, y] of [[22, 46], [42, 46], [32, 64]]) {
    p.rect(x, y + 2, 6, 8, C.outline).rect(x + 1, y + 1, 4, 9, '#ffcf6a').set(x + 2, y, '#ffcf6a').set(x + 3, y, '#ffcf6a');
    p.line(x + 3, y + 1, x + 3, y + 9, '#e09a3a');
  }
  // porta em arco
  p.rect(28, 88, 14, 20, C.woodDark).rect(29, 86, 12, 22, '#6e4426');
  p.rect(30, 84, 10, 2, '#6e4426');
  p.set(38, 98, C.gold);
  // bandeirola com livro aberto
  p.rect(48, 52, 12, 18, C.purple).poly([[48, 70], [54, 66], [60, 70], [60, 74], [48, 74]], C.purple);
  p.rect(50, 57, 8, 6, '#fdf6e3').line(54, 57, 54, 62, C.purpleDark);
  p.rect(48, 52, 12, 1, C.gold);
  // pilha de livros na porta
  for (const [y, c, w] of [[104, '#c0392b', 12], [101, '#2e86de', 10], [98, '#16a085', 11]]) p.rect(6, y, w, 3, c).rect(6, y, w, 1, mix(c, '#ffffff', 0.35));
  p.outline(OUT);
  return p;
}

/** Coruja mentora (2 quadros: olhos abertos e piscando). */
export function owl(frame = 0) {
  const p = new Pix(14, 16);
  p.ellipse(7, 9, 6, 7, (x, y) => (y > 11 ? '#a87a52' : '#8a5f3c'));
  p.ellipse(7, 11, 4, 4, '#e8d2a8');
  p.set(3, 2, '#8a5f3c').set(4, 3, '#8a5f3c').set(11, 2, '#8a5f3c').set(10, 3, '#8a5f3c');
  for (const x of [4, 10]) {
    if (frame) p.rect(x - 1, 6, 3, 1, OUT);
    else p.ellipse(x, 6, 1.8, 1.8, '#ffe066').set(x, 6, OUT);
  }
  p.set(7, 8, C.gold).set(7, 9, C.goldDark);
  // capelo de formatura
  p.rect(3, 1, 9, 1, OUT).rect(5, 0, 5, 1, OUT).set(11, 2, C.gold).set(11, 3, C.gold);
  p.outline(OUT);
  return p;
}

/** TIM: torre de transmissão treliçada com antenas parabólicas. */
export function radioTower() {
  const p = new Pix(46, 108);
  const steel = '#7d82a6';
  const dark = '#4e5272';
  for (let y = 8; y < 108; y++) {
    const half = 3 + Math.floor((y - 8) / 6);
    p.set(23 - half, y, dark).set(23 + half, y, steel);
    if (y % 8 === 0) for (let x = 23 - half; x <= 23 + half; x++) p.set(x, y, steel);
    if (y % 8 < 8) {
      const t = (y % 8) / 8;
      p.set(Math.round(23 - half + t * half * 2), y, dark);
      p.set(Math.round(23 + half - t * half * 2), y, dark);
    }
  }
  p.rect(22, 0, 3, 8, steel).set(23, 0, '#ff3b3b');
  // parabólicas
  for (const [x, y, dir] of [[14, 30, -1], [32, 46, 1]]) {
    p.ellipse(x + dir * 2, y, 3, 6, (xx) => (xx * dir > (x + dir * 2) * dir ? '#e8ebf8' : '#c9cde4'));
    p.rect(x - (dir < 0 ? 0 : 1), y, 2, 1, dark);
  }
  p.outline(OUT);
  return p;
}

/** Golem da automação: robô quadrado com rosto em tela e engrenagem. 2 quadros (pisca a luz). */
export function robot(frame = 0) {
  const p = new Pix(32, 38);
  // antena
  p.rect(15, 0, 2, 5, '#4e5272').set(15, 0, frame ? '#ff3b3b' : '#ffd84a').set(16, 0, frame ? '#ff3b3b' : '#ffd84a');
  // cabeça
  p.rect(6, 5, 20, 14, '#a9adc8').rect(6, 5, 20, 1, '#c9cde4').rect(25, 5, 1, 14, '#7d82a6');
  p.rect(9, 8, 14, 8, '#10202a');
  p.rect(11, 10, 3, 3, C.crystal).rect(18, 10, 3, 3, C.crystal);
  p.line(12, 14, 19, 14, C.crystalDark);
  // corpo
  p.rect(4, 20, 24, 12, '#8b8fa8').rect(4, 20, 24, 1, '#b9bdd2').rect(27, 20, 1, 12, '#5a5d78');
  // engrenagem no peito
  p.ellipse(16, 26, 4, 4, '#f2a33a').ellipse(16, 26, 1.6, 1.6, '#8b8fa8');
  for (const [x, y] of [[16, 21], [16, 31], [11, 26], [21, 26]]) p.set(x, y, '#f2a33a');
  // braços e pernas
  p.rect(0, 21, 4, 9, '#7d82a6').rect(28, 21, 4, 9, '#7d82a6');
  p.rect(0, 30, 4, 3, '#4e5272').rect(28, 30, 4, 3, '#4e5272');
  p.rect(8, 32, 6, 6, '#5a5d78').rect(18, 32, 6, 6, '#5a5d78');
  p.outline(OUT);
  return p;
}

/** SENAI: santuário de cura, colunas, emblema de coração com pulso (saúde + tecnologia). */
export function sanctuary() {
  const p = new Pix(100, 82);
  // telhado
  p.poly([[2, 26], [50, 2], [98, 26]], (x, y) => (y % 5 === 0 ? '#2c8c92' : x < 50 ? '#5fd0cc' : '#3fb0b0'));
  p.rect(4, 26, 92, 4, '#e9f4f2').rect(4, 29, 92, 1, '#b9d2ce');
  // emblema no frontão
  const heart = [
    '.HH...HH.',
    'HHHH.HHHH',
    'HHHHHHHHH',
    'HHHHHHHHH',
    '.HHHHHHH.',
    '..HHHHH..',
    '...HHH...',
    '....H....',
  ];
  p.grid(heart, { H: '#3ccf7a' }, 46, 11);
  p.line(44, 15, 47, 15, '#ffffff').line(47, 15, 49, 12, '#ffffff').line(49, 12, 51, 18, '#ffffff').line(51, 18, 53, 15, '#ffffff').line(53, 15, 56, 15, '#ffffff');
  // colunas
  for (const x of [10, 28, 64, 82]) {
    p.rect(x, 30, 8, 46, '#f2f8f6').rect(x + 6, 30, 2, 46, '#c4dad6').rect(x - 1, 30, 10, 2, '#d8e8e4').rect(x - 1, 74, 10, 2, '#d8e8e4');
  }
  // interior e porta de luz
  p.rect(36, 30, 28, 46, '#bfe6e2');
  p.rect(42, 44, 16, 32, '#ffffff').rect(44, 42, 12, 2, '#ffffff').rect(46, 40, 8, 2, '#ffffff');
  // degraus
  p.rect(2, 76, 96, 3, '#d8e8e4').rect(0, 79, 100, 3, '#b9d2ce');
  p.outline(OUT);
  return p;
}

/** Familiar de IA: orbe flutuante com olhos e órbita de faíscas. 2 quadros. */
export function aiOrb(frame = 0) {
  const p = new Pix(20, 20);
  p.ellipse(10, 10, 6.5, 6.5, (x, y) => (x < 9 && y < 9 ? '#e6d4ff' : x > 12 || y > 13 ? '#7a4fd8' : '#b48cff'));
  p.set(8, 10, OUT).set(8, 11, OUT).set(12, 10, OUT).set(12, 11, OUT);
  const orbit = frame
    ? [[2, 6], [17, 13], [10, 1]]
    : [[3, 14], [17, 5], [10, 18]];
  orbit.forEach(([x, y]) => p.set(x, y, C.crystalHi));
  p.outline(OUT);
  // brilho por fora do contorno
  return p;
}

/** Grimório: púlpito com o livro aberto brilhando e estante atrás. */
export function grimoire() {
  const p = new Pix(84, 76);
  // estante
  p.rect(30, 0, 54, 64, '#5a3a24').rect(32, 2, 50, 60, '#3a2416');
  const r = rng('shelf');
  for (let shelf = 0; shelf < 4; shelf++) {
    const y = 4 + shelf * 15;
    p.rect(32, y + 12, 50, 2, '#6e4426');
    for (let x = 34; x < 80; ) {
      const w = 2 + Math.floor(r() * 3);
      const h = 8 + Math.floor(r() * 4);
      const c = ['#c0392b', '#2e86de', '#16a085', '#8e44ad', '#d9a03a', '#e9dcc0'][Math.floor(r() * 6)];
      p.rect(x, y + 12 - h, w, h, c).rect(x, y + 12 - h, 1, h, mix(c, '#ffffff', 0.3));
      x += w + (r() < 0.2 ? 2 : 0);
    }
  }
  // púlpito
  p.poly([[6, 50], [34, 50], [30, 76], [10, 76]], (x) => (x < 14 ? C.woodHi : x > 26 ? C.woodDark : C.wood));
  p.rect(2, 46, 36, 5, C.woodDark);
  // livro aberto
  p.poly([[0, 46], [20, 40], [20, 47], [2, 50]], '#f6ecd0');
  p.poly([[20, 40], [40, 46], [38, 50], [20, 47]], '#e8dab4');
  p.line(20, 40, 20, 47, C.purpleDark);
  for (let i = 0; i < 3; i++) {
    p.line(4, 47 - i * 2 + 0, 17, 43 - i * 2, '#9a8a6a');
    p.line(23, 43 - i * 2, 36, 47 - i * 2, '#9a8a6a');
  }
  p.outline(OUT);
  // runas brilhando acima do livro
  for (const [x, y, c] of [[12, 32, C.crystalHi], [20, 26, C.purpleHi], [28, 33, C.goldHi], [17, 36, C.crystal], [25, 22, C.crystal]]) {
    p.set(x, y, c).set(x - 1, y, mix(c, '#00000000', 0.4)).set(x + 1, y, mix(c, '#00000000', 0.4));
  }
  return p;
}

/** Mural de missões: quadro de cortiça com telhadinho e cartazes presos. */
export function questBoard() {
  const p = new Pix(84, 70);
  p.rect(8, 16, 4, 54, C.woodDark).rect(72, 16, 4, 54, C.woodDark);
  p.poly([[0, 14], [42, 0], [84, 14]], (x, y) => (y % 4 === 0 ? '#8a3a2a' : x < 42 ? '#d0603f' : '#b04a34'));
  p.rect(4, 16, 76, 40, C.wood).rect(7, 19, 70, 34, '#c49a62');
  const r = rng('posters');
  for (const [x, y, w, h] of [[10, 22, 16, 13], [30, 21, 14, 17], [48, 23, 18, 12], [12, 38, 18, 12], [36, 40, 14, 11], [56, 37, 16, 14]]) {
    const paper = r() < 0.5 ? '#fdf6e3' : '#f3e3b8';
    p.rect(x, y, w, h, paper);
    for (let yy = y + 3; yy < y + h - 1; yy += 2) p.line(x + 2, yy, x + 2 + Math.floor(r() * (w - 4)), yy, '#9a8a6a');
    p.set(x + Math.floor(w / 2), y, '#d63a3a');
  }
  p.rect(30, 56, 24, 4, C.woodDark);
  p.outline(OUT);
  return p;
}

/** Acampamento: barraca roxa. */
export function tent() {
  const p = new Pix(64, 44);
  p.poly([[2, 44], [32, 2], [62, 44]], (x, y) => (x < 32 ? (y % 6 === 0 ? C.purple : C.purpleLight) : y % 6 === 0 ? C.purpleDark : C.purple));
  p.poly([[24, 44], [32, 20], [40, 44]], '#1a1030');
  p.poly([[32, 20], [40, 44], [36, 44], [33, 26]], '#2e1660');
  p.rect(31, 0, 2, 4, C.woodDark).set(32, 0, C.gold);
  p.outline(OUT);
  return p;
}

/** Fogueira: 3 quadros de chama. */
export function campfire(frame = 0) {
  const p = new Pix(26, 26);
  // pedras
  for (const [x, y] of [[3, 22], [8, 23], [14, 23], [19, 22], [22, 21], [1, 21]]) p.ellipse(x, y, 2.6, 2, C.stone);
  // lenha
  p.line(5, 21, 20, 17, C.woodDark).line(5, 17, 20, 21, C.wood).line(6, 18, 19, 20, C.woodHi);
  const shapes = [
    [[13, 2], [18, 12], [17, 18], [9, 18], [8, 12]],
    [[12, 3], [17, 11], [18, 18], [8, 18], [9, 10]],
    [[14, 4], [19, 13], [16, 18], [9, 18], [7, 13]],
  ];
  const s = shapes[frame % 3];
  p.poly(s, '#ff8a2a');
  p.poly(s.map(([x, y]) => [13 + (x - 13) * 0.62, 18 + (y - 18) * 0.62]), '#ffd84a');
  p.poly(s.map(([x, y]) => [13 + (x - 13) * 0.3, 18 + (y - 18) * 0.3]), '#fff6c8');
  p.outline(OUT);
  // fagulhas
  const sparks = [[[6, 4], [20, 1]], [[18, 5], [9, 0]], [[11, 1], [21, 7]]][frame % 3];
  sparks.forEach(([x, y]) => p.set(x, y, '#ffd84a'));
  return p;
}

/* -------------------------------- interface -------------------------------- */

/** Ícones dos atributos (11×11). */
export const ICONS = {
  codigo: ['...........', '..K.....K..', '.KC.....CK.', 'KC...K...CK', 'C...KC....C', 'C...C.....C', 'C..KC.....C', 'KC.C....CK.', '.KC.....CK.', '..K.....K..', '...........'],
  suporte: ['..KKKKKKK..', '.KBBBBBBBK.', 'KBbbbbbbbBK', 'KBbWWWWWbBK', 'KBbWbbbWbBK', 'KBbWbbbWbBK', '.KBbWWWbBK.', '.KBbbbbbBK.', '..KBbbbBK..', '...KBBBK...', '....KKK....'],
  automacao: ['....KKK....', '.K.KOOOK.K.', 'KOKOOOOOKOK', '.KOOoooOOK.', 'KOOoKKKoOOK', 'KOOoK.KoOOK', 'KOOoKKKoOOK', '.KOOoooOOK.', 'KOKOOOOOKOK', '.K.KOOOK.K.', '....KKK....'],
  integracao: ['...........', '.KKKK......', 'KGGGGK.....', 'KGKKGK.KKK.', 'KGK.KGKGGGK', '.KGGGKGKKGK', 'KGGGKGK.KGK', 'KGKKGK.KKGK', 'KGGGK..KGK.', '.KKK....K..', '...........'],
  saude: ['...........', '.KKK...KKK.', 'KHHHK.KHHHK', 'KHhHHKHHHHK', 'KHHHHHHHHHK', 'KHHWHHHHHHK', '.KHWHWHWHK.', '..KHHHWHK..', '...KHHHK...', '....KHK....', '.....K.....'],
  ia: ['.....K.....', '....KSK....', '....KSK....', '..KKSsSKK..', 'KKSSsssSSKK', 'KSssssssSK.', 'KKSSsssSSKK', '..KKSsSKK..', '....KSK....', '....KSK....', '.....K.....'],
};

const ICON_PAL = {
  K: OUT,
  C: C.crystal,
  B: '#5aa0ff',
  b: '#2e5fb8',
  W: '#d8ecff',
  O: '#c9cde4',
  o: '#f2a33a',
  G: C.gold,
  H: '#3ccf7a',
  h: '#b6ffcf',
  S: C.purpleHi,
  s: C.purpleLight,
};

export function icon(name) {
  const p = new Pix(13, 13);
  if (name === 'codigo') {
    // "</>" desenhado com linhas: em grade de texto não ficava legível.
    const c = C.crystal;
    p.line(4, 3, 1, 6, c).line(1, 6, 4, 9, c);
    p.line(8, 3, 11, 6, c).line(11, 6, 8, 9, c);
    p.line(7, 2, 5, 10, C.crystalHi);
    p.outline(OUT);
    return p;
  }
  p.grid(ICONS[name], ICON_PAL, 1, 1);
  return p;
}

/** Orbe de XP (moeda de experiência). */
export function xpOrb() {
  const p = new Pix(9, 9);
  p.ellipse(4.5, 4.5, 4, 4, (x, y) => (x < 4 && y < 4 ? C.goldHi : x > 5 || y > 5 ? C.goldDark : C.gold));
  p.set(4, 2, '#ffffff');
  p.outline(OUT);
  return p;
}

/** Balão "!" de missão disponível. */
export function questMark() {
  const p = new Pix(9, 14);
  p.rect(1, 0, 7, 11, C.goldHi).rect(1, 0, 7, 1, '#ffffff');
  p.rect(3, 2, 3, 5, OUT).rect(3, 8, 3, 2, OUT);
  p.poly([[3, 11], [6, 11], [4.5, 13.5]], C.goldHi);
  p.outline(OUT);
  return p;
}

/**
 * Moldura de janela em 9 partes (24×24, cantos de 8 px): painel azul-noite, borda dupla
 * roxa e dourada. Usada com border-image no CSS.
 */
export function panelFrame() {
  const p = new Pix(24, 24);
  p.rect(0, 0, 24, 24, OUT);
  p.rect(1, 1, 22, 22, C.goldDark);
  p.rect(2, 2, 20, 20, C.gold);
  p.rect(2, 2, 20, 1, C.goldHi);
  p.rect(3, 3, 18, 18, C.purpleDark);
  p.rect(4, 4, 16, 16, '#16122e');
  p.rect(4, 4, 16, 1, '#2a2350');
  // cantos arredondados
  for (const [x, y] of [[0, 0], [23, 0], [0, 23], [23, 23]]) p.clear(x, y);
  // rebites dourados
  for (const [x, y] of [[3, 3], [20, 3], [3, 20], [20, 20]]) p.set(x, y, C.goldHi);
  return p;
}

/** Moldura de botão (12×12, cantos de 4 px). */
export function buttonFrame(face = C.purple, hi = C.purpleLight, low = C.purpleDeep) {
  const p = new Pix(12, 12);
  p.rect(0, 0, 12, 12, OUT);
  p.rect(1, 1, 10, 10, face);
  p.rect(1, 1, 10, 1, hi).rect(1, 1, 1, 10, hi);
  p.rect(1, 10, 10, 1, low).rect(10, 1, 1, 10, low);
  for (const [x, y] of [[0, 0], [11, 0], [0, 11], [11, 11]]) p.clear(x, y);
  return p;
}
