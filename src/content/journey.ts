// A jornada do mago: cada etapa da carreira vira uma missão no caminho. Os fatos vêm de
// profile.ts (empregos, textos); aqui ficam só a narrativa de jogo, as tarefas resumidas e as
// recompensas (XP e atributos), que são metáfora — a progressão conta a história, não mede nada.
import { about, jobs, person, type Job, type SceneId } from './profile';

export type AttrId = 'codigo' | 'suporte' | 'automacao' | 'integracao' | 'saude' | 'ia';

export const attributes: { id: AttrId; label: string; short: string }[] = [
  { id: 'codigo', label: 'Código', short: 'COD' },
  { id: 'suporte', label: 'Suporte', short: 'SUP' },
  { id: 'automacao', label: 'Automação', short: 'AUT' },
  { id: 'integracao', label: 'Integração', short: 'INT' },
  { id: 'saude', label: 'Saúde', short: 'SAÚ' },
  { id: 'ia', label: 'IA', short: 'IA' },
];

/** Atributos com que o herói começa a jornada. */
export const ATTR_START = 1;
export const ATTR_MAX = 10;

export interface Quest {
  /** Rótulo curto da tarefa (a lista de verificação da missão). */
  task: string;
}

export interface Stage {
  id: SceneId;
  kind: 'title' | 'quest' | 'grimoire' | 'board' | 'finale';
  /** "Capítulo 2" etc. (vazio na abertura e nas telas finais). */
  chapter?: string;
  /** Nome do lugar no mapa. */
  place: string;
  /** Título da missão. */
  title: string;
  job?: Job;
  /** Período por extenso quando não vem de um emprego. */
  period?: string;
  /** Narrativa curta, na voz do jogo, mas só com fatos. */
  intro: string;
  tasks: string[];
  /** Missões paralelas (em andamento, fora do emprego). */
  side?: { title: string; text: string }[];
  /** Texto completo de origem (relatório da missão): o currículo sem resumo. */
  report?: string[];
  note?: string;
  xp: number;
  gains: Partial<Record<AttrId, number>>;
  /** Itens (tecnologias) citados explicitamente na fonte. */
  items?: string[];
}

const job = (id: string) => {
  const found = jobs.find((item) => item.id === id);
  if (!found) throw new Error(`emprego desconhecido: ${id}`);
  return found;
};

