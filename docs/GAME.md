# A Jornada do Mago — como o jogo funciona

A página conta a carreira de Samuel como um jogo: o herói (um mago chibi) segue um caminho,
cada etapa é uma missão, e cada missão concluída dá XP e atributos. A página não rola: o que
muda é o caminho e o cenário em volta.

## Arquitetura

- **Fonte de verdade: atributos do `<html>`.** O script de boot (`src/lib/boot.ts`) define
  antes da primeira pintura `data-mode` (`stage` = jogo, `read` = página única; ausente sem JS),
  `data-scene` (etapa atual, pelo hash), `data-motion` e `data-seen` (etapas já concluídas na
  sessão). A máquina (`src/components/stage/machine.ts`) atualiza esses atributos e, durante a
  chegada a uma etapa, mantém `data-travel`: `fwd`/`back` para a etapa vizinha (caminhada) e
  `warp` para um salto de 2+ etapas (teleporte: voltar ao início, mapa, teclas 1–0, Home/End).
- **O CSS faz o jogo.** O cenário fica parado; na caminhada o herói (`.g-lane`) atravessa a tela
  até a borda, a tela escurece (`.g-fade`), céu, fundo e trecho de chão (`.g-seg`) trocam no
  escuro e ele entra pela outra borda até o seu lugar, com passos em folha de sprites e poeira.
  No teleporte ele conjura, abre um portal (`.g-portal`) à sua frente e entra nele (o corpo é
  cortado no centro do portal); a tela escurece, o cenário troca e ele sai de outro portal no
  seu lugar. A linha do tempo está comentada em `game.css` ("teleporte").
  Depois a janela da missão abre e as tarefas são marcadas.
  As regras por etapa (valores da ficha, qual cenário aparece, efeitos da primeira chegada)
  são geradas a partir dos dados em `src/components/game/GameStyles.tsx`.
- **A ficha (HUD) é CSS puro.** Nível, XP e atributos são propriedades registradas com
  `@property` e mostradas por contadores; a transição faz os números "subirem".
- **O React só observa** (`Director`, `useStage()`): comandos, mapa, copiar e-mail.
- **Conteúdo real nas janelas.** Cada etapa é uma `<section>` com título (`headingProps`), na
  ordem do documento. O mundo em pixel art é decorativo (`aria-hidden`). Sem JS, no modo
  leitura (`?modo=leitura`) e na impressão a página vira um diário de bordo rolável.

## Conteúdo

- Fatos (empregos, textos, tecnologias, contatos): `src/content/profile.ts`.
- Jornada (etapas, narrativa, tarefas, XP, atributos): `src/content/journey.ts`. XP e atributos
  são metáfora: a progressão conta a história, não mede nada. Só entram fatos da fonte.
- Ordem e nomes das etapas, e âncoras antigas (`#about`, `#contact`...): `scenes` em `profile.ts`.

Para **adicionar uma etapa**: inclua o id em `scenes`, a etapa em `stages`, o céu e os marcos em
`src/components/game/scenery.ts`, e o cenário em `scripts/pixel/world.mjs` (`far` e `ground`).
As teclas 1–9 levam às nove primeiras etapas e 0 à décima.

Para **adicionar um atributo**: inclua-o em `attributes` (`journey.ts`), registre `--g-<id>` com
`@property` e na lista de `transition` da caminhada em `game.css`, e desenhe o ícone em `ICONS`
(`scripts/pixel/props.mjs`). Cada atributo vai de 1 a 10 (as barrinhas usam 10% por ponto).

## Arte

Toda a arte é desenhada em código e gerada como PNG com fundo transparente:

```bash
npm run sprites        # scripts/pixel/build.mjs → public/game e ícones do site
```

- `scripts/pixel/lib.mjs`: tela de pixels, primitivas, contorno automático, encoder PNG.
- `scripts/pixel/hero.mjs`: o herói (40×54 px por quadro): parado ×2, andando ×4, conjurando ×2.
- `scripts/pixel/world.mjs`: cenários (camada distante 320×150 e chão 160×40, emendáveis).
- `scripts/pixel/props.mjs`: marcos de cada etapa, poeira e portal do teleporte, ícones dos
  atributos, molduras da interface.

O mundo tem 180 px de altura virtual. O CSS amplia tudo por `--px` (inteiro) com
`image-rendering: pixelated`. O chão ocupa os 40 px de baixo; o herói pisa no caminho.

## Movimento e desempenho

- Movimento reduzido (`data-motion='reduced'`): nada anda nem pisca; a ficha mostra os valores
  na hora e as tarefas aparecem já marcadas.
- Etapas fora de quadro não são renderizadas (`content-visibility: hidden`). Não meça peças de
  uma etapa antes de ela chegar.
- Animações infinitas só com ciclos longos e só na etapa ativa (as dos marcos ficam pausadas fora
  dela): o React escuta eventos de animação na raiz.

## QA

```bash
npm run build && npx next start -p 3000
node scripts/qa/capture.mjs --scenes indra --vp desk,mob --out /tmp/qa
node scripts/qa/capture.mjs --scenes indra --from origem --vp desk --frames 1,6,12,18,24,30 --out /tmp/qa
node scripts/qa/capture.mjs --scenes contato --from inicio --vp desk,mob --frames 3,9,11,17,21,27 --out /tmp/qa  # teleporte
node scripts/qa/capture.mjs --mode read --vp desk,mob --out /tmp/qa
node scripts/og/render.mjs   # imagem de compartilhamento a partir da tela de título
```

`?qa=1` expõe `window.__stage` (`go`, `finish`, `phase`, `seek(ms)`, `play`).
