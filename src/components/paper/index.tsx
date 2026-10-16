// Primitivas da "Mesa de Montagem". Sem hooks: renderizam no servidor e em qualquer cena.
// Convenção de animação (docs/MOTION.md): composição usa translate/rotate/scale;
// `transform` fica livre para a coreografia em @keyframes.
import Image from 'next/image';
import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';
import halftone from '../../../public/img/samuel-halftone.png';
import { random, scissorPolygon, spread, tornTopPolygon } from '@/lib/seed';
import s from './paper.module.css';

export const cx = (...names: Array<string | false | null | undefined>) => names.filter(Boolean).join(' ');

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** Props do título de cada cena: alvo de foco ao trocar de cena. */
export const headingProps = (sceneId: string) => ({
  id: `${sceneId}-title`,
  'data-scene-heading': '',
  tabIndex: -1,
});

interface CutLettersProps extends HTMLAttributes<HTMLElement> {
  text: string;
  as?: ElementType;
  seed?: string;
  /** Desalinhamento máximo de cada letra (px, px, graus). */
  jitter?: { x?: number; y?: number; r?: number };
  /** Índice da primeira letra (útil para encadear atrasos entre linhas). */
  startIndex?: number;
  boil?: boolean;
  /** Peça puramente visual dentro de um elemento que já tem nome acessível (ex.: h1 com aria-label). */
  decorative?: boolean;
  wordClassName?: string;
  letterClassName?: string;
  glyphClassName?: string;
}

/**
 * Texto em letras recortadas: cada letra é uma peça com desalinhamento próprio.
 * Variáveis por letra: --i (índice global), --w (palavra), --li (índice na palavra),
 * --jx/--jy/--jr (desalinhamento), --boil-phase.
 * O nome acessível vem de aria-label; as peças visuais ficam ocultas para leitores de tela.
 */
export function CutLetters({
  text,
  as: Tag = 'span',
  seed,
  jitter = {},
  startIndex = 0,
  boil = true,
  decorative = false,
  className,
  wordClassName,
  letterClassName,
  glyphClassName,
  ...rest
}: CutLettersProps) {
  const rand = random(seed ?? text);
  const { x = 3, y = 7, r = 3.5 } = jitter;
  let i = startIndex;
  const words = text.split(' ');
  return (
    <Tag
      className={cx(s.cut, className)}
      {...(decorative ? { 'aria-hidden': true } : { 'aria-label': text })}
      {...rest}
    >
      <span aria-hidden={decorative ? undefined : true}>
        {words.map((word, w) => (
          <span key={w}>
            <span className={cx(s.word, wordClassName)} style={{ '--w': w } as Vars}>
              {[...word].map((char, li) => {
                const n = i++;
                return (
                  <span
                    key={li}
                    data-letter=""
                    className={cx(s.letter, letterClassName)}
                    style={
                      {
                        '--i': n,
                        '--li': li,
                        '--jx': `${spread(rand, x)}px`,
                        '--jy': `${spread(rand, y)}px`,
                        '--jr': `${spread(rand, r)}deg`,
                        '--boil-phase': n % 3,
                      } as Vars
                    }
                  >
                    <span className={cx(s.glyph, boil && 'boil', glyphClassName)}>{char}</span>
                  </span>
                );
              })}
            </span>
            {w < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}

interface PaperProps extends HTMLAttributes<HTMLDivElement> {
  seed: string;
  /** scissor: recorte irregular nos 4 lados; torn-top: rasgado só em cima; straight: guilhotina. */
  edge?: 'scissor' | 'torn-top' | 'straight';
  depth?: number;
  tone?: 'paper' | 'kraft' | 'zebra' | 'none';
  /** Recorta também o conteúdo (fotos e imagens que vão até a borda). Texto: deixe false. */
  clipContent?: boolean;
  /** Classe do miolo, onde fica o conteúdo. */
  sheetClassName?: string;
  children?: ReactNode;
}

/**
 * Folha de papel com sombra dura, em três camadas: a sombra (cópia do recorte deslocada),
 * a superfície recortada e, por cima, o conteúdo. O recorte nunca alcança o texto: o
 * padding que a cena define no className fica dentro da folha.
 * Sombra: --paper-shadow-x / --paper-shadow-y no className (padrão 4px 6px).
 */
export function Paper({
  seed,
  edge = 'scissor',
  depth,
  tone = 'paper',
  clipContent = false,
  className,
  sheetClassName,
  children,
  ...rest
}: PaperProps) {
  const clipPath =
    edge === 'scissor'
      ? scissorPolygon(seed, { depth })
      : edge === 'torn-top'
        ? tornTopPolygon(seed, { depth })
        : undefined;
  return (
    <div className={cx(s.paper, className)} {...rest}>
      {tone !== 'none' && <span className={s.shade} style={{ clipPath }} aria-hidden="true" />}
      <span className={cx(s.surface, s[tone])} style={{ clipPath }} aria-hidden="true" />
      <div className={cx(s.body, sheetClassName)} style={clipContent ? { clipPath } : undefined}>
        {children}
      </div>
    </div>
  );
}

/** Tira de fita crepe translúcida. Posicione e gire pelo className/style (translate/rotate). */
export function Tape({ className, style }: { className?: string; style?: CSSProperties }) {
  return <span className={cx(s.tape, className)} style={style} aria-hidden="true" />;
}

/** Etiqueta Dymo em relevo (o texto é exibido em caixa alta pelo CSS, como na rotuladora). */
export function Dymo({ children, className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cx(s.dymo, className)} {...rest}>
      {children}
    </span>
  );
}

/** Alfinete violeta. */
export function Pin({ className, style }: { className?: string; style?: CSSProperties }) {
  return <span className={cx(s.pin, className)} style={style} aria-hidden="true" />;
}

/**
 * Foto do Samuel impressa em meio-tom violeta (2 cores, 20 KB). Servida sem otimização
 * do Next: a reamostragem borraria a retícula e o PNG já é menor que um AVIF equivalente.
 */
export function HalftonePhoto({
  className,
  priority,
  sizes = '(min-width: 1100px) 30vw, 60vw',
  alt = "Retrato de Samuel D' Siqueira, sorrindo, de óculos",
}: {
  className?: string;
  priority?: boolean;
  sizes?: string;
  alt?: string;
}) {
  return (
    <Image
      src={halftone}
      alt={alt}
      className={cx(s.halftone, className)}
      sizes={sizes}
      priority={priority}
      unoptimized
    />
  );
}

export { s as paperStyles };
