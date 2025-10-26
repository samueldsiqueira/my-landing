"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FaUser } from 'react-icons/fa';

const About = () => {
  return (
    <motion.section
      id="about"
      className="py-20 px-4 bg-black text-white"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <FaUser className="text-purple-500 text-4xl" />
          <h2 className="text-3xl font-bold text-center text-purple-500">Sobre Mim</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-lg shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-left leading-relaxed">
              Como Analista de Sistemas, minha carreira é focada em implementações estratégicas na interseção entre tecnologia e saúde. Atualmente, dedico-me a integrar soluções avançadas, incluindo agentes de Inteligência Artificial, para otimizar processos e criar valor. Além da minha atuação principal, também desenvolvo projetos de software como consultor para terceiros, buscando sempre aplicar as tecnologias mais atuais.
            </p>
          </motion.div>
          <div className="hidden md:block relative h-64">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default About;
