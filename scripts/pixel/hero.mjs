// O herói: Samuel como mago chibi (3/4, virado para a direita). Inspirado na foto do projeto:
// cabelo escuro volumoso, óculos de armação preta grossa, sorriso largo e barba rala.
// Chapéu e capa roxos, túnica escura (a camiseta preta da foto), cajado com cristal.
// Quadros: parado ×2, andando ×4, conjurando ×2. Cada quadro tem 40×54 px.
import { Pix, sheet } from './lib.mjs';
import { C } from './palette.mjs';

export const HERO_W = 40;
export const HERO_H = 54;
/** Folga no topo para o cajado erguido e as faíscas. */
const TOP = 6;

/** Chapéu pontudo com a ponta caída para trás, faixa dourada e aba larga. */
function hat(p, oy, { flap = 0 } = {}) {
  const y = (v) => v + oy;
  // Cone: claro à esquerda (luz de cima/esquerda), escuro à direita.
  const rows = [
    [0, 14, 16],
    [1, 13, 17],
    [2, 13, 18],
    [3, 13, 18],
    [4, 13, 19],
    [5, 12, 19],
    [6, 12, 20],
    [7, 12, 21],
    [8, 11, 21],
    [9, 11, 22],
    [10, 11, 23],
    [11, 10, 24],
  ];
  for (const [r, x0, x1] of rows)
    for (let x = x0; x <= x1; x++) {
      const t = (x - x0) / Math.max(1, x1 - x0);
      p.set(x, y(r), t < 0.22 ? C.purpleLight : t > 0.78 ? C.purpleDark : C.purple);
    }
  // Ponta caída para trás (esquerda), balança 1 px ao andar.
  p.set(12, y(1), C.purpleLight).set(11, y(1), C.purpleLight);
  p.set(10, y(2 + flap), C.purpleLight).set(11, y(2 + flap), C.purple);
  p.set(9, y(3 + flap), C.purpleHi);
  // Faixa dourada com brilho.
  for (let x = 11; x <= 23; x++) p.set(x, y(9), x > 20 ? C.goldDark : C.gold);
  for (let x = 11; x <= 23; x++) p.set(x, y(10), x > 20 ? C.goldDark : x < 13 ? C.goldHi : C.gold);
  // Estrela bordada no cone.
  p.set(16, y(5), C.goldHi).set(15, y(6), C.gold).set(16, y(6), C.goldHi).set(17, y(6), C.gold).set(16, y(7), C.gold);
  // Aba: elipse vista de cima, borda da frente mais escura.
  p.ellipse(19, y(13.5), 14, 2.6, (x, yy) => {
    const top = yy <= y(12);
    if (top) return x < 14 ? C.purpleHi : C.purpleLight;
    if (yy === y(13)) return x < 12 ? C.purpleLight : C.purple;
    return C.purpleDark;
  });
  for (let x = 8; x <= 30; x++) p.set(x, y(15), C.purpleDeep);
}

