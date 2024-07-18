import { FaJsSquare, FaReact } from 'react-icons/fa';
import { SiTypescript, SiNextdotjs, SiNodedotjs, SiBun, SiPlaywright, SiPuppeteer, SiSelenium } from 'react-icons/si';

const AboutMe = () => {
	return (
		<section className='bg-gray-700 p-6 rounded-lg shadow-md max-w-3xl mx-auto mt-8'>
			<h2 className='text-2xl font-bold mb-4'>Sobre Mim</h2>
			<p className='text-lg'>
				Sou um desenvolvedor em transição para a área de programação, com mais de 9 anos de experiência em suporte e
				infraestrutura. Atualmente, trabalho como estagiário de desenvolvimento de software na TIM, uma das maiores operadoras de
				telecomunicações do Brasil, onde desenvolvo soluções para automação de tarefas repetitivas e onerosas. Nesse processo,
				aprimorei minhas habilidades em web scraping, utilizando bibliotecas poderosas como Playwright, Puppeteer e Selenium, e em
				linguagens como Python, TypeScript, PHP e Javascript. Também tenho conhecimentos em SGBD, SQL, Linux e Windows Server, e
				aplico metodologias ágeis para otimizar a migração de sistemas legados. Meu objetivo é contribuir para a eficiência
				operacional e a inovação na TIM, e continuar meu aprendizado contínuo na área de programação.
			</p>
			<div className='flex space-x-4 mt-4'>
				<FaJsSquare size={42} className='text-yellow-500' />
				<FaReact size={42} className='text-blue-400' />
				<SiTypescript size={42} className='text-blue-600' />
				<SiNextdotjs size={42} className='text-slate-800' />
				<SiNodedotjs size={42} className='text-green-800' />
				<SiPlaywright size={42} className='text-orange-600' />
				<SiBun size={42} />
				<SiPuppeteer size={42} className='text-green-300' />
				<SiSelenium size={42} className='text-black' />
			</div>
		</section>
	);
};

export default AboutMe;
