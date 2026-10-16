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

export async function getProjects(): Promise<ProjectsResult> {
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
