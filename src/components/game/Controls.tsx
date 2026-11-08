'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { person, scenes, type SceneId } from '@/content/profile';
import { useStage } from '@/components/stage/Director';

function MotionToggle() {
  const { motion, setMotion } = useStage();
  const reduced = motion === 'reduced';
  return (
    <button type="button" className="g-toggle" aria-pressed={reduced} onClick={() => setMotion(reduced ? 'full' : 'reduced')}>
      <span className="g-switch" aria-hidden="true" />
      Movimento reduzido
    </button>
  );
}

/**
 * Comandos do jogo: avançar/voltar, o mapa da jornada (índice das etapas), a barra compacta
 * do celular com o mapa em diálogo, e as opções (movimento reduzido, página única).
 * Links com data-go (no conteúdo) viram navegação da máquina no modo jogo.
 */
export function Controls() {
  const { index, mode, go, next, prev, rewind } = useStage();
  const sheet = useRef<HTMLDialogElement>(null);
  const current = scenes[index];
  const isLast = index === scenes.length - 1;
  const upcoming = scenes[index + 1];

  useEffect(() => {
    if (mode !== 'stage') return;
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[data-go]');
      if (!link) return;
      event.preventDefault();
      go(link.dataset.go as SceneId, 'click');
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [mode, go]);

  const onMapClick = (event: React.MouseEvent<HTMLAnchorElement>, i: number) => {
    if (mode !== 'stage') return;
    event.preventDefault();
    sheet.current?.close();
    go(i, 'click');
  };

  const mapItems = (compact: boolean) =>
    scenes.map((scene, i) => (
      <li key={scene.id}>
        <a href={`#${scene.id}`} aria-current={i === index ? 'step' : undefined} onClick={(event) => onMapClick(event, i)}>
          <span className="g-node" aria-hidden="true">
            {i + 1}
          </span>
          <span className={compact ? undefined : 'g-node-label'}>{scene.label}</span>
        </a>
      </li>
    ));

  return (
    <>
      <a className="skip-link" href={`#${current.id}-title`}>
        Pular para o conteúdo
      </a>

      {/* Modo leitura: barra simples com âncoras para cada etapa. */}
      <header className="g-readbar" data-chrome>
        <a href="#inicio" className="g-readname">
          {person.name}
        </a>
        <nav aria-label="Etapas">
          <ul>
            {scenes.slice(1).map((scene) => (
              <li key={scene.id}>
                <a href={`#${scene.id}`}>{scene.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="./" className="g-readswitch">
          Jogar a jornada
        </a>
      </header>

      <div className="g-tools" data-chrome>
        <MotionToggle />
        <a href="?modo=leitura" className="g-toollink">
          Ver em uma página
        </a>
      </div>

      {/* Mapa da jornada (telas largas). */}
      <nav className="g-map" aria-label="Mapa da jornada" data-chrome style={{ '--i': index } as CSSProperties}>
        <ol>{mapItems(false)}</ol>
      </nav>

      <div className="g-steps" data-chrome>
        <button type="button" className="g-button g-prev" onClick={() => prev('click')} disabled={index === 0} aria-label="Voltar uma etapa">
          <span aria-hidden="true">◀</span>
        </button>
        {isLast ? (
          <button type="button" className="g-button g-next" onClick={() => rewind()}>
            <span aria-hidden="true">↺</span> Recomeçar
          </button>
        ) : (
          <button type="button" className="g-button g-next" onClick={() => next('click')}>
            <span className="g-next-text">
              <small>Avançar para</small> {upcoming.label}
            </span>
            <span aria-hidden="true">▶</span>
          </button>
        )}
      </div>

      {/* Barra compacta (celular): voltar, onde estou (abre o mapa) e avançar. */}
      <nav className="g-bar" aria-label="Navegação da jornada" data-chrome>
        <button type="button" className="g-button" onClick={() => prev('click')} disabled={index === 0} aria-label="Voltar uma etapa">
          <span aria-hidden="true">◀</span>
        </button>
        <button type="button" className="g-where" onClick={() => sheet.current?.showModal()} aria-haspopup="dialog">
          <strong>{current.label}</strong>
          <small>
            Etapa {index + 1} de {scenes.length} · mapa
          </small>
        </button>
        {isLast ? (
          <button type="button" className="g-button" onClick={() => rewind()} aria-label="Recomeçar a jornada">
            <span aria-hidden="true">↺</span>
          </button>
        ) : (
          <button type="button" className="g-button g-button-gold" onClick={() => next('click')} aria-label={`Avançar para ${upcoming.label}`}>
            <span aria-hidden="true">▶</span>
          </button>
        )}
      </nav>

      <dialog
        ref={sheet}
        className="g-sheet"
        aria-labelledby="sheet-title"
        onClick={(event) => event.target === event.currentTarget && sheet.current?.close()}
      >
        <div className="g-sheet-box">
          <div className="g-sheet-head">
            <h2 id="sheet-title">Mapa da jornada</h2>
            <button type="button" className="g-button g-button-small" onClick={() => sheet.current?.close()} aria-label="Fechar o mapa">
              <span aria-hidden="true">✕</span>
            </button>
          </div>
          <ol className="g-sheet-list">{mapItems(true)}</ol>
          <div className="g-sheet-tools">
            <MotionToggle />
            <a href="?modo=leitura" className="g-toollink">
              Ver em uma página
            </a>
          </div>
        </div>
      </dialog>

      <p id="stage-live" className="sr-only" aria-live="polite" aria-atomic="true" />
    </>
  );
}
