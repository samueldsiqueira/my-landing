import type { CSSProperties, ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6';
import { FiMail } from 'react-icons/fi';
import { Scene } from '@/components/stage/Scene';
import { CutLetters, cx, headingProps } from '@/components/paper';
import { contact, person } from '@/content/profile';
import { random, spread } from '@/lib/seed';
import ContactCopy from './ContactCopy';
import s from './Contact.module.css';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

interface Ticket {
  id: string;
  icon: IconType;
  kicker: string;
  title: string;
  detail: string;
  href: string;
  external: boolean;
  primary: boolean;
}

const tickets: Ticket[] = [
  {
    id: 'whatsapp',
    icon: FaWhatsapp,
    kicker: 'WhatsApp',
    title: 'Chamar no WhatsApp',
    detail: person.whatsapp.display,
    href: person.whatsapp.href,
    external: true,
    primary: true,
  },
  {
    id: 'email',
    icon: FiMail,
    kicker: 'E-mail',
    title: 'Enviar e-mail',
    detail: person.email,
    href: `mailto:${person.email}`,
    external: false,
    primary: true,
  },
  {
    id: 'linkedin',
    icon: FaLinkedinIn,
    kicker: 'Rede',
    title: 'LinkedIn',
    detail: person.linkedin.replace(/^https:\/\/(www\.)?linkedin\.com\//, '').replace(/\/$/, ''),
    href: person.linkedin,
    external: true,
    primary: false,
  },
  {
    id: 'github',
    icon: FaGithub,
    kicker: 'Código',
    title: 'GitHub',
    detail: `@${person.githubUser}`,
    href: person.github,
    external: true,
    primary: false,
  },
];

/** Bilhete destacável: canhoto kraft com o número e o ícone, picote, corpo com a ação. */
function TicketLink({ ticket, k, children }: { ticket: Ticket; k: number; children?: ReactNode }) {
  const rand = random(`contact-ticket-${ticket.id}`);
  const Icon = ticket.icon;
  const vars: Vars = { '--k': k, '--tr': `${spread(rand, 1.6)}deg`, '--tx': `${spread(rand, 6)}px` };
  return (
    <li className={cx(s.slot, s[ticket.id])} style={vars}>
      <a
        className={cx(s.ticket, ticket.primary && s.primary)}
        href={ticket.href}
        {...(ticket.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        <span className={s.shade} aria-hidden="true" />
        <span className={s.surface} aria-hidden="true" />
        <span className={s.stub} aria-hidden="true">
          <Icon className={s.icon} focusable="false" />
          <span className="dot">Nº {String(k + 1).padStart(2, '0')}</span>
        </span>
        <span className={s.body}>
          <span className={cx('dot', s.kicker)} aria-hidden="true">
            {ticket.kicker}
          </span>
          <span className={s.action}>{ticket.title}</span>
          <span className={cx('dot', s.detail)}>{ticket.detail}</span>
          {ticket.external && <span className="sr-only"> (abre em nova aba)</span>}
        </span>
      </a>
      {children}
    </li>
  );
}

const nameLetters = person.name.replace(/\s/g, '').length;

/**
 * Cena 6 — "Mesa limpa". A mão varre o set na chegada (máquina), a câmera recua e mostra a
 * borda da esteira sobre a bancada (globals.css), e sobra só o essencial: "Fale comigo" em
 * letras recortadas, quatro bilhetes destacáveis com os canais e o nome voltando a cair,
 * letra a letra, de trás para frente — fecha o arco da abertura.
 */
export default function Contact({ year }: { year: number }) {
  return (
    <Scene id="contact" className={s.canvas}>
      <div className={s.frame}>
        <div className={s.head}>
          <h2 className={s.title} aria-label={contact.title} {...headingProps('contact')}>
            <CutLetters
              decorative
              text={contact.title}
              seed="contact-title"
              wordClassName={s.word}
              letterClassName={s.letter}
              jitter={{ x: 2, y: 6, r: 3.5 }}
            />
          </h2>
          <p className={s.lead}>{contact.lead}</p>
        </div>

        <ul className={s.tickets}>
          {tickets.map((ticket, k) => (
            <TicketLink key={ticket.id} ticket={ticket} k={k}>
              {/* Ao lado do bilhete de e-mail (irmão do link: nada interativo dentro de um link). */}
              {ticket.id === 'email' && <ContactCopy email={person.email} />}
            </TicketLink>
          ))}
        </ul>

        <p className={s.sign}>
          <span className={s.signName} style={{ '--n': nameLetters } as Vars}>
            <CutLetters
              decorative
              text={person.name}
              seed="contact-sign"
              letterClassName={s.signLetter}
              boil={false}
              jitter={{ x: 1.5, y: 3, r: 4 }}
            />
            <span className="sr-only">{person.name}</span>
          </span>{' '}
          <small className={cx('dot', s.year)}>© {year}</small>
        </p>
      </div>
    </Scene>
  );
}
