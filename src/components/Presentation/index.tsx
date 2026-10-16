"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import Navigation from '../Navigation';
import { scenes } from '../../data/profile';
import { sceneComponents } from './Scenes';
import { steps } from './stopMotion';

// Tempo mínimo entre trocas de cena: evita que um único gesto de trackpad
// (que dispara dezenas de eventos wheel) pule várias cenas de uma vez.
const LOCK_MS = 900;
const SWIPE_THRESHOLD = 50;

// Posição do brilho roxo de fundo em cada cena; ele "salta" entre elas.
const glowPositions = [
  { left: '20%', top: '45%' },
  { left: '78%', top: '30%' },
  { left: '30%', top: '75%' },
  { left: '70%', top: '65%' },
  { left: '15%', top: '25%' },
  { left: '50%', top: '50%' },
];

// Retorna true se algum elemento rolável entre o alvo e a cena ainda pode
// rolar na direção pedida — nesse caso o gesto pertence a ele, não à troca de cena.
const canScrollInside = (target: EventTarget | null, root: HTMLElement | null, dir: number) => {
  let el = target instanceof HTMLElement ? target : null;
  while (el && el !== root) {
    const { overflowY } = getComputedStyle(el);
    if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 1) {
      if (dir > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true;
      if (dir < 0 && el.scrollTop > 0) return true;
    }
    el = el.parentElement;
  }
  return false;
};

const Presentation = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const lockedUntil = useRef(0);
  const touchStart = useRef<{ y: number; canScrollDown: boolean; canScrollUp: boolean } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const total = scenes.length;

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(total - 1, next));
      if (clamped === index) return;
      setDirection(clamped > index ? 1 : -1);
      setIndex(clamped);
      lockedUntil.current = Date.now() + LOCK_MS;
    },
    [index, total]
  );

  const step = useCallback(
    (dir: number, target: EventTarget | null) => {
      if (Date.now() < lockedUntil.current) return;
      if (canScrollInside(target, stageRef.current, dir)) return;
      goTo(index + dir);
    },
    [goTo, index]
  );

  // Abre direto na cena indicada pela URL (#projects, #contact...).
  useEffect(() => {
    const fromHash = scenes.findIndex((scene) => `#${scene.id}` === window.location.hash);
    if (fromHash > 0) setIndex(fromHash);
  }, []);

  useEffect(() => {
    const url = index === 0 ? window.location.pathname : `#${scenes[index].id}`;
    window.history.replaceState(null, '', url);
  }, [index]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 8) return;
      step(e.deltaY > 0 ? 1 : -1, e.target);
    };
    const onKey = (e: KeyboardEvent) => {
      // Espaço sobre um botão/link deve acioná-lo, não trocar de cena.
      if (e.key === ' ' && (e.target as HTMLElement).closest?.('button, a')) return;
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        step(1, null);
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        step(-1, null);
      } else if (e.key === 'Home') {
        goTo(0);
      } else if (e.key === 'End') {
        goTo(total - 1);
      }
    };
    // No toque, o conteúdo interno já rolou quando o dedo sobe; por isso o
    // limite de rolagem é avaliado no início do gesto, não no fim.
    const onTouchStart = (e: TouchEvent) => {
      touchStart.current = {
        y: e.touches[0].clientY,
        canScrollDown: canScrollInside(e.target, stageRef.current, 1),
        canScrollUp: canScrollInside(e.target, stageRef.current, -1),
      };
    };
    const onTouchEnd = (e: TouchEvent) => {
      const start = touchStart.current;
      touchStart.current = null;
      if (!start) return;
      const delta = start.y - e.changedTouches[0].clientY;
      if (Math.abs(delta) < SWIPE_THRESHOLD) return;
      const dir = delta > 0 ? 1 : -1;
      if (dir > 0 ? start.canScrollDown : start.canScrollUp) return;
      step(dir, null);
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [step, goTo, total]);

  const CurrentScene = sceneComponents[index];
  const frameLabel = String(index + 1).padStart(2, '0');

  return (
    <main className="fixed inset-0 overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Fundo: brilho roxo que se move quadro a quadro */}
      <motion.div
        aria-hidden
        className="absolute w-[60vmax] h-[60vmax] rounded-full opacity-25 pointer-events-none"
        style={{ x: '-50%', y: '-50%', background: 'radial-gradient(circle, #9333ea 0%, transparent 60%)' }}
        initial={false}
        animate={glowPositions[index]}
        transition={{ duration: 0.8, ease: steps(8) }}
      />
      <div aria-hidden className="grain absolute inset-0 pointer-events-none" />
      <div aria-hidden className="absolute inset-0 pointer-events-none vignette" />

      <Navigation current={index} onNavigate={goTo} />

      {/* Palco */}
      <div ref={stageRef} className="relative z-10 h-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.section
            key={scenes[index].id}
            id={scenes[index].id}
            aria-label={scenes[index].label}
            custom={direction}
            variants={{
              enter: (dir: number) => ({ y: dir * 40, opacity: 0 }),
              center: { y: 0, opacity: 1, transition: { duration: 0.4, ease: steps(4) } },
              leave: (dir: number) => ({ y: dir * -40, opacity: 0, transition: { duration: 0.3, ease: steps(3) } }),
            }}
            initial="enter"
            animate="center"
            exit="leave"
            className="h-full overflow-y-auto overscroll-contain px-4 pt-24 pb-28 flex"
          >
            <div className="m-auto w-full">
              <CurrentScene />
            </div>
          </motion.section>
        </AnimatePresence>
      </div>

      {/* Flash de troca de quadro */}
      <motion.div
        key={`flash-${index}`}
        aria-hidden
        className="absolute inset-0 z-20 bg-purple-200 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.12, 0, 0.06, 0] }}
        transition={{ duration: 0.4, ease: steps(5) }}
      />

      {/* HUD: contador de cena e progresso */}
      <div className="absolute bottom-0 inset-x-0 z-30 px-4 pt-10 pb-5 pointer-events-none bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="container mx-auto flex items-end justify-between gap-4">
          <div className="font-mono text-xs md:text-sm text-gray-400 tracking-widest">
            <span className="text-purple-400 text-lg md:text-2xl font-bold">{frameLabel}</span>
            <span> / {String(total).padStart(2, '0')}</span>
            <span className="hidden sm:inline"> — {scenes[index].label}</span>
          </div>

          {index < total - 1 ? (
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="pointer-events-auto flex flex-col items-center text-purple-400 hover:text-purple-300 text-xs uppercase tracking-[0.3em]"
              aria-label="Próxima cena"
            >
              <span className="hidden md:block mb-1">Role</span>
              <FiChevronDown className="text-3xl hop" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => goTo(0)}
              className="pointer-events-auto text-purple-400 hover:text-purple-300 text-xs uppercase tracking-[0.3em]"
            >
              Voltar ao início
            </button>
          )}
        </div>
        <div className="container mx-auto mt-3 flex gap-1.5">
          {scenes.map((scene, i) => (
            <button
              key={scene.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir para ${scene.label}`}
              className="pointer-events-auto flex-1 h-1 rounded-full bg-gray-800 overflow-hidden"
            >
              <motion.span
                className="block h-full bg-purple-500"
                initial={false}
                animate={{ width: i <= index ? '100%' : '0%' }}
                transition={{ duration: 0.4, ease: steps(4) }}
              />
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Presentation;
