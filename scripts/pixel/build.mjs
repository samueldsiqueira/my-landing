// Gera toda a arte do jogo em public/game (PNGs com fundo transparente).
//   npm run sprites
// A arte é desenhada em código (scripts/pixel/*.mjs): mudou o desenho, rode de novo.
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Pix, sheet } from './lib.mjs';
import { heroFrames } from './hero.mjs';
import { BIOMES, farLayer, groundTile } from './world.mjs';
import * as P from './props.mjs';

const out = join(dirname(fileURLToPath(import.meta.url)), '../../public/game');
const save = (name, pix) => pix.save(join(out, `${name}.png`));

const hero = heroFrames();
save('hero', sheet(hero));
// Retrato do HUD: chapéu e rosto do quadro parado.
save('portrait', hero[0].crop(6, 4, 30, 30));
save('dust', sheet([P.dust(0), P.dust(1)]));
save('portal', sheet([P.portal(0), P.portal(1), P.portal(2)]));

for (const id of BIOMES) {
  save(`far-${id}`, farLayer(id));
  save(`ground-${id}`, groundTile(id));
}

save('cottage', P.cottage());
save('signpost', P.signpost({ boards: 1 }));
save('signpost-4', P.signpost({ boards: 4, w: 40 }));
save('retro-pc', P.retroPc());
save('slime', sheet([P.slime(0), P.slime(1)]));
save('booth', P.guildBooth());
save('tower', P.academyTower());
save('owl', sheet([P.owl(0), P.owl(1)]));
save('radio', P.radioTower());
save('robot', sheet([P.robot(0), P.robot(1)]));
save('sanctuary', P.sanctuary());
save('orb', sheet([P.aiOrb(0), P.aiOrb(1)]));
save('lab', P.vrLab());
save('headset', sheet([P.vrHeadset(0), P.vrHeadset(1)]));
save('grimoire', P.grimoire());
save('board', P.questBoard());
save('tent', P.tent());
save('fire', sheet([P.campfire(0), P.campfire(1), P.campfire(2)]));

for (const name of Object.keys(P.ICONS)) save(`icon-${name}`, P.icon(name));
save('xp', P.xpOrb());
save('quest', P.questMark());
save('frame', P.panelFrame());
save('button', P.buttonFrame());
save('button-gold', P.buttonFrame('#f6c853', '#fff1b0', '#b8842c'));

// Ícones do site (favicon e ícone da tela inicial): o rosto do mago com o chapéu.
const appDir = join(dirname(fileURLToPath(import.meta.url)), '../../src/app');
const face = hero[0].crop(7, 5, 28, 28);
const tile = (size, scale) => {
  const p = new Pix(size, size).rect(0, 0, size, size, '#120d26');
  const s = face.scaled(scale);
  return p.blit(s, Math.floor((size - s.w) / 2), Math.floor((size - s.h) / 2));
};
tile(32, 1).save(join(appDir, 'icon.png'));
tile(180, 6).save(join(appDir, 'apple-icon.png'));

console.log(`arte gerada em ${out}`);
