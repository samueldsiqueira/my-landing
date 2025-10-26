"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaCalendarAlt } from 'react-icons/fa';

const Experience = () => {
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
        <div className="flex items-center justify-center gap-3 mb-8">
          <FaBriefcase className="text-purple-500 text-4xl" />
          <h2 className="text-3xl font-bold text-center text-purple-500">Experiência Profissional</h2>
        </div>
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-4">
              <FaCalendarAlt className="text-purple-500 text-2xl mt-1" />
              <div>
                <h3 className="text-xl font-bold">TIM Brasil</h3>
                <p className="text-purple-400">Estagiário</p>
                <p className="mt-2">Atualmente trabalhando para expandir o conhecimento no mundo da tecnologia e contribuir para o sucesso da equipe e da empresa.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Experience;
