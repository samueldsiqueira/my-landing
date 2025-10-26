"use client";
import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      id="contact"
      className="py-12 px-4 bg-black text-white border-t border-gray-800"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-3 text-purple-500">Entre em Contato</h2>
          <p className="text-gray-400 text-base max-w-xl mx-auto">
            Interessado em trabalhar junto ou tem alguma questão? Entre em contato através das redes sociais acima.
          </p>
        </div>
        
        <div className="pt-6 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            © {currentYear} Samuel D&apos; Siqueira. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Contact;