/** Rosto, cabelo, óculos e sorriso. */
function head(p, oy) {
  const y = (v) => v + oy;
  // Cabelo volumoso por baixo da aba (atrás do rosto).
  p.ellipse(19.5, y(19.5), 10.5, 6.5, C.hair);
  // Rosto
  p.ellipse(19.5, y(21.5), 8.6, 7.2, (x, yy) => (x >= 26 || yy >= y(27) ? C.skinShade : C.skin));
  // Orelha (lado de trás, à esquerda)
  p.set(10, y(21), C.skinShade).set(10, y(22), C.skinShade).set(11, y(22), C.skin).set(11, y(21), C.skin);
  // Volume do cabelo nas laterais
  for (const [x, yy, c] of [
    [9, 17, C.hairMid], [9, 18, C.hair], [9, 19, C.hair], [10, 19, C.hair], [9, 20, C.hair],
    [10, 20, C.hair], [10, 17, C.hairMid], [11, 18, C.hair], [11, 19, C.hair], [11, 20, C.hair],
    [28, 17, C.hairMid], [29, 18, C.hair], [28, 18, C.hair], [28, 19, C.hair], [29, 19, C.hair], [28, 20, C.hair],
  ])
    p.set(x, y(yy), c);
  // Franja irregular sobre a testa
  for (let x = 11; x <= 28; x++) p.set(x, y(16), x % 3 === 0 ? C.hairMid : C.hair);
  for (let x = 12; x <= 27; x++) p.set(x, y(17), x % 4 === 1 ? C.hairHi : C.hair);
  for (const x of [12, 13, 15, 16, 18, 21, 22, 24, 26, 27]) p.set(x, y(18), C.hair);
  for (const x of [13, 16, 22, 26]) p.set(x, y(19), C.hair);
  // Sobrancelhas grossas
  for (const x of [14, 15, 16]) p.set(x, y(19), C.hair);
  for (const x of [21, 22, 23, 24]) p.set(x, y(19), C.hair);
  // Óculos: armação preta grossa, retangular
  const frame = C.outline;
  const lens = (x0, x1) => {
    for (let x = x0; x <= x1; x++) {
      p.set(x, y(20), frame);
      p.set(x, y(23), frame);
    }
    for (const yy of [21, 22]) {
      p.set(x0, y(yy), frame);
      p.set(x1, y(yy), frame);
      for (let x = x0 + 1; x < x1; x++) p.set(x, y(yy), C.skin);
    }
  };
  lens(12, 18);
  lens(20, 27);
  p.set(19, y(21), frame); // ponte
  p.set(11, y(21), frame); // haste até a orelha
  p.set(13, y(21), C.lens).set(21, y(21), C.lens).set(22, y(21), C.lens); // reflexos
  // Olhos sorrindo (arcos)
  p.set(15, y(22), C.outline).set(16, y(21), C.outline).set(17, y(22), C.outline);
  p.set(23, y(22), C.outline).set(24, y(21), C.outline).set(25, y(22), C.outline);
  // Bochechas
  p.set(13, y(24), C.blush).set(14, y(24), C.blush).set(26, y(24), C.blush);
  // Nariz
  p.set(20, y(24), C.skinShade).set(21, y(24), C.skinShade);
  // Sorriso largo com dentes
  for (let x = 17; x <= 23; x++) p.set(x, y(25), x === 17 || x === 23 ? C.outline : C.teeth);
  for (let x = 18; x <= 22; x++) p.set(x, y(26), x === 18 || x === 22 ? C.outline : C.mouth);
  for (let x = 19; x <= 21; x++) p.set(x, y(27), C.outline);
  // Barba rala (pontilhado no queixo e no maxilar)
  for (const [x, yy] of [
    [15, 27], [24, 27], [16, 28], [18, 28], [20, 28], [22, 28], [23, 28], [14, 26], [25, 26], [19, 28], [21, 28],
  ])
    p.set(x, y(yy), C.skinDark);
}

/** Capa (atrás), túnica, cinto, braços e mãos. `step` balança a barra da capa. */
function body(p, oy, { step = 0, castArm = false } = {}) {
  const y = (v) => v + oy;
  // Capa atrás do corpo, abrindo para baixo
  p.poly(
    [
      [12, y(29)],
      [27, y(29)],
      [31 - step, y(42)],
      [8 - step, y(42)],
    ],
    (x) => (x < 12 ? C.purpleLight : x > 26 ? C.purpleDark : C.purple),
  );
  // Barra da capa recortada
  for (let x = 8 - step; x <= 31 - step; x += 3) p.set(x, y(42), C.purpleDark);
  // Túnica (a camiseta escura da foto)
  p.poly(
    [
      [13, y(29)],
      [26, y(29)],
      [28, y(40)],
      [11, y(40)],
    ],
    (x) => (x < 15 ? C.robeLight : x > 24 ? C.robeDark : C.robe),
  );
  // Gola roxa com fecho dourado
  for (let x = 14; x <= 25; x++) p.set(x, y(29), x < 17 ? C.purpleHi : C.purpleLight);
  for (let x = 15; x <= 24; x++) p.set(x, y(30), C.purple);
  p.set(19, y(30), C.gold).set(20, y(30), C.goldDark);
  // Pescoço (sombra)
  for (let x = 17; x <= 22; x++) p.set(x, y(28), C.skinShade);
  // Faixa central e cinto
  for (let yy = 31; yy <= 39; yy++) p.set(19, y(yy), C.purpleLight);
  for (let x = 12; x <= 27; x++) p.set(x, y(35), x === 19 || x === 20 ? C.gold : C.goldDark);
  p.set(19, y(36), C.goldDark);
  // Bainha da túnica
  for (let x = 11; x <= 28; x++) p.set(x, y(40), C.purpleDark);
  // Braço de trás (esquerda), mão à mostra
  for (let yy = 31; yy <= 36; yy++) {
    p.set(11, y(yy), C.robeLight);
    p.set(12, y(yy), C.robe);
  }
  p.set(11, y(37), C.skin).set(12, y(37), C.skinShade);
  // Braço da frente segurando o cajado
  if (castArm) {
    // erguido: manga sobe até a altura do rosto
    for (let i = 0; i <= 5; i++) {
      p.set(26 + Math.floor(i / 2), y(31 - i), C.purpleLight);
      p.set(27 + Math.floor(i / 2), y(31 - i), C.purple);
    }
    p.rect(29, y(24), 2, 2, C.skin);
    p.set(30, y(25), C.skinShade);
  } else {
    for (let i = 0; i <= 4; i++) {
      p.set(26 + Math.floor(i / 2), y(31 + i), C.purpleLight);
      p.set(27 + Math.floor(i / 2), y(31 + i), C.purple);
    }
    p.rect(29, y(34), 2, 2, C.skin);
    p.set(30, y(35), C.skinShade);
  }
}

