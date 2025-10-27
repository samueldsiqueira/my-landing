"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FiMail } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  const currentYear = new Date().getFullYear();

  const contactMethods = [
    {
      icon: FaWhatsapp,
      label: 'WhatsApp',
      value: '21 98113-4252',
      href: 'https://wa.me/5521981134252',
      color: '#25D366'
    },
    {
      icon: FiMail,
      label: 'E-mail',
      value: 'samueldsiqueira@gmail.com',
      href: 'mailto:samueldsiqueira@gmail.com',
      color: '#9333ea'
    },
  ];

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
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-3 text-purple-500">Contato</h2>
          <p className="text-gray-400 text-base max-w-xl mx-auto">
            Interessado em trabalhar junto ou tem alguma questão? Fique à vontade para entrar em contato!
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <motion.a
                key={index}
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gradient-to-br from-gray-800 to-gray-900 px-6 py-4 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 group w-full md:w-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${method.color}20` }}
                >
                  <IconComponent 
                    className="text-2xl" 
                    style={{ color: method.color }}
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-400">{method.label}</p>
                  <p className="text-white font-medium group-hover:text-purple-400 transition-colors">
                    {method.value}
                  </p>
                </div>
              </motion.a>
            );
          })}
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
