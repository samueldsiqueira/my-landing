import React from 'react';

const skills = [
  'TypeScript',
  'JavaScript',
  'HTML',
  'CSS',
  'React',
  'Next.js'
];

const Skills = () => {
  return (
    <section id="skills" className="py-20 px-4 bg-black text-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-purple-500">Tecnologias</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {skills.map((skill, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg">
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
