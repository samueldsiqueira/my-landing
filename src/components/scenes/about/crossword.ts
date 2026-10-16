// Geometria da palavra cruzada da cena Sobre. As duas palavras saem do próprio texto do
// perfil ("…na interseção entre tecnologia e saúde."), então não há conteúdo duplicado.
import { about } from '@/content/profile';
import { random, spread } from '@/lib/seed';

export type CellKind = 'across' | 'down' | 'cross';

export interface Cell {
  key: string;
  char: string;
  kind: CellKind;
  /** Posição na composição larga (horizontal = coluna). A alta é a transposta. */
  col: number;
  row: number;
  /** Ordem em que a peça é colocada na mesa (uma por quadro). */
  order: number;
  /** Desalinhamento da peça (unidades do viewBox da letra e graus). */
  jx: number;
  jy: number;
  jr: number;
  /** Direção em que a peça é arremessada na saída (vetor unitário a partir do cruzamento). */
  fx: number;
  fy: number;
  /** Número de palavra cruzada (1, 2) na composição larga e na alta. */
  numWide?: number;
  numTall?: number;
}

export interface Crossword {
  across: string;
  down: string;
  cols: number;
  rows: number;
  /** Cruzamento na composição larga: coluna da palavra vertical e linha da horizontal. */
  crossCol: number;
  crossRow: number;
  cells: Cell[];
}

const bare = (char: string) => char.normalize('NFD').replace(/\p{M}/gu, '').toUpperCase();

/** "tecnologia" e "saúde", lidas do texto do primeiro item de about. */
const findWords = () => {
  for (const item of about) {
    const match = item.text.match(/entre\s+(\p{L}+)\s+e\s+(\p{L}+)/u);
    if (match) return { across: match[1], down: match[2] };
  }
  return null;
};

/**
 * A vertical (saúde) termina na letra compartilhada; a horizontal (tecnologia) a usa na
 * primeira posição possível. Retorna null se as palavras não se cruzarem.
 */
export function buildCrossword(): Crossword | null {
  const words = findWords();
  if (!words) return null;
  const A = [...words.across.toUpperCase()];
  const D = [...words.down.toUpperCase()];

  let crossRow = -1;
  let crossCol = -1;
  for (let i = D.length - 1; i >= 0 && crossCol < 0; i--) {
    const j = A.findIndex((char) => bare(char) === bare(D[i]));
    if (j >= 0) {
      crossRow = i;
      crossCol = j;
    }
  }
  if (crossCol < 0) return null;

  const rand = random('about-crossword');
  const downCells = D.map((char, i) => ({ char, col: crossCol, row: i, i }));
  const acrossCells = A.map((char, j) => ({ char, col: j, row: crossRow, j }));

  // Alterna as palavras (vertical, horizontal, vertical...) e deixa o cruzamento por último.
  const downRest = downCells.filter((cell) => cell.row !== crossRow);
  const acrossRest = acrossCells.filter((cell) => cell.col !== crossCol);
  const sequence: Array<{ char: string; col: number; row: number; kind: CellKind }> = [];
  for (let k = 0; k < Math.max(downRest.length, acrossRest.length); k++) {
    if (downRest[k]) sequence.push({ ...downRest[k], kind: 'down' });
    if (acrossRest[k]) sequence.push({ ...acrossRest[k], kind: 'across' });
  }
  sequence.push({ char: A[crossCol], col: crossCol, row: crossRow, kind: 'cross' });

  const cells: Cell[] = sequence.map((cell, order) => {
    const center = cell.kind === 'cross';
    const dx = center ? 0 : cell.col - crossCol;
    const dy = center ? -1 : cell.row - crossRow;
    const length = Math.hypot(dx, dy);
    const push = 0.85 + rand() * 0.4;
    return {
      key: `${cell.col}-${cell.row}`,
      char: cell.char,
      kind: cell.kind,
      col: cell.col,
      row: cell.row,
      order,
      jx: spread(rand, 1.2),
      jy: spread(rand, 1.6),
      jr: spread(rand, 3.2),
      fx: Number(((dx / length) * push).toFixed(2)),
      fy: Number(((dy / length) * push).toFixed(2)),
    };
  });

  // Numeração de palavra cruzada: da esquerda para a direita, de cima para baixo.
  const firstDown = cells.find((cell) => cell.col === crossCol && cell.row === 0);
  const firstAcross = cells.find((cell) => cell.col === 0 && cell.row === crossRow);
  const starts = [firstDown, firstAcross].filter(Boolean) as Cell[];
  const order = (a: Cell, b: Cell, tall: boolean) =>
    tall ? a.col - b.col || a.row - b.row : a.row - b.row || a.col - b.col;
  [...starts].sort((a, b) => order(a, b, false)).forEach((cell, n) => (cell.numWide = n + 1));
  [...starts].sort((a, b) => order(a, b, true)).forEach((cell, n) => (cell.numTall = n + 1));

  return {
    across: words.across,
    down: words.down,
    cols: A.length,
    rows: D.length,
    crossCol,
    crossRow,
    cells,
  };
}

/**
 * Listagem impressa na matricial, dentro das letras de TECNOLOGIA: palavras feitas só de
 * pontos (três fiadas por linha, como a matriz de agulhas), sem texto real, para que nada
 * decorativo vaze para o conteúdo da página (innerText, copiar e colar, leitores, buscadores).
 * Uma linha a cada 12,5 unidades: duas por faixa zebrada.
 */
export const PRINT_TILE = { width: 380, height: 100 };

export const printRows = (() => {
  const rand = random('about-printout');
  const char = 4.4;
  const rows: [string[], string[], string[]] = [[], [], []];
  const n = (value: number) => value.toFixed(1);
  for (let line = 0; line < PRINT_TILE.height / 12.5; line++) {
    const base = 9 + line * 12.5;
    let x = 2 + Math.floor(rand() * 3) * char;
    while (x < PRINT_TILE.width - char * 2) {
      const end = Math.min(x + (2 + Math.floor(rand() * 9)) * char, PRINT_TILE.width - char);
      rows[0].push(`M${n(x)} ${n(base - 5.2)}H${n(end)}`);
      rows[1].push(`M${n(x)} ${n(base - 2.6)}H${n(end)}`);
      rows[2].push(`M${n(x)} ${n(base)}H${n(end)}`);
      x = end + char * (1 + Math.floor(rand() * 2)) + (rand() < 0.15 ? char * 5 : 0);
    }
  }
  return rows.map((row) => row.join(''));
})();
