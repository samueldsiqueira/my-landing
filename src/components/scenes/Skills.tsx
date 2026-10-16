import { Scene } from '@/components/stage/Scene';
import { Paper, headingProps } from '@/components/paper';
import { skillGroups } from '@/content/profile';
import stub from './stub.module.css';

// PROVISÓRIO: será substituído pela composição "Carimbos".
export default function Skills() {
  return (
    <Scene id="skills" className={stub.canvas}>
      <Paper seed="skills-stub" className={stub.sheet}>
        <h2 className={stub.title} {...headingProps('skills')}>
          Tecnologias
        </h2>
        <ul className={stub.list}>
          {skillGroups.map((group) => (
            <li key={group.id}>
              <h3>{group.label}</h3>
              <p>{group.items.map((item) => item.name).join(', ')}</p>
            </li>
          ))}
        </ul>
      </Paper>
    </Scene>
  );
}
