'use client';

import { useEffect } from 'react';

/**
 * Deleite da cena Carimbos: clicar ou tocar numa impressão (ou no carimbo do responsável)
 * faz o carimbo bater nela de novo — sobe, bate com a ficha tremendo, sai (3 quadros, CSS).
 * Nenhuma informação depende disso; nada acontece com movimento reduzido nem fora do palco.
 */
export default function SkillsStampTap() {
  useEffect(() => {
    const scene = document.getElementById('skills');
    const frame = scene?.querySelector<HTMLElement>('[data-stamp-frame]');
    const form = frame?.querySelector<HTMLElement>('[data-stamp-form]');
    const stamp = form?.querySelector<HTMLElement>('[data-tap-stamp]');
    if (!scene || !frame || !form || !stamp) return;
    const root = document.documentElement;

    const onClick = (event: MouseEvent) => {
      if (root.dataset.mode !== 'stage' || root.dataset.motion !== 'full') return;
      if (root.dataset.scene !== 'skills' || root.dataset.leaving) return;
      const mark = (event.target as Element).closest('[data-slot], [data-owner]')?.querySelector<HTMLElement>('[data-mark]');
      if (!mark) return;
      // Posição dentro da ficha pela cadeia de offsets: ignora o giro e o tremor da folha.
      let x = mark.offsetWidth / 2;
      let y = mark.offsetHeight;
      for (let el: HTMLElement | null = mark; el && el !== form; el = el.offsetParent as HTMLElement | null) {
        x += el.offsetLeft;
        y += el.offsetTop;
      }
      stamp.style.setProperty('--tx', `${Math.round(x)}px`);
      stamp.style.setProperty('--ty', `${Math.round(y)}px`);
      frame.removeAttribute('data-tap');
      void frame.offsetWidth;
      frame.setAttribute('data-tap', '');
    };

    // Ao terminar, limpa o gatilho para que nada se repita ao voltar à cena.
    const onEnd = (event: AnimationEvent) => {
      if (event.target === stamp) frame.removeAttribute('data-tap');
    };

    scene.addEventListener('click', onClick);
    stamp.addEventListener('animationend', onEnd);
    return () => {
      scene.removeEventListener('click', onClick);
      stamp.removeEventListener('animationend', onEnd);
    };
  }, []);

  return null;
}
