"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiCalendar, FiMapPin } from 'react-icons/fi';

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
        <h2 className="text-4xl font-bold mb-12 text-center text-purple-500">Experiência Profissional</h2>
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-lg border border-gray-700"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-start gap-4">
              <div className="bg-purple-600 p-3 rounded-lg">
                <FiBriefcase className="text-2xl text-white" />
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-white">TIM Brasil</h3>
                <p className="text-purple-400 font-medium mb-3">Estagiário</p>
                <div className="flex items-center gap-4 mb-4 text-gray-400 text-sm">
                  <span className="flex items-center gap-1">
                    <FiCalendar className="text-base" />
                    2023 - Presente
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Atualmente trabalhando para expandir o conhecimento no mundo da tecnologia e contribuir para o sucesso da equipe e da empresa.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Experience;
