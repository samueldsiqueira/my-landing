// Ganchos de QA expostos com ?qa=1 (src/components/stage/machine.ts, enableQa).
export {};

declare global {
  interface Window {
    __stage?: {
      go: (target: number | string) => void;
      finish: () => void;
      phase: () => 'idle' | 'exiting' | 'entering';
      seek: (ms: number) => void;
      play: () => void;
    };
  }
}
