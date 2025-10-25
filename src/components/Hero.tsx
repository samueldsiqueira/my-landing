import React from 'react';

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center bg-black text-white p-4">
      <h1 className="text-5xl font-bold mb-4">Samuel D' Siqueira</h1>
      <h2 className="text-2xl mb-8">Desenvolvedor de Software</h2>
      <div className="flex gap-4">
        <a href="https://www.linkedin.com/in/samuel-d-siqueira" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">
          LinkedIn
        </a>
        <a href="https://github.com/samueldsiqueira" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">
          GitHub
        </a>
      </div>
    </section>
  );
};

export default Hero;
