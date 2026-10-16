# Mesa de Montagem — guia de autoria das cenas

A página é o set de uma animação stop-motion em papel sobre uma esteira de corte. Cada cena é
um novo arranjo da mesa. Este documento é o contrato para escrever ou alterar uma cena.

## Arquitetura em uma página

- **Fonte de verdade: atributos do `<html>`.** O script de boot (`src/lib/boot.ts`) define antes
  da primeira pintura `data-mode` (`stage` = cenas, `read` = página única; ausente sem JS),
  `data-scene`, `data-motion` (`full`/`reduced`), `data-seen` (cenas já vistas na sessão) e
  `data-hand`. Depois, a máquina (`src/components/stage/machine.ts`) atualiza esses atributos.
- **O CSS faz a coreografia.** As cenas ficam todas no DOM (SEO, leitores de tela, modo leitura);
  o CSS mostra só a cena de `html[data-scene]` e dispara as animações de entrada quando o seletor
  passa a valer. Sem biblioteca de animação.
- **O React só observa.** `Director` lê os atributos com `useSyncExternalStore` e expõe
  `useStage()` (`index`, `sceneId`, `mode`, `motion`, `go`, `next`, `prev`, `rewind`, `setMotion`).
- **Transição:** saída da cena atual (`data-leaving` no `<html>` e na seção, até ~700 ms) →
  troca de `data-scene` → entrada da nova. Qualquer navegação durante a entrada a completa
  (pular). A sombra da mão cruza o set em algumas transições (`handOn` em `machine.ts`).

## Anatomia de uma cena

```tsx
<Scene id="about" className={s.canvas}>
  {' '}
  {/* section > .scene-scroll > .scene-canvas */}
  <div className={s.frame}>
    {' '}
    {/* a composição vive aqui */}
    <h2 className={s.title} {...headingProps('about')}>
      …
    </h2>
    …
  </div>
</Scene>
```

- A área de rolagem (`.scene-scroll`) é o **container** das consultas (`container-name: canvas`):
  no palco, `cqw`/`cqh` medem a área livre da cena, já sem a interface (régua, índice, barra).
- `.scene-canvas` (o `className` passado a `Scene`) **cresce com o conteúdo** (`min-height: 100%`):
  se o texto não couber, a cena rola por dentro e o fim nunca fica atrás da barra; a troca de
  cena só acontece na borda da rolagem. Centralize com `margin: auto` (não com
  `place-items: center`, que empurra o excesso para cima, fora do alcance da rolagem).
- Título: um `h1` (abertura) ou `h2` com `headingProps(id)` — é o alvo de foco ao trocar de cena.

### Duas composições, não uma reduzida

|                   | Quando                                                             | Unidades                                                                  |
| ----------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| **Alta** (padrão) | retrato, telas estreitas e **modo leitura**                        | fluxo normal, `cqw`; limite a largura (`max-width` ~30–44rem no `.frame`) |
| **Larga**         | `@container canvas (min-width: 760px) and (min-aspect-ratio: 1/1)` | posicionamento absoluto em `cqw`/`cqh` dentro do `.frame`                 |

A consulta larga depende de `aspect-ratio`, que só existe no palco (a área de rolagem é container de tamanho). No
modo leitura vale sempre a composição alta — de propósito: vira um documento legível.

## Gramática de movimento

1. **12 fps "em dois".** `var(--frame)` = 83,333 ms. Durações e atrasos sempre em quadros:
   `calc(var(--frame) * 4)`.
2. **Pose a pose.** `animation-timing-function: step-end`: cada keyframe fica parado até o
   próximo. Uma entrada típica tem 3–5 poses (viagem → overshoot → assentamento). Pausas =
   segurar uma pose por mais quadros (keyframes mais espaçados).
3. **Estilos-base = pose final.** Sem JS, no modo leitura e com movimento reduzido nenhuma
   animação roda, então o CSS-base precisa ser a composição pronta. Use `fill-mode: both`.
