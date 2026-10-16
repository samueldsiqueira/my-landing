'use client';

import { useEffect } from 'react';

const FRAME_MS = 1000 / 12;
/** Teto de quadros de uma alimentação: distâncias longas pulam várias linhas por quadro. */
const MAX_FEED_FRAMES = 8;
/** Um registro vira o "atual" quando seu topo passa desta fração da altura visível do papel. */
const SPY_LINE = 0.35;

const DIRS: Record<string, [number, number]> = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
};

/**
 * Alimentação do formulário contínuo. Escolher um período na régua avança o papel em saltos
 * de linhas inteiras, um salto por quadro (12 fps), até o registro; rolar o papel move o
 * alfinete para o registro à vista. Com movimento reduzido o papel vai direto. Sem JS (ou no
 * modo leitura) os períodos continuam sendo âncoras comuns para os registros.
 */
export default function ExperienceFeed() {
  useEffect(() => {
    const scene = document.getElementById('experience');
    const sheet = scene?.querySelector<HTMLElement>('[data-feed]');
    const track = scene?.querySelector<HTMLElement>('[data-track]');
    if (!scene || !sheet || !track) return;
    const root = document.documentElement;
    const links = Array.from(track.querySelectorAll<HTMLAnchorElement>('a[data-job]'));
    const records = links.map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))));
    if (!links.length || records.some((record) => !record)) return;

    let current = Math.max(0, links.findIndex((link) => link.hasAttribute('aria-current')));
    let timer = 0;
    let feeding = false;
    let spyFrame = 0;

    const staged = () => root.dataset.mode === 'stage';
    const moving = () => root.dataset.motion === 'full';
    const scrolls = () =>
      getComputedStyle(sheet).overflowY !== 'visible' && sheet.scrollHeight > sheet.clientHeight + 1;
    const lineHeight = () => parseFloat(getComputedStyle(sheet).getPropertyValue('--lh')) || 24;
    const maxScroll = () => Math.max(0, sheet.scrollHeight - sheet.clientHeight);
    const topOf = (i: number) => records[i]!.offsetTop - records[0]!.offsetTop;

    const mark = (i: number) => {
      if (i === current && links[i].hasAttribute('aria-current')) return;
      links.forEach((link, k) => {
        if (k === i) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
      current = i;
    };

    const stop = () => {
      window.clearTimeout(timer);
      timer = 0;
      feeding = false;
      delete sheet.dataset.feeding;
    };

    /** Avança (ou recua) o papel até `target` em saltos de linhas inteiras, um por quadro. */
    const feedTo = (target: number) => {
      stop();
      const start = sheet.scrollTop;
      const end = Math.round(Math.max(0, Math.min(maxScroll(), target)));
      const lh = lineHeight();
      const lines = Math.round(Math.abs(end - start) / lh);
      if (!moving() || lines < 1) {
        sheet.scrollTop = end;
        return;
      }
      const frames = Math.min(lines, MAX_FEED_FRAMES);
      const dir = Math.sign(end - start);
      let k = 0;
      feeding = true;
      const step = () => {
        k += 1;
        const t = k / frames;
        const eased = t * t * (3 - 2 * t);
        sheet.scrollTop = k === frames ? end : start + dir * Math.round(lines * eased) * lh;
        sheet.dataset.feeding = k % 2 ? 'odd' : 'even';
        // Um quadro extra parado antes de devolver o alfinete ao acompanhamento da rolagem.
        timer = window.setTimeout(k < frames ? step : stop, FRAME_MS);
      };
      step();
    };

    const select = (i: number) => {
      track.dataset.picked = '';
      mark(i);
      if (scrolls()) feedTo(topOf(i));
    };

    /** O vizinho mais próximo na direção da seta, pela geometria (régua vertical ou horizontal). */
    const neighbour = (i: number, [dx, dy]: [number, number]) => {
      const center = (el: Element) => {
        const rect = el.getBoundingClientRect();
        return [rect.left + rect.width / 2, rect.top + rect.height / 2];
      };
      const [cx, cy] = center(links[i]);
      let best = -1;
      let bestDistance = Infinity;
      links.forEach((link, k) => {
        if (k === i) return;
        const [x, y] = center(link);
        const along = (x - cx) * dx + (y - cy) * dy;
        if (along <= 1) return;
        const distance = Math.hypot(x - cx, y - cy);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = k;
        }
      });
      return best;
    };

    const onTrackClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[data-job]');
      if (!link || !staged()) return;
      event.preventDefault();
      select(links.indexOf(link));
    };

    const onTrackKey = (event: KeyboardEvent) => {
      if (!staged() || event.altKey || event.ctrlKey || event.metaKey) return;
      const i = links.indexOf(event.target as HTMLAnchorElement);
      if (i < 0) return;
      let to = -1;
      if (event.key === 'Home') to = 0;
      else if (event.key === 'End') to = links.length - 1;
      else if (DIRS[event.key]) to = neighbour(i, DIRS[event.key]);
      else return;
      event.preventDefault();
      if (to < 0 || to === i) return;
      links[to].focus();
      select(to);
    };

    /** Papel com foco: setas = uma linha; PgDn/Espaço = próximo registro; Home/End = pontas. */
    const onSheetKey = (event: KeyboardEvent) => {
      if (event.target !== sheet || !staged() || !scrolls()) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const top = sheet.scrollTop;
      const max = maxScroll();
      const lh = lineHeight();
      let dir = 0;
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowUp': {
          dir = event.key === 'ArrowDown' ? 1 : -1;
          if (dir > 0 ? top >= max - 1 : top <= 0) return; // na borda: a cena decide
          event.preventDefault();
          stop();
          sheet.scrollTop = top + dir * lh;
          return;
        }
        case 'PageDown':
        case 'PageUp':
        case ' ': {
          dir = event.key === 'PageUp' || (event.key === ' ' && event.shiftKey) ? -1 : 1;
          if (dir > 0 ? top >= max - 1 : top <= 0) return;
          event.preventDefault();
          const tops = records.map((_, k) => topOf(k));
          const next =
            dir > 0 ? tops.findIndex((y) => y > top + 1) : tops.findLastIndex((y) => y < top - 1);
          if (next >= 0) select(next);
          else feedTo(dir > 0 ? max : 0);
          return;
        }
        case 'Home':
        case 'End':
          event.preventDefault();
          select(event.key === 'Home' ? 0 : records.length - 1);
          return;
      }
    };

    const spy = () => {
      spyFrame = 0;
      if (feeding || !scrolls()) return;
      const line = sheet.scrollTop + sheet.clientHeight * SPY_LINE;
      let i = 0;
      records.forEach((_, k) => {
        if (topOf(k) <= line) i = k;
      });
      if (sheet.scrollTop >= maxScroll() - 2) i = records.length - 1;
      if (i !== current) {
        track.dataset.picked = '';
        mark(i);
      }
    };

    const onScroll = () => {
      if (!spyFrame) spyFrame = requestAnimationFrame(spy);
    };

    // Qualquer gesto no papel interrompe a alimentação em curso.
    const interrupt = () => {
      if (feeding) stop();
    };

    /**
     * O papel só entra na ordem de Tab quando rola (teclado consegue rolar). Só mede com a cena
     * em quadro: fora dela o navegador não faz o layout (content-visibility) e medir o forçaria.
     */
    const syncFocusable = () => {
      if (staged() && root.dataset.scene === 'experience' && scrolls()) sheet.tabIndex = 0;
      else sheet.removeAttribute('tabindex');
    };

    // Ao sair da cena, a próxima entrada volta a cravar o alfinete com a coreografia de entrada.
    const observer = new MutationObserver(() => {
      if (root.dataset.scene !== 'experience') {
        delete track.dataset.picked;
        stop();
      }
      syncFocusable();
    });
    observer.observe(root, { attributes: true, attributeFilter: ['data-scene'] });

    const resize = new ResizeObserver(syncFocusable);
    resize.observe(sheet);
    syncFocusable();

    track.addEventListener('click', onTrackClick);
    track.addEventListener('keydown', onTrackKey);
    sheet.addEventListener('keydown', onSheetKey);
    sheet.addEventListener('scroll', onScroll, { passive: true });
    sheet.addEventListener('wheel', interrupt, { passive: true });
    sheet.addEventListener('touchstart', interrupt, { passive: true });
    sheet.addEventListener('pointerdown', interrupt, { passive: true });
    return () => {
      stop();
      cancelAnimationFrame(spyFrame);
      observer.disconnect();
      resize.disconnect();
      track.removeEventListener('click', onTrackClick);
      track.removeEventListener('keydown', onTrackKey);
      sheet.removeEventListener('keydown', onSheetKey);
      sheet.removeEventListener('scroll', onScroll);
      sheet.removeEventListener('wheel', interrupt);
      sheet.removeEventListener('touchstart', interrupt);
      sheet.removeEventListener('pointerdown', interrupt);
    };
  }, []);

  return null;
}
