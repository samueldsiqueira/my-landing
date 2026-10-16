import type { IconType } from 'react-icons';
import { FaMasksTheater } from 'react-icons/fa6';
import {
  SiCss,
  SiDocker,
  SiFastapi,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiLinux,
  SiMariadb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiRabbitmq,
  SiReact,
  SiSelenium,
  SiTypescript,
} from 'react-icons/si';

export const person = {
  name: "Samuel D' Siqueira",
  givenName: 'Samuel',
  familyName: "D' Siqueira",
  roles: ['Desenvolvedor de Software', 'Analista de Sistemas', 'Especialista em IA'],
  summary: 'Analista de Sistemas e desenvolvedor de software. Integra sistemas na área da saúde e cria agentes de IA.',
  email: 'samueldsiqueira@gmail.com',
  whatsapp: { display: '21 98113-4252', href: 'https://wa.me/5521981134252' },
  linkedin: 'https://www.linkedin.com/in/samuel-d-siqueira',
  github: 'https://github.com/samueldsiqueira',
  githubUser: 'samueldsiqueira',
  /** Linhas impressas na tira de formulário contínuo da abertura. */
  printout: ['Saúde + sistemas', 'Agentes de IA', 'Desde 2017'],
} as const;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://my-landing-olive.vercel.app';

export const scenes = [
  { id: 'inicio', label: 'Início', alias: 'inicio' },
  { id: 'about', label: 'Sobre', alias: 'sobre' },
  { id: 'skills', label: 'Tecnologias', alias: 'tecnologias' },
  { id: 'projects', label: 'Projetos', alias: 'projetos' },
  { id: 'experience', label: 'Experiência', alias: 'experiencia' },
  { id: 'contact', label: 'Contato', alias: 'contato' },
] as const;

export type SceneId = (typeof scenes)[number]['id'];

export const about = [
  {
    id: 'analista',
    title: 'Analista de Sistemas',
    text: 'Minha carreira é focada em implementações estratégicas na interseção entre tecnologia e saúde.',
  },
  {
    id: 'desenvolvimento',
    title: 'Desenvolvimento',
    text: 'Atualmente, dedico-me a integrar soluções avançadas, incluindo agentes de Inteligência Artificial, para otimizar processos e criar valor.',
  },
  {
    id: 'consultoria',
    title: 'Consultoria',
    text: 'Também desenvolvo projetos de software como consultor para terceiros, buscando sempre aplicar as tecnologias mais atuais.',
  },
] as const;

export interface Skill {
  name: string;
  icon: IconType;
}

export interface SkillGroup {
  id: string;
  label: string;
  items: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'linguagens',
    label: 'Linguagens',
    items: [
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'Python', icon: SiPython },
      { name: 'HTML', icon: SiHtml5 },
      { name: 'CSS', icon: SiCss },
    ],
  },
  {
    id: 'frameworks',
    label: 'Frameworks e runtime',
    items: [
      { name: 'React', icon: SiReact },
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'FastAPI', icon: SiFastapi },
    ],
  },
  {
    id: 'automacao',
    label: 'Automação e testes',
    items: [
      { name: 'Playwright', icon: FaMasksTheater },
      { name: 'Selenium', icon: SiSelenium },
    ],
  },
  {
    id: 'infra',
    label: 'Dados, filas e infraestrutura',
    items: [
      { name: 'PostgreSQL', icon: SiPostgresql },
      { name: 'MariaDB', icon: SiMariadb },
      { name: 'RabbitMQ', icon: SiRabbitmq },
      { name: 'Docker', icon: SiDocker },
      { name: 'Git', icon: SiGit },
      { name: 'Linux', icon: SiLinux },
    ],
  },
];

export interface Job {
  id: string;
  title: string;
  company: string;
  type: string;
  location: string;
  /** Mês de início no formato AAAA-MM. */
  start: string;
  /** Mês de término no formato AAAA-MM; null para o emprego atual. */
  end: string | null;
  description: string[];
  note?: string;
}

/** Do mais recente para o mais antigo. */
export const jobs: Job[] = [
  {
    id: 'senai',
    title: 'Analista de Sistemas',
    company: 'SENAI Soluções Digitais',
    type: 'Tempo integral',
    location: 'Remota',
    start: '2024-11',
    end: null,
    description: [
      'Atuo como Analista de Sistemas, com foco em análise técnica, integrações de sistemas e apoio ao desenvolvimento de soluções corporativas.',
      'Participo da evolução e manutenção de sistemas voltados à área da saúde, contribuindo com a definição de requisitos, melhoria de processos e integração entre plataformas.',
      'Busco sempre alinhar tecnologia, desempenho e conformidade técnica, garantindo soluções eficientes e seguras.',
    ],
  },
  {
    id: 'tim',
    title: 'Estagiário de Desenvolvimento de Software',
    company: 'TIM Brasil',
    type: 'Estágio',
    location: 'Híbrida',
    start: '2022-11',
    end: '2024-11',
    description: [
      'Integrante da equipe de engenharia de telecomunicações, minha função envolveu a análise de processos internos repetitivos para desenvolver automações eficientes.',
      'Desenvolvi projetos de automação de processos legados, empregando habilidades em Python e JavaScript, utilizando bibliotecas como Playwright e Selenium para web scraping.',
      'Meu papel visou melhorar a eficiência operacional e contribuir para a inovação contínua por meio da automação inteligente.',
    ],
  },
  {
    id: 'indra',
    title: 'Analista de Suporte Nível 2',
    company: 'Indra',
    type: 'Tempo integral',
    location: 'Presencial',
    start: '2017-12',
    end: '2022-07',
    description: [
      'Execução de suporte especializado em softwares Microsoft (ligados ao desenvolvimento, bibliotecas e extensões) para uma multinacional com mais de 50 mil funcionários.',
      'Atendimento personalizado para usuários lotados no Brasil, América Latina, USA e Europa.',
      'Acompanhamento e análise de requisições, avaliando desvios com base no conceito de melhoria contínua (Gestão da Qualidade).',
      'Desenvolvimento de novos padrões e processos para otimização do atendimento.',
    ],
    note: 'Esta função engloba a função anterior de "Analista de Suporte Técnico".',
  },
];

export const contact = {
  title: 'Fale comigo',
  lead: 'Projetos, consultoria ou oportunidades: escolha o canal.',
} as const;
