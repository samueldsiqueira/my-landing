// Composição do mundo por etapa: céu (degradê em faixas, como nos jogos de 16/32 bits) e os
// marcos que ficam à beira do caminho. As imagens vêm de public/game (npm run sprites).
// Medidas em pixels da arte (o CSS multiplica por --px). Posição x em % do trecho do caminho.
import type { SceneId } from '@/content/profile';

/** Paradas de cor do céu, de cima para o horizonte. */
export const skies: Record<SceneId, string[]> = {
  inicio: ['#2a2a6e', '#7a4fa8', '#f08aa0', '#ffc98a'],
  origem: ['#070a1e', '#121a44', '#24306a'],
  indra: ['#5aa0e8', '#8cc4f2', '#cfe8fb'],
  kenzie: ['#7bb2e8', '#f2d6a2', '#ffe8b8'],
  tim: ['#3a1e5c', '#b0456a', '#ff8a5a', '#ffc36b'],
  senai: ['#0b2a3a', '#155a6a', '#2b8f94'],
  grimorio: ['#160f33', '#33215f', '#6a3f8f'],
  projetos: ['#6fb0ea', '#a6d4f5', '#e4f4ff'],
  contato: ['#050716', '#0e1436', '#1e2350'],
};

export interface Prop {
  src: string;
  w: number;
  h: number;
  x: number;
  /** Altura da base em pixels da arte, a partir do chão da faixa (padrão: borda de trás). */
  base?: number;
  /** Quadros na folha (animação em passos). */
  frames?: number;
  /** Duração do ciclo da animação, em ms. */
  cycle?: number;
  /** Flutua (bob vertical), para o familiar de IA. */
  float?: boolean;
  /** Rótulos das tábuas de uma placa (texto real por cima da arte). */
  labels?: string[];
}

/** Borda de trás do caminho (a 34 px do pé da faixa de chão) e o leito do caminho. */
export const BACK = 34;
export const PATH = 24;

export const landmarks: Record<SceneId, Prop[]> = {
  inicio: [
    { src: 'cottage', w: 76, h: 70, x: 30 },
    { src: 'signpost', w: 36, h: 31, x: 54, labels: ['Jornada'] },
  ],
  origem: [
    { src: 'retro-pc', w: 66, h: 52, x: 31 },
    { src: 'slime', w: 16, h: 14, x: 50, base: PATH, frames: 2, cycle: 900 },
  ],
  indra: [
    { src: 'booth', w: 90, h: 74, x: 22 },
    { src: 'signpost-4', w: 46, h: 58, x: 46, labels: ['Brasil', 'América Latina', 'EUA', 'Europa'] },
  ],
  kenzie: [
    { src: 'tower', w: 70, h: 108, x: 30 },
    { src: 'owl', w: 14, h: 16, x: 50, frames: 2, cycle: 3200 },
  ],
  tim: [
    { src: 'radio', w: 46, h: 108, x: 30 },
    { src: 'robot', w: 32, h: 38, x: 46, base: PATH, frames: 2, cycle: 1200 },
  ],
  senai: [
    { src: 'sanctuary', w: 100, h: 82, x: 27 },
    { src: 'orb', w: 20, h: 20, x: 53, base: 70, frames: 2, cycle: 1000, float: true },
  ],
  grimorio: [{ src: 'grimoire', w: 84, h: 76, x: 30 }],
  projetos: [{ src: 'board', w: 84, h: 70, x: 30 }],
  contato: [
    { src: 'tent', w: 64, h: 44, x: 31 },
    { src: 'fire', w: 26, h: 26, x: 50, base: PATH, frames: 3, cycle: 450 },
  ],
};

const hexToRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const mixHex = (a: string, b: string, t: number) => {
  const [x, y] = [hexToRgb(a), hexToRgb(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(' ')})`;
};

/** Degradê em faixas duras (sem suavizar): cada faixa é uma cor da paleta interpolada. */
export const skyGradient = (stops: string[], bands = 12) => {
  const parts: string[] = [];
  for (let b = 0; b < bands; b++) {
    const t = (b / (bands - 1)) * (stops.length - 1);
    const k = Math.min(stops.length - 2, Math.floor(t));
    const color = mixHex(stops[k], stops[k + 1], t - k);
    const from = ((b / bands) * 100).toFixed(2);
    const to = (((b + 1) / bands) * 100).toFixed(2);
    parts.push(`${color} ${from}% ${to}%`);
  }
  return `linear-gradient(to bottom, ${parts.join(', ')})`;
};
