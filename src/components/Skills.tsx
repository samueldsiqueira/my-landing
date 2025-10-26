"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { SiTypescript, SiJavascript, SiHtml5, SiCss3, SiReact, SiNextdotjs } from 'react-icons/si';
import { FaCode } from 'react-icons/fa';

const skills = [
  { name: 'TypeScript', icon: SiTypescript },
  { name: 'JavaScript', icon: SiJavascript },
  { name: 'HTML', icon: SiHtml5 },
  { name: 'CSS', icon: SiCss3 },
  { name: 'React', icon: SiReact },
  { name: 'Next.js', icon: SiNextdotjs }
];

const Skills = () => {
  return (
    <motion.section
      id="skills"
      className="py-20 px-4 bg-black text-white"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <FaCode className="text-purple-500 text-4xl" />
          <h2 className="text-3xl font-bold text-center text-purple-500">Tecnologias</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {skills.map((skill, index) => {
            const IconComponent = skill.icon;
            return (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex flex-col items-center gap-3 min-w-[120px]"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <IconComponent className="text-purple-500 text-4xl" />
                <span className="text-center">{skill.name}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

export default Skills;
