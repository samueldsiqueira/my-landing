// Máquina de cenas, sem React. A fonte de verdade são os atributos do <html>
// (data-scene, data-mode, data-motion...), definidos primeiro pelo script de boot e depois
// por esta máquina; o CSS reage a eles e o React apenas os lê (useSyncExternalStore).
import { scenes, type SceneId } from '@/content/profile';

export type Mode = 'stage' | 'read';
export type Motion = 'full' | 'reduced';
export type InputSource = 'wheel' | 'key' | 'touch' | 'click' | 'hash';
type Phase = 'idle' | 'exiting' | 'entering';

export const sceneIds = scenes.map((scene) => scene.id) as SceneId[];
const aliases: Record<string, SceneId> = Object.fromEntries(scenes.map((scene) => [scene.alias, scene.id]));
const last = sceneIds.length - 1;

const FRAME_MS = 1000 / 12;
const EXIT_CAP_MS = 700;
const WHEEL_THRESHOLD = 40;
const WHEEL_GESTURE_GAP = 240;
const SWIPE_MIN = 56;

const state = {
  cur: 0,
  phase: 'idle' as Phase,
  queued: null as number | null,
  token: 0,
  entering: [] as Animation[],
  initialized: false,
};

const html = () => document.documentElement;
export const readMode = (): Mode => (html().dataset.mode === 'stage' ? 'stage' : 'read');
export const readMotion = (): Motion => (html().dataset.motion === 'reduced' ? 'reduced' : 'full');
const sceneEl = (id: SceneId) => document.getElementById(id);

/** Transições que ganham a sombra da mão cruzando o set. */
const handOn = (from: SceneId, to: SceneId) =>
  to === 'contact' || (from === 'inicio' && to === 'about') || (from === 'contact' && to === 'inicio');

const finiteAnimations = (root: Element) =>
  root
    .getAnimations({ subtree: true })
    .filter((animation) => animation.effect?.getComputedTiming().endTime !== Infinity);

const settle = (animations: Animation[], capMs?: number) => {
  const all = Promise.all(animations.map((animation) => animation.finished.catch(() => undefined)));
  if (!capMs) return all;
  return Promise.race([all, new Promise((resolve) => setTimeout(resolve, capMs))]);
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** True se algum elemento rolável entre o alvo e a cena ainda pode rolar na direção pedida. */
export const canScrollInside = (target: EventTarget | null, dir: number) => {
  let el = target instanceof Element ? target : null;
  while (el && !el.classList.contains('scene')) {
    if (el instanceof HTMLElement) {
      const { overflowY } = getComputedStyle(el);
      if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 1) {
        if (dir > 0 && Math.ceil(el.scrollTop + el.clientHeight) < el.scrollHeight - 1) return true;
        if (dir < 0 && el.scrollTop > 0) return true;
      }
    }
    el = el.parentElement;
  }
  return false;
};

export const resolveTarget = (target: number | string): number | null => {
  if (typeof target === 'number') return Math.max(0, Math.min(last, target));
  const id = (aliases[target] ?? target) as SceneId;
  const index = sceneIds.indexOf(id);
  return index >= 0 ? index : null;
};

/** A área da cena só entra na ordem de Tab quando de fato rola (teclado consegue rolar). */
const syncScrollable = (id: SceneId) => {
  const scroller = sceneEl(id)?.querySelector<HTMLElement>('.scene-scroll');
  if (!scroller) return;
  if (scroller.scrollHeight > scroller.clientHeight + 1) scroller.tabIndex = 0;
  else scroller.removeAttribute('tabindex');
};

const announce = (index: number) => {
  const live = document.getElementById('stage-live');
  if (live) live.textContent = `${scenes[index].label}, cena ${index + 1} de ${sceneIds.length}`;
};

const markSeen = (id: SceneId) => {
  const seen = new Set((html().dataset.seen ?? '').split(' ').filter(Boolean));
  if (seen.has(id)) return;
  seen.add(id);
  const value = Array.from(seen).join(' ');
  html().dataset.seen = value;
  try {
    sessionStorage.setItem('stage:seen', value);
  } catch {
    // Armazenamento indisponível (aba privada): a abertura apenas não encurta.
  }
};

