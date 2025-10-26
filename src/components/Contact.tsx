"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { SocialIcon } from 'react-social-icons';
import { FiMail, FiLinkedin, FiGithub } from 'react-icons/fi';

const Contact = () => {
  return (
    <motion.section
      id="contact"
      className="py-20 px-4 bg-black text-white"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4 text-purple-500">Entre em Contato</h2>
        <p className="text-gray-300 mb-12 text-lg max-w-2xl mx-auto">
          Interessado em trabalhar junto ou tem alguma questão? Fique à vontade para entrar em contato!
        </p>
        <div className="flex justify-center gap-8 flex-wrap">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }} 
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-2"
          >
            <SocialIcon 
              url="https://www.linkedin.com/in/samuel-d-siqueira" 
              target="_blank" 
              rel="noopener noreferrer" 
              bgColor="#9333ea" 
              style={{ height: 50, width: 50 }} 
            />
            <span className="text-sm text-gray-400">LinkedIn</span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.1, rotate: -5 }} 
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-2"
          >
            <SocialIcon 
              url="https://github.com/samueldsiqueira" 
              target="_blank" 
              rel="noopener noreferrer" 
              bgColor="#9333ea" 
              style={{ height: 50, width: 50 }} 
            />
            <span className="text-sm text-gray-400">GitHub</span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-2"
          >
            <SocialIcon 
              url="mailto:samueldsiqueira@gmail.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              bgColor="#9333ea" 
              style={{ height: 50, width: 50 }} 
            />
            <span className="text-sm text-gray-400">Email</span>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;
