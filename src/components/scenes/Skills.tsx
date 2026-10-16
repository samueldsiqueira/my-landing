import type { CSSProperties } from 'react';
import { Scene } from '@/components/stage/Scene';
import { cx, headingProps } from '@/components/paper';
import { person, skillGroups } from '@/content/profile';
import { random, spread } from '@/lib/seed';
import SkillsStampTap from './SkillsStampTap';
import s from './Skills.module.css';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/*
 * Agenda do carimbo (quadros a 12 fps), derivada do conteúdo: se uma tecnologia entrar ou
 * sair em profile.ts, o carimbo, as impressões e o tremor da ficha se reorganizam sozinhos.
 * O 1º grupo é carimbado um a um (sobe 1 quadro, bate 1 quadro); depois o ritmo acelera e
 * cada quadro recebe uma impressão.
 */
const FIRST_SLAM = 4;
const slowCount = skillGroups[0]?.items.length ?? 0;
const slamAt = (k: number) =>
  k < slowCount ? FIRST_SLAM + 2 * k : FIRST_SLAM + 2 * Math.max(0, slowCount - 1) + (k - slowCount + 1);

let counter = 0;
const groups = skillGroups.map((group) => ({
  ...group,
  items: group.items.map((item) => {
    const k = counter++;
    const rand = random(`skills-${item.name}`);
    return {
      ...item,
      slow: k < slowCount,
      vars: {
        '--at': slamAt(k),
        '--rot': `${spread(rand, 4.2)}deg`,
        '--ox': `${spread(rand, 3)}px`,
        '--oy': `${spread(rand, 2.4)}px`,
        '--mx': `${Math.round(rand() * 256)}px`,
        '--my': `${Math.round(rand() * 256)}px`,
        '--press': `${Math.round(rand() * 360)}deg`,
        // Pressão mínima ≥ 0,7: a borda mais fraca da impressão ainda passa de 4,5:1 sobre o papel.
        '--weak': (0.7 + rand() * 0.15).toFixed(2),
      } as Vars,
    };
  }),
}));

const total = counter;
const rapidCount = Math.max(0, total - slowCount);
const lastSlam = total ? slamAt(total - 1) : FIRST_SLAM;
const maxPerGroup = Math.max(1, ...skillGroups.map((group) => group.items.length));

const timeline: Vars = {
  '--cols': maxPerGroup,
  '--groups': skillGroups.length,
  '--tall-rows': skillGroups.reduce((n, group) => n + Math.ceil(group.items.length / 3), 0),
  '--first-slam': FIRST_SLAM,
  '--last-slam': lastSlam,
  '--slow-iter': Math.max(0, slowCount - 0.5),
  '--rapid-start': FIRST_SLAM + 2 * Math.max(0, slowCount - 1) + 1,
  '--rapid-iter': rapidCount / 2,
};

/** Carimbo de madeira visto de lado (recorte de papel): sombra fixa + corpo que sobe e bate. */
function Stamp({ className, bodyClassName }: { className?: string; bodyClassName?: string }) {
  return (
    <span className={cx(s.stamp, className)} aria-hidden="true">
      <svg className={s.stampShadow} viewBox="0 0 100 104" focusable="false">
        <use href="#skills-stamp-silhouette" />
      </svg>
      <svg className={cx(s.stampBody, bodyClassName)} viewBox="0 0 100 104" focusable="false">
        <use href="#skills-stamp-art" />
      </svg>
    </span>
  );
}

/**
 * Desenho do carimbo, definido uma vez e reutilizado por todas as cópias (<use>). As cores
 * são variáveis (tons de kraft/tinta/papel definidos em .stamp), herdadas por cada cópia.
 */
