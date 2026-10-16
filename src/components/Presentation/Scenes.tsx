"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { SocialIcon } from 'react-social-icons';
import { TypeAnimation } from 'react-type-animation';
import { FiGithub, FiExternalLink, FiCalendar, FiMapPin } from 'react-icons/fi';
import { AiOutlineCode } from 'react-icons/ai';
import { SiVercel } from 'react-icons/si';
import {
  fetchVercelProjects,
  getProjectUrl,
  getProjectPreviewImage,
  VercelProject,
} from '../../services/vercelServices';
import { about, contactMethods, jobs, roles, skills, socials } from '../../data/profile';
import { frame, pop, sequence, steps } from './stopMotion';

const Title = ({ kicker, children }: { kicker: string; children: React.ReactNode }) => (
  <motion.div variants={frame} className="text-center mb-8 md:mb-10">
    <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-purple-400/80 mb-3">{kicker}</p>
    <h2 className="boil text-3xl md:text-5xl font-bold text-purple-500">{children}</h2>
  </motion.div>
);

const Scene = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    variants={sequence}
    initial="hidden"
    animate="show"
    exit="exit"
    className={`container mx-auto w-full ${className}`}
  >
    {children}
  </motion.div>
);

export const IntroScene = () => (
  <Scene className="flex flex-col items-center text-center">
    <motion.div variants={pop} className="relative mb-8">
      <div className="absolute inset-0 bg-purple-600 rounded-full blur-2xl opacity-30 animate-pulse" />
      <div className="boil relative">
        <Image
          src="/profile_picture.jpg"
          alt="Samuel D' Siqueira"
          width={180}
          height={180}
          className="rounded-full border-4 border-purple-500 shadow-2xl w-32 h-32 md:w-44 md:h-44 object-cover"
          priority
        />
      </div>
    </motion.div>

    <motion.h1
      variants={frame}
      className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent"
    >
      Samuel D&apos; Siqueira
    </motion.h1>

    <motion.div variants={frame} className="text-xl md:text-3xl mb-8 h-10 text-purple-300">
      <TypeAnimation sequence={roles} wrapper="span" cursor repeat={Infinity} />
    </motion.div>

    <motion.div variants={sequence} className="flex gap-6 justify-center">
      {socials.map((url) => (
        <motion.div key={url} variants={pop} whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9 }}>
          <SocialIcon
            url={url}
            target="_blank"
            rel="noopener noreferrer"
            bgColor="#9333ea"
            style={{ height: 50, width: 50 }}
          />
        </motion.div>
      ))}
    </motion.div>
  </Scene>
);

export const AboutScene = () => (
  <Scene>
    <Title kicker="Cena 02">Sobre Mim</Title>
    <div className="grid md:grid-cols-3 gap-5 md:gap-8 max-w-5xl mx-auto">
      {about.map(({ icon: Icon, title, text }) => (
        <motion.div
          key={title}
          variants={frame}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-5 md:p-6"
        >
          <div className="flex md:flex-col items-start gap-4">
            <div className="bg-purple-600 p-3 rounded-lg flex-shrink-0">
              <Icon className="text-2xl text-white" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-2">{title}</h3>
              <p className="text-gray-300 text-sm md:text-base">{text}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </Scene>
);

export const SkillsScene = () => (
  <Scene>
    <Title kicker="Cena 03">Tecnologias &amp; Ferramentas</Title>
    <motion.div
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } }, exit: {} }}
      className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-5 max-w-5xl mx-auto"
    >
      {skills.map(({ name, icon: Icon, color }) => (
        <motion.div
          key={name}
          variants={pop}
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 md:p-5 rounded-xl border border-gray-700 hover:border-purple-500 flex flex-col items-center justify-center gap-2"
        >
          <Icon className="text-3xl md:text-5xl" style={{ color }} />
          <span className="text-xs md:text-sm font-medium text-gray-200">{name}</span>
        </motion.div>
      ))}
    </motion.div>
  </Scene>
);

