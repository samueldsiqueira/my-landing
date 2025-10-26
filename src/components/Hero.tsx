"use client";
import React from 'react';
import Image from 'next/image';
import { SocialIcon } from 'react-social-icons';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FiChevronDown } from 'react-icons/fi';

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-black via-gray-900 to-black text-white p-4 relative">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, #9333ea 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, #9333ea 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, #9333ea 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <div className="relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-purple-600 rounded-full blur-2xl opacity-30 animate-pulse" />
          <Image
            src="/profile_picture.jpg"
            alt="Samuel D' Siqueira"
            width={180}
            height={180}
            className="rounded-full mb-8 border-4 border-purple-500 shadow-2xl relative z-10 mx-auto"
            priority
          />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }} 
          className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent"
        >
          Samuel D&apos; Siqueira
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.4 }} 
          className="text-2xl md:text-3xl mb-8 h-10 text-purple-300"
        >
          <TypeAnimation
            sequence={[
              'Desenvolvedor de Software',
              2000,
              'Analista de Sistemas',
              2000,
              'Especialista em IA',
              2000,
            ]}
            wrapper="span"
            cursor={true}
            repeat={Infinity}
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.6 }} 
          className="flex gap-6 justify-center mb-8"
        >
          <motion.div whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9 }}>
            <SocialIcon 
              url="https://www.linkedin.com/in/samuel-d-siqueira" 
              target="_blank" 
              rel="noopener noreferrer" 
              bgColor="#9333ea" 
              style={{ height: 50, width: 50 }} 
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.2, rotate: -10 }} whileTap={{ scale: 0.9 }}>
            <SocialIcon 
              url="https://github.com/samueldsiqueira" 
              target="_blank" 
              rel="noopener noreferrer" 
              bgColor="#9333ea" 
              style={{ height: 50, width: 50 }} 
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
            <SocialIcon 
              url="mailto:samueldsiqueira@gmail.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              bgColor="#9333ea" 
              style={{ height: 50, width: 50 }} 
            />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <FiChevronDown className="text-4xl text-purple-400" />
      </motion.div>
    </section>
  );
};

export default Hero;
