"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { AiOutlineCode } from 'react-icons/ai';

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
        <h2 className="text-4xl font-bold mb-12 text-center text-purple-500">Projetos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 flex flex-col"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <AiOutlineCode className="text-3xl text-purple-500" />
                <h3 className="text-xl font-bold">{project.name}</h3>
              </div>
              <p className="mb-4 flex-grow text-gray-300">{project.description || 'Clique para ver o repositório.'}</p>
              <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-purple-500 hover:text-purple-400 font-medium flex items-center gap-2 group transition-colors"
              >
                <FiGithub className="text-xl" />
                <span>Ver no GitHub</span>
                <FiExternalLink className="text-sm group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Projects;
