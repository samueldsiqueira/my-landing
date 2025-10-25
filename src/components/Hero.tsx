"use client";
import React from 'react';
import Image from 'next/image';
import { SocialIcon } from 'react-social-icons';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center bg-black text-white p-4">
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Image
          src="/profile.jfif"
          alt="Samuel D' Siqueira"
          width={150}
          height={150}
          className="rounded-full mb-8"
        />
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-5xl font-bold mb-4">
        Samuel D' Siqueira
      </motion.h1>
      <motion.h2 initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-2xl mb-8">
        Desenvolvedor de Software
      </motion.h2>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="flex gap-4">
        <SocialIcon url="https://www.linkedin.com/in/samuel-d-siqueira" target="_blank" rel="noopener noreferrer" bgColor="#9333ea" style={{ height: 40, width: 40 }} />
        <SocialIcon url="https://github.com/samueldsiqueira" target="_blank" rel="noopener noreferrer" bgColor="#9333ea" style={{ height: 40, width: 40 }} />
        <SocialIcon url="mailto:samueldsiqueira@gmail.com" target="_blank" rel="noopener noreferrer" bgColor="#9333ea" style={{ height: 40, width: 40 }} />
      </motion.div>
    </section>
  );
};

export default Hero;
