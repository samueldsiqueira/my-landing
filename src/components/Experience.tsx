"use client";
import React from 'react';
import { motion } from 'framer-motion';

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
        <h2 className="text-3xl font-bold mb-8 text-center text-purple-500">Experiência Profissional</h2>
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="bg-gray-800 p-6 rounded-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold">TIM Brasil</h3>
            <p className="text-purple-400">Estagiário</p>
            <p className="mt-2">Atualmente trabalhando para expandir o conhecimento no mundo da tecnologia e contribuir para o sucesso da equipe e da empresa.</p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Experience;
