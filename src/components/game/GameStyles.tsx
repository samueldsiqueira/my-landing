import { attributes, progress, stages } from '@/content/journey';

const full = "html[data-mode='stage'][data-motion='full'][data-travel]";

/**
 * Regras por etapa geradas a partir dos dados da jornada: valores da ficha (nível, XP,
 * atributos — viram números por contadores CSS), qual céu/fundo aparece e, na primeira
 * chegada a uma missão, o "subiu de nível", o herói conjurando e as tarefas sendo marcadas.
 * Os quadros da viagem em si (caminhada ou teleporte) vêm de --hero-travel, em game.css.
 * Tudo funciona antes da hidratação, porque depende só dos atributos do <html>.
 */
export function GameStyles() {
  const css = stages
    .map((stage, i) => {
      const p = progress[i];
      const id = stage.id;
      const at = `html[data-scene='${id}']`;
      const fresh = `${full}[data-scene='${id}']:not([data-seen~='${id}'])`;
      const attrs = attributes.map((a) => `--g-${a.id}:${p.attrs[a.id]}`).join(';');
      const rules = [
        `${at} .g-game{--g-xp:${p.xp};--g-lv:${p.level};--g-fill:${p.fill.toFixed(3)};${attrs}}`,
        `html[data-mode='stage'][data-scene='${id}'] #${id}{visibility:visible;content-visibility:visible}`,
        `${at} .g-sky[data-biome='${id}'],${at} .g-far[data-biome='${id}']{opacity:1}`,
        `${at} .g-seg[data-stage='${id}']{opacity:1;visibility:visible}`,
        `${at} .g-seg[data-stage='${id}'] .g-prop :is(.g-sprite),${at} .g-seg[data-stage='${id}'] .g-prop[data-float]{animation-play-state:running}`,
      ];
      if (stage.xp) {
        rules.push(
          `${fresh} .g-levelup[data-stage='${id}']{animation:g-levelup 1600ms steps(1,end) var(--travel) forwards}`,
          `${fresh} .g-hero .g-sprite{animation:var(--hero-travel),g-cast 600ms steps(2) var(--travel) 2,g-idle 1200ms steps(2) calc(var(--travel) + 1200ms) infinite}`,
          `${fresh} #${id} .g-check{animation:g-check 1ms step-end calc(var(--travel) + 450ms + var(--k) * 260ms) both}`,
          `${fresh} #${id} .g-tasks li{animation:g-task-in 250ms steps(2) calc(var(--travel) + 350ms + var(--k) * 260ms) both}`,
        );
      }
      return rules.join('\n');
    })
    .join('\n');
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
