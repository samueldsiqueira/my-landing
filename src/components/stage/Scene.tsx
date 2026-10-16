import type { ReactNode } from 'react';
import type { SceneId } from '@/content/profile';

/**
 * Seção de uma cena. Fora do palco (sem JS, modo leitura, impressão) é uma seção comum
 * do documento; no palco, o CSS mostra apenas a cena indicada em html[data-scene].
 * O título da cena deve usar headingProps(id) (de components/paper).
 */
export function Scene({ id, className, children }: { id: SceneId; className?: string; children: ReactNode }) {
  return (
    <section id={id} data-id={id} className="scene" aria-labelledby={`${id}-title`}>
      <div className="scene-scroll">
        <div className={className ? `scene-canvas ${className}` : 'scene-canvas'}>{children}</div>
      </div>
    </section>
  );
}
