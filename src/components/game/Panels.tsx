import type { CSSProperties } from 'react';
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6';
import { FiMail } from 'react-icons/fi';
import { Scene, headingProps } from '@/components/stage/Scene';
import { attributes, progress, stages, type Stage } from '@/content/journey';
import { contact, person, skillGroups } from '@/content/profile';
import { formatDuration, formatMonth } from '@/lib/dates';
import type { ProjectsResult } from '@/lib/vercel';
import CopyEmail from './CopyEmail';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;
const NewTab = () => <span className="sr-only"> (abre em nova aba)</span>;

function Kicker({ stage }: { stage: Stage }) {
  return (
    <p className="g-kicker">
      {stage.chapter && <span>{stage.chapter}</span>}
      {stage.chapter && <span aria-hidden="true"> · </span>}
      <span>{stage.place}</span>
    </p>
  );
}

/** Abertura: a tela de título do jogo. */
function TitlePanel({ stage }: { stage: Stage }) {
  return (
    <Scene id={stage.id} kind={stage.kind}>
      <p className="g-kicker">A jornada de</p>
      <h1 className="g-logo" {...headingProps(stage.id)}>
        {person.name}
      </h1>
      <ul className="g-roles">
        {person.roles.map((role) => (
          <li key={role}>{role}</li>
        ))}
      </ul>
      <p className="g-intro">{stage.intro}</p>
      <a className="g-start" href={`#${stages[1].id}`} data-go={stages[1].id}>
        <span aria-hidden="true">▶</span> Começar jornada
      </a>
      <ul className="g-links">
        <li>
          <a href={person.linkedin} {...external}>
            LinkedIn
            <NewTab />
          </a>
        </li>
        <li>
          <a href={person.github} {...external}>
            GitHub
            <NewTab />
          </a>
        </li>
        <li>
          <a href={`mailto:${person.email}`}>E-mail</a>
        </li>
      </ul>
      <p className="g-hint" data-stage-only>
        Use ← → no teclado, deslize ou toque em Avançar.
      </p>
    </Scene>
  );
}

