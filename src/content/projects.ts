/**
 * Curadoria opcional dos projetos vindos da API da Vercel, indexada pelo nome do projeto na Vercel.
 * Tudo aqui é opcional: projetos sem entrada aparecem com os dados da API.
 *
 * Exemplo:
 *   'meu-app': { title: 'Meu App', description: 'Painel de triagem para clínicas.', order: 1 },
 *   'rascunho-antigo': { hidden: true },
 */
export interface ProjectOverride {
  title?: string;
  description?: string;
  hidden?: boolean;
  /** Menor aparece primeiro; projetos sem ordem vêm depois, por data de atualização. */
  order?: number;
}

export const projectOverrides: Record<string, ProjectOverride> = {};

/** Projetos da conta que nunca aparecem (o próprio portfólio). */
export const excludedProjects = ['my-landing'];
