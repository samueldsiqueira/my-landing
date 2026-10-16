// Peças da folha de contato. Sem hooks: renderizam no servidor (estado vazio) e dentro da ilha
// interativa (ProjectsSheet). Coreografia e composição em Projects.module.css.
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { Dymo, cx } from '@/components/paper';
import type { Project } from '@/lib/vercel';
import s from '../Projects.module.css';

export type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** A tira foi cortada do meio do rolo: a numeração de borda começa no quadro 13, como numa folha real. */
const FIRST_FRAME = 13;

/** Uma tira de folha de contato tem 6 quadros; com mais projetos, ela ganha quadros (e encolhe no palco largo). */
export const slotCount = (projects: number) => Math.max(6, projects);

/**
 * Revelação dos quadros na entrada, em quadros de 12 fps: o quadro sob a lupa já está revelado
 * (é o que se vê pela lente); os outros revelam a partir dela, em 3 levas a partir do quadro 5.
 */
export const developTiming = (j: number, sel: number, n: number): Vars => {
  if (j === sel) return { '--dv': 0, '--dd': 0 };
  const wave = Math.min(2, Math.floor(((Math.abs(j - sel) - 1) * 3) / Math.max(1, n - 1)));
  return { '--dv': 5 + wave, '--dd': 3 };
};

const FRAMEWORKS: Record<string, string> = {
  nextjs: 'Next.js',
  vite: 'Vite',
  'create-react-app': 'Create React App',
  remix: 'Remix',
  'react-router': 'React Router',
  astro: 'Astro',
  sveltekit: 'SvelteKit',
  'sveltekit-1': 'SvelteKit',
  svelte: 'Svelte',
  nuxtjs: 'Nuxt',
  vue: 'Vue',
  gatsby: 'Gatsby',
  angular: 'Angular',
  hugo: 'Hugo',
  docusaurus: 'Docusaurus',
  'docusaurus-2': 'Docusaurus',
  eleventy: 'Eleventy',
  vitepress: 'VitePress',
  storybook: 'Storybook',
  express: 'Express',
  hono: 'Hono',
  fastapi: 'FastAPI',
  flask: 'Flask',
  python: 'Python',
  node: 'Node.js',
};

/** Nome legível do framework a partir do identificador da Vercel ("nextjs" → "Next.js"). */
export const frameworkLabel = (slug: string) =>
  FRAMEWORKS[slug] ??
  slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

type Shot = Pick<Project, 'title' | 'framework' | 'previewImage'>;

/**
 * Imagem de um quadro. Por baixo da captura fica um quadro tipográfico com o título: se a
 * imagem remota falhar (ou ainda não tiver chegado), é ele que aparece — sem depender de JS.
 * Sem projeto, o quadro fica virgem (cinza, não exposto).
 */
export function Picture({ shot, className }: { shot?: Shot; className?: string }) {
  return (
    <span className={cx(s.picture, className)}>
      {shot && (
        <span className={s.develop}>
          <span className={s.slate} aria-hidden="true">
            {shot.framework && <span className={s.slateMeta}>{frameworkLabel(shot.framework)}</span>}
            <span className={s.slateTitle}>{shot.title}</span>
          </span>
          {/* Captura remota (serviço externo): o otimizador do Next não ajuda e exigiria liberar o domínio. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={s.shot}
            src={shot.previewImage}
            alt=""
            width={1200}
            height={750}
            loading="lazy"
            decoding="async"
          />
        </span>
      )}
    </span>
  );
}

/** Uma posição da tira: o quadro e as marcas impressas na borda (número e meia-posição "▸13A"). */
export function Slot({ j, timing, selected, children }: { j: number; timing?: Vars; selected?: boolean; children: ReactNode }) {
  return (
    <div className={s.slot} style={timing} data-selected={selected ? '' : undefined}>
      {children}
      <span className={s.edgeNumber} aria-hidden="true">
        {FIRST_FRAME + j}
      </span>
      <span className={s.edgeHalf} aria-hidden="true">
        ▸{FIRST_FRAME + j}A
      </span>
    </div>
  );
}

/**
 * Tira de filme 35 mm: base preta com as perfurações vazadas (máscara: a esteira aparece pelos
 * furos), código de barras na ponta e os quadros. A sombra fica no invólucro, porque a máscara
 * cortaria a própria sombra.
 */
export function Film({ children, className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={s.filmShadow}>
      <div className={cx(s.film, className)} {...rest}>
        <span className={s.dx} aria-hidden="true" />
        <span className={s.leaderMark} aria-hidden="true">
          ▸{FIRST_FRAME - 1}A
        </span>
        {children}
      </div>
    </div>
  );
}

/**
 * Conta-fios (lupa) apoiado no quadro selecionado. A lente mostra uma cópia ampliada da tira
 * inteira, deslocada junto com a lupa: no caminho entre dois quadros ela mostra a borda e o
 * vizinho, como uma lupa de verdade. O corpo é contra-girado para que o brilho e a sombra
 * fiquem alinhados com a luz da mesa, e a cópia volta a girar com a tira.
 */
export function Loupe({ clone, moving }: { clone: ReactNode; moving?: boolean }) {
  return (
    <span className={s.loupeTrack} aria-hidden="true">
      <span className={s.loupe} data-moving={moving ? '' : undefined}>
        <span className={s.loupeShadow} />
        <span className={s.loupeBody}>
          <span className={s.lens}>
            <span className={s.lensContent}>
              <span className={s.clone}>{clone}</span>
            </span>
          </span>
          <span className={s.glass} />
        </span>
      </span>
    </span>
  );
}

/** Etiqueta de papel com ilhós e linha violeta. `state` controla qual etiqueta aparece no palco. */
export function Tag({
  state,
  children,
  className,
}: {
  state?: 'on' | 'in' | 'out';
  children: ReactNode;
  className?: string;
}) {
  return (
    <li className={cx(s.tag, className)} data-state={state}>
      <div className={s.tagSheet}>{children}</div>
      <span className={s.eyelet} aria-hidden="true" />
      <svg className={s.thread} viewBox="0 0 120 90" aria-hidden="true" focusable="false">
        <path d="M112 45c-14 2-30 9-44 20-15 12-30 19-48 17-9-1-15-6-17-12" />
      </svg>
    </li>
  );
}

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

/** Link externo do tipo ação (abre em nova aba, avisado para leitores de tela). */
export function Action({ href, alt, children }: { href: string; alt?: boolean; children: ReactNode }) {
  return (
    <a className={cx(s.action, alt && s.actionAlt)} href={href} {...external}>
      {children}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}

/** Conteúdo da etiqueta de um projeto. */
export function ProjectDetails({ project }: { project: Project }) {
  return (
    <>
      <h3 className={s.tagTitle}>{project.title}</h3>
      {project.description && <p className={s.tagText}>{project.description}</p>}
      {project.framework && (
        <p className={s.tagMeta}>
          <span className="sr-only">Framework: </span>
          <Dymo className={s.dymo}>{frameworkLabel(project.framework)}</Dymo>
        </p>
      )}
      <p className={s.actions}>
        <Action href={project.url}>Abrir site</Action>
        {project.repoUrl && (
          <Action href={project.repoUrl} alt>
            Ver código
          </Action>
        )}
      </p>
    </>
  );
}
