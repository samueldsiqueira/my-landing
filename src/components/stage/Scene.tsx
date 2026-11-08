import type { ReactNode } from 'react';
import type { SceneId } from '@/content/profile';

/** Props do título de cada etapa: alvo de foco ao trocar de etapa. */
export const headingProps = (sceneId: string) => ({
  id: `${sceneId}-title`,
  'data-scene-heading': '',
  tabIndex: -1,
});

/**
 * Seção de uma etapa (a janela da missão). Fora do jogo (sem JS, modo leitura, impressão) é
 * uma seção comum do documento; no jogo, o CSS mostra apenas a etapa de html[data-scene].
 * O título deve usar headingProps(id).
 */
export function Scene({
  id,
  kind,
  className,
  children,
}: {
  id: SceneId;
  kind: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} data-id={id} data-kind={kind} className="scene" aria-labelledby={`${id}-title`}>
      <div className="scene-scroll" role="group" aria-labelledby={`${id}-title`}>
        <div className={className ? `scene-canvas ${className}` : 'scene-canvas'}>{children}</div>
      </div>
    </section>
  );
}
