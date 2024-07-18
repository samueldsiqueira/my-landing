// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SocialButtons from '../components/SocialButtons';
import TypingEffect from '../components/TypingEffect';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Samuel D Siqueira - Desenvolvedor',
	description: 'Portfólio pessoal de Samuel D Siqueira',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='pt-BR'>
			<body className={`${inter.className} min-h-screen bg-gray-800 text-white`}>
				<Sidebar />
				<main className='flex flex-col items-center mt-16'>
					<Header />
					<TypingEffect />
					<SocialButtons />
					{children}
				</main>
			</body>
		</html>
	);
}
