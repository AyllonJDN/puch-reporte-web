export const sum = (a: number[]) => a.reduce((x, y) => x + y, 0)
export const mean = (a: number[]) => sum(a) / a.length
export const median = (a: number[]) => {
  const s = [...a].sort((x, y) => x - y)
  const n = s.length
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2
}
export const stdev = (a: number[]) => {
  const u = mean(a)
  return Math.sqrt(sum(a.map((x) => (x - u) ** 2)) / (a.length - 1))
}
export const cv = (a: number[]) => (stdev(a) / mean(a)) * 100
export function corr(x: number[], y: number[]) {
  const a = mean(x)
  const b = mean(y)
  let n = 0
  let dx = 0
  let dy = 0
  x.forEach((v, i) => {
    n += (v - a) * (y[i] - b)
    dx += (v - a) ** 2
    dy += (y[i] - b) ** 2
  })
  return n / Math.sqrt(dx * dy)
}
export function linreg(x: number[], y: number[]) {
  const r = corr(x, y)
  const slope = (r * stdev(y)) / stdev(x)
  return { slope, intercept: mean(y) - slope * mean(x), r, r2: r * r }
}

/** Formato es-PE del informe: miles con punto, decimales con coma; dato faltante como "—". */
export function nf(n: number | null | undefined, d = 0) {
  if (n == null || !Number.isFinite(n)) return '—'
  return n
    .toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d })
    .replace('-', '−')
}
export const pct = (n: number | null | undefined, d = 1) => (n == null ? '—' : `${nf(n, d)} %`)

const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
export const dm = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`
export const dlong = (iso: string) => `${+iso.slice(8, 10)} ${MES[+iso.slice(5, 7) - 1]}`
export const clean = (s: string) =>
  s.replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, '').replace(/\s+/g, ' ').trim()
export const snip = (s: string) => {
  const c = clean(s)
  return c.length >= 100 ? `${c}…` : c
}
