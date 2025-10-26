"use client";
import React from 'react';
import Image from 'next/image';
import { SocialIcon } from 'react-social-icons';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center bg-black text-white p-4">
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
          <Image
            src="/profile.webp"
            alt="Samuel D' Siqueira"
            width={200}
            height={200}
            className="rounded-full mb-8 relative z-10 border-4 border-purple-500 shadow-2xl"
          />
        </div>
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-5xl font-bold mb-4">
        Samuel D&apos; Siqueira
      </motion.h1>
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-2xl mb-8 h-8">
        <TypeAnimation
          sequence={[
            'Desenvolvedor de Software',
            2000,
            'Analista de Sistemas',
            2000,
          ]}
          wrapper="span"
          cursor={true}
          repeat={Infinity}
        />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="flex gap-4">
        <motion.div whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9 }}>
          <SocialIcon url="https://www.linkedin.com/in/samuel-d-siqueira" target="_blank" rel="noopener noreferrer" bgColor="#9333ea" style={{ height: 40, width: 40 }} />
        </motion.div>
        <motion.div whileHover={{ scale: 1.2, rotate: -10 }} whileTap={{ scale: 0.9 }}>
          <SocialIcon url="https://github.com/samueldsiqueira" target="_blank" rel="noopener noreferrer" bgColor="#9333ea" style={{ height: 40, width: 40 }} />
        </motion.div>
        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
          <SocialIcon url="mailto:samueldsiqueira@gmail.com" target="_blank" rel="noopener noreferrer" bgColor="#9333ea" style={{ height: 40, width: 40 }} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
