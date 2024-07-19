import { FaJsSquare, FaReact } from 'react-icons/fa';
import { SiTypescript, SiNextdotjs, SiNodedotjs, SiBun, SiPlaywright, SiPuppeteer, SiSelenium } from 'react-icons/si';

const TechBadges = () => {
	return (
		<div className='flex flex-col justify-center justify-items-center mt-20'>
			<div>
				<p>Tecnologias:</p>
			</div>
			<ul className='flex flex-wrap w-4/5 gap-2 justify-center justify-items-center'>
				<li>
					<FaJsSquare size={32} className='text-yellow-500' />
				</li>
				<li>
					<FaReact size={32} className='text-blue-400' />
				</li>
				<li>
					<SiTypescript size={32} className='text-blue-600' />
				</li>
				<li>
					<SiNextdotjs size={32} className='text-slate-800' />
				</li>
				<li>
					<SiNodedotjs size={32} className='text-green-800' />
				</li>
				<li>
					<SiBun size={32} />
				</li>
				<li>
					<SiPlaywright size={32} className='text-orange-600' />
				</li>
				<li>
					<SiPuppeteer size={32} className='text-green-300' />
				</li>
				<li>
					<SiSelenium size={32} className='text-gray-700' />
				</li>
			</ul>
		</div>
	);
};

export default TechBadges;
