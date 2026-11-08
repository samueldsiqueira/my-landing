# Samuel D' Siqueira — portfólio

Portfólio em forma de jogo: a carreira de Samuel contada como a jornada de um mago em pixel art.
O herói segue o caminho, aceita as missões (cada etapa acadêmica e profissional), conclui tarefas
e ganha XP e atributos. A página não rola: ao avançar, o cenário muda em volta do herói.

- **Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript.
- **Jogo:** CSS (sprites em passos, transições, contadores) sobre atributos do `<html>`; React só
  para os comandos. Arte em pixel desenhada em código (`npm run sprites`).
- **Como funciona e como editar:** [`docs/GAME.md`](docs/GAME.md).

## Rodando

```bash
npm install
cp .env.example .env.local   # opcional: projetos da Vercel
npm run dev
```

Scripts: `npm run build`, `npm start`, `npm run lint`, `npm run typecheck`, `npm run test:e2e`,
`npm run sprites` (regenera toda a pixel art em `public/game`).

## Projetos da Vercel

A etapa "Missões secundárias" lista os projetos da sua conta na Vercel, buscados **no servidor** e
atualizados a cada hora (ISR). O token nunca vai para o navegador.

1. Crie um token em <https://vercel.com/account/tokens> com leitura de projetos e deployments.
2. Defina `VERCEL_API_TOKEN` (e `VERCEL_TEAM_ID`, se for conta de time) nas variáveis do projeto
   na Vercel e/ou em `.env.local`. **Não use o prefixo `NEXT_PUBLIC_`.**
3. Opcional: ajuste títulos, descrições, ordem ou oculte projetos em `src/content/projects.ts`.

Sem token, o mural mostra um convite para os repositórios no GitHub. Para testar o mural sem rede, gere o build com `PROJECTS_FIXTURE=1` (cinco projetos de exemplo) ou
`PROJECTS_FIXTURE=error` (falha da API); nunca defina essa variável em produção.

## Conteúdo

Textos, cargos, experiências e tecnologias ficam em `src/content/profile.ts`; a jornada (missões,
tarefas, XP e atributos) em `src/content/journey.ts`. A duração de cada emprego é calculada
automaticamente a partir das datas.

## Modos de visualização

- **Jogo** (padrão com JavaScript): uma etapa por vez; ← → , roda, deslizar ou os botões.
- **Página única:** `?modo=leitura`, ou o link "Ver em uma página". Também é o que buscadores,
  leitores sem JavaScript e a impressão recebem.
- **Movimento reduzido:** segue `prefers-reduced-motion` e pode ser ligado no botão da interface.
