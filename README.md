# Samuel D' Siqueira — portfólio

Landing page pessoal em forma de animação stop-motion em papel: cada seção é uma cena montada
sobre uma esteira de corte, trocada por roda do mouse, teclado, toque ou pelo índice.

- **Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript.
- **Animação:** CSS puro (`@keyframes` com `step-end`, pose a pose a 12 fps), sem biblioteca.
- **Guia das cenas e da gramática de movimento:** [`docs/MOTION.md`](docs/MOTION.md).

## Rodando

```bash
npm install
cp .env.example .env.local   # opcional: projetos da Vercel
npm run dev
```

Scripts: `npm run build`, `npm start`, `npm run lint`, `npm run typecheck`, `npm run test:e2e`,
`npm run assets` (regenera a foto em meio-tom e as texturas; requer ImageMagick).

## Projetos da Vercel

A cena "Projetos" lista os projetos da sua conta na Vercel, buscados **no servidor** e
atualizados a cada hora (ISR). O token nunca vai para o navegador.

1. Crie um token em <https://vercel.com/account/tokens> com leitura de projetos e deployments.
2. Defina `VERCEL_API_TOKEN` (e `VERCEL_TEAM_ID`, se for conta de time) nas variáveis do projeto
   na Vercel e/ou em `.env.local`. **Não use o prefixo `NEXT_PUBLIC_`.**
3. Opcional: ajuste títulos, descrições, ordem ou oculte projetos em `src/content/projects.ts`.

Sem token, a cena mostra um convite para os repositórios no GitHub. Para testar a folha de
contato sem rede, gere o build com `PROJECTS_FIXTURE=1` (cinco projetos de exemplo) ou
`PROJECTS_FIXTURE=error` (falha da API); nunca defina essa variável em produção.

## Conteúdo

Textos, cargos, experiências e tecnologias ficam em `src/content/profile.ts`. A duração de cada
emprego é calculada automaticamente a partir das datas.

## Modos de visualização

- **Cenas** (padrão com JavaScript): uma cena por vez, em tela cheia.
- **Página única:** `?modo=leitura`, ou o link "Ver em uma página". Também é o que buscadores,
  leitores sem JavaScript e a impressão recebem.
- **Movimento reduzido:** segue `prefers-reduced-motion` e pode ser ligado no botão da interface.
