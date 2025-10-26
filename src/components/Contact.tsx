"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { SocialIcon } from 'react-social-icons';
import { FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';

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
        <div className="flex items-center justify-center gap-3 mb-8">
          <FaEnvelope className="text-purple-500 text-4xl" />
          <h2 className="text-3xl font-bold text-purple-500">Contato</h2>
        </div>
        <div className="flex flex-col items-center gap-8">
          <div className="flex justify-center gap-8">
            <motion.div whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9 }}>
              <SocialIcon url="https://www.linkedin.com/in/samuel-d-siqueira" target="_blank" rel="noopener noreferrer" bgColor="#9333ea" style={{ height: 50, width: 50 }} />
            </motion.div>
            <motion.div whileHover={{ scale: 1.2, rotate: -10 }} whileTap={{ scale: 0.9 }}>
              <SocialIcon url="https://github.com/samueldsiqueira" target="_blank" rel="noopener noreferrer" bgColor="#9333ea" style={{ height: 50, width: 50 }} />
            </motion.div>
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
              <SocialIcon url="mailto:samueldsiqueira@gmail.com" target="_blank" rel="noopener noreferrer" bgColor="#9333ea" style={{ height: 50, width: 50 }} />
            </motion.div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 text-gray-300">
            <motion.a
              href="https://www.linkedin.com/in/samuel-d-siqueira"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-purple-400 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <FaLinkedin className="text-xl" />
              <span>LinkedIn</span>
            </motion.a>
            <motion.a
              href="https://github.com/samueldsiqueira"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-purple-400 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <FaGithub className="text-xl" />
              <span>GitHub</span>
            </motion.a>
            <motion.a
              href="mailto:samueldsiqueira@gmail.com"
              className="flex items-center gap-2 hover:text-purple-400 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <FaEnvelope className="text-xl" />
              <span>samueldsiqueira@gmail.com</span>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;