export const stages: Stage[] = [
  {
    id: 'inicio',
    kind: 'title',
    place: 'Vila Inicial',
    title: 'A Jornada de Samuel',
    intro: person.summary,
    tasks: [],
    xp: 0,
    gains: {},
  },
  {
    id: 'origem',
    kind: 'quest',
    chapter: 'Capítulo 1',
    place: 'Taverna dos Jogadores',
    title: 'O código do MMO',
    intro:
      'A jornada começou num jogo MMO. Num fórum, o aprendiz encontrou o código-fonte do jogo que jogava e resolveu mergulhar.',
    tasks: [
      'Encontrar o código-fonte do jogo num fórum',
      'Ler, testar e aprender até o código funcionar',
      'Fazer o jogo rodar em diversas ocasiões',
    ],
    xp: 150,
    gains: { codigo: 2 },
  },
  {
    id: 'indra',
    kind: 'quest',
    chapter: 'Capítulo 2',
    place: 'Guilda do Suporte',
    title: 'Suporte para o mundo todo',
    job: job('indra'),
    intro:
      'Na guilda do suporte, o mago aprendeu a resolver problemas reais de usuários de vários continentes, sem perder a calma nem o padrão de qualidade.',
    tasks: [
      'Suporte especializado em softwares Microsoft para uma multinacional com mais de 50 mil funcionários',
      'Atender usuários no Brasil, na América Latina, nos EUA e na Europa',
      'Analisar requisições e desvios com melhoria contínua',
      'Criar novos padrões e processos de atendimento',
    ],
    report: job('indra').description,
    note: job('indra').note,
    xp: 900,
    gains: { suporte: 5, integracao: 1 },
  },
  {
    id: 'kenzie',
    kind: 'quest',
    chapter: 'Capítulo 3',
    place: 'Academia Kenzie',
    title: 'Formação de Desenvolvedor Front-End',
    intro:
      'Para entender os sistemas por dentro, o mago entrou para a academia e concluiu o bootcamp da Kenzie Academy, formando-se Desenvolvedor Front-End.',
    tasks: [
      'Concluir o bootcamp de Desenvolvedor Front-End da Kenzie Academy',
      'Construir os projetos do curso: Kenzie Hub, Hamburgueria e Nu Kenzie',
      'Projeto final em equipe: Center RPG',
    ],
    xp: 600,
    gains: { codigo: 4 },
    items: ['Front-End'],
  },
  {
    id: 'tim',
    kind: 'quest',
    chapter: 'Capítulo 4',
    place: 'Torres de Transmissão',
    title: 'Automação na engenharia de telecom',
    job: job('tim'),
    intro:
      'Nas torres da TIM, o mago encontrou tarefas repetidas e as transformou em feitiços de automação que trabalham sozinhos.',
    tasks: [
      'Analisar processos internos repetitivos da engenharia de telecomunicações',
      'Automatizar processos legados com Python e JavaScript',
      'Web scraping com Playwright e Selenium',
      'Melhorar a eficiência operacional com automação inteligente',
    ],
    report: job('tim').description,
    xp: 900,
    gains: { automacao: 5, codigo: 2 },
    items: ['Python', 'JavaScript', 'Playwright', 'Selenium'],
  },
  {
    id: 'senai',
    kind: 'quest',
    chapter: 'Capítulo 5',
    place: 'Santuário da Saúde',
    title: 'Sistemas para a saúde',
    job: job('senai'),
    intro: `${about[0].text} No santuário, o mago cuida de sistemas que apoiam a área da saúde.`,
    tasks: [
      'Análise técnica e integrações de sistemas',
      'Evoluir e manter sistemas voltados à área da saúde',
      'Definir requisitos, melhorar processos e integrar plataformas',
      'Alinhar tecnologia, desempenho e conformidade técnica',
    ],
    side: [
      { title: 'Agentes de IA', text: about[1].text },
      { title: 'Consultoria', text: about[2].text },
    ],
    report: job('senai').description,
    xp: 1000,
    gains: { integracao: 5, saude: 5, ia: 4 },
  },
  {
    id: 'grimorio',
    kind: 'grimoire',
    place: 'Biblioteca Arcana',
    title: 'Grimório de feitiços',
    intro: 'Cada tecnologia aprendida pelo caminho virou um feitiço no grimório do mago.',
    tasks: [],
    xp: 0,
    gains: {},
  },
  {
    id: 'projetos',
    kind: 'board',
    place: 'Mural de Missões',
    title: 'Missões secundárias',
    intro: 'Projetos publicados pelo mago. Cada cartaz leva ao site no ar e, quando houver, ao código.',
    tasks: [],
    xp: 0,
    gains: {},
  },
  {
    id: 'contato',
    kind: 'finale',
    place: 'Acampamento',
    title: 'Próxima missão: a sua',
    intro:
      'O mago está pronto para a próxima etapa. Tem um projeto, uma consultoria ou uma vaga? Escolha um pergaminho e chame para a aventura.',
    tasks: [],
    xp: 0,
    gains: {},
  },
];

/** Nível a partir do XP acumulado (curva quadrática: cada nível custa um pouco mais). */
export const levelFor = (xp: number) => 1 + Math.floor(Math.sqrt(xp / 20));
export const xpForLevel = (level: number) => 20 * (level - 1) ** 2;

export interface Progress {
  xp: number;
  level: number;
  /** Fração do nível atual já preenchida (0–1). */
  fill: number;
  attrs: Record<AttrId, number>;
}

/** Progresso acumulado ao concluir cada etapa (na ordem das etapas). */
export const progress: Progress[] = (() => {
  const attrs = Object.fromEntries(attributes.map((a) => [a.id, ATTR_START])) as Record<AttrId, number>;
  let xp = 0;
  return stages.map((stage) => {
    xp += stage.xp;
    for (const [id, gain] of Object.entries(stage.gains)) attrs[id as AttrId] += gain ?? 0;
    const level = levelFor(xp);
    const start = xpForLevel(level);
    const fill = (xp - start) / (xpForLevel(level + 1) - start);
    return { xp, level, fill, attrs: { ...attrs } };
  });
})();
