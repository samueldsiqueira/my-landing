import Image from 'next/image';

const Header = () => {
	return (
		<div className='flex flex-col items-center'>
			<Image
				src='/profile_picture.jpg' // Caminho da imagem na pasta public
				alt='Samuel D Siqueira'
				width={150}
				height={150}
				className='rounded-full object-cover'
			/>
		</div>
	);
};

export default Header;
