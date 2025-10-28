import axios from 'axios';

const VERCEL_TOKEN = process.env.NEXT_PUBLIC_VERCEL_TOKEN;
const VERCEL_TEAM_ID = process.env.NEXT_PUBLIC_VERCEL_TEAM_ID;

export interface VercelDeployment {
  uid: string;
  url: string;
  name: string;
  created: number;
  state: string;
  ready: number;
  target?: string;
  type: string;
}

export interface VercelProject {
  id: string;
  name: string;
  framework: string;
  link?: {
    type: string;
    repo: string;
    org?: string;
  };
  latestDeployments?: VercelDeployment[];
  targets?: {
    production?: {
      url: string;
      ready: boolean;
    };
  };
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

    // Build URL with optional team ID - using v9 API for projects list
    let url = 'https://api.vercel.com/v9/projects';
    if (VERCEL_TEAM_ID) {
      url += `?teamId=${VERCEL_TEAM_ID}`;
    }

    const response = await axios.get(url, { headers });
    
    // Filter out "my-landing" project
    const projects = response.data.projects || [];
    const filteredProjects = projects.filter((project: VercelProject) => project.name !== 'my-landing');
    
    // Fetch deployment URLs for each project
    const projectsWithDeployments = await Promise.all(
      filteredProjects.map(async (project: VercelProject) => {
        try {
          const deployment = await fetchProjectDeployment(project.name);
          return {
            ...project,
            latestDeployments: deployment ? [deployment] : []
          };
        } catch (error) {
          console.error(`Error fetching deployment for ${project.name}:`, error);
          return project;
        }
      })
    );
    
    return projectsWithDeployments;
  } catch (error) {
    console.error('Error fetching Vercel projects:', error);
    return [];
  }
};

export const fetchProjectDeployment = async (projectName: string): Promise<VercelDeployment | null> => {
  try {
    if (!VERCEL_TOKEN) {
      console.error('Vercel token not configured');
      return null;
    }

    const headers = {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
    };

    // Build URL to get deployments for specific project
    let url = `https://api.vercel.com/v6/deployments?projectId=${projectName}&limit=1&target=production`;
    if (VERCEL_TEAM_ID) {
      url += `&teamId=${VERCEL_TEAM_ID}`;
    }

    const response = await axios.get(url, { headers });
    const deployments = response.data.deployments || [];
    
    // Return the most recent production deployment
    if (deployments.length > 0) {
      return deployments[0];
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching deployment for project ${projectName}:`, error);
    return null;
  }
};

export const getProjectUrl = (project: VercelProject): string => {
  // Try to get production deployment URL first
  if (project.targets?.production?.url) {
    return `https://${project.targets.production.url}`;
  }
  
  // Get the latest deployment URL
  if (project.latestDeployments && project.latestDeployments.length > 0) {
    const deployment = project.latestDeployments[0];
    if (deployment.url) {
      return `https://${deployment.url}`;
    }
  }
  
  // Fallback to project name
  return `https://${project.name}.vercel.app`;
};

export const getProjectPreviewImage = (project: VercelProject): string => {
  const projectUrl = getProjectUrl(project);
  
  // Try to use the project's native Open Graph image first
  // This matches what Vercel dashboard shows - the actual OG image from the deployment
  // Standard Next.js OG image path (most common for Vercel projects)
  return `${projectUrl}/opengraph-image.png`;
};
