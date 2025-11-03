import { FaJsSquare, FaReact } from 'react-icons/fa';
import {
	SiTypescript,
	SiNextdotjs,
	SiNodedotjs,
	SiExpress,
	SiFastapi,
	SiPython,
	SiPoetry,
	SiBun,
	SiPlaywright,
	SiPuppeteer,
	SiSelenium,
	SiLinux,
	SiDocker,
	SiPostgresql,
	SiMariadb,
	SiRabbitmq,
} from 'react-icons/si';

const TechBadges = () => {
	return (
		<div className='flex flex-wrap justify-center w-full mt-10'>
			<div className='w-full text-green-600 flex justify-center '>
				<p className='text-center mb-2'>Tecnologias:</p>
			</div>
			<ul className='flex flex-wrap w-full gap-2 justify-center justify-items-center'>
				<li className='w-10'>
					<FaJsSquare size={32} className='text-yellow-500' />
				</li>
				<li className='w-10'>
					<FaReact size={32} className=' text-blue-400' />
				</li>
				<li className='w-10'>
					<SiTypescript size={32} className='text-blue-600' />
				</li>
				<li className='w-10'>
					<SiNextdotjs size={32} className='text-slate-800' />
				</li>
				<li className='w-10'>
					<SiNodedotjs size={32} className='bg-white rounded text-green-800' />
				</li>
				<li className='w-10'>
					<SiBun size={32} />
				</li>
				<li className='w-10'>
					<SiPlaywright size={32} className='bg-green-500 rounded text-orange-600' />
				</li>
				<li className='w-10'>
					<SiPuppeteer size={32} className='bg-gray-700 rounded-sm text-green-300' />
				</li>
				<li className='w-10'>
					<SiSelenium size={32} className='text-gray-700' />
				</li>
				<li className='w-10'>
					<SiExpress size={32} className='bg-white rounded text-slate-950' />
				</li>
				<li className='w-10'>
					<SiPython size={32} className='bg-yellow-300 rounded  text-green-700' />
				</li>
				<li className='w-10'>
					<SiFastapi size={32} className='text-purple-700' />
				</li>
				<li className='w-10'>
					<SiDocker size={32} className='bg-white rounded text-blue-700' />
				</li>
				<li className='w-10'>
					<SiLinux size={32} className='bg-white rounded text-black' />
				</li>
				<li className='w-10'>
					<SiPostgresql size={32} className='bg-blue-500 rounded text-black' />
				</li>
				<li className='w-10'>
					<SiMariadb size={32} className='bg-blue-500 rounded text-black' />
				</li>
				<li className='w-10'>
					<SiRabbitmq size={32} className='bg-gray-100 rounded text-orange-600' />
				</li>
			</ul>
		</div>
	);
};

export default TechBadges;
