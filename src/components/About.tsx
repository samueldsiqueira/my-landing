import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-20 px-4 bg-black text-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-purple-500">Sobre Mim</h2>
        <p className="max-w-3xl mx-auto text-center">
          Meu nome é Samuel D' Siqueira e sou Desenvolvedor Front-End. Minha jornada na tecnologia começou como jogador de jogos MMO, onde me deparei com um fórum com o código-fonte do jogo que estava jogando. Resolvi mergulhar e, com muita leitura e aprendizado, consegui fazer o código funcionar em diversas ocasiões.
        </p>
        <p className="max-w-3xl mx-auto text-center mt-4">
          Posteriormente, atuei em funções de manutenção e suporte em empresas de telecomunicações. Porém, para aprofundar meu entendimento de sistemas e problemas, decidi me aprofundar no assunto e concluí o bootcamp da Kenzie Academy, onde me formei como Desenvolvedor Front-End. Atualmente, trabalho como estagiário na TIM Brasil, buscando ampliar meus conhecimentos no mundo da tecnologia e contribuir para o sucesso da equipe e da empresa.
        </p>
      </div>
    </section>
  );
};

export default About;
