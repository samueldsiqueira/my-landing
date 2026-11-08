'use client';

import { useEffect, useRef, useState } from 'react';

type Status = 'idle' | 'copied' | 'failed';

/** Tempo que o aviso "E-mail copiado" fica na tela. */
const NOTICE_MS = 4000;

/**
 * "Copiar e-mail": copia o endereço e mostra um aviso de item obtido; o anúncio para leitores
 * de tela vai numa região polida (cada cópia gera um texto novo, para ser anunciada de novo).
 * Sem JS o botão não aparece (CSS): o endereço continua visível no pergaminho de e-mail.
 */
export default function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [count, setCount] = useState(0);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(email);
      setStatus('copied');
      setCount((n) => n + 1);
      timer.current = window.setTimeout(() => setStatus('idle'), NOTICE_MS);
    } catch {
      setStatus('failed');
      setCount((n) => n + 1);
    }
  };

  return (
    <div className="g-copywrap">
      <button type="button" className="g-button g-button-small" onClick={copy}>
        Copiar e-mail
      </button>
      {status === 'copied' && (
        <span key={count} className="g-toast" aria-hidden="true">
          ✦ E-mail copiado!
        </span>
      )}
      <span className={status === 'failed' ? 'g-copyfail' : 'sr-only'} role="status">
        {status === 'copied' && (count % 2 ? 'E-mail copiado.' : 'E-mail copiado novamente.')}
        {status === 'failed' && 'Não deu para copiar: o endereço está no pergaminho de e-mail.'}
      </span>
    </div>
  );
}