4. **Comece invisível.** O keyframe 0% aparece durante o atraso; em entradas use
   `0% { opacity: 0 }` e a primeira pose visível no keyframe seguinte.
5. **`transform` é da coreografia.** Para compor (posição/giro estáticos) use as propriedades
   `translate`, `rotate` e `scale` — elas se somam ao `transform` animado.
6. **Antecipação e impacto.** Peça que cai: alta (sombra grande, `scale` > 1) → achata 1 quadro
   → assenta. Carimbo: sobe antes de bater.
7. **Imperfeição com seed.** Use `random(seed)`/`spread()` de `src/lib/seed.ts` (determinístico,
   sem divergência de hidratação). `CutLetters` já dá a cada letra `--jx/--jy/--jr`, `--i`,
   `--li`, `--w`, `--boil-phase`.
8. **Boil** (tremor dos quadros parados): classe global `boil` num elemento **interno**, sem
   `translate`/`rotate` próprios (o keyframe usa essas propriedades). Use em poucos elementos.
9. **Feedback de interação nunca é quadro a quadro.** Foco, hover e clique respondem na hora;
   só a coreografia é stop-motion.
10. **Revisita.** `html[data-seen~='id']` indica que a cena já foi vista; encurte a entrada
    (ex.: variável `--t` multiplicando atrasos, ou mostrar o estado final com 2–3 quadros).

### Seletores (dentro do CSS Module da cena)

```css
/* ENTRADA: só no palco, com movimento, com a cena ativa */
:global(html[data-mode='stage'][data-motion='full'][data-scene='about'] #about) .piece {
  animation: piece-in calc(var(--frame) * 4) step-end both;
  animation-delay: calc(var(--frame) * 6);
}

/* SAÍDA própria: desligue a saída padrão do canvas e anime as peças */
:global(html[data-mode='stage'][data-motion='full'][data-leaving='about'] #about) .canvas {
  animation: none;
}
:global(html[data-mode='stage'][data-motion='full'][data-leaving='about'] #about) .piece {
  animation: piece-off calc(var(--frame) * 3) step-end forwards;
}
```

`html[data-dir]` (`1`/`-1`) e `var(--dir)` indicam o sentido da navegação. A saída deve caber em
~4–6 quadros (há um teto de 700 ms).

### Peças compartilhadas entre cenas

Marque com `data-shared="chave"` a peça que viaja (ex.: a foto da abertura vira o 3×4 da cena
Sobre: `data-shared="photo"` nas duas). Só viajam peças presentes nas duas cenas; nesse caso a
máquina esconde a da cena que sai (`data-traveling`), mede onde ela estava e aplica
`data-flip` com `--flip-x/--flip-y/--flip-s` na que entra (keyframe global `flip-in`, 4 poses).
O elemento com `data-shared` não pode ter `transform` próprio nem outra animação; anime os filhos.

## Interatividade

- Prefira componentes de servidor. Interação vai numa ilha `'use client'` pequena.
- Widgets que usam setas/Home/End: `data-keys-capture` no contêiner (a máquina não troca de cena
  enquanto o foco estiver dentro). Gestos horizontais próprios: `data-swipe-capture`.
  Rolagem própria com a roda: `data-wheel-capture` (ou um contêiner `overflow-y: auto`).
- Use `useStage()` para navegar (`go('contact')`, `rewind()`).
- Alvos de toque ≥ 44 px; nada pode depender de hover.

## Movimento reduzido

`html[data-motion='reduced']` desliga todas as animações e transições (`!important`). Se a
composição animada depender de sobreposição (ex.: etiquetas que se revezam), escreva o layout
estático alternativo com `:global(html[data-mode='stage'][data-motion='full'])` para a versão
animada e deixe o estático como base.

## Acessibilidade e desempenho

- Conteúdo completo no HTML, em ordem lógica; letras recortadas com nome acessível (`aria-label`
  ou `CutLetters decorative` dentro de um título rotulado).
