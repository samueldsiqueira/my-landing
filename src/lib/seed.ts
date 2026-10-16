// Aleatoriedade determinística: o mesmo seed gera a mesma "imperfeição" no servidor e no
// navegador, então recortes e desalinhamentos não causam divergência de hidratação.

export const hashSeed = (input: string) => {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

/** PRNG mulberry32: retorna uma função que gera números em [0, 1). */
export const random = (seed: string | number) => {
  let a = typeof seed === 'number' ? seed : hashSeed(seed);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Valor em [-amount, amount], arredondado para manter o HTML curto e estável. */
export const spread = (rand: () => number, amount: number, decimals = 2) =>
  Number(((rand() * 2 - 1) * amount).toFixed(decimals));

const round = (n: number) => Number(n.toFixed(2));

/**
 * Polígono de recorte com bordas irregulares para clip-path.
 * depth: quanto a tesoura "entra" no papel, em % do lado; points: vértices por lado.
 */
export const scissorPolygon = (seed: string, { depth = 1.6, points = 14 } = {}) => {
  const rand = random(seed);
  const v: string[] = [];
  const step = 100 / points;
  for (let i = 0; i < points; i++) v.push(`${round(i * step)}% ${round(rand() * depth)}%`);
  for (let i = 0; i < points; i++) v.push(`${round(100 - rand() * depth)}% ${round(i * step)}%`);
  for (let i = 0; i < points; i++) v.push(`${round(100 - i * step)}% ${round(100 - rand() * depth)}%`);
  for (let i = 0; i < points; i++) v.push(`${round(rand() * depth)}% ${round(100 - i * step)}%`);
  return `polygon(${v.join(', ')})`;
};

/** Borda rasgada só no topo (papel destacado de um bloco ou da picotagem). */
export const tornTopPolygon = (seed: string, { depth = 6, points = 18 } = {}) => {
  const rand = random(seed);
  const v: string[] = [];
  for (let i = 0; i <= points; i++) v.push(`${round((i / points) * 100)}% ${round(rand() * depth)}px`);
  v.push('100% 100%', '0% 100%');
  return `polygon(${v.join(', ')})`;
};
