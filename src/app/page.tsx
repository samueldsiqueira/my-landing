import { Director } from '@/components/stage/Director';
import { Stage } from '@/components/stage/Stage';
import Opening from '@/components/scenes/Opening';
import About from '@/components/scenes/About';
import Skills from '@/components/scenes/Skills';
import Projects from '@/components/scenes/Projects';
import Experience from '@/components/scenes/Experience';
import Contact from '@/components/scenes/Contact';
import { currentMonth } from '@/lib/dates';
import { getProjects } from '@/lib/vercel';

// Regenera a página a cada hora: projetos novos e durações atualizadas sem novo deploy.
export const revalidate = 3600;

export default async function Home() {
  const projects = await getProjects();
  const month = currentMonth();

  return (
    <Director>
      <Stage>
        <Opening />
        <About />
        <Skills />
        <Projects result={projects} />
        <Experience asOf={month} />
        <Contact year={Number(month.slice(0, 4))} />
      </Stage>
    </Director>
  );
}
