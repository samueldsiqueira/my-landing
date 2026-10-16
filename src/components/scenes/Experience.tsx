import type { CSSProperties, ReactNode } from 'react';
import { Scene } from '@/components/stage/Scene';
import { CutLetters, Pin, headingProps } from '@/components/paper';
import { jobs, person, scenes } from '@/content/profile';
import { formatDuration, formatMonth, monthIndex } from '@/lib/dates';
import { random, spread } from '@/lib/seed';
import ExperienceFeed from './ExperienceFeed';
import s from './Experience.module.css';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const label = scenes.find((scene) => scene.id === 'experience')?.label ?? 'Experiência';
const two = (n: number) => String(n).padStart(2, '0');
const r = (n: number) => Number(n.toFixed(3));

/** Pontas rasgadas da fita (zigue-zague com seed), nas duas orientações da régua. */
const tapeClips = (seed: string) => {
  const rand = random(seed);
  const teeth = 4;
  const jag = () => r(1 + rand() * 4);
  const endA = Array.from({ length: teeth + 1 }, (_, i) => [i % 2 ? jag() : 0, r((i / teeth) * 100)] as const);
  const endB = Array.from({ length: teeth + 1 }, (_, i) => [i % 2 ? jag() : 0, r((i / teeth) * 100)] as const);
  // Horizontal: dentes nas pontas esquerda e direita.
  const h = [
    ...endB.map(([d, p]) => `calc(100% - ${d}px) ${p}%`),
    ...[...endA].reverse().map(([d, p]) => `${d}px ${p}%`),
  ];
  // Vertical: dentes no topo e na base.
  const v = [...endA.map(([d, p]) => `${p}% ${d}px`), ...[...endB].reverse().map(([d, p]) => `${p}% calc(100% - ${d}px)`)];
  return { h: `polygon(${h.join(', ')})`, v: `polygon(${v.join(', ')})` };
};

/** Linha do rasgo na picotagem: o papel que cai e o canhoto que fica presos à impressora. */
const tearLine = (seed: string) => {
  const rand = random(seed);
  const n = 26;
  const pts = Array.from({ length: n + 1 }, (_, i) => `${r((i / n) * 100)}% calc(var(--stub-h) + ${spread(rand, 3.5)}px)`);
  const first = pts[0].replace(/^0%/, '-24px');
  const last = pts[n].replace(/^100%/, 'calc(100% + 24px)');
  return {
    sheet: `polygon(${first}, ${pts.join(', ')}, ${last}, calc(100% + 24px) calc(100% + 24px), -24px calc(100% + 24px))`,
    stub: `polygon(0 0, 100% 0, ${[...pts].reverse().join(', ')})`,
  };
};

const tear = tearLine('experience-tear');

/** Linha pontilhada de um campo impresso: "EMPRESA ........". */
function Field({ term, children }: { term: string; children: ReactNode }) {
  return (
    <>
      <dt>
        {term}
        <span aria-hidden="true">................</span>
      </dt>
      <dd>{children}</dd>
    </>
  );
}

/**
 * Cena 5 — "Formulário contínuo". Uma folha zebrada de impressora matricial desce do topo
 * da tela com um registro por emprego; ao lado, uma régua de acrílico com os períodos em fita
 * crepe (proporcionais, com o intervalo real entre eles). Escolher um período alimenta o
 * papel em saltos de linha até o registro. Sem JS, os períodos são âncoras para os registros.
 */