const replayHand = () => {
  const root = html();
  root.removeAttribute('data-hand');
  void root.offsetWidth;
  root.dataset.hand = 'move';
};

/** Completa a coreografia de entrada em curso (pular). */
export const finishEnter = () => {
  state.entering.forEach((animation) => {
    try {
      animation.finish();
    } catch {
      // Animação já removida.
    }
  });
  state.entering = [];
};

const trackEnter = async (id: SceneId, run: number) => {
  const el = sceneEl(id);
  if (!el) return;
  state.phase = 'entering';
  state.entering = readMotion() === 'full' ? finiteAnimations(el) : [];
  // Já há outra navegação pedida: não faz o visitante esperar a entrada inteira desta cena.
  if (state.queued !== null) finishEnter();
  await settle(state.entering);
  if (state.token !== run) return;
  state.entering = [];
  state.phase = 'idle';
  const next = state.queued;
  state.queued = null;
  if (next !== null && next !== state.cur) go(next, 'click');
};

interface ArriveOptions {
  dir: number;
  source: InputSource;
  moveFocus: boolean;
  shared: Map<string, DOMRect>;
  run: number;
}

/** Troca a cena visível e cuida de tudo que acompanha a chegada (FLIP, foco, URL, anúncio). */
const arrive = async (to: number, { dir, source, moveFocus, shared, run }: ArriveOptions) => {
  const root = html();
  const toId = sceneIds[to];
  const toEl = sceneEl(toId);
  if (!toEl) return;
  root.dataset.scene = toId;
  state.cur = to;

  if (readMotion() === 'full' && shared.size) {
    toEl.querySelectorAll<HTMLElement>('[data-shared]').forEach((el) => {
      const origin = shared.get(el.dataset.shared!);
      el.removeAttribute('data-flip');
      if (!origin) return;
      const rect = el.getBoundingClientRect();
      if (!rect.width) return;
      el.style.setProperty('--flip-x', `${origin.left + origin.width / 2 - (rect.left + rect.width / 2)}px`);
      el.style.setProperty('--flip-y', `${origin.top + origin.height / 2 - (rect.top + rect.height / 2)}px`);
      el.style.setProperty('--flip-s', String(origin.width / rect.width));
      void el.offsetWidth;
      el.setAttribute('data-flip', '');
    });
  } else {
    toEl.querySelectorAll('[data-flip]').forEach((el) => el.removeAttribute('data-flip'));
  }

  const scroller = toEl.querySelector<HTMLElement>('.scene-scroll');
  if (scroller) scroller.scrollTop = dir > 0 || source !== 'wheel' ? 0 : scroller.scrollHeight;
  syncScrollable(toId);

  announce(to);
  if (moveFocus) toEl.querySelector<HTMLElement>('[data-scene-heading]')?.focus({ preventScroll: true });
  const base = `${location.pathname}${location.search}`;
  history.replaceState(null, '', to === 0 ? base : `${base}#${toId}`);

  await trackEnter(toId, run);
};

const transition = async (to: number, source: InputSource) => {
  const run = ++state.token;
  const from = state.cur;
  const fromId = sceneIds[from];
  const toId = sceneIds[to];
  const fromEl = sceneEl(fromId);
  if (!fromEl || !sceneEl(toId)) return;

  const root = html();
  const full = readMotion() === 'full';
  const dir = to > from ? 1 : -1;
  root.dataset.dir = String(dir);
  state.phase = 'exiting';

  const active = document.activeElement;
  const moveFocus = !active || active === document.body || fromEl.contains(active);

  // Peças compartilhadas: mede onde estão antes de a cena sair.
  const shared = new Map<string, DOMRect>();
  if (full) {
    fromEl.querySelectorAll<HTMLElement>('[data-shared]').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width && rect.height) shared.set(el.dataset.shared!, rect);
    });
  }

  markSeen(fromId);

  if (full) {
    if (handOn(fromId, toId)) replayHand();
    fromEl.setAttribute('data-leaving', '');
    root.dataset.leaving = fromId;
    await settle(finiteAnimations(fromEl), EXIT_CAP_MS);
    if (state.token !== run) return;
  }

  fromEl.removeAttribute('data-leaving');
  delete root.dataset.leaving;
  await arrive(to, { dir, source, moveFocus, shared, run });
};

