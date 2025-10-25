"use client";
import React from 'react';
import { motion } from 'framer-motion';

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
        <h2 className="text-3xl font-bold mb-8 text-center text-purple-500">Sobre Mim</h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg text-left">
              Como Analista de Sistemas, minha carreira é focada em implementações estratégicas na interseção entre tecnologia e saúde. Atualmente, dedico-me a integrar soluções avançadas, incluindo agentes de Inteligência Artificial, para otimizar processos e criar valor. Além da minha atuação principal, também desenvolvo projetos de software como consultor para terceiros, buscando sempre aplicar as tecnologias mais atuais.
            </p>
          </div>
          <div className="hidden md:block relative">
            <motion.div
              className="absolute inset-0 bg-purple-900 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.7, 0.5],
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
