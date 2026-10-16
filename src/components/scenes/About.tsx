import { Scene } from '@/components/stage/Scene';
import { Paper, headingProps } from '@/components/paper';
import { about } from '@/content/profile';
import stub from './stub.module.css';

// PROVISÓRIO: será substituído pela composição "Interseção" (palavra cruzada).
export default function About() {
  return (
    <Scene id="about" className={stub.canvas}>
      <Paper seed="about-stub" className={stub.sheet}>
        <h2 className={stub.title} {...headingProps('about')}>
          Sobre
        </h2>
        <ul className={stub.list}>
          {about.map((item) => (
            <li key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </Paper>
    </Scene>
  );
}
