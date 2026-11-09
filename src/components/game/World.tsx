import type { CSSProperties } from 'react';
import { attributes, progress, stages } from '@/content/journey';
import { person } from '@/content/profile';
import { landmarks, skies, skyGradient, BACK } from './scenery';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const img = (name: string) => `url(/game/${name}.png)`;

/**
 * O mundo: céu, fundo, chão e marcos de cada etapa (um cenário por vez, parado) e o herói. Na
 * caminhada o herói atravessa a tela até a borda, a tela escurece, o cenário troca e ele entra
 * pelo outro lado. Puramente visual: o conteúdo está nas janelas de missão.
 */
export function World() {
  return (
    <div className="g-world">
      {stages.map((stage) => (
        <div key={`sky-${stage.id}`} className="g-sky" data-biome={stage.id} style={{ backgroundImage: skyGradient(skies[stage.id]) }} />
      ))}
      {stages.map((stage) => (
        <div key={`far-${stage.id}`} className="g-far" data-biome={stage.id} style={{ backgroundImage: img(`far-${stage.id}`) }} />
      ))}

      <div className="g-track">
        {stages.map((stage) => (
          <div key={stage.id} className="g-seg" data-stage={stage.id}>
            <div className="g-ground" style={{ backgroundImage: img(`ground-${stage.id}`) }} />
            {landmarks[stage.id].map((prop) => (
              <div
                key={prop.src}
                className="g-prop"
                data-frames={prop.frames ?? undefined}
                data-float={prop.float ? '' : undefined}
                style={
                  {
                    '--x': prop.x,
                    '--w': prop.w,
                    '--h': prop.h,
                    '--base': prop.base ?? BACK,
                    '--frames': prop.frames ?? 1,
                    '--cycle': `${prop.cycle ?? 1000}ms`,
                    backgroundImage: prop.frames ? undefined : img(prop.src),
                  } as Vars
                }
              >
                {prop.frames && <span className="g-sprite" style={{ backgroundImage: img(prop.src) }} />}
                {prop.labels?.map((label, b) => (
                  <span key={label} className="g-sign" style={{ '--b': b } as Vars}>
                    {label}
                  </span>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* A pista do herói: é ela que se move na caminhada (o cenário fica parado). */}
      <div className="g-lane">
        <span className="g-dust">
          <span className="g-sprite" />
        </span>
        <div className="g-hero">
          <span className="g-sprite" />
        </div>
      </div>
      <div className="g-fade" />
      {stages.map((stage, i) =>
        stage.xp ? (
          <p key={`lv-${stage.id}`} className="g-levelup" data-stage={stage.id}>
            <span>Nível {progress[i].level}!</span>
            <small>+{stage.xp} XP</small>
          </p>
        ) : null,
      )}
    </div>
  );
}

/** Ficha do herói: nível, XP e atributos. Os números vêm de variáveis CSS por etapa (contadores). */
export function Hud() {
  return (
    <div className="g-hud">
      <div className="g-card">
        <span className="g-portrait" />
        <div className="g-who">
          <p className="g-name">{person.name}</p>
          <p className="g-class">Mago · Analista de Sistemas</p>
          <div className="g-level">
            <span className="g-lv" />
            <span className="g-xpbar">
              <span />
            </span>
            <span className="g-xpnum" />
          </div>
        </div>
      </div>
      <ul className="g-attrs">
        {attributes.map((attr) => (
          <li key={attr.id} style={{ '--v': `var(--g-${attr.id})` } as Vars}>
            <span className="g-ico" style={{ backgroundImage: img(`icon-${attr.id}`) }} />
            <span className="g-attr-label">{attr.short}</span>
            <span className="g-attr-val" />
            <span className="g-pips" />
          </li>
        ))}
      </ul>
    </div>
  );
}
