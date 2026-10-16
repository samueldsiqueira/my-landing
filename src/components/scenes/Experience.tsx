import { Scene } from '@/components/stage/Scene';
import { Paper, headingProps } from '@/components/paper';
import { jobs } from '@/content/profile';
import { formatDuration, formatMonth } from '@/lib/dates';
import stub from './stub.module.css';

// PROVISÓRIO: será substituído pela composição "Formulário contínuo".
export default function Experience({ asOf }: { asOf: string }) {
  return (
    <Scene id="experience" className={stub.canvas}>
      <Paper seed="experience-stub" className={stub.sheet}>
        <h2 className={stub.title} {...headingProps('experience')}>
          Experiência
        </h2>
        <ol className={stub.list}>
          {jobs.map((job) => (
            <li key={job.id}>
              <h3>
                {job.title}, {job.company}
              </h3>
              <p>
                {formatMonth(job.start)} a {job.end ? formatMonth(job.end) : 'hoje'} (
                {formatDuration(job.start, job.end ?? asOf)}), {job.type.toLowerCase()}, {job.location.toLowerCase()}
              </p>
              {job.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </li>
          ))}
        </ol>
      </Paper>
    </Scene>
  );
}
