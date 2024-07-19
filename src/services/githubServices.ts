import axios from 'axios';

const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USER;
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

export const fetchGitHubRepos = async () => {
	try {
		const response = await axios.get(`https://api.github.com/users/${GITHUB_USERNAME}/repos`, {
			headers: {
				Authorization: `Bearer ${GITHUB_TOKEN}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error('Erro ao buscar repositórios do GitHub:', error);
		return [];
	}
};
