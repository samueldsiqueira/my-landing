'use client';

import { useEffect } from 'react';

const RADIUS = 150;

/**
 * Presença do visitante na abertura: a letra mais próxima do ponteiro se levanta da mesa
 * (sombra maior, 2 quadros). Tocar na foto faz as fitas "baterem" de novo. Puro deleite:
 * nenhuma informação depende disso, e nada acontece com movimento reduzido.
 */
export default function OpeningPresence() {
  useEffect(() => {
    const scene = document.getElementById('inicio');
    if (!scene) return;
    const root = document.documentElement;
    const fine = window.matchMedia('(pointer: fine)');
    let near: Element | null = null;
    let frame = 0;
    let last: PointerEvent | null = null;

    const update = () => {
      frame = 0;
      if (!last || root.dataset.motion !== 'full' || root.dataset.scene !== 'inicio') return;
      let best: Element | null = null;
      let bestDistance = RADIUS;
      for (const letter of scene.querySelectorAll('h1 [data-letter]')) {
        const rect = letter.getBoundingClientRect();
        const distance = Math.hypot(
          last.clientX - (rect.left + rect.width / 2),
          last.clientY - (rect.top + rect.height / 2),
        );
        if (distance < bestDistance) {
          bestDistance = distance;
          best = letter;
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
    };

    const onPhoto = (event: PointerEvent) => {
      const photo = (event.target as Element).closest('[data-shared="photo"]');
      if (!photo || root.dataset.motion !== 'full') return;
      photo.removeAttribute('data-retape');
      void (photo as HTMLElement).offsetWidth;
      photo.setAttribute('data-retape', '');
    };

    scene.addEventListener('pointermove', onMove);
    scene.addEventListener('pointerleave', onLeave);
    scene.addEventListener('pointerdown', onPhoto);
    return () => {
      cancelAnimationFrame(frame);
      scene.removeEventListener('pointermove', onMove);
      scene.removeEventListener('pointerleave', onLeave);
      scene.removeEventListener('pointerdown', onPhoto);
    };
  }, []);

  return null;
}
