import type { CSSProperties } from 'react';
import { Scene } from '@/components/stage/Scene';
import { CutLetters, Dymo, HalftonePhoto, Paper, Tape, cx, headingProps } from '@/components/paper';
import { person } from '@/content/profile';
import OpeningPresence from './OpeningPresence';
import s from './Opening.module.css';

const rolesSentence = `${person.roles.slice(0, -1).join(', ')} e ${person.roles.at(-1)}`;

const links = [
  { label: 'LinkedIn', href: person.linkedin, external: true },
  { label: 'GitHub', href: person.github, external: true },
  { label: 'E-mail', href: `mailto:${person.email}`, external: false },
];

/**
 * Cena 1 — "Montagem". Foto em meio-tom presa com fita, nome em letras recortadas,
 * etiqueta Dymo alternando os cargos, etiquetas kraft com os links e uma tira de
 * formulário contínuo. A coreografia de entrada está toda em Opening.module.css.
 */
export default function Opening() {
  return (
    <Scene id="inicio" className={s.canvas}>
      <div className={s.frame}>
        <div className={s.photoSlot}>
          <div className={s.photoAnim} data-shared="photo">
            <Paper seed="inicio-photo" depth={1.8} clipContent className={s.photo}>
              <HalftonePhoto priority sizes="(min-width: 1100px) 32vw, 62vw" />
            </Paper>
            <Tape className={cx(s.tape, s.tapeA)} />
            <Tape className={cx(s.tape, s.tapeB)} />
          </div>
        </div>

        <h1 className={s.name} aria-label={person.name} {...headingProps('inicio')}>
          <CutLetters decorative text={person.givenName} className={s.first} letterClassName={s.letter} />{' '}
          <CutLetters
            decorative
            text={person.familyName}
            startIndex={person.givenName.length}
            className={s.second}
            letterClassName={s.letter}
            jitter={{ x: 2, y: 5, r: 3 }}
          />
        </h1>

        <div className={s.roles}>
          <p className="sr-only">{rolesSentence}</p>
          <div className={s.dymoStack} aria-hidden="true">
            {person.roles.map((role, k) => (
              <Dymo key={role} className={s.dymo} style={{ '--k': k } as CSSProperties}>
                {role}
              </Dymo>
            ))}
          </div>
        </div>

        <ul className={s.links}>
          {links.map((link, k) => (
            <li key={link.label} style={{ '--k': k } as CSSProperties}>
              <a
                className={s.tag}
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {link.label}
                {link.external && <span className="sr-only"> (abre em nova aba)</span>}
              </a>
            </li>
          ))}
        </ul>

        <Paper seed="inicio-printout" edge="straight" tone="zebra" className={s.printout}>
          <ul className="dot">
            {person.printout.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </Paper>
      </div>

      <OpeningPresence />
    </Scene>
  );
}