/** Missão de carreira: narrativa, tarefas cumpridas, recompensas e relatório completo. */
function QuestPanel({ stage, index, asOf }: { stage: Stage; index: number; asOf: string }) {
  const { job, school } = stage;
  const p = progress[index];
  return (
    <Scene id={stage.id} kind={stage.kind}>
      <Kicker stage={stage} />
      <h2 className="g-title" {...headingProps(stage.id)}>
        {stage.title}
      </h2>
      {job && (
        <p className="g-meta">
          <strong>{job.company}</strong> · {job.title}
          <br />
          <span>
            <time dateTime={job.start}>{formatMonth(job.start)}</time> –{' '}
            {job.end ? <time dateTime={job.end}>{formatMonth(job.end)}</time> : 'atual'} ·{' '}
            {formatDuration(job.start, job.end ?? asOf)} · {job.location}
          </span>
          {job.end === null && <span className="g-badge">Missão em andamento</span>}
        </p>
      )}
      {school && (
        <p className="g-meta">
          <strong>{school.institution}</strong> · {school.course}
          <br />
          <span>
            <time dateTime={school.start}>{formatMonth(school.start)}</time> –{' '}
            <time dateTime={school.end}>{formatMonth(school.end)}</time> · {formatDuration(school.start, school.end)} ·{' '}
            {school.field}
          </span>
        </p>
      )}
      <p className="g-intro">{stage.intro}</p>

      <h3 className="g-sub">Tarefas concluídas</h3>
      <ul className="g-tasks">
        {stage.tasks.map((task, k) => (
          <li key={task} style={{ '--k': k } as Vars}>
            <span className="g-check" aria-hidden="true" />
            {task}
          </li>
        ))}
      </ul>

      {stage.side && (
        <>
          <h3 className="g-sub">Missões paralelas</h3>
          <ul className="g-side">
            {stage.side.map((side) => (
              <li key={side.title}>
                <strong>{side.title}:</strong> {side.text}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="g-rewards">
        <h3 className="g-sub">Recompensas</h3>
        <ul>
          <li className="g-reward-xp">
            <span className="g-ico" style={{ backgroundImage: 'url(/game/xp.png)' }} aria-hidden="true" />+{stage.xp} XP
          </li>
          {attributes
            .filter((attr) => stage.gains[attr.id])
            .map((attr) => (
              <li key={attr.id}>
                <span className="g-ico" style={{ backgroundImage: `url(/game/icon-${attr.id}.png)` }} aria-hidden="true" />
                {attr.label} +{stage.gains[attr.id]}
              </li>
            ))}
          {stage.items && <li className="g-items">Itens: {stage.items.join(', ')}</li>}
        </ul>
        <p className="sr-only">
          Ao concluir: nível {p.level}, {p.xp} XP. {attributes.map((a) => `${a.label} ${p.attrs[a.id]}`).join(', ')}.
        </p>
      </div>

      {stage.report && (
        <details className="g-report">
          <summary>Relatório completo da missão</summary>
          {stage.report.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {stage.note && <p className="g-note">{stage.note}</p>}
        </details>
      )}
    </Scene>
  );
}

/** Grimório: as tecnologias como feitiços aprendidos, por escola. */
function GrimoirePanel({ stage }: { stage: Stage }) {
  return (
    <Scene id={stage.id} kind={stage.kind}>
      <Kicker stage={stage} />
      <h2 className="g-title" {...headingProps(stage.id)}>
        {stage.title}
      </h2>
      <p className="g-intro">{stage.intro}</p>
      {skillGroups.map((group) => (
        <section key={group.id} className="g-school" aria-labelledby={`school-${group.id}`}>
          <h3 className="g-sub" id={`school-${group.id}`}>
            {group.label}
          </h3>
          <ul className="g-spells">
            {group.items.map((skill) => (
              <li key={skill.name}>
                <skill.icon aria-hidden="true" focusable="false" />
                {skill.name}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Scene>
  );
}

/** Mural: projetos publicados na Vercel como missões secundárias. */
function BoardPanel({ stage, result }: { stage: Stage; result: ProjectsResult }) {
  return (
    <Scene id={stage.id} kind={stage.kind}>
      <Kicker stage={stage} />
      <h2 className="g-title" {...headingProps(stage.id)}>
        {stage.title}
      </h2>
      <p className="g-intro">{stage.intro}</p>
      {result.status === 'ok' && result.projects.length ? (
        <ul className="g-posters">
          {result.projects.map((project) => (
            <li key={project.id}>
              <h3>{project.title}</h3>
              {project.description && <p>{project.description}</p>}
              <p className="g-poster-links">
                <a href={project.url} {...external}>
                  Abrir site
                  <NewTab />
                </a>
                {project.repoUrl && (
                  <a href={project.repoUrl} {...external}>
                    Ver código
                    <NewTab />
                  </a>
                )}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="g-empty">
          <p>
            {result.status === 'error'
              ? 'O mural não carregou agora. As missões continuam no GitHub.'
              : 'Nenhum cartaz no mural por enquanto. As missões estão no GitHub.'}
          </p>
          <a className="g-button" href={person.github} {...external}>
            Ver repositórios no GitHub
            <NewTab />
          </a>
        </div>
      )}
    </Scene>
  );
}

const scrolls = [
  { label: 'Chamar no WhatsApp', detail: person.whatsapp.display, href: person.whatsapp.href, Icon: FaWhatsapp, ext: true },
  { label: 'Enviar e-mail', detail: person.email, href: `mailto:${person.email}`, Icon: FiMail, ext: false },
  { label: 'LinkedIn', detail: 'samuel-d-siqueira', href: person.linkedin, Icon: FaLinkedinIn, ext: true },
  { label: 'GitHub', detail: `@${person.githubUser}`, href: person.github, Icon: FaGithub, ext: true },
];

/** Final: a próxima missão é a de quem está jogando. */
function FinalePanel({ stage, year }: { stage: Stage; year: number }) {
  return (
    <Scene id={stage.id} kind={stage.kind}>
      <Kicker stage={stage} />
      <h2 className="g-title" {...headingProps(stage.id)}>
        {stage.title}
      </h2>
      <p className="g-intro">{stage.intro}</p>
      <h3 className="g-sub">{contact.title}</h3>
      <p>{contact.lead}</p>
      <ul className="g-scrolls">
        {scrolls.map(({ label, detail, href, Icon, ext }) => (
          <li key={label}>
            <a href={href} {...(ext ? external : {})}>
              <Icon aria-hidden="true" focusable="false" />
              <span>
                <strong>{label}</strong>
                <small>{detail}</small>
              </span>
              {ext && <NewTab />}
            </a>
          </li>
        ))}
      </ul>
      <CopyEmail email={person.email} />
      <p className="g-restart" data-stage-only>
        <a href={`#${stages[0].id}`} data-go={stages[0].id}>
          <span aria-hidden="true">↺</span> Recomeçar a jornada
        </a>
      </p>
      <p className="g-copy">
        © {year} {person.name}
      </p>
    </Scene>
  );
}

export function Panels({ projects, asOf, year }: { projects: ProjectsResult; asOf: string; year: number }) {
  return stages.map((stage, i) => {
    switch (stage.kind) {
      case 'title':
        return <TitlePanel key={stage.id} stage={stage} />;
      case 'quest':
        return <QuestPanel key={stage.id} stage={stage} index={i} asOf={asOf} />;
      case 'grimoire':
        return <GrimoirePanel key={stage.id} stage={stage} />;
      case 'board':
        return <BoardPanel key={stage.id} stage={stage} result={projects} />;
      case 'finale':
        return <FinalePanel key={stage.id} stage={stage} year={year} />;
    }
  });
}
