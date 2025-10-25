"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { SocialIcon } from 'react-social-icons';

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
        <h2 className="text-3xl font-bold mb-8 text-purple-500">Contato</h2>
        <div className="flex justify-center gap-8">
          <motion.div whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9 }}>
            <SocialIcon url="https://www.linkedin.com/in/samuel-d-siqueira" target="_blank" rel="noopener noreferrer" bgColor="#9333ea" style={{ height: 40, width: 40 }} />
          </motion.div>
          <motion.div whileHover={{ scale: 1.2, rotate: -10 }} whileTap={{ scale: 0.9 }}>
            <SocialIcon url="https://github.com/samueldsiqueira" target="_blank" rel="noopener noreferrer" bgColor="#9333ea" style={{ height: 40, width: 40 }} />
          </motion.div>
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
            <SocialIcon url="mailto:samueldsiqueira@gmail.com" target="_blank" rel="noopener noreferrer" bgColor="#9333ea" style={{ height: 40, width: 40 }} />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;
