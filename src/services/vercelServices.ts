import axios from 'axios';

const VERCEL_TOKEN = process.env.NEXT_PUBLIC_VERCEL_TOKEN;
const VERCEL_TEAM_ID = process.env.NEXT_PUBLIC_VERCEL_TEAM_ID;

export interface VercelProject {
  id: string;
  name: string;
  framework: string;
  link?: {
    type: string;
    repo: string;
    org?: string;
  };
  latestDeployments?: Array<{
    url: string;
    ready: boolean;
    state: string;
  }>;
}

export const fetchVercelProjects = async (): Promise<VercelProject[]> => {
  try {
    if (!VERCEL_TOKEN) {
      console.error('Vercel token not configured');
      return [];
    }

    const headers = {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
    };

    // Build URL with optional team ID
    let url = 'https://api.vercel.com/v9/projects';
    if (VERCEL_TEAM_ID) {
      url += `?teamId=${VERCEL_TEAM_ID}`;
    }

    const response = await axios.get(url, { headers });
    
    // Filter out "my-landing" project
    const projects = response.data.projects || [];
    return projects.filter((project: VercelProject) => project.name !== 'my-landing');
  } catch (error) {
    console.error('Error fetching Vercel projects:', error);
    return [];
  }
};

export const getProjectUrl = (project: VercelProject): string => {
  // Get the latest deployment URL
  if (project.latestDeployments && project.latestDeployments.length > 0) {
    const deployment = project.latestDeployments[0];
    if (deployment.ready && deployment.url) {
      return `https://${deployment.url}`;
    }
  }
  
  // Fallback to project name
  return `https://${project.name}.vercel.app`;
};

export const getProjectPreviewImage = (project: VercelProject): string => {
  const projectUrl = getProjectUrl(project);
  // Use Vercel's OG image API or a screenshot service
  return `https://v1.screenshot.11ty.dev/${encodeURIComponent(projectUrl)}/opengraph/`;
};
