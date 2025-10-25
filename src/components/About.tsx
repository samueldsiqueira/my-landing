"use client";
import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-20 px-4 bg-black text-white">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-center text-purple-500"
        >
          Sobre Mim
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-lg text-left">
              Como Analista de Sistemas, minha carreira é focada em implementações estratégicas na interseção entre tecnologia e saúde. Atualmente, dedico-me a integrar soluções avançadas, incluindo agentes de Inteligência Artificial, para otimizar processos e criar valor. Além da minha atuação principal, também desenvolvo projetos de software como consultor para terceiros, buscando sempre aplicar as tecnologias mais atuais.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hidden md:block"
          >
            <div className="w-full h-64 bg-gradient-to-r from-purple-900 to-black rounded-lg"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
