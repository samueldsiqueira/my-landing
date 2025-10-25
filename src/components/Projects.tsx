"use client";
import React from 'react';
import { motion } from 'framer-motion';

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
        <h2 className="text-3xl font-bold mb-8 text-center text-purple-500">Projetos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 p-6 rounded-lg"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-2">{project.name}</h3>
              <p className="mb-4">{project.description || 'Clique para ver o repositório.'}</p>
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">
                Ver no GitHub
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Projects;
