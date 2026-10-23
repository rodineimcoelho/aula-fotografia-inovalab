import { exposureStops, type Exposure } from './models.ts';
import { defocusRadius, focusPlanes, type FocusPlane } from './depth-of-field.ts';

export class ExposureScene {
  private context: CanvasRenderingContext2D;
  private background = new Image();
  private noise = document.createElement('canvas');
  private observer: ResizeObserver;
  private frameId = 0;
  private running = true;
  private start = performance.now();
  private frozenTime = 0;
  private visible = true;
  private disposed = false;
  private lastFrame = 0;
  private reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  private focus: FocusPlane = 'subject';
  private compareBlur = false;
  constructor(private canvas: HTMLCanvasElement, private value: Exposure, photo: string) {
    this.context = canvas.getContext('2d')!;
    this.background.src = photo;
    this.noise.width = 180; this.noise.height = 100;
    this.makeNoise();
    this.observer = new ResizeObserver(() => this.resize()); this.observer.observe(canvas); this.resize();
    this.running = !this.reduced;
    this.frameId = requestAnimationFrame((time) => this.frame(time));
  }
  setValue(value: Exposure) { this.value = { ...value }; this.makeNoise(); this.draw(performance.now()); }
  setFocus(plane: FocusPlane) { this.focus = plane;this.draw(performance.now()); }
  setBlurComparison(enabled: boolean) { this.compareBlur = enabled;this.draw(performance.now()); }
  pause(): boolean { this.frozenTime = this.time(performance.now()); this.running = !this.running; this.start = performance.now() - this.frozenTime; return this.running; }
  private time(now: number) { return this.running ? now - this.start : this.frozenTime; }
  private resize() {
    const box = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.max(1, Math.min(1200, Math.round(box.width * Math.min(devicePixelRatio, 1.5))));
    this.canvas.height = Math.max(1, Math.round(this.canvas.width * box.height / Math.max(1, box.width)));
    this.draw(performance.now());
  }
  private makeNoise() {
    const ctx = this.noise.getContext('2d')!; const data = ctx.createImageData(this.noise.width, this.noise.height);
    let seed = 127;
    const strength = Math.min(95, 4 + Math.sqrt(this.value.iso / 100) * 10 + Math.max(0, -this.value.light) * 5);
    for (let i = 0; i < data.data.length; i += 4) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const v = seed % 256; data.data[i] = data.data[i + 1] = data.data[i + 2] = v; data.data[i + 3] = strength;
    }
    ctx.putImageData(data, 0, 0);
  }
  private frame(now: number) {
    if (this.disposed) return;
    if (now - this.lastFrame > 40 && this.visible) { this.draw(now); this.lastFrame = now; }
    this.frameId = requestAnimationFrame(t => this.frame(t));
  }
  private draw(now: number) {
    const ctx = this.context, w = this.canvas.width, h = this.canvas.height;
    const exposure = exposureStops(this.value);
    const brightness = this.compareBlur ? 1 : Math.max(.08, Math.min(5, 2 ** exposure));
    const blur = (plane: FocusPlane) => defocusRadius(this.value.aperture,focusPlanes[this.focus],focusPlanes[plane],w);
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#283337'; ctx.fillRect(0, 0, w, h);
    ctx.save(); ctx.filter = `blur(${blur('background')*.5}px) brightness(${brightness})`;
    if (this.background.complete && this.background.naturalWidth) {
      const ratio = Math.max((w+100) / this.background.naturalWidth, (h+100) / this.background.naturalHeight);
      const dw = this.background.naturalWidth * ratio, dh = this.background.naturalHeight * ratio;
      ctx.drawImage(this.background, (w - dw) / 2, (h - dh) / 2, dw, dh);
    }
    ctx.fillStyle='#2a383e';ctx.fillRect(w*.73,h*.12,w*.2,h*.36);
    ctx.strokeStyle='#d6e0dd';ctx.lineWidth=Math.max(2,w*.003);
    for(let i=0;i<9;i++){const x=w*(.75+i*.02);ctx.beginPath();ctx.moveTo(x,h*.14);ctx.lineTo(x,h*.46);ctx.stroke();}
    ctx.fillStyle='#cf786f';ctx.fillRect(w*.73,h*.35,w*.2,h*.045);
    ctx.restore();
    ctx.save();ctx.filter=`brightness(${brightness})`;
    const bokeh = Math.max(w*.002,blur('background'));
    for(const [x,y] of [[.17,.2],[.3,.14],[.57,.22],[.66,.13]]) {
      ctx.fillStyle='#ffe4ad';ctx.globalAlpha=.62;ctx.beginPath();ctx.arc(x*w,y*h,bokeh,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#fff2d4';ctx.lineWidth=Math.max(1,w*.001);ctx.stroke();
    }
    ctx.restore();
    const phase = this.time(now) / 1800;
    const ballX = (t: number) => w * (.5 + .29 * Math.sin(t));
    const count = Math.max(1, Math.min(28, Math.ceil(this.value.shutter * 120)));
    const radius = Math.min(w * .065, h * .15);
    ctx.save(); ctx.filter = `blur(${blur('subject')*.5}px) brightness(${brightness})`;
    for (let i = count - 1; i >= 0; i--) {
      const t = phase - this.value.shutter * 3.5 * (i / count);
      const x = ballX(t), y = h * .52;
      ctx.globalAlpha = count === 1 ? 1 : .12 + .88 / count;
      ctx.fillStyle = '#d97739'; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#482b22'; ctx.lineWidth = Math.max(1, radius * .035); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - radius, y); ctx.lineTo(x + radius, y); ctx.moveTo(x, y - radius); ctx.lineTo(x, y + radius); ctx.stroke();
    }
    ctx.restore();
    ctx.save();ctx.filter=`blur(${blur('foreground')*.5}px) brightness(${brightness})`;
    ctx.fillStyle='#274653';ctx.fillRect(w*.025,h*.58,w*.075,h*.5);
    ctx.strokeStyle='#d4dfdc';ctx.lineWidth=w*.009;
    for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(w*.025,h*(.64+i*.065));ctx.lineTo(w*.1,h*(.61+i*.065));ctx.stroke();}
    ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.drawImage(this.noise, 0, 0, w, h); ctx.restore();
    ctx.save(); ctx.strokeStyle = '#efefec'; ctx.globalAlpha = .8; ctx.lineWidth = 1;
    const x = this.focus==='background'?w*.83:this.focus==='foreground'?w*.0625:ballX(phase), y = this.focus==='background'?h*.3:this.focus==='foreground'?h*.78:h*.52, d = radius * 1.5, l = radius * .35;
    for (const [sx, sy] of [[-1,-1],[1,-1],[-1,1],[1,1]]) { ctx.beginPath(); ctx.moveTo(x + sx * d, y + sy * (d - l)); ctx.lineTo(x + sx * d, y + sy * d); ctx.lineTo(x + sx * (d - l), y + sy * d); ctx.stroke(); }
    ctx.restore();
  }
  dispose() { this.disposed = true; cancelAnimationFrame(this.frameId); this.observer.disconnect(); }
}
