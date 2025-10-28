"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { AiOutlineCode } from 'react-icons/ai';
import { SiVercel } from 'react-icons/si';
import { fetchVercelProjects, getProjectUrl, getProjectPreviewImage, getProjectPreviewImagePaths, VercelProject } from '../services/vercelServices';
import Image from 'next/image';

const Projects = () => {
  const [vercelProjects, setVercelProjects] = useState<VercelProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [imageAttempts, setImageAttempts] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadProjects = async () => {
      const projects = await fetchVercelProjects();
      setVercelProjects(projects);
      setLoading(false);
    };

    loadProjects();
  }, []);

  const handleImageError = (projectId: string) => {
    const currentAttempt = imageAttempts[projectId] || 0;
    const project = vercelProjects.find(p => p.id === projectId);
    
    if (project) {
      const imagePaths = getProjectPreviewImagePaths(project);
      
      // Try next image path
      if (currentAttempt < imagePaths.length - 1) {
        setImageAttempts(prev => ({ ...prev, [projectId]: currentAttempt + 1 }));
      } else {
        // All attempts failed, show fallback
        setImageErrors(prev => ({ ...prev, [projectId]: true }));
      }
    }
  };

  const getImageSource = (project: VercelProject): string => {
    const attempt = imageAttempts[project.id] || 0;
    const imagePaths = getProjectPreviewImagePaths(project);
    return imagePaths[attempt] || getProjectPreviewImage(project);
  };

  useEffect(() => {
    const loadProjects = async () => {
      const projects = await fetchVercelProjects();
      setVercelProjects(projects);
      setLoading(false);
    };

    loadProjects();
  }, []);

  return (
    <motion.section
      id="projects"
      className="py-20 px-4 bg-black text-white"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center text-purple-500">Projetos</h2>
        
        {loading ? (
          <div className="text-center text-gray-400">Carregando projetos...</div>
        ) : vercelProjects.length === 0 ? (
          <div className="text-center text-gray-400">Nenhum projeto encontrado.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vercelProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 flex flex-col overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                {/* Preview Image */}
                <div className="relative w-full h-48 bg-gray-700 flex items-center justify-center">
                  {imageErrors[project.id] ? (
                    <div className="text-6xl text-purple-500">🚀</div>
                  ) : (
                    <Image
                      key={`${project.id}-${imageAttempts[project.id] || 0}`}
                      src={getImageSource(project)}
                      alt={`${project.name} preview`}
                      fill
                      className="object-cover"
                      unoptimized
                      onError={() => handleImageError(project.id)}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <AiOutlineCode className="text-3xl text-purple-500" />
                    <h3 className="text-xl font-bold">{project.name}</h3>
                  </div>
                  
                  {project.framework && (
                    <p className="mb-4 text-sm text-gray-400">
                      Framework: <span className="text-purple-400">{project.framework}</span>
                    </p>
                  )}

                  <div className="mt-auto space-y-2">
                    {/* Vercel Deployment Link */}
                    <a 
                      href={getProjectUrl(project)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-purple-500 hover:text-purple-400 font-medium flex items-center gap-2 group transition-colors"
                    >
                      <SiVercel className="text-xl" />
                      <span>Ver no Vercel</span>
                      <FiExternalLink className="text-sm group-hover:translate-x-1 transition-transform" />
                    </a>

                    {/* GitHub Link if available */}
                    {project.link?.repo && (
                      <a 
                        href={`https://github.com/${project.link.org || project.link.repo}/${project.link.repo}`}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-400 hover:text-gray-300 font-medium flex items-center gap-2 group transition-colors"
                      >
                        <FiGithub className="text-xl" />
                        <span>Ver no GitHub</span>
                        <FiExternalLink className="text-sm group-hover:translate-x-1 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default Projects;