- Contraste: tinta (`--color-ink`/`--color-mimeo`) sobre papel; papel/`--color-ruler` sobre a esteira.
- Anime só `transform`, `opacity` e, com moderação, `clip-path`. Nada de animar `filter`,
  `box-shadow`, layout ou `background-position` em loop. `text-shadow` só em poucos quadros.
- Sem flashes; tremores ≤ 2 px.
- **Nada de `infinite` com ciclo curto.** O React escuta `animationiteration` na raiz; cada volta
  de uma animação infinita acorda a thread principal (16 letras com ciclo de 375 ms custavam ~35%
  de CPU parada). Para tremor use a classe global `boil` (ciclo de 15 s); se precisar de outro
  loop, faça um ciclo ≥ 10 s ou dispare animações curtas por JS só quando a cena estiver visível.
- Keyframes com `var()` não rodam no compositor: use valores fixos em animações contínuas.
- **Cenas fora de quadro não são renderizadas** (`content-visibility: hidden`; no modo leitura,
  `auto`). Não meça (`getBoundingClientRect`, `offsetWidth`) peças de uma cena antes de ela
  chegar: isso força o layout que o navegador estava pulando. Meça depois da troca de
  `data-scene`, como a máquina faz no FLIP. As animações dessas cenas também ficam paradas.

## Tokens

Cores (`src/app/globals.css`, `@theme`): `--color-mat` #23463A, `--color-paper` #F6F6F1,
`--color-kraft` #C59A63, `--color-ink` #17161C, `--color-mimeo` #3A27A6, `--color-zebra` #DDEBD8,
`--color-ruler` #CFE0B4. Sombras: `--shadow`, `--shadow-soft`. Fita: `--tape`.
Fontes: Archivo variável (`font-stretch` 62–125%, peso 100–900) para tudo; classe `.dot` (Doto,
matricial) só no que é "impresso" por impressora matricial.
Primitivas em `src/components/paper`: `CutLetters`, `Paper`, `Tape`, `Dymo`, `Pin`, `HalftonePhoto`,
`cx`, `headingProps`.

### Papel (`Paper`)

- Três camadas: sombra dura (cópia do recorte deslocada), superfície recortada e o conteúdo por
  cima. **O recorte nunca alcança o texto**: o `padding` vai no `className` (ou no `sheetClassName`)
  e fica dentro da folha. Deixe pelo menos 16–20 px entre o texto e qualquer borda.
- `clipContent` recorta também o conteúdo — só para imagens que vão até a borda (fotos).
- Sombra: `--paper-shadow-x`/`--paper-shadow-y` no `className` (padrão 4px 6px). Não use
  `filter: drop-shadow` numa `Paper`.
- Tons: `paper`, `kraft`, `zebra`, `none`. Texto sobre papel sempre em `--color-ink`
  (violeta `--color-mimeo` só para destaques e links). Nada de cinzas lavados nem cores fora dos tokens.

## QA

```bash
npm run build && npx next start -p 3000
node scripts/qa/capture.mjs --scenes about --vp desk,mob,tabletP,mobL --out /tmp/qa
node scripts/qa/capture.mjs --scenes about --vp desk --frames 0,2,4,6,8,12 --out /tmp/qa   # quadros exatos
node scripts/qa/capture.mjs --scenes about --from inicio --frames 0,1,2,3,4,6 --out /tmp/qa  # chegando de outra cena
node scripts/qa/capture.mjs --scenes about --motion reduced --out /tmp/qa
node scripts/qa/capture.mjs --mode read --vp desk,mob --out /tmp/qa
```

`?qa=1` expõe `window.__stage` (`go`, `finish`, `phase`, `seek(ms)`, `play`).

`seek` só alcança animações que o navegador ainda lista: use `fill-mode: both` (a convenção) —
uma animação sem preenchimento que já terminou some de `getAnimations()` e o quadro capturado
sai errado. Para quadros iniciais confiáveis, capture a partir de uma navegação (`--from`).
