import { Director } from '@/components/stage/Director';
import { Game } from '@/components/game/Game';
import { currentMonth } from '@/lib/dates';
import { getProjects } from '@/lib/vercel';

// Regenera a página a cada hora: projetos novos e durações atualizadas sem novo deploy.
export const revalidate = 3600;

export default async function Home() {
  const projects = await getProjects();
  const month = currentMonth();

  return (
    <Director>
      <Game projects={projects} asOf={month} year={Number(month.slice(0, 4))} />
    </Director>
  );
}
