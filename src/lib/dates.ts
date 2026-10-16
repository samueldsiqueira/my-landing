const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** Mês corrente no formato AAAA-MM (calculado no servidor e repassado aos componentes). */
export const currentMonth = (date = new Date()) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;

const parse = (month: string) => {
  const [year, m] = month.split('-').map(Number);
  return { year, month: m };
};

/** Índice absoluto em meses, útil para posicionar períodos numa régua. */
export const monthIndex = (month: string) => {
  const { year, month: m } = parse(month);
  return year * 12 + (m - 1);
};

/** "nov/2024" */
export const formatMonth = (month: string) => {
  const { year, month: m } = parse(month);
  return `${MONTHS[m - 1]}/${year}`;
};

/** Duração inclusiva, como no LinkedIn: "1 ano e 11 meses", "4 anos e 8 meses", "2 anos". */
export const formatDuration = (start: string, end: string) => {
  const total = monthIndex(end) - monthIndex(start) + 1;
  const years = Math.floor(total / 12);
  const months = total % 12;
  const y = years ? `${years} ${years === 1 ? 'ano' : 'anos'}` : '';
  const m = months ? `${months} ${months === 1 ? 'mês' : 'meses'}` : '';
  return [y, m].filter(Boolean).join(' e ') || '1 mês';
};
