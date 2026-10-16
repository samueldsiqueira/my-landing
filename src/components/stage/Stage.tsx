'use client';

import { useRef, type CSSProperties } from 'react';
import { FiChevronDown, FiChevronLeft, FiChevronRight, FiChevronUp, FiRotateCcw, FiX } from 'react-icons/fi';
import { person, scenes } from '@/content/profile';
import { useStage } from './Director';
import s from './Stage.module.css';

const RULER_MARKS = Array.from({ length: 12 }, (_, i) => (i + 1) * 5);

function MotionToggle({ className }: { className?: string }) {
  const { motion, setMotion } = useStage();
  const reduced = motion === 'reduced';
  return (
    <button
      type="button"
      className={`${s.toggle} ${className ?? ''}`}
      aria-pressed={reduced}
      onClick={() => setMotion(reduced ? 'full' : 'reduced')}
    >
      <span className={s.switch} aria-hidden="true" />
      Movimento reduzido
    </button>
  );
}

export function Stage({ children }: { children: React.ReactNode }) {
  const { index, mode, go, next, prev, rewind } = useStage();
  const sheet = useRef<HTMLDialogElement>(null);
  const current = scenes[index];
  const isLast = index === scenes.length - 1;
  const upcoming = scenes[index + 1];

  const onIndexClick = (event: React.MouseEvent<HTMLAnchorElement>, i: number) => {
    if (mode !== 'stage') return;
    event.preventDefault();
    sheet.current?.close();
    go(i, 'click');
  };

  return (
    <>
      <a className="skip-link" href={`#${current.id}-title`}>
        Pular para o conteúdo
      </a>
      <div className="mat" aria-hidden="true" />

      {/* Régua superior: decorativa, dá escala à mesa. */}
      <div className={s.rulerTop} aria-hidden="true" data-chrome>
        {RULER_MARKS.map((mark) => (
          <span key={mark} style={{ '--n': mark } as CSSProperties}>
            {mark}
          </span>
        ))}
      </div>

      {/* Modo leitura: barra simples com âncoras para cada seção. */}
      <header className={s.readbar} data-chrome>
        <a href="#inicio" className={s.readName}>
          {person.name}
        </a>
        <nav aria-label="Seções">
          <ul>
            {scenes.slice(1).map((scene) => (
              <li key={scene.id}>
                <a href={`#${scene.id}`}>{scene.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="./" className={s.readSwitch}>
          Ver como cenas
        </a>
      </header>

      {/* Régua lateral: o índice das cenas (desktop). */}
      <nav className={s.index} aria-label="Cenas" data-chrome>
        <ol>
          {scenes.map((scene, i) => (
            <li key={scene.id}>
              <a
                href={`#${scene.id}`}
                aria-current={i === index ? 'location' : undefined}
                onClick={(event) => onIndexClick(event, i)}
              >
                <span className={s.indexNumber}>{i + 1}</span>
                <span className={s.indexLabel}>{scene.label}</span>
              </a>
            </li>
          ))}
        </ol>
        <span className={s.pin} style={{ '--i': index } as CSSProperties} aria-hidden="true" />
      </nav>

      <div className={s.tools} data-chrome>
        <MotionToggle />
        <a href="?modo=leitura" className={s.toolLink}>
          Ver em uma página
        </a>
      </div>

      <main id="conteudo" className={s.scenes}>
        {children}
      </main>

      {/* Controles de sequência (desktop). */}
      <div className={s.sequence} data-chrome>
        {index > 0 && (
          <button type="button" className={s.prev} onClick={() => prev('click')}>
            <FiChevronUp aria-hidden="true" />
            Anterior
          </button>
        )}
        {isLast ? (
          <button type="button" className={s.next} onClick={() => rewind()}>
            <small>Fim</small>
            <strong>
              Rever do início <FiRotateCcw aria-hidden="true" />
            </strong>
          </button>
        ) : (
          <button
            type="button"
            className={s.next}
            onClick={() => next('click')}
            aria-label={`Próxima cena: ${upcoming.label}`}
          >
            <small>Próxima cena</small>
            <strong>
              {upcoming.label} <FiChevronDown aria-hidden="true" />
            </strong>
          </button>
        )}
        <p className={s.hint} aria-hidden="true">
          Role, use ↑ ↓ ou escolha no índice
        </p>
      </div>

      {/* Barra inferior (telas compactas): papel rasgado com anterior, índice e próxima. */}
      <nav className={s.bar} aria-label="Navegação entre cenas" data-chrome>
        <button type="button" onClick={() => prev('click')} disabled={index === 0} aria-label="Cena anterior">
          <FiChevronLeft aria-hidden="true" />
        </button>
        <button type="button" className={s.where} onClick={() => sheet.current?.showModal()} aria-haspopup="dialog">
          <strong>{current.label}</strong>
          <small>
            {index + 1} de {scenes.length}
          </small>
        </button>
        {isLast ? (
          <button type="button" onClick={() => rewind()} aria-label="Rever do início">
            <FiRotateCcw aria-hidden="true" />
          </button>
        ) : (
          <button type="button" onClick={() => next('click')} aria-label={`Próxima cena: ${upcoming.label}`}>
            <FiChevronRight aria-hidden="true" />
          </button>
        )}
      </nav>

      <dialog
        ref={sheet}
        className={s.sheet}
        aria-labelledby="sheet-title"
        onClick={(event) => event.target === event.currentTarget && sheet.current?.close()}
      >
        <div className={s.sheetPaper}>
          <div className={s.sheetHead}>
            <h2 id="sheet-title">Índice</h2>
            <button type="button" onClick={() => sheet.current?.close()} aria-label="Fechar índice">
              <FiX aria-hidden="true" />
            </button>
          </div>
          <ol>
            {scenes.map((scene, i) => (
              <li key={scene.id}>
                <a
                  href={`#${scene.id}`}
                  aria-current={i === index ? 'location' : undefined}
                  onClick={(event) => onIndexClick(event, i)}
                >
                  <span>{i + 1}</span>
                  {scene.label}
                </a>
              </li>
            ))}
          </ol>
          <div className={s.sheetTools}>
            <MotionToggle className={s.sheetToggle} />
            <a href="?modo=leitura">Ver em uma página</a>
          </div>
        </div>
      </dialog>

      <div className="flicker" aria-hidden="true" />
      <div className="hand" aria-hidden="true" />
      <p id="stage-live" className="sr-only" aria-live="polite" aria-atomic="true" />
    </>
  );
}
