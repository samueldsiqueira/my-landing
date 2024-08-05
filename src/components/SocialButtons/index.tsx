import React from 'react';
import { FaGithub, FaLinkedin, FaTelegram, FaEnvelope } from 'react-icons/fa';

const SocialButtons = () => {
	return (
		<div className='flex space-x-4 mt-8'>
			<a href='https://github.com/samueldsiqueira' target='_blank' rel='noopener noreferrer'>
				<FaGithub className='text-gray-300 hover:text-purple-600' size={32} />
			</a>
			<a href='https://linkedin.com/in/samuel-d-siqueira' target='_blank' rel='noopener noreferrer'>
				<FaLinkedin className='text-gray-300 hover:text-purple-700' size={32} />
			</a>
			<a href='https://t.me/seuusuario' target='_blank' rel='noopener noreferrer'>
				<FaTelegram className='text-gray-300 hover:text-purple-800' size={32} />
			</a>
			<a href='mailto:samueldsiqueira@gmail.com'>
				<FaEnvelope className='text-gray-300 hover:text-purple-900' size={32} />
			</a>
		</div>
	);
};

export default SocialButtons;