export const ProjectsScene = () => {
  const [projects, setProjects] = useState<VercelProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;
    fetchVercelProjects().then((result) => {
      if (!active) return;
      setProjects(result);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Scene>
      <Title kicker="Cena 04">Projetos</Title>
      {loading ? (
        <motion.p variants={frame} className="text-center text-gray-400">
          Carregando projetos...
        </motion.p>
      ) : projects.length === 0 ? (
        <motion.p variants={frame} className="text-center text-gray-400">
          Nenhum projeto encontrado.
        </motion.p>
      ) : (
        <motion.div
          variants={sequence}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={frame}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-purple-500 overflow-hidden flex"
            >
              <div className="relative w-28 md:w-36 flex-shrink-0 bg-gray-700 flex items-center justify-center">
                {imageErrors[project.id] ? (
                  <span className="text-4xl">🚀</span>
                ) : (
                  <Image
                    src={getProjectPreviewImage(project)}
                    alt={`${project.name} preview`}
                    fill
                    className="object-cover"
                    unoptimized
                    onError={() => setImageErrors((prev) => ({ ...prev, [project.id]: true }))}
                  />
                )}
              </div>
              <div className="p-4 flex flex-col gap-2 min-w-0">
                <div className="flex items-center gap-2">
                  <AiOutlineCode className="text-xl text-purple-500 flex-shrink-0" />
                  <h3 className="font-bold truncate">{project.name}</h3>
                </div>
                {project.framework && (
                  <p className="text-xs text-gray-400">
                    Framework: <span className="text-purple-400">{project.framework}</span>
                  </p>
                )}
                <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <a
                    href={getProjectUrl(project)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-500 hover:text-purple-400 flex items-center gap-1"
                  >
                    <SiVercel /> Vercel <FiExternalLink className="text-xs" />
                  </a>
                  {project.link?.repo && (
                    <a
                      href={`https://github.com/${project.link.org || project.link.repo}/${project.link.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-300 flex items-center gap-1"
                    >
                      <FiGithub /> GitHub <FiExternalLink className="text-xs" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </Scene>
  );
};

export const ExperienceScene = () => {
  const [selectedId, setSelectedId] = useState(jobs[0].id);
  const selected = jobs.find((job) => job.id === selectedId) ?? jobs[0];

  return (
    <Scene>
      <Title kicker="Cena 05">Experiência Profissional</Title>
      <div className="grid md:grid-cols-[2fr_3fr] gap-6 max-w-5xl mx-auto">
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-purple-600 to-purple-500" />
          <div className="space-y-3">
            {jobs.map((job) => {
              const active = job.id === selectedId;
              return (
                <motion.button
                  key={job.id}
                  variants={frame}
                  type="button"
                  onClick={() => setSelectedId(job.id)}
                  className="relative block w-full text-left pl-10"
                >
                  <span
                    className={`absolute left-4 top-5 w-4 h-4 rounded-full border-4 border-black -translate-x-1/2 ${
                      active ? 'bg-purple-400 scale-125' : 'bg-purple-700'
                    }`}
                  />
                  <span
                    className={`block rounded-xl border p-4 transition-colors bg-gradient-to-br from-gray-800 to-gray-900 ${
                      active ? 'border-purple-500' : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <span className="block font-bold text-white">{job.title}</span>
                    <span className="block text-purple-400 text-sm">{job.company}</span>
                    <span className="block text-gray-500 text-xs mt-1">{job.period}</span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <motion.div
          variants={frame}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-5 md:p-6 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20, rotate: 1 }}
              animate={{ opacity: 1, x: 0, rotate: 0, transition: { duration: 0.4, ease: steps(4) } }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.2, ease: steps(2) } }}
            >
              <h3 className="text-xl font-bold text-white">{selected.title}</h3>
              <p className="text-purple-400 font-medium mb-3">{selected.company}</p>
              <div className="flex flex-wrap items-center gap-3 text-gray-400 text-xs md:text-sm mb-4">
                <span className="flex items-center gap-1">
                  <FiCalendar /> {selected.period} ({selected.duration})
                </span>
                <span className="flex items-center gap-1">
                  <FiMapPin /> {selected.location}
                </span>
                <span className="bg-gray-700 px-2 py-1 rounded text-xs">{selected.type}</span>
              </div>
              <p
                data-scroll-area
                className="text-gray-300 text-sm leading-relaxed whitespace-pre-line max-h-56 md:max-h-72 overflow-y-auto pr-2"
              >
                {selected.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </Scene>
  );
};

export const ContactScene = () => (
  <Scene className="text-center">
    <Title kicker="Cena 06 — Fim">Contato</Title>
    <motion.p variants={frame} className="text-gray-400 max-w-xl mx-auto mb-10">
      Interessado em trabalhar junto ou tem alguma questão? Fique à vontade para entrar em contato!
    </motion.p>
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
      {contactMethods.map(({ icon: Icon, label, value, href, color }) => (
        <motion.a
          key={label}
          variants={pop}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05, y: -5 }}
          className="flex items-center gap-3 bg-gradient-to-br from-gray-800 to-gray-900 px-6 py-4 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors group w-full md:w-auto"
        >
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
            <Icon className="text-2xl" style={{ color }} />
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-white font-medium group-hover:text-purple-400 transition-colors">{value}</p>
          </div>
        </motion.a>
      ))}
    </div>
    <motion.p variants={frame} className="text-gray-500 text-sm">
      © {new Date().getFullYear()} Samuel D&apos; Siqueira. Todos os direitos reservados.
    </motion.p>
  </Scene>
);

export const sceneComponents = [IntroScene, AboutScene, SkillsScene, ProjectsScene, ExperienceScene, ContactScene];
