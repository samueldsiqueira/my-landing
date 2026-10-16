import { Scene } from '@/components/stage/Scene';
import { Paper, headingProps } from '@/components/paper';
import { person } from '@/content/profile';
import type { ProjectsResult } from '@/lib/vercel';
import stub from './stub.module.css';

// PROVISÓRIO: será substituído pela composição "Folha de contato" com lupa.
export default function Projects({ result }: { result: ProjectsResult }) {
  return (
    <Scene id="projects" className={stub.canvas}>
      <Paper seed="projects-stub" className={stub.sheet}>
        <h2 className={stub.title} {...headingProps('projects')}>
          Projetos
        </h2>
        {result.projects.length ? (
          <ul className={stub.list}>
            {result.projects.map((project) => (
              <li key={project.id}>
                <h3>{project.title}</h3>
                {project.framework && <p>{project.framework}</p>}
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  Abrir site
                </a>{' '}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                    Ver código
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className={stub.list}>
            <p>Nenhum projeto publicado no momento. O código está no GitHub.</p>
            <a href={person.github} target="_blank" rel="noopener noreferrer">
              Ver repositórios no GitHub
            </a>
          </div>
        )}
      </Paper>
    </Scene>
  );
}
