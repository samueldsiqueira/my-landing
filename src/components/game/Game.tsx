import type { ProjectsResult } from '@/lib/vercel';
import { Controls } from './Controls';
import { GameStyles } from './GameStyles';
import { Panels } from './Panels';
import { Hud, World } from './World';
import './game.css';

/**
 * A jornada: o mundo em pixel art (herói, caminho, cenários e ficha) é decorativo; o conteúdo
 * de verdade são as janelas de missão, uma seção por etapa, na ordem do documento.
 */
export function Game({ projects, asOf, year }: { projects: ProjectsResult; asOf: string; year: number }) {
  return (
    <>
      <GameStyles />
      <Controls />
      <div className="g-game" aria-hidden="true">
        <World />
        <Hud />
      </div>
      <main id="jornada" className="g-panels">
        <Panels projects={projects} asOf={asOf} year={year} />
      </main>
    </>
  );
}