function StampSprite() {
  const knob = <circle cx="50" cy="17" r="15" />;
  const neck = <path d="M40.5 30c4 4 5 9 4.4 14.6-.5 5-3.6 9-8.6 13.4h27.4c-5-4.4-8.1-8.4-8.6-13.4-.6-5.6.4-10.6 4.4-14.6z" />;
  const collar = <rect x="12" y="56" width="76" height="6.5" rx="1.6" />;
  const block = <rect x="8" y="61" width="84" height="27" rx="2.6" />;
  const rubber = <rect x="11" y="87" width="78" height="10" rx="1" />;
  return (
    <svg className={s.sprite} aria-hidden="true" focusable="false">
      <defs>
        <symbol id="skills-stamp-silhouette" viewBox="0 0 100 104">
          {knob}
          {neck}
          {collar}
          {block}
          {rubber}
        </symbol>
        <symbol id="skills-stamp-art" viewBox="0 0 100 104">
          <g style={{ fill: 'var(--wood-deep)' }}>{knob}</g>
          <ellipse cx="44" cy="10.5" rx="5.6" ry="3.4" style={{ fill: 'var(--wood-light)' }} transform="rotate(-28 44 10.5)" />
          <path d="M57 27c4-3 6.6-7.5 7.4-12.5 1.2 7-1.6 13-7.4 16.4z" style={{ fill: 'var(--wood-dark)' }} />
          <g style={{ fill: 'var(--wood)' }}>{neck}</g>
          <path d="M47 33c1.6 4 1.8 8.4 1 12.4-.6 3.4-2.6 7.6-5.6 12.6h-3.8c3.8-4.2 6-8 6.6-12 .6-4.2.2-8.6-1.4-13z" style={{ fill: 'var(--wood-light)' }} />
          <g style={{ fill: 'var(--wood-dark)' }}>{collar}</g>
          <g style={{ fill: 'var(--color-kraft)' }}>{block}</g>
          <rect x="78" y="61" width="14" height="27" rx="2.6" style={{ fill: 'var(--wood-dark)' }} opacity="0.35" />
          <path
            d="M12 70.5c5-1.4 10-.6 15 .4M12 80c6-1 11 .2 15 1M73 68.6c4 .9 7 .6 9.6-.4M71 83c4-1 8-.6 11 .6"
            style={{ stroke: 'var(--wood-dark)' }}
            strokeWidth="1.1"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
          <rect x="31" y="66.5" width="38" height="16" style={{ fill: 'var(--color-paper)' }} />
          <rect x="35" y="70.4" width="30" height="2.4" style={{ fill: 'var(--color-mimeo)' }} />
          <rect x="35" y="75.6" width="19" height="2.4" style={{ fill: 'var(--color-mimeo)' }} />
          <g style={{ fill: 'var(--color-mimeo)' }}>{rubber}</g>
          <rect x="11" y="94" width="78" height="3" style={{ fill: 'var(--rubber-edge)' }} />
        </symbol>
      </defs>
    </svg>
  );
}

/**
 * Cena 3 — "Carimbos". Uma ficha técnica de repartição sobre a esteira: cabeçalho com o
 * título e o campo do responsável, uma linha por grupo com quadros para carimbar. O carimbo
 * (objeto-herói) bate cada tecnologia na ficha. Coreografia em Skills.module.css.
 */
export default function Skills() {
  return (
    <Scene id="skills" className={s.canvas}>
      <StampSprite />
      <div className={s.frame} style={timeline} data-stamp-frame="">
        <div className={s.formSlot}>
          <div className={s.formShake}>
            <div className={s.formTap}>
              <div className={s.form} data-stamp-form="">
                <header className={s.header}>
                  <h2 className={s.title} {...headingProps('skills')}>
                    Tecnologias
                  </h2>
                  <div className={s.owner} aria-hidden="true" data-owner="">
                    <span className={s.cellLabel}>Responsável</span>
                    <span className={s.idWrap}>
                      <span className={s.idStamp} data-mark="">
                        <span className={s.idName}>{person.name}</span>
                        <span className={s.idRole}>{person.roles[1]}</span>
                      </span>
                      <Stamp className={s.headGhost} bodyClassName={s.headGhostBody} />
                    </span>
                  </div>
                </header>

                <div className={s.rows}>
                  {groups.map((group) => (
                    <div key={group.id} className={s.row}>
                      <h3 id={`skills-${group.id}`} className={s.label}>
                        {group.label}
                      </h3>
                      <ul className={s.slots} aria-labelledby={`skills-${group.id}`}>
                        {group.items.map(({ name, icon: Icon, slow, vars }) => (
                          <li key={name} className={cx(s.slot, slow ? s.slow : s.rapid)} style={vars} data-slot="">
                            <span className={s.imprint} data-mark="">
                              <Icon className={s.icon} aria-hidden="true" focusable="false" />
                              <span className={s.name}>{name}</span>
                            </span>
                            <Stamp className={s.ghost} bodyClassName={s.ghostBody} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <span className={s.tapStamp} aria-hidden="true" data-tap-stamp="">
                  <Stamp bodyClassName={s.tapBody} />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={s.props} aria-hidden="true">
          <span className={s.pad}>
            <span className={s.padLid}>
              <span className={s.padLabel} />
            </span>
            <span className={s.padCase}>
              <span className={s.felt} />
            </span>
          </span>
          <span className={s.rest}>
            <span className={s.restAway}>
              <span className={s.restTap}>
                <span className={s.restIn}>
                  <span className={s.restBack}>
                    <Stamp className={cx(s.restStamp, 'boil')} />
                  </span>
                </span>
              </span>
            </span>
          </span>
        </div>

      </div>
      <SkillsStampTap />
    </Scene>
  );
}
