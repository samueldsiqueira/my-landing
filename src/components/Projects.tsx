import React from 'react';

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
    <section id="projects" className="py-20 px-4 bg-black text-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-purple-500">Projetos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">{project.name}</h3>
              <p className="mb-4">{project.description || 'Clique para ver o repositório.'}</p>
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">
                Ver no GitHub
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
