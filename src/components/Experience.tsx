"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBriefcase, FiCalendar, FiMapPin, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface Job {
  id: number;
  title: string;
  company: string;
  type: string;
  location: string;
  period: string;
  duration: string;
  description: string;
}

const jobs: Job[] = [
  {
    id: 1,
    title: "Analista de Sistemas",
    company: "SENAI Soluções Digitais",
    type: "Tempo integral",
    location: "Remota",
    period: "nov de 2024 - o momento",
    duration: "1 ano",
    description: `Atuo como Analista de Sistemas, com foco em análise técnica, integrações de sistemas e apoio ao desenvolvimento de soluções corporativas.

Participo da evolução e manutenção de sistemas voltados à área da saúde, contribuindo com a definição de requisitos, melhoria de processos e integração entre plataformas.

Busco sempre alinhar tecnologia, desempenho e conformidade técnica, garantindo soluções eficientes e seguras.`
  },
  {
    id: 2,
    title: "Estagiário de Desenvolvimento de Software",
    company: "TIM Brasil",
    type: "Estágio",
    location: "Híbrida",
    period: "nov de 2022 - nov de 2024",
    duration: "2 anos 1 mês",
    description: `Integrante da equipe de engenharia de telecomunicações, minha função envolveu a análise de processos internos repetitivos para desenvolver automações eficientes.

Desenvolvi projetos de automação de processos legados, empregando habilidades em Python e Javascript, utilizando bibliotecas como Playwright e Selenium para web scraping.

Meu papel visou melhorar a eficiência operacional e contribuir para a inovação contínua por meio da automação inteligente.`
  },
  {
    id: 3,
    title: "Analista de Suporte Nível 2",
    company: "Indra",
    type: "Tempo integral",
    location: "Presencial",
    period: "dez de 2017 - jul de 2022",
    duration: "4 anos 8 meses",
    description: `Execução de suporte especializado em softwares Microsoft (ligados ao desenvolvimento, bibliotecas e extensões) para uma multinacional com mais de 50 mil funcionários.

Atendimento personalizado para usuários lotados no Brasil, América Latina, USA e Europa.

Acompanhamento e análise de requisições, avaliando desvios com base no conceito de melhoria contínua (Gestão da Qualidade).

Desenvolvimento de novos padrões e processos para otimização do atendimento.

Nota: Esta função engloba a função anterior de "Analista de Suporte Técnico".`
  }
];

const Experience = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <motion.section
      id="experience"
      className="py-20 px-4 bg-black text-white"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center text-purple-500">Experiência Profissional</h2>
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-purple-600 to-purple-500"></div>
            
            <div className="space-y-8">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  className="relative"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 top-6 w-4 h-4 bg-purple-500 rounded-full border-4 border-black transform -translate-x-1/2 z-10"></div>
                  
                  <motion.div
                    className="ml-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700 overflow-hidden cursor-pointer"
                    whileHover={{ y: -5, borderColor: '#a855f7' }}
                    onClick={() => toggleExpand(job.id)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
                          <p className="text-purple-400 font-medium mb-2">{job.company}</p>
                          <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                            <span className="flex items-center gap-1">
                              <FiCalendar className="text-base" />
                              {job.period} ({job.duration})
                            </span>
                            <span className="flex items-center gap-1">
                              <FiMapPin className="text-base" />
                              {job.location}
                            </span>
                            <span className="bg-gray-700 px-2 py-1 rounded text-xs">
                              {job.type}
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <motion.div
                            className="bg-purple-600 p-2 rounded-lg"
                            animate={{ rotate: expandedId === job.id ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {expandedId === job.id ? (
                              <FiChevronUp className="text-xl text-white" />
                            ) : (
                              <FiChevronDown className="text-xl text-white" />
                            )}
                          </motion.div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedId === job.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 mt-4 border-t border-gray-700">
                              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                {job.description}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Experience;
