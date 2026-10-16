'use client';

import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useSyncExternalStore } from 'react';
import type { SceneId } from '@/content/profile';
import * as machine from './machine';

interface StageApi {
  index: number;
  sceneId: SceneId;
  mode: machine.Mode;
  motion: machine.Motion;
  go: typeof machine.go;
  next: typeof machine.next;
  prev: typeof machine.prev;
  rewind: typeof machine.rewind;
  setMotion: typeof machine.setMotion;
}

const StageContext = createContext<StageApi | null>(null);

export const useStage = () => {
  const ctx = useContext(StageContext);
  if (!ctx) throw new Error('useStage precisa estar dentro de <Director>');
  return ctx;
};

// Os atributos do <html> são um estado externo: o React só os observa.
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-scene', 'data-mode', 'data-motion'],
  });
  return () => observer.disconnect();
};

const useHtmlData = (read: () => string, server: string) => useSyncExternalStore(subscribe, read, () => server);

const readScene = () => document.documentElement.dataset.scene ?? 'inicio';

export function Director({ children }: { children: React.ReactNode }) {
  const sceneId = useHtmlData(readScene, 'inicio') as SceneId;
  const mode = useHtmlData(machine.readMode, 'read') as machine.Mode;
  const motion = useHtmlData(machine.readMotion, 'full') as machine.Motion;

  useLayoutEffect(() => {
    machine.init();
  }, []);

  useEffect(() => (mode === 'stage' ? machine.attachInputs() : undefined), [mode]);

  useEffect(() => {
    if (new URLSearchParams(location.search).has('qa')) machine.enableQa();
  }, []);

  const api = useMemo<StageApi>(
    () => ({
      index: Math.max(0, machine.sceneIds.indexOf(sceneId)),
      sceneId,
      mode,
      motion,
      go: machine.go,
      next: machine.next,
      prev: machine.prev,
      rewind: machine.rewind,
      setMotion: machine.setMotion,
    }),
    [sceneId, mode, motion],
  );

  return <StageContext.Provider value={api}>{children}</StageContext.Provider>;
}
