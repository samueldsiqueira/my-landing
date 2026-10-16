import { Scene } from '@/components/stage/Scene';
import { headingProps } from '@/components/paper';
import { person, scenes } from '@/content/profile';
import type { ProjectsResult } from '@/lib/vercel';
import { Action, Film, Loupe, Picture, Slot, Tag, slotCount, type Vars } from './projects/Film';
import ProjectsSheet from './projects/ProjectsSheet';
import s from './Projects.module.css';

const label = scenes.find((scene) => scene.id === 'projects')?.label ?? 'Projetos';

const emptyMessage = {
  unconfigured: 'Nenhum projeto publicado no momento. O código está no GitHub.',
  ok: 'Nenhum projeto publicado no momento. O código está no GitHub.',
  error: 'Não foi possível carregar os projetos agora.',
} as const;

/**
 * Cena 4 — "Folha de contato". Uma tira de filme 35 mm cruza a esteira com um projeto em cada
 * quadro; o conta-fios (lupa) repousa no quadro escolhido e a etiqueta ao lado traz os dados
 * e os links. Sem projetos, a tira fica virgem e a etiqueta aponta para o GitHub.
 * Coreografia em Projects.module.css; a ilha ProjectsSheet só cuida da seleção.
 */
export default function Projects({ result }: { result: ProjectsResult }) {
  const title = (
    <h2 className={s.title} {...headingProps('projects')}>
      <span className={s.titleTape}>{label}</span>
    </h2>
  );

  if (result.status === 'ok' && result.projects.length) {
    return (
      <Scene id="projects" className={s.canvas}>
        <div className={s.frame}>
          <ProjectsSheet projects={result.projects} title={title} />
        </div>
      </Scene>
    );
  }

  const n = slotCount(0);
  const blank = Array.from({ length: n }, (_, j) => (
    <Slot key={j} j={j} selected={j === 0}>
      <Picture />
    </Slot>
  ));

  return (
    <Scene id="projects" className={s.canvas}>
      <div className={s.frame}>
        <div className={s.camera} style={{ '--sel': 0, '--n': n } as Vars} data-empty="">
          {title}
          <div className={s.stripWrap}>
            <div className={s.strip} aria-hidden="true">
              <Film>{blank}</Film>
              <Loupe clone={<Film>{blank}</Film>} />
            </div>
          </div>
          <ul className={s.tags}>
            <Tag state="on" className={s.tagEmpty}>
              <p className={s.tagMessage}>{emptyMessage[result.status]}</p>
              <p className={s.actions}>
                <Action href={person.github}>Ver repositórios no GitHub</Action>
              </p>
            </Tag>
          </ul>
        </div>
      </div>
    </Scene>
  );
}
