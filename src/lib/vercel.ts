// Executado apenas no servidor (page.tsx). O token nunca chega ao navegador:
// variáveis sem o prefixo NEXT_PUBLIC_ não são incluídas no bundle do cliente.
import { excludedProjects, projectOverrides } from '@/content/projects';
import { person } from '@/content/profile';

const API = 'https://api.vercel.com';
const REVALIDATE_SECONDS = 3600;

export interface Project {
  id: string;
  name: string;
  title: string;
  description: string | null;
  framework: string | null;
  url: string;
  repoUrl: string | null;
  previewImage: string;
}

export type ProjectsResult = { status: 'ok'; projects: Project[] } | { status: 'unconfigured' | 'error'; projects: [] };

interface ApiProject {
  id: string;
  name: string;
  framework?: string | null;
  updatedAt?: number;
  link?: { type?: string; repo?: string; org?: string };
  targets?: { production?: { url?: string; alias?: string[] } };
}

interface ApiDeployment {
  url?: string;
}

const token = () =>
  // NEXT_PUBLIC_VERCEL_TOKEN é aceito só como transição: lido aqui, no servidor, ele não vai para o bundle.
  // Renomeie para VERCEL_API_TOKEN na Vercel e rotacione o token antigo, que já foi exposto.
  process.env.VERCEL_API_TOKEN || process.env.NEXT_PUBLIC_VERCEL_TOKEN;

const withTeam = (url: string) => {
  const team = process.env.VERCEL_TEAM_ID || process.env.NEXT_PUBLIC_VERCEL_TEAM_ID;
  if (!team) return url;
  return `${url}${url.includes('?') ? '&' : '?'}teamId=${encodeURIComponent(team)}`;
};

