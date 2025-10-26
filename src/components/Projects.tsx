"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FaFolderOpen, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const projects = [
  {
    name: 'center-rpg',
    url: 'https://github.com/samueldsiqueira/center-rpg',
    description: 'Forked from Project-Final-Kenzie/center-rpg'
  },
  {
    name: 'nutshell-website',
    url: 'https://github.com/samueldsiqueira/nutshell-website',
    description: 'Forked from Gab0/nutshell-website'
  },
  {
    name: 'kenzie-hub-samueldsiqueira',
    url: 'https://github.com/samueldsiqueira/kenzie-hub-samueldsiqueira',
    description: ''
  },
  {
    name: 'Kenzie-hamburgueria',
    url: 'https://github.com/samueldsiqueira/Kenzie-hamburgueria',
    description: ''
  },
  {
    name: 'nu-kenzie-samueldsiqueira',
    url: 'https://github.com/samueldsiqueira/nu-kenzie-samueldsiqueira',
    description: ''
  }
];

const Projects = () => {
  return (
    <motion.section
      id="projects"
      className="py-20 px-4 bg-black text-white"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <FaFolderOpen className="text-purple-500 text-4xl" />
          <h2 className="text-3xl font-bold text-center text-purple-500">Projetos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start justify-between mb-4">
                <FaGithub className="text-purple-500 text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">{project.name}</h3>
              <p className="mb-4 text-gray-300">{project.description || 'Clique para ver o repositório.'}</p>
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-400 flex items-center gap-2 transition-colors">
                Ver no GitHub <FaExternalLinkAlt className="text-sm" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Projects;
