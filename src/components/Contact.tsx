import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 px-4 bg-black text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 text-purple-500">Contato</h2>
        <div className="flex justify-center gap-8">
          <a href="https://www.linkedin.com/in/samuel-d-siqueira" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">
            LinkedIn
          </a>
          <a href="https://github.com/samueldsiqueira" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">
            GitHub
          </a>
          <a href="mailto:samueldsiqueira@gmail.com" className="text-purple-500 hover:underline">
            Email
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
