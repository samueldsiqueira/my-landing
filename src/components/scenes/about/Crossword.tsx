import type { CSSProperties } from 'react';
import halftone from '../../../../public/img/samuel-halftone.png';
import type { Cell, Crossword as Grid } from './crossword';
import { PRINT_TILE, printRows } from './crossword';
import s from '../About.module.css';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

// Cada letra é desenhada num viewBox 100×100 (= uma casa). A foto e a listagem impressa
// são folhas contínuas em coordenadas da grade, deslocadas por casa via CSS (--col/--row),
// então as letras parecem recortadas da mesma folha nas duas composições.
const PHOTO_RATIO = halftone.height / halftone.width;

function Defs({ grid }: { grid: Grid }) {
  // Larga: SAÚDE na vertical (coluna crossCol), a foto ocupa a altura da palavra, centrada no rosto.
  const wideH = grid.rows * 100;
  const wideW = wideH / PHOTO_RATIO;
  const wideX = (grid.crossCol + 0.5) * 100 - wideW * 0.46;
  // Alta (transposta): SAÚDE na horizontal (linha crossCol), a faixa dos olhos passa pela palavra.
  const tallW = grid.rows * 100;
  const tallH = tallW * PHOTO_RATIO;
  const tallY = (grid.crossCol + 0.5) * 100 - tallH * 0.4;

  return (
    <svg className={s.defs} width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        {/* Formulário contínuo zebrado: faixas de 1/4 de casa. */}
        <pattern id="about-bars" width="100" height="50" patternUnits="userSpaceOnUse">
          <rect width="100" height="50" className={s.barPaper} />
          <rect y="25" width="100" height="25" className={s.barGreen} />
        </pattern>
        {/* Listagem impressa: duas linhas por faixa, cada palavra em três fiadas de pontos. */}
        <pattern id="about-print" width={PRINT_TILE.width} height={PRINT_TILE.height} patternUnits="userSpaceOnUse">
          {printRows.map((d, k) => (
            <path key={k} d={d} className={`${s.printDots} ${s[`printDots${k}`]}`} />
          ))}
        </pattern>
        <image
          id="about-photo-wide"
          href={halftone.src}
          x={wideX.toFixed(1)}
          y="0"
          width={wideW.toFixed(1)}
          height={wideH}
          preserveAspectRatio="none"
        />
        <image
          id="about-photo-tall"
          href={halftone.src}
          x="0"
          y={tallY.toFixed(1)}
          width={tallW}
          height={tallH.toFixed(1)}
          preserveAspectRatio="none"
        />
        {/* O cruzamento é emendado na diagonal: metade foto, metade formulário. */}
        <clipPath id="about-half-photo">
          <polygon points="-20,-20 120,-20 -20,120" />
        </clipPath>
        <clipPath id="about-half-paper">
          <polygon points="120,-20 120,120 -20,120" />
        </clipPath>
      </defs>
    </svg>
  );
}

function Paperfill() {
  return (
    <>
      <rect x="-20" y="-20" width="140" height="140" fill="url(#about-bars)" />
      <rect x="-50" y="-50" width="1200" height="1200" fill="url(#about-print)" className={s.sheet} />
    </>
  );
}

function Photofill() {
  return (
    <>
      <rect x="-20" y="-20" width="140" height="140" className={s.photoBase} />
      <use href="#about-photo-wide" className={`${s.sheet} ${s.wideOnly}`} />
      <use href="#about-photo-tall" className={`${s.sheet} ${s.tallOnly}`} />
    </>
  );
}

function Glyph({ cell }: { cell: Cell }) {
  const id = `about-glyph-${cell.key}`;
  return (
    <svg className={s.glyph} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs>
        <text id={id} x="50" y="88" textAnchor="middle" className={s.glyphText}>
          {cell.char}
        </text>
        <clipPath id={`${id}-clip`}>
          <use href={`#${id}`} />
        </clipPath>
      </defs>
      <use href={`#${id}`} className={s.glyphShadow} />
      <use href={`#${id}`} className={s.glyphRim} />
      <g clipPath={`url(#${id}-clip)`}>
        {cell.kind === 'across' && <Paperfill />}
        {cell.kind === 'down' && <Photofill />}
        {cell.kind === 'cross' && (
          <>
            <g clipPath="url(#about-half-paper)">
              <Paperfill />
            </g>
            <g clipPath="url(#about-half-photo)">
              <Photofill />
            </g>
            <line x1="104" y1="-4" x2="-4" y2="104" className={s.seam} />
          </>
        )}
      </g>
    </svg>
  );
}

/**
 * Palavra cruzada "tecnologia × saúde": TECNOLOGIA recortada de formulário contínuo
 * impresso (a máquina), SAÚDE recortada da foto em meio-tom (a pessoa). Peça visual: o nome
 * acessível está no título da cena.
 */
export function Crossword({ grid }: { grid: Grid }) {
  return (
    <div
      className={s.crossword}
      aria-hidden="true"
      style={{ '--cols': grid.cols, '--rows': grid.rows } as Vars}
    >
      <Defs grid={grid} />
      {grid.cells.map((cell) => (
        <div
          key={cell.key}
          className={s.cell}
          data-kind={cell.kind}
          data-num-wide={cell.numWide}
          data-num-tall={cell.numTall}
          style={
            {
              '--wc': cell.col,
              '--wr': cell.row,
              '--k': cell.order,
              '--jx': cell.jx,
              '--jy': cell.jy,
              '--jr': `${cell.jr}deg`,
              '--fx': cell.fx,
              '--fy': cell.fy,
              '--boil-phase': cell.order % 3,
            } as Vars
          }
        >
          <div className={s.piece}>
            <div className={`${s.wobble} boil`}>
              <Glyph cell={cell} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
