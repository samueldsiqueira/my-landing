'use client';

import { useEffect } from 'react';

const RADIUS = 150;
const ROLE_EVERY_MS = 3000;

/**
 * Comportamentos vivos da abertura, todos dispensáveis (nenhuma informação depende deles) e
 * desligados com movimento reduzido, com a cena oculta ou com a aba em segundo plano:
 * - a letra mais próxima do ponteiro se levanta da mesa (sombra maior, 2 quadros);
 * - tocar na foto faz as fitas "baterem" de novo;
 * - a etiqueta Dymo reveza os cargos: a atual é arrancada e a próxima, perfurada.
 */
export default function OpeningPresence() {
  useEffect(() => {
    const scene = document.getElementById('inicio');
    if (!scene) return;
    const root = document.documentElement;
    const fine = window.matchMedia('(pointer: fine)');
    const live = () =>
      root.dataset.mode === 'stage' &&
      root.dataset.motion === 'full' &&
      root.dataset.scene === 'inicio' &&
      document.visibilityState === 'visible';

    // ---- letra mais próxima do ponteiro (centros em cache: nada de medir a cada quadro) ----
    let near: Element | null = null;
    let frame = 0;
    let last: PointerEvent | null = null;
    let centers: Array<{ el: Element; x: number; y: number }> = [];

    const measure = () => {
      centers = Array.from(scene.querySelectorAll('h1 [data-letter]'), (el) => {
        const rect = el.getBoundingClientRect();
        return { el, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      });
    };

    const update = () => {
      frame = 0;
      if (!last || !live()) return;
      if (!centers.length) measure();
      let best: Element | null = null;
      let bestDistance = RADIUS;
      for (const { el, x, y } of centers) {
        const distance = Math.hypot(last.clientX - x, last.clientY - y);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = el;
        }
      }
      if (best === near) return;
      near?.removeAttribute('data-near');
      near = best;
      near?.setAttribute('data-near', '');
    };

    const onMove = (event: PointerEvent) => {
      if (!fine.matches) return;
      last = event;
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onLeave = () => {
      near?.removeAttribute('data-near');
      near = null;
      centers = [];
    };

    const onResize = () => {
      centers = [];
    };

    // ---- fitas ----
    const onPhoto = (event: PointerEvent) => {
      const photo = (event.target as Element).closest('[data-shared="photo"]');
      if (!photo || root.dataset.motion !== 'full') return;
      photo.removeAttribute('data-retape');
      void (photo as HTMLElement).offsetWidth;
      photo.setAttribute('data-retape', '');
    };

    // ---- revezamento dos cargos na etiqueta Dymo ----
    const roles = Array.from(scene.querySelectorAll<HTMLElement>('[data-role]'));
    let current = 0;
    const rotate = () => {
      if (!live() || roles.length < 2) return;
      const prev = roles[current];
      current = (current + 1) % roles.length;
      const next = roles[current];
      prev.removeAttribute('data-on');
      prev.removeAttribute('data-first');
      prev.setAttribute('data-off', '');
      next.removeAttribute('data-off');
      next.setAttribute('data-on', '');
    };
    // A primeira troca espera a etiqueta inicial ser lida; depois, uma a cada 3 s.
    let timer = window.setTimeout(function tick() {
      rotate();
      timer = window.setTimeout(tick, ROLE_EVERY_MS);
    }, ROLE_EVERY_MS + 2000);

    scene.addEventListener('pointermove', onMove);
    scene.addEventListener('pointerleave', onLeave);
    scene.addEventListener('pointerdown', onPhoto);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      scene.removeEventListener('pointermove', onMove);
      scene.removeEventListener('pointerleave', onLeave);
      scene.removeEventListener('pointerdown', onPhoto);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return null;
}
