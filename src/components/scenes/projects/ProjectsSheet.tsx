'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type TouchEvent,
} from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Tape, cx } from '@/components/paper';
import type { Project } from '@/lib/vercel';
import { Film, Loupe, Picture, ProjectDetails, Slot, Tag, developTiming, slotCount, type Vars } from './Film';
import s from '../Projects.module.css';

const FRAME_MS = 1000 / 12;
/** A lupa viaja em 3 quadros; a etiqueta antiga sai em 1 e a nova bate no seguinte. */
const SWAP_MS = FRAME_MS * 3;
const SWIPE_MIN = 40;

const motionFull = () => document.documentElement.dataset.motion === 'full';

/**
 * Ilha da folha de contato: guarda o projeto selecionado e orquestra a troca (lupa, etiqueta,
 * ampliação). Todo o movimento é CSS; aqui só mudam atributos e variáveis.
 */
export default function ProjectsSheet({ projects, title }: { projects: Project[]; title: ReactNode }) {
  const total = projects.length;
  const n = slotCount(total);
  const [sel, setSel] = useState(0);
  // `tick` reinicia as animações de troca (chave dos elementos); `from` é a etiqueta que está saindo.
  const [swap, setSwap] = useState<{ tick: number; from: number | null }>({ tick: 0, from: null });
  const [moving, setMoving] = useState(false);
  const [message, setMessage] = useState('');
  const camera = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const frames = useRef<Array<HTMLButtonElement | null>>([]);
  const timer = useRef(0);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const select = (target: number, focus = false) => {
    const next = ((target % total) + total) % total;
    if (focus) frames.current[next]?.focus();
    if (next === sel) return;
    const animate = motionFull();
    setSel(next);
    setSwap((prev) => ({ tick: prev.tick + 1, from: animate ? sel : null }));
    setMoving(animate);
    setMessage(`Projeto ${next + 1} de ${total}: ${projects[next].title}`);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setSwap((prev) => ({ ...prev, from: null }));
      setMoving(false);
    }, SWAP_MS);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Captura que não carregou: some e deixa à vista o quadro tipográfico que está por baixo
  // (inclusive as que falharam antes da hidratação; o evento "error" não borbulha, daí a captura).
  useEffect(() => {
    const cam = camera.current;
    if (!cam) return;
    const fail = (img: HTMLImageElement) => img.setAttribute('data-failed', '');
    cam.querySelectorAll('img').forEach((img) => img.complete && !img.naturalWidth && fail(img));
    const onError = (event: Event) => event.target instanceof HTMLImageElement && fail(event.target);
    cam.addEventListener('error', onError, true);
    return () => cam.removeEventListener('error', onError, true);
  }, []);

  // Composição alta: a tira rola na horizontal; o quadro escolhido sempre fica à vista (corte seco, sem rolagem suave).
  useEffect(() => {
    const scroller = strip.current;
    const frame = frames.current[sel];
    if (!scroller || !frame || scroller.scrollWidth <= scroller.clientWidth + 1) return;
    const view = scroller.getBoundingClientRect();
    const rect = frame.getBoundingClientRect();
    const margin = rect.width * 0.6;
    if (rect.left < view.left + margin) scroller.scrollLeft -= view.left + margin - rect.left;
    else if (rect.right > view.right - margin) scroller.scrollLeft += rect.right - (view.right - margin);
  }, [sel]);

  // Origem da "câmera" da entrada (composição alta): o centro da lupa, medido sem a escala da câmera.
  // Na composição larga o CSS calcula a origem sozinho (trigonometria), inclusive antes da hidratação.
  useLayoutEffect(() => {
    const cam = camera.current;
    if (!cam) return;
    let raf = 0;
    const measure = () => {
      const frame = frames.current[sel];
      if (!frame || !cam.offsetWidth) return;
      const c = cam.getBoundingClientRect();
      const k = c.width / cam.offsetWidth || 1;
      const f = frame.getBoundingClientRect();
      const ox = (f.left + f.width / 2 - c.left) / k;
      const oy = (f.top + f.height / 2 - c.top) / k;
      const view = cam.closest<HTMLElement>('.scene-scroll');
      let visible = cam.offsetHeight;
      if (view) {
        const style = getComputedStyle(view);
        visible = view.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      }
      const cx = cam.offsetWidth / 2;
      const cy = Math.min(cam.offsetHeight, Math.max(visible, 0)) / 2;
      cam.style.setProperty('--m-ox', `${ox.toFixed(1)}px`);
      cam.style.setProperty('--m-oy', `${oy.toFixed(1)}px`);
      cam.style.setProperty('--m-px', `${(cx - ox).toFixed(1)}px`);
      cam.style.setProperty('--m-py', `${(cy - oy).toFixed(1)}px`);
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    const observer = new ResizeObserver(schedule);
    observer.observe(cam);
    const scroller = strip.current;
    scroller?.addEventListener('scroll', schedule, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      scroller?.removeEventListener('scroll', schedule);
    };
  }, [sel]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const targets: Record<string, number> = { ArrowRight: sel + 1, ArrowLeft: sel - 1, Home: 0, End: total - 1 };
    if (!(event.key in targets)) return;
    event.preventDefault();
    select(targets[event.key], true);
  };

  // Gesto horizontal sobre a tira quando ela não rola (palco largo em telas de toque).
  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const t = event.touches[0];
    touch.current = event.touches.length === 1 ? { x: t.clientX, y: t.clientY } : null;
  };
  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touch.current;
    touch.current = null;
    const scroller = strip.current;
    if (!start || !scroller || scroller.scrollWidth > scroller.clientWidth + 1) return;
    const t = event.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    select(sel + (dx < 0 ? 1 : -1));
  };

  const current = projects[sel];
  const slots = Array.from({ length: n }, (_, j) => j);

  return (
    <div ref={camera} className={s.camera} style={{ '--sel': sel, '--n': n } as Vars}>
      {title}

      <div className={s.print} aria-hidden="true">
        <div className={s.printPaper}>
          <div key={swap.tick} className={s.printPicture} data-changed={swap.tick ? '' : undefined}>
            <Picture shot={current} />
          </div>
        </div>
        <Tape className={cx(s.printTape, s.printTapeA)} />
        <Tape className={cx(s.printTape, s.printTapeB)} />
      </div>

      <div ref={strip} className={s.stripWrap} data-swipe-capture="" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className={s.strip}>
          <Film role="group" aria-label="Projetos publicados" data-keys-capture="" onKeyDown={onKeyDown}>
            {slots.map((j) => {
              const project = projects[j];
              return (
                <Slot key={j} j={j} timing={developTiming(j, sel, n)} selected={j === sel}>
                  {project ? (
                    <button
                      ref={(el) => {
                        frames.current[j] = el;
                      }}
                      type="button"
                      className={s.frameButton}
                      aria-pressed={j === sel}
                      tabIndex={j === sel ? 0 : -1}
                      onClick={() => select(j)}
                    >
                      <Picture shot={project} />
                      <span className="sr-only">{project.title}</span>
                    </button>
                  ) : (
                    <Picture />
                  )}
                </Slot>
              );
            })}
          </Film>
          <Loupe
            moving={moving}
            clone={
              <Film>
                {slots.map((j) => (
                  <Slot key={j} j={j} timing={developTiming(j, sel, n)} selected={j === sel}>
                    <Picture shot={projects[j]} />
                  </Slot>
                ))}
              </Film>
            }
          />
        </div>
      </div>

      {total > 1 && (
        <div className={s.controls}>
          <button type="button" className={s.step} onClick={() => select(sel - 1)}>
            <span className={cx(s.stepPaper, s.stepPrev)}>
              <FiChevronLeft aria-hidden="true" />
              Projeto anterior
            </span>
          </button>
          <span className={s.count}>
            {sel + 1} de {total}
          </span>
          <button type="button" className={s.step} onClick={() => select(sel + 1)}>
            <span className={cx(s.stepPaper, s.stepNext)}>
              Próximo projeto
              <FiChevronRight aria-hidden="true" />
            </span>
          </button>
        </div>
      )}

      <ul className={s.tags}>
        {projects.map((project, i) => {
          const isCurrent = i === sel;
          const state = isCurrent ? (swap.tick ? 'in' : 'on') : i === swap.from ? 'out' : undefined;
          return (
            <Tag key={isCurrent ? `${project.id}:${swap.tick}` : project.id} state={state}>
              <ProjectDetails project={project} />
            </Tag>
          );
        })}
      </ul>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {message}
      </p>
    </div>
  );
}