export default function Experience({ asOf }: { asOf: string }) {
  const total = jobs.length;
  const firstYear = Math.min(...jobs.map((job) => Number(job.start.slice(0, 4))));
  const lastYear = Math.max(Number(asOf.slice(0, 4)), firstYear);
  const from = monthIndex(`${firstYear}-01`);
  const span = monthIndex(`${lastYear + 1}-01`) - from;
  const pct = (month: number) => r(((month - from) / span) * 100);
  const years = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => firstYear + i);

  // Traços da régua: meses (curtos), trimestres (médios) e anos (longos).
  const ticks = { h: '', v: '' };
  for (let m = 0; m <= span; m++) {
    const len = m % 12 === 0 ? 12 : m % 3 === 0 ? 6 : 3.5;
    ticks.h += `M${m} 0v${len}`;
    ticks.v += `M0 ${span - m}h${len}`;
  }

  const timeline = jobs.map((job, i) => {
    const end = job.end ?? asOf;
    const a = pct(monthIndex(job.start));
    const b = pct(monthIndex(end) + 1);
    const rand = random(`experience-tape-${job.id}`);
    const clips = tapeClips(`experience-tape-${job.id}`);
    const [short, ...rest] = job.company.split(' ');
    return {
      job,
      short,
      rest: rest.join(' '),
      period: `${formatMonth(job.start)} a ${job.end ? formatMonth(job.end) : 'hoje'}`,
      vars: {
        '--a': a,
        '--b': b,
        '--k': total - 1 - i,
        '--tr': `${spread(rand, 0.7)}deg`,
        '--to': `${spread(rand, 1.5)}px`,
        '--clip-h': clips.h,
        '--clip-v': clips.v,
      } as Vars,
    };
  });

  return (
    <Scene id="experience" className={s.canvas}>
      <div className={s.frame} style={{ '--tear': tear.sheet, '--stub': tear.stub } as Vars}>
        <h2 className={s.title} aria-label={label} {...headingProps('experience')}>
          <CutLetters decorative text={label} seed="experience-title" letterClassName={s.letter} jitter={{ x: 2, y: 5, r: 3 }} />
        </h2>

        <nav className={s.timeline} aria-label={`Linha do tempo, ${firstYear} a ${lastYear}`}>
          <div className={s.ruler} aria-hidden="true">
            <div className={s.acrylic}>
              <svg className={s.ticksH} viewBox={`0 0 ${span} 12`} preserveAspectRatio="none" focusable="false">
                <path d={ticks.h} />
              </svg>
              <svg className={s.ticksV} viewBox={`0 0 12 ${span}`} preserveAspectRatio="none" focusable="false">
                <path d={ticks.v} />
              </svg>
              {years.map((year) => (
                <span
                  key={year}
                  className={s.year}
                  style={{ '--p': pct(monthIndex(`${year}-07`)) } as Vars}
                >
                  {year}
                </span>
              ))}
            </div>
          </div>

          <ol className={s.track} data-track="" data-keys-capture="">
            {timeline.map(({ job, short, rest, period, vars }, i) => (
              <li key={job.id} className={s.seg} style={vars}>
                <a
                  className={s.segLink}
                  href={`#exp-${job.id}`}
                  data-job=""
                  aria-current={i === 0 ? 'true' : undefined}
                >
                  <span className={s.tape} aria-hidden="true" />
                  <span className={s.segText}>
                    <span className={s.segName}>
                      {short}
                      {rest && <span className={s.segRest}> {rest}</span>}
                    </span>
                    <span className={s.segRole}>
                      <span className="sr-only">, </span>
                      {job.title}
                    </span>
                    <span className="sr-only">, {period}</span>
                  </span>
                  <Pin className={s.pin} />
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className={s.feedSlot}>
          <div className={s.stub} aria-hidden="true" />
          <div className={s.sheet} data-feed="" role="region" aria-label="Registros impressos">
            <div className={s.form}>
              <p className={`dot ${s.printHead}`}>
                <span>{person.name}</span> <span>Emitido em {formatMonth(asOf)}</span>
              </p>

              <ol className={s.records}>
                {jobs.map((job, i) => (
                  <li key={job.id} id={`exp-${job.id}`} className={job.end === null ? `${s.record} ${s.current}` : s.record}>
                    <h3 className={`dot ${s.recTitle}`}>
                      Registro {two(i + 1)} de {two(total)}
                      <span className="sr-only">: {job.company}</span>
                    </h3>
                    {job.end === null && (
                      <p className={s.stampSlot}>
                        <span className={s.stampShadow} aria-hidden="true" />
                        <span className={s.stamp}>Em andamento</span>
                      </p>
                    )}

                    <dl className={`dot ${s.fields}`}>
                      <Field term="Empresa">{job.company}</Field>
                      <Field term="Cargo">
                        {job.title}
                        {job.note && <span aria-hidden="true"> *</span>}
                      </Field>
                      <Field term="Período">
                        <span className={s.keep}>
                          <time dateTime={job.start}>{formatMonth(job.start)}</time> -{' '}
                          {job.end ? <time dateTime={job.end}>{formatMonth(job.end)}</time> : 'atual'}
                        </span>{' '}
                        <span className={s.keep}>({formatDuration(job.start, job.end ?? asOf)})</span>
                      </Field>
                      <Field term="Regime">{job.type}</Field>
                      <Field term="Modalidade">{job.location}</Field>
                    </dl>

                    <p className={`dot ${s.rule}`} aria-hidden="true">
                      {'-'.repeat(96)}
                    </p>

                    <div className={s.desc}>
                      {job.description.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>

                    {job.note && (
                      <p className={`dot ${s.note}`}>
                        <span aria-hidden="true">* </span>
                        {job.note}
                      </p>
                    )}
                  </li>
                ))}
              </ol>

              <p className={`dot ${s.end}`}>Fim do relatório</p>
            </div>
          </div>
          <div className={s.fold} aria-hidden="true" />
        </div>
      </div>

      <ExperienceFeed />
    </Scene>
  );
}
