export const apertures = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
export const shutters = [1 / 4000, 1 / 2000, 1 / 1000, 1 / 500, 1 / 250, 1 / 125, 1 / 60, 1 / 30, 1 / 15, 1 / 8, 1 / 4, 1 / 2, 1];
export const sensitivities = [100, 200, 400, 800, 1600, 3200, 6400];
export type Exposure = { aperture: number; shutter: number; iso: number; light: number };
export const defaultExposure: Exposure = { aperture: 5.6, shutter: 1 / 250, iso: 400, light: 0 };
export function captureFactors(value: Exposure) {
  const light = (defaultExposure.aperture/value.aperture)**2 * value.shutter/defaultExposure.shutter;
  const gain = value.iso/defaultExposure.iso;
  return { light, gain, signal: light*gain };
}
export function exposureStops(value: Exposure): number {
  return Math.log2((value.shutter / defaultExposure.shutter) * (defaultExposure.aperture / value.aperture) ** 2 * value.iso / defaultExposure.iso) + value.light;
}
export function formatShutter(seconds: number): string {
  return seconds >= 1 ? `${seconds.toLocaleString('pt-BR')} s` : `1/${Math.round(1 / seconds)} s`;
}
export function meterLabel(stops: number): string {
  return `${stops > 0 ? '+' : ''}${stops.toFixed(1).replace('.', ',')} EV`;
}
export function remainingSeconds(endTime: number, now: number): number {
  return Math.max(0, Math.ceil((endTime - now) / 1000));
}
export function timerText(seconds: number): string {
  return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
}
export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
}
export function safeUrl(value: string): string | null {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; }
}
