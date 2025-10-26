"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiCode, FiTarget } from 'react-icons/fi';

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
        <h2 className="text-4xl font-bold mb-12 text-center text-purple-500">Sobre Mim</h2>
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-purple-600 p-3 rounded-lg flex-shrink-0">
                <FiUser className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-purple-400 mb-2">Analista de Sistemas</h3>
                <p className="text-gray-300">
                  Minha carreira é focada em implementações estratégicas na interseção entre tecnologia e saúde.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-purple-600 p-3 rounded-lg flex-shrink-0">
                <FiCode className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-purple-400 mb-2">Desenvolvimento</h3>
                <p className="text-gray-300">
                  Atualmente, dedico-me a integrar soluções avançadas, incluindo agentes de Inteligência Artificial, para otimizar processos e criar valor.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-purple-600 p-3 rounded-lg flex-shrink-0">
                <FiTarget className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-purple-400 mb-2">Consultoria</h3>
                <p className="text-gray-300">
                  Também desenvolvo projetos de software como consultor para terceiros, buscando sempre aplicar as tecnologias mais atuais.
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:block relative h-96">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-900 to-purple-600 rounded-2xl blur-3xl opacity-30"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-10 bg-gradient-to-tr from-purple-800 to-purple-500 rounded-2xl blur-2xl opacity-40"
              animate={{
                scale: [1.1, 1, 1.1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default About;