async function api<T>(path: string, auth: string): Promise<T> {
  const response = await fetch(withTeam(`${API}${path}`), {
    headers: { Authorization: `Bearer ${auth}` },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!response.ok) throw new Error(`Vercel API ${response.status} em ${path}`);
  return response.json() as Promise<T>;
}

const productionUrl = async (project: ApiProject, auth: string) => {
  const alias = project.targets?.production?.alias?.[0];
  if (alias) return `https://${alias}`;
  try {
    const { deployments } = await api<{ deployments?: ApiDeployment[] }>(
      `/v6/deployments?projectId=${encodeURIComponent(project.id)}&limit=1&target=production`,
      auth,
    );
    if (deployments?.[0]?.url) return `https://${deployments[0].url}`;
  } catch {
    // Sem deployment de produção: usa o domínio padrão abaixo.
  }
  if (project.targets?.production?.url) return `https://${project.targets.production.url}`;
  return `https://${project.name}.vercel.app`;
};

const repoUrl = (project: ApiProject) => {
  if (project.link?.type !== 'github' || !project.link.repo) return null;
  return `https://github.com/${project.link.org || person.githubUser}/${project.link.repo}`;
};

const titleFromName = (name: string) =>
  name
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const previewImageFor = (url: string) =>
  `https://api.screen-shot.xyz/take?url=${encodeURIComponent(url)}&width=1200&height=750`;

/**
 * Captura de tela simulada (SVG inline) para o fixture de QA: funciona sem rede, ao contrário
 * do serviço de capturas, e deixa testar a folha de contato com imagens de verdade.
 */
const mockShot = (title: string, ink: string, paper: string, accent: string) => {
  const cards = [0, 1, 2]
    .map(
      (k) =>
        `<rect x="${96 + k * 344}" y="470" width="320" height="200" rx="14" fill="${paper}" stroke="${ink}" stroke-opacity=".14"/>` +
        `<rect x="${124 + k * 344}" y="502" width="${150 + k * 30}" height="18" rx="4" fill="${ink}" fill-opacity=".78"/>` +
        `<rect x="${124 + k * 344}" y="540" width="250" height="12" rx="4" fill="${ink}" fill-opacity=".28"/>` +
        `<rect x="${124 + k * 344}" y="564" width="210" height="12" rx="4" fill="${ink}" fill-opacity=".28"/>`,
    )
    .join('');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">` +
    `<rect width="1200" height="750" fill="${paper}"/>` +
    `<rect width="1200" height="84" fill="${ink}"/>` +
    `<circle cx="72" cy="42" r="18" fill="${accent}"/>` +
    `<rect x="104" y="34" width="150" height="16" rx="4" fill="${paper}" fill-opacity=".9"/>` +
    `<rect x="760" y="34" width="90" height="14" rx="4" fill="${paper}" fill-opacity=".55"/>` +
    `<rect x="880" y="34" width="90" height="14" rx="4" fill="${paper}" fill-opacity=".55"/>` +
    `<rect x="1000" y="26" width="120" height="32" rx="16" fill="${accent}"/>` +
    `<text x="96" y="210" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="700" fill="${ink}">${title}</text>` +
    `<rect x="96" y="250" width="620" height="18" rx="5" fill="${ink}" fill-opacity=".35"/>` +
    `<rect x="96" y="282" width="520" height="18" rx="5" fill="${ink}" fill-opacity=".35"/>` +
    `<rect x="96" y="340" width="190" height="54" rx="27" fill="${accent}"/>` +
    `<rect x="304" y="340" width="170" height="54" rx="27" fill="none" stroke="${ink}" stroke-width="3"/>` +
    `<rect x="800" y="150" width="304" height="250" rx="18" fill="${accent}" fill-opacity=".22"/>` +
    `<path d="M830 360 L900 290 L960 330 L1040 230 L1080 260" fill="none" stroke="${accent}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>` +
    cards +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

/** Projetos plausíveis para QA visual (PROJECTS_FIXTURE=1). Nunca usado em produção. */
const fixtureProjects = (): Project[] => {
  const project = (
    name: string,
    title: string,
    description: string | null,
    framework: string | null,
    withRepo: boolean,
    shot: [string, string, string] | null,
  ): Project => {
    const url = `https://${name}.vercel.app`;
    return {
      id: `prj_fixture_${name}`,
      name,
      title,
      description,
      framework,
      url,
      repoUrl: withRepo ? `https://github.com/${person.githubUser}/${name}` : null,
      // Sem `shot`, usa o serviço real de capturas (bloqueado no ambiente de QA: testa o quadro tipográfico).
      previewImage: shot ? mockShot(title, ...shot) : previewImageFor(url),
    };
  };
  return [
    project(
      'agente-triagem',
      'Agente de triagem',
      'Agente de IA que organiza a fila de atendimento a partir dos sintomas relatados pelo paciente.',
      'nextjs',
      true,
      ['#13233f', '#f4f7fb', '#2f7de1'],
    ),
    project('painel-leitos', 'Painel de leitos', 'Ocupação de leitos em tempo real para equipes de regulação.', 'vite', false, [
      '#1d1d1b',
      '#fbf7ef',
      '#e2583e',
    ]),
    project('agenda-clinica', 'Agenda Clinica', null, 'nextjs', true, null),
    project(
      'fhir-explorer',
      'Explorador FHIR',
      'Navegador de recursos FHIR para testar integrações entre sistemas de saúde.',
      'vite',
      true,
      ['#0f2f2a', '#eef6f2', '#19a37a'],
    ),
    project('relatorios-automaticos', 'Relatórios automáticos de produção', null, null, false, null),
  ];
};

export async function getProjects(): Promise<ProjectsResult> {
  if (process.env.PROJECTS_FIXTURE === '1') return { status: 'ok', projects: fixtureProjects() };
  if (process.env.PROJECTS_FIXTURE === 'error') return { status: 'error', projects: [] };
  const auth = token();
  if (!auth) return { status: 'unconfigured', projects: [] };

  try {
    const { projects = [] } = await api<{ projects?: ApiProject[] }>('/v9/projects?limit=100', auth);
    const visible = projects.filter(
      (project) => !excludedProjects.includes(project.name) && !projectOverrides[project.name]?.hidden,
    );

    const resolved = await Promise.all(
      visible.map(async (project): Promise<Project & { order: number; updatedAt: number }> => {
        const override = projectOverrides[project.name] ?? {};
        const url = await productionUrl(project, auth);
        return {
          id: project.id,
          name: project.name,
          title: override.title ?? titleFromName(project.name),
          description: override.description ?? null,
          framework: project.framework ?? null,
          url,
          repoUrl: repoUrl(project),
          previewImage: previewImageFor(url),
          order: override.order ?? Number.POSITIVE_INFINITY,
          updatedAt: project.updatedAt ?? 0,
        };
      }),
    );

    resolved.sort((a, b) => a.order - b.order || b.updatedAt - a.updatedAt);
    return {
      status: 'ok',
      projects: resolved.map((project) => ({
        id: project.id,
        name: project.name,
        title: project.title,
        description: project.description,
        framework: project.framework,
        url: project.url,
        repoUrl: project.repoUrl,
        previewImage: project.previewImage,
      })),
    };
  } catch (error) {
    console.error('Falha ao buscar projetos na Vercel:', error);
    return { status: 'error', projects: [] };
  }
}
