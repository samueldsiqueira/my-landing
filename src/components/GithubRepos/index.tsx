// components/GitHubRepos.tsx
'use client';

import { useEffect, useState } from 'react';
import { fetchGitHubRepos } from '@/services/githubServices';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { log } from 'console';

interface Repo {
	id: number;
	name: string;
	html_url: string;
	description: string;
}

const GitHubRepos = () => {
	const [repos, setRepos] = useState<Repo[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const getRepos = async () => {
			const reposData = await fetchGitHubRepos();
			setRepos(reposData);
			setLoading(false);
			console.log(reposData);
		};

		getRepos();
	}, []);

	if (loading) {
		return <p>Carregando...</p>;
	}

	return (
		<section className='bg-gray-700 p-6 rounded-lg shadow-md max-w-3xl mx-auto mt-8'>
			<h2 className='text-2xl font-bold mb-4'>Meus Repositórios no GitHub</h2>
			<Swiper spaceBetween={10} slidesPerView={1} navigation pagination={{ clickable: true }} className='swiper-container'>
				{repos.map((repo) => (
					<SwiperSlide key={repo.id} className='swiper-slide'>
						<a href={repo.html_url} target='_blank' rel='noopener noreferrer' className='text-blue-400'>
							<h3 className='text-xl'>{repo.name}</h3>
							<p>{repo.description}</p>
						</a>
					</SwiperSlide>
				))}
			</Swiper>
		</section>
	);
};

export default GitHubRepos;