export function go(target: number | SceneId, source: InputSource = 'click') {
  const to = resolveTarget(target);
  if (to === null) return;
  if (readMode() !== 'stage') {
    sceneEl(sceneIds[to])?.scrollIntoView({ behavior: readMotion() === 'full' ? 'smooth' : 'auto' });
    return;
  }
  if (state.phase === 'exiting') {
    state.queued = to;
    return;
  }
  if (state.phase === 'entering') finishEnter();
  if (to === state.cur) return;
  void transition(to, source);
}

export const next = (source: InputSource = 'click') => go(state.cur + 1, source);
export const prev = (source: InputSource = 'click') => go(state.cur - 1, source);

/** Rebobinar: as cenas passam de trás para frente, dois quadros cada, sem coreografia. */
export async function rewind() {
  if (readMode() !== 'stage' || readMotion() !== 'full' || state.phase !== 'idle' || state.cur === 0) {
    go(0);
    return;
  }
  const root = html();
  const run = ++state.token;
  state.phase = 'exiting';
  markSeen(sceneIds[state.cur]);
  root.dataset.rewind = '';
  root.dataset.dir = '-1';
  for (let i = state.cur - 1; i >= 1; i--) {
    root.dataset.scene = sceneIds[i];
    await wait(FRAME_MS * 2);
    if (state.token !== run) return;
  }
  delete root.dataset.rewind;
  const active = document.activeElement;
  const moveFocus = !active || active === document.body || !!active.closest('.scene');
  await arrive(0, { dir: -1, source: 'click', moveFocus, shared: new Map(), run });
}

export function setMotion(value: Motion) {
  html().dataset.motion = value;
  try {
    localStorage.setItem('stage:motion', value);
  } catch {
    // Sem armazenamento: vale só para esta visita.
  }
  if (value === 'reduced') finishEnter();
}

/** Lê o estado que o boot decidiu e acompanha a entrada da primeira cena. Idempotente. */
export function init() {
  if (state.initialized) return;
  state.initialized = true;
  const root = html();
  state.cur = Math.max(0, sceneIds.indexOf(root.dataset.scene as SceneId));
  delete root.dataset.boot;
  document.addEventListener('animationend', (event) => {
    if (event.animationName === 'hand-sweep') root.removeAttribute('data-hand');
  });
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => syncScrollable(sceneIds[state.cur]), 150);
  });
  syncScrollable(sceneIds[state.cur]);
  if (readMode() === 'stage') void trackEnter(sceneIds[state.cur], state.token);
}

