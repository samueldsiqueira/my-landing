"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { scenes } from '../../data/profile';

interface NavigationProps {
  current: number;
  onNavigate: (index: number) => void;
}

const Navigation = ({ current, onNavigate }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // A primeira cena é acessada pelo nome no canto esquerdo.
  const menuItems = scenes.map((scene, index) => ({ ...scene, index })).slice(1);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    e.preventDefault();
    onNavigate(index);
    setIsOpen(false);
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          current > 0 ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a
              href="#"
              onClick={(e) => handleClick(e, 0)}
              className="text-xl font-bold text-white hover:text-purple-400 transition-colors"
            >
              Samuel D&apos; Siqueira
            </a>

            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.index)}
                  aria-current={current === item.index ? 'step' : undefined}
                  className={`relative transition-colors font-medium ${
                    current === item.index ? 'text-purple-400' : 'text-gray-300 hover:text-purple-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  {current === item.index && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-500"
                    />
                  )}
                </motion.a>
              ))}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white p-2 hover:text-purple-400 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsOpen(false)} />
            <motion.div
              className="absolute top-20 right-0 left-0 mx-4 bg-gradient-to-br from-gray-900 to-black border border-purple-500 rounded-xl shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col py-4">
                {menuItems.map((item, i) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleClick(e, item.index)}
                    className={`px-6 py-4 hover:text-purple-400 hover:bg-purple-900/20 transition-colors font-medium border-b border-gray-800 last:border-b-0 ${
                      current === item.index ? 'text-purple-400' : 'text-gray-300'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
