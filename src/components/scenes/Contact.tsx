import { Scene } from '@/components/stage/Scene';
import { Paper, headingProps } from '@/components/paper';
import { contact, person } from '@/content/profile';
import stub from './stub.module.css';

// PROVISÓRIO: será substituído pela composição "Mesa limpa".
export default function Contact({ year }: { year: number }) {
  return (
    <Scene id="contact" className={stub.canvas}>
      <Paper seed="contact-stub" className={stub.sheet}>
        <h2 className={stub.title} {...headingProps('contact')}>
          {contact.title}
        </h2>
        <p>{contact.lead}</p>
        <ul className={stub.list}>
          <li>
            <a href={person.whatsapp.href} target="_blank" rel="noopener noreferrer">
              Chamar no WhatsApp ({person.whatsapp.display})
            </a>
          </li>
          <li>
            <a href={`mailto:${person.email}`}>Enviar e-mail ({person.email})</a>
          </li>
          <li>
            <a href={person.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={person.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
        </ul>
        <p>
          © {year} {person.name}
        </p>
      </Paper>
    </Scene>
  );
}
