import type { Metadata } from 'next';
import { Prompt } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SocialButtons from '@/components/SocialButtons';
import TypingEffect from '@/components/TypingEffect';
import AboutMe from '@/components/Aboutme';
import TechBadges from '@/components/TechBadges';
import GitHubRepos from '@/components/GithubRepos';

const prompt = Prompt({
	subsets: ['latin'],
	weight: '200',
});

export const metadata: Metadata = {
	title: "Samuel D' Siqueira - Developer",
	description: "Portfólio pessoal de Samuel D' Siqueira",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='pt-BR'>
			<body className={`${prompt.className} min-h-screen bg-gray-800 text-white`}>
				<Sidebar>
					<Header />
					<TypingEffect />
					<SocialButtons />
					<TechBadges />
				</Sidebar>
				<main className='ml-16 p-4'>
					<AboutMe />
					<GitHubRepos />
					{children}
				</main>
			</body>
		</html>
	);
}
