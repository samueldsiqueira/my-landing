import type { CSSProperties } from 'react';
import { Scene } from '@/components/stage/Scene';
import { Dymo, HalftonePhoto, Paper, Pin, cx, headingProps } from '@/components/paper';
import { about, scenes } from '@/content/profile';
import { Crossword } from './about/Crossword';
import { buildCrossword } from './about/crossword';
import s from './About.module.css';

const label = scenes.find((scene) => scene.id === 'about')?.label ?? 'Sobre';
const grid = buildCrossword();
// Dimensões da grade (composição larga) e posição do cruzamento, usadas pelo CSS para
// alinhar fichas, fios e alfinetes ao E.
const frameVars = {
  '--cols': grid?.cols ?? 10,
  '--rows': grid?.rows ?? 5,
  '--xc': grid?.crossCol ?? 1,
  '--xr': grid?.crossRow ?? 4,
} as CSSProperties;
const slots = [s.slot1, s.slot2, s.slot3];
const threads = [s.thread1, s.thread2, s.thread3];

// Fio frouxo: duas barrigas largas (±12 px), pousado na esteira antes de esticar.
const SLACK = 'M18 0 C 6 14, 4 30, 18 46 S 32 76, 18 100';

/** Fio violeta: reto quando esticado, ondulado enquanto é puxado. Geometria no CSS. */
function Thread({ className }: { className?: string }) {
  return (
    <span className={cx(s.thread, className)} aria-hidden="true">
      <svg viewBox="0 0 36 100" preserveAspectRatio="none" focusable="false">
        <g className={s.threadSlack}>
          <path className={s.threadShadow} d={SLACK} transform="translate(1.6 0)" />
          <path d={SLACK} />
          <path className={s.threadTwist} d={SLACK} />
        </g>
        <g className={s.threadTaut}>
          <path className={s.threadShadow} d="M19.6 0 L19.6 100" />
          <path d="M18 0 L18 100" />
          <path className={s.threadTwist} d="M18 0 L18 100" />
        </g>
      </svg>
    </span>
  );
}

/**
 * Cena 2 — "Interseção". A frase "interseção entre tecnologia e saúde" vira uma palavra
 * cruzada de verdade: TECNOLOGIA (formulário contínuo) cruza SAÚDE (foto em meio-tom) no E.
 * Do cruzamento saem fios violeta até três fichas pautadas, uma por item de about; a
 * primeira recebe a foto 3×4 que veio da abertura (data-shared="photo").
 * Coreografia de entrada e saída em About.module.css.
 */
export default function About() {
  return (
    <Scene id="about" className={s.canvas}>
      <div className={s.frame} style={frameVars}>
        {/* Nome acessível completo; começa pelo texto visível da etiqueta. */}
        <h2
          className={s.title}
          aria-label={grid ? `${label}: ${grid.across} e ${grid.down}` : undefined}
          {...headingProps('about')}
        >
          <Dymo className={s.dymo}>{label}</Dymo>
        </h2>

        {grid && <Crossword grid={grid} />}

        <ul className={s.cards}>
          {about.map((item, k) => (
            <li key={item.id} className={cx(s.slot, slots[k])}>
              <div className={s.cardMove}>
                {/* Margens do texto num miolo próprio: não dependem da estrutura interna de Paper. */}
                <Paper seed={`about-${item.id}`} edge="straight">
                  <div className={s.cardBody}>
                    {k === 0 && <span className={s.photoRoom} aria-hidden="true" />}
                    <h3 className={s.cardTitle}>{item.title}</h3>
                    <p className={s.cardText}>{item.text}</p>
                  </div>
                </Paper>
              </div>

              {k === 0 && (
                <div className={s.photoMove}>
                  <div className={s.photo} data-shared="photo">
                    <div className={s.photoPrint}>
                      <Paper seed="about-photo" edge="straight">
                        <div className={s.photoMat}>
                          <div className={s.photoCrop}>
                            <HalftonePhoto alt="" sizes="96px" />
                          </div>
                        </div>
                      </Paper>
                    </div>
                  </div>
                  <span className={s.staple} aria-hidden="true" />
                </div>
              )}

              <Pin className={s.pin} />
              {k < about.length - 1 && <Thread className={s.drop} />}
            </li>
          ))}
        </ul>

        {grid && (
          <>
            <div className={s.threads} aria-hidden="true">
              {about.map((item, k) => (
                <Thread key={item.id} className={threads[k]} />
              ))}
            </div>
            {/* O alfinete crava o E por cima; os fios saem de baixo da peça. */}
            <div className={s.crossPinBox} aria-hidden="true">
              <Pin className={s.crossPin} />
            </div>
          </>
        )}
      </div>
    </Scene>
  );
}
