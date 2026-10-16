'use client';

import { useEffect, useRef, useState } from 'react';
import paper from '@/components/paper/paper.module.css';
import s from './Contact.module.css';

type Status = 'idle' | 'copied' | 'failed';

/** Tempo que a etiqueta "E-mail copiado" fica na mesa. */
const LABEL_MS = 4000;

/**
 * "Copiar e-mail": copia o endereço e a rotuladora perfura a confirmação ao lado do botão.
 * O anúncio para leitores de tela vai numa região polida. Sem JS o botão não aparece (CSS):
 * o endereço continua visível no bilhete de e-mail.
 */
export default function ContactCopy({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [punch, setPunch] = useState(0);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(email);
      setStatus('copied');
      // Nova chave a cada clique: a etiqueta é perfurada de novo.
      setPunch((n) => n + 1);
      timer.current = window.setTimeout(() => setStatus('idle'), LABEL_MS);
    } catch {
      setStatus('failed');
    }
  };

  return (
    <div className={s.copyWrap}>
      <button type="button" className={s.copyButton} onClick={copy}>
        Copiar e-mail
      </button>
      {status === 'copied' && (
        // A etiqueta Dymo do kit (só a classe: o kit inteiro puxaria next/image para o cliente).
        <span key={punch} className={`${paper.dymo} ${s.copied}`} aria-hidden="true">
          E-mail copiado
        </span>
      )}
      <span className={status === 'failed' ? s.copyFail : 'sr-only'} role="status">
        {status === 'copied' && 'E-mail copiado.'}
        {status === 'failed' && 'Não deu para copiar: o endereço está no bilhete de e-mail.'}
      </span>
    </div>
  );
}