/** Cajado com cristal. `lift` sobe o cajado (conjurar); `glow` aumenta o brilho. */
function staff(p, oy, { lift = 0, glow = 0 } = {}) {
  const y = (v) => v + oy - lift;
  for (let yy = 13; yy <= 46; yy++) {
    p.set(31, y(yy), yy % 7 === 0 ? C.woodHi : C.wood);
    p.set(32, y(yy), C.woodDark);
  }
  // Garras de madeira segurando o cristal
  p.set(30, y(12), C.woodDark).set(33, y(12), C.woodDark).set(30, y(11), C.wood).set(33, y(11), C.wood);
  // Cristal em losango
  const cx = 31.5;
  const cy = y(8);
  p.poly(
    [
      [cx, cy - 5],
      [cx + 3, cy],
      [cx, cy + 4],
      [cx - 3, cy],
    ],
    (x, yy) => (x < cx - 0.5 && yy < cy ? C.crystalHi : x > cx ? C.crystalDark : C.crystal),
  );
  p.set(30, y(6), C.crystalHi).set(30, y(7), C.white);
  if (glow) {
    const pts = [
      [27, 4],
      [36, 6],
      [35, 12],
      [28, 11],
      [31, 1],
    ];
    pts.slice(0, glow + 2).forEach(([x, yy]) => p.set(x, y(yy), C.spark));
    if (glow > 1) pts.forEach(([x, yy]) => p.set(x + (x > 31 ? 1 : -1), y(yy), C.crystalHi));
  }
}

/** Pernas e botas. `a`/`b`: deslocamento horizontal do pé de trás e do da frente. */
function legs(p, oy, { a = 0, b = 0, liftA = 0, liftB = 0 } = {}) {
  const leg = (x, dx, lift, near) => {
    const top = 41 + oy;
    const bottom = 46 + oy - lift;
    for (let yy = top; yy <= bottom - 3; yy++) {
      p.set(x + dx, yy, near ? C.robe : C.robeDark);
      p.set(x + 1 + dx, yy, near ? C.robeDark : C.robeDark);
      p.set(x + 2 + dx, yy, C.robeDark);
    }
    // bota (bico para a direita)
    for (let yy = bottom - 2; yy <= bottom; yy++)
      for (let xx = x - 1 + dx; xx <= x + 3 + dx + (yy === bottom ? 1 : 0); xx++)
        p.set(xx, yy, yy === bottom ? C.bootDark : xx === x - 1 + dx ? C.bootDark : C.boot);
    p.set(x + dx, bottom - 2, C.woodHi);
  };
  leg(14, a, liftA, false);
  leg(22, b, liftB, true);
}

function frame({ bob = 0, step = 0, legsOpt = {}, flap = 0, cast = 0 } = {}) {
  const p = new Pix(HERO_W, HERO_H);
  const oy = TOP + bob;
  legs(p, TOP, legsOpt);
  body(p, oy, { step, castArm: cast > 0 });
  head(p, oy);
  hat(p, oy, { flap });
  staff(p, oy, { lift: cast ? 7 : 0, glow: cast });
  p.outline(C.outline);
  return p;
}

export function heroFrames() {
  return [
    // parado (respira: sobe 1 px)
    frame({}),
    frame({ bob: -1, flap: 1 }),
    // andando: contato, passagem, contato oposto, passagem
    frame({ legsOpt: { a: -3, b: 3 }, step: 1, flap: 0 }),
    frame({ bob: -1, legsOpt: { a: -1, b: 1, liftA: 2 }, step: 0, flap: 1 }),
    frame({ legsOpt: { a: 2, b: -2 }, step: -1, flap: 0 }),
    frame({ bob: -1, legsOpt: { a: 1, b: -1, liftB: 2 }, step: 0, flap: 1 }),
    // conjurando (cajado erguido, faíscas)
    frame({ cast: 1 }),
    frame({ bob: -1, cast: 2, flap: 1 }),
  ];
}

export const heroSheet = () => sheet(heroFrames());