/** Entradas do palco: roda (por intenção), toque, teclado e hash. Retorna a limpeza. */
export function attachInputs() {
  const wheel = { acc: 0, last: 0, locked: false, scrolling: false };
  let touch: { x: number; y: number; up: boolean; down: boolean; ignore: boolean } | null = null;

  const activeScroller = () => sceneEl(sceneIds[state.cur])?.querySelector<HTMLElement>('.scene-scroll') ?? null;
  const dialogOpen = () => !!document.querySelector('dialog[open]');

  const onWheel = (event: WheelEvent) => {
    if (event.ctrlKey || dialogOpen()) return;
    const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    const dy = event.deltaY * scale;
    const dx = event.deltaX * scale;
    const gap = event.timeStamp - wheel.last;
    wheel.last = event.timeStamp;
    if (Math.abs(dx) > Math.abs(dy) || !dy) return;
    const dir = dy > 0 ? 1 : -1;
    if (gap > WHEEL_GESTURE_GAP) {
      wheel.acc = 0;
      wheel.scrolling = false;
      if (state.phase !== 'exiting') wheel.locked = false;
    }
    if (wheel.locked || wheel.scrolling) return;
    if ((event.target as Element | null)?.closest?.('[data-wheel-capture]')) return;
    if (canScrollInside(event.target, dir)) {
      // O gesto pertence à rolagem interna; a troca de cena espera um gesto novo.
      wheel.scrolling = true;
      return;
    }
    wheel.acc += dy;
    if (Math.abs(wheel.acc) >= WHEEL_THRESHOLD) {
      wheel.acc = 0;
      wheel.locked = true;
      go(state.cur + dir, 'wheel');
    }
  };

  const onTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 1) {
      touch = null;
      return;
    }
    const t = event.touches[0];
    touch = {
      x: t.clientX,
      y: t.clientY,
      up: canScrollInside(event.target, -1),
      down: canScrollInside(event.target, 1),
      ignore: !!(event.target as Element | null)?.closest?.('[data-swipe-capture], dialog'),
    };
  };

  const onTouchEnd = (event: TouchEvent) => {
    const start = touch;
    touch = null;
    if (!start || start.ignore) return;
    const t = event.changedTouches[0];
    const dy = start.y - t.clientY;
    const dx = start.x - t.clientX;
    if (Math.abs(dy) < SWIPE_MIN || Math.abs(dy) < Math.abs(dx) * 1.3) return;
    const dir = dy > 0 ? 1 : -1;
    if (dir > 0 ? start.down : start.up) return;
    go(state.cur + dir, 'touch');
  };

  const onPointerDown = () => {
    if (state.phase === 'entering') finishEnter();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target as HTMLElement;
    if (target.closest?.('input, textarea, select, [contenteditable="true"], dialog')) return;
    const arrows = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (target.closest?.('[data-keys-capture]') && arrows.includes(event.key)) return;

    let dir = 0;
    let jump: number | null = null;
    switch (event.key) {
      case 'ArrowDown':
      case 'PageDown':
        dir = 1;
        break;
      case 'ArrowUp':
      case 'PageUp':
        dir = -1;
        break;
      case ' ':
        if (target.closest?.('button, a, summary, [role="button"]')) return;
        dir = event.shiftKey ? -1 : 1;
        break;
      case 'Home':
        jump = 0;
        break;
      case 'End':
        jump = last;
        break;
      case 'Escape':
        if (state.phase === 'entering') finishEnter();
        return;
      default:
        if (/^[1-9]$/.test(event.key) && Number(event.key) <= sceneIds.length) jump = Number(event.key) - 1;
    }

    if (jump !== null) {
      event.preventDefault();
      go(jump, 'key');
      return;
    }
    if (!dir) return;
    event.preventDefault();
    // Em telas baixas a cena rola por dentro: primeiro rola o conteúdo, depois troca de cena.
    const scroller = activeScroller();
    if (scroller && canScrollInside(scroller, dir)) {
      const page = event.key === 'ArrowDown' || event.key === 'ArrowUp' ? 80 : scroller.clientHeight * 0.85;
      scroller.scrollBy({ top: dir * page, behavior: readMotion() === 'full' ? 'smooth' : 'auto' });
      return;
    }
    go(state.cur + dir, 'key');
  };

  const onHash = () => {
    const target = resolveTarget(decodeURIComponent(location.hash.slice(1)) || sceneIds[0]);
    if (target !== null) go(target, 'hash');
  };

  window.addEventListener('wheel', onWheel, { passive: true });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('hashchange', onHash);
  return () => {
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('hashchange', onHash);
  };
}

/** Ganchos de QA (?qa=1): navegação e congelamento determinístico de quadros. */
export function enableQa() {
  const qa = {
    go: (target: number | SceneId) => go(target, 'click'),
    finish: finishEnter,
    phase: () => state.phase,
    /** Congela todas as animações do documento no instante `ms` após o início de cada uma. */
    seek: (ms: number) =>
      document.getAnimations().forEach((animation) => {
        animation.pause();
        animation.currentTime = ms;
      }),
    play: () => document.getAnimations().forEach((animation) => animation.play()),
  };
  (window as unknown as { __stage: typeof qa }).__stage = qa;
}
