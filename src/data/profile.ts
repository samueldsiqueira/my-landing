import { FiUser, FiCode, FiTarget, FiMail } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import {
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiGit,
  SiDocker,
  SiPostgresql,
  SiMariadb,
  SiRabbitmq,
} from 'react-icons/si';

export const scenes = [
  { id: 'inicio', label: 'Início' },
  { id: 'about', label: 'Sobre Mim' },
  { id: 'skills', label: 'Tecnologias & Ferramentas' },
  { id: 'projects', label: 'Projetos' },
  { id: 'experience', label: 'Experiência Profissional' },
  { id: 'contact', label: 'Contato' },
];

export const roles = [
  'Desenvolvedor de Software',
  2000,
  'Analista de Sistemas',
  2000,
  'Especialista em IA',
  2000,
];

export const socials = [
  'https://www.linkedin.com/in/samuel-d-siqueira',
  'https://github.com/samueldsiqueira',
  'mailto:samueldsiqueira@gmail.com',
];

export const about = [
  {
    icon: FiUser,
    title: 'Analista de Sistemas',
    text: 'Minha carreira é focada em implementações estratégicas na interseção entre tecnologia e saúde.',
  },
  {
    icon: FiCode,
    title: 'Desenvolvimento',
    text: 'Atualmente, dedico-me a integrar soluções avançadas, incluindo agentes de Inteligência Artificial, para otimizar processos e criar valor.',
  },
  {
    icon: FiTarget,
    title: 'Consultoria',
    text: 'Também desenvolvo projetos de software como consultor para terceiros, buscando sempre aplicar as tecnologias mais atuais.',
  },
];

export const skills = [
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  { name: 'HTML', icon: SiHtml5, color: '#E34F26' },
  { name: 'CSS', icon: SiCss3, color: '#1572B6' },
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#FFFFFF' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
  { name: 'Python', icon: SiPython, color: '#3776AB' },
  { name: 'Git', icon: SiGit, color: '#F05032' },
  { name: 'Docker', icon: SiDocker, color: '#2496ED' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
  { name: 'MariaDB', icon: SiMariadb, color: '#C49A6C' },
  { name: 'RabbitMQ', icon: SiRabbitmq, color: '#FF6600' },
];

export interface Job {
  id: number;
  title: string;
  company: string;
  type: string;
  location: string;
  period: string;
  duration: string;
  description: string;
}

export const jobs: Job[] = [
  {
    id: 1,
    title: 'Analista de Sistemas',
    company: 'SENAI Soluções Digitais',
    type: 'Tempo integral',
    location: 'Remota',
    period: 'nov de 2024 - o momento',
    duration: '1 ano',
    description: `Atuo como Analista de Sistemas, com foco em análise técnica, integrações de sistemas e apoio ao desenvolvimento de soluções corporativas.

Participo da evolução e manutenção de sistemas voltados à área da saúde, contribuindo com a definição de requisitos, melhoria de processos e integração entre plataformas.

Busco sempre alinhar tecnologia, desempenho e conformidade técnica, garantindo soluções eficientes e seguras.`,
  },
  {
    id: 2,
    title: 'Estagiário de Desenvolvimento de Software',
    company: 'TIM Brasil',
    type: 'Estágio',
    location: 'Híbrida',
    period: 'nov de 2022 - nov de 2024',
    duration: '2 anos 1 mês',
    description: `Integrante da equipe de engenharia de telecomunicações, minha função envolveu a análise de processos internos repetitivos para desenvolver automações eficientes.

Desenvolvi projetos de automação de processos legados, empregando habilidades em Python e JavaScript, utilizando bibliotecas como Playwright e Selenium para web scraping.

Meu papel visou melhorar a eficiência operacional e contribuir para a inovação contínua por meio da automação inteligente.`,
  },
  {
    id: 3,
    title: 'Analista de Suporte Nível 2',
    company: 'Indra',
    type: 'Tempo integral',
    location: 'Presencial',
    period: 'dez de 2017 - jul de 2022',
    duration: '4 anos 8 meses',
    description: `Execução de suporte especializado em softwares Microsoft (ligados ao desenvolvimento, bibliotecas e extensões) para uma multinacional com mais de 50 mil funcionários.

Atendimento personalizado para usuários lotados no Brasil, América Latina, USA e Europa.

Acompanhamento e análise de requisições, avaliando desvios com base no conceito de melhoria contínua (Gestão da Qualidade).

Desenvolvimento de novos padrões e processos para otimização do atendimento.

Nota: Esta função engloba a função anterior de "Analista de Suporte Técnico".`,
  },
];

export const contactMethods = [
  {
    icon: FaWhatsapp,
    label: 'WhatsApp',
    value: '21 98113-4252',
    href: 'https://wa.me/5521981134252',
    color: '#25D366',
  },
  {
    icon: FiMail,
    label: 'E-mail',
    value: 'samueldsiqueira@gmail.com',
    href: 'mailto:samueldsiqueira@gmail.com',
    color: '#9333ea',
  },
];
