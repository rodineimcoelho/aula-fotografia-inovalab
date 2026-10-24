import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { captureFactors, defaultExposure, type Exposure } from './models.ts';

export type CameraFrame = { phase: 'closed' | 'exposing' | 'complete'; progress: number; light: number; gain: number };
export type CameraDemoOptions = { decorative?: boolean; pixelRatio?: number; autoRotate?: boolean };

export const cameraParts = [
  { id: 'lens', name: 'Lente', text: 'Direciona a luz e forma a imagem. O foco muda quais planos aparecem nítidos.' },
  { id: 'aperture', name: 'Diafragma', text: 'Muda o tamanho da abertura. Abertura e distância de foco influenciam a profundidade de campo.' },
  { id: 'shutter', name: 'Obturador', text: 'Determina o tempo de registro. Aqui há cortinas mecânicas; também existem obturadores eletrônicos.' },
  { id: 'sensor', name: 'Sensor', text: 'Transforma a luz recebida em sinais elétricos. O processamento transforma esses dados em uma imagem.' },
];

export class CameraDemo {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(36, 1, .1, 60);
  private controls: OrbitControls;
  private observer: ResizeObserver;
  private parts = new Map<string, THREE.Group>();
  private targets = new Map<string, number>();
  private body: THREE.Group;
  private sensorMaterial = new THREE.MeshStandardMaterial({ color: '#7789a5', metalness: .65, roughness: .26 });
  private curtain: THREE.Mesh;
  private shutterCurtains = new THREE.Group();
  private iris: THREE.Mesh;
  private irisBlades: THREE.Mesh[] = [];
  private exposureSeconds = 1 / 250;
  private shotDuration = 1200;
  private value: Exposure = { ...defaultExposure };
  private apertureRadius = .31;
  private sensorTexture: THREE.DataTexture;
  private lastSignalUpdate = 0;
  private photons: THREE.Mesh[] = [];
  private explode = 0;
  private shot = -1;
  private selected = 'lens';
  private highlighting = false;
  private readonly highlightScale = 1.4;
  private surfaceMaterials: { material: THREE.MeshStandardMaterial; part: string; color: THREE.Color; emissive: THREE.Color; intensity: number }[] = [];
  private outline?: LineSegments2;
  private outlineMaterial = new LineMaterial({ color: '#efefec', linewidth: 3, depthWrite: false, toneMapped: false });
  private overviewDirection = new THREE.Vector3(9,1.8,7).normalize();
  private disposed = false;
  private reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  private decorative = false;
  private lastDecorativeFrame = 0;
  private animationRunning = true;
  private fitting = false;
  private fitPosition = new THREE.Vector3();
  private fitTarget = new THREE.Vector3();
  private shifts: Record<string, number> = { lens: 4.1, aperture: 2.4, shutter: 1.1, sensor: 0 };

  constructor(private host: HTMLElement, private onSelect: (id: string) => void, private onFrame: (frame: CameraFrame) => void = ()=>{}, options: CameraDemoOptions = {}) {
    this.decorative = options.decorative ?? false;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, options.pixelRatio ?? 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor('#151618', 0);
    this.renderer.domElement.setAttribute('role', 'img');
    this.renderer.domElement.setAttribute('aria-label', 'Câmera digital esquemática em três dimensões. Use os botões abaixo para selecionar suas peças.');
    host.append(this.renderer.domElement);
    this.camera.position.set(9, 1.8, 8.4);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 1.4);
    this.controls.enablePan = false;
    this.controls.enableDamping = !this.reduced;
    this.controls.autoRotate = options.autoRotate ?? false;
    this.controls.autoRotateSpeed = .45;
    this.controls.minDistance = 7;
    this.controls.maxDistance = 17;
    this.controls.maxPolarAngle = Math.PI * .8;
    this.controls.addEventListener('start', () => { this.fitting = false; });
    this.controls.addEventListener('end',()=>{
      const direction=this.camera.position.clone().sub(this.controls.target).normalize();
      this.overviewDirection.copy(direction);
    });
    this.scene.add(new THREE.HemisphereLight('#d5e7fa', '#30252c', 2.4));
    const key = new THREE.DirectionalLight('#ffffff', 3.2);
    key.position.set(3, 6, 8); this.scene.add(key);
    const rim = new THREE.DirectionalLight('#cf786f', 2);
    rim.position.set(-5, 2, -2); this.scene.add(rim);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: '#43474d', metalness: .6, roughness: .35 });
    const rubber = new THREE.MeshStandardMaterial({ color: '#23272b', roughness: .85 });
    const steel = new THREE.MeshStandardMaterial({ color: '#a2a5a8', metalness: .8, roughness: .28 });
    const glass = new THREE.MeshPhysicalMaterial({ color: '#8da6bd', metalness: .45, roughness: .12, transparent: true, opacity: .48, side: THREE.DoubleSide });
    this.body = new THREE.Group();
    const shape = new THREE.Shape();
    const w = 3.7, h = 2.25, r = .25;
    shape.moveTo(-w / 2 + r, -h / 2);
    shape.lineTo(w / 2 - r, -h / 2); shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    shape.lineTo(w / 2, h / 2 - r); shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    shape.lineTo(-w / 2 + r, h / 2); shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    shape.lineTo(-w / 2, -h / 2 + r); shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    const shell = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: .8, bevelEnabled: true, bevelSize: .08, bevelThickness: .08, bevelSegments: 3, steps: 1 }), bodyMaterial);
    shell.position.z = -.7; this.body.add(shell);
    const grip = new THREE.Mesh(new THREE.BoxGeometry(.7, 2, 1.05), rubber); grip.position.set(-1.55, -.08, 0); this.body.add(grip);
    const finder = new THREE.Mesh(new THREE.BoxGeometry(1.1, .5, .85), bodyMaterial); finder.position.set(0, 1.25, -.2); this.body.add(finder);
    const release = new THREE.Mesh(new THREE.CylinderGeometry(.16, .16, .09, 24), steel); release.position.set(-1.25, 1.2, .12); this.body.add(release);
    this.scene.add(this.body);
    this.sensorTexture = new THREE.DataTexture(new Uint8Array(48*32*4),48,32,THREE.RGBAFormat);
    this.sensorMaterial.map = this.sensorTexture;
    this.sensorMaterial.emissiveMap = this.sensorTexture;
    const lens = new THREE.Group();
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(.94, 1.03, 1.5, 64, 1, true), rubber); barrel.rotation.x = Math.PI / 2; lens.add(barrel);
    for (const z of [-.65, -.3, .3, .66]) {
      const band = new THREE.Mesh(new THREE.TorusGeometry(.96, .045, 8, 64), steel); band.position.z = z; lens.add(band);
    }
    const front = new THREE.Mesh(new THREE.CircleGeometry(.84, 64), glass); front.position.z = .77; lens.add(front);
    const inner = new THREE.Mesh(new THREE.RingGeometry(.64, .85, 64), rubber); inner.position.z = .78; lens.add(inner);
    lens.position.z = 1.15; this.parts.set('lens', lens); this.targets.set('lens', 1.15);
    const diaphragm = new THREE.Group();
    this.iris = new THREE.Mesh(new THREE.RingGeometry(.37, .83, 64), new THREE.MeshStandardMaterial({ color: '#cf786f', metalness: .55, roughness: .4, side: THREE.DoubleSide }));
    diaphragm.add(this.iris);
    for (let i = 0; i < 7; i++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(.36, .055, .035), steel);
      const a = i / 7 * Math.PI * 2; blade.position.set(Math.cos(a) * .54, Math.sin(a) * .54, .03); blade.rotation.z = a + .5; diaphragm.add(blade); this.irisBlades.push(blade);
    }
    diaphragm.position.z = .36; this.parts.set('aperture', diaphragm); this.targets.set('aperture', .36);
    const shutter = new THREE.Group();
    const shutterMaterial = new THREE.MeshStandardMaterial({ color: '#70767c', side: THREE.DoubleSide, metalness: .65, roughness: .45 });
    this.curtain = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 1.05), shutterMaterial); this.shutterCurtains.add(this.curtain);
    for (let j = 0; j < 6; j++) { const line = new THREE.Mesh(new THREE.BoxGeometry(1.45, .012, .02), rubber); line.position.set(0, -.48 + j * .19, .02); this.shutterCurtains.add(line); }
    shutter.add(this.shutterCurtains);
    for(const y of [-.57,.57]){const rail=new THREE.Mesh(new THREE.BoxGeometry(1.62,.07,.05),steel);rail.position.set(0,y,.035);shutter.add(rail);}
    for(const x of [-.775,.775]){const rail=new THREE.Mesh(new THREE.BoxGeometry(.07,1.1,.05),steel);rail.position.set(x,0,.035);shutter.add(rail);}
    shutter.position.z = .16; this.parts.set('shutter', shutter); this.targets.set('shutter', .16);
    const sensor = new THREE.Group(); sensor.add(new THREE.Mesh(new THREE.BoxGeometry(1.58, 1.16, .1), steel));
    const chip = new THREE.Mesh(new THREE.PlaneGeometry(1.36, .94), this.sensorMaterial); chip.position.z = .07; sensor.add(chip);
    const grid = new THREE.GridHelper(1.34, 10, '#a1b4c7', '#879bad'); grid.rotation.x = Math.PI / 2; grid.position.z = .08; grid.scale.z = .7; sensor.add(grid);
    sensor.position.z = -.13; this.parts.set('sensor', sensor); this.targets.set('sensor', -.13);
    for (const [id, part] of this.parts) { part.userData.part = id; part.traverse(node => { node.userData.part = id; }); this.scene.add(part); }
    // Each surface gets its own material so highlighting one part cannot recolor another.
    for (const [id, group] of [['body', this.body], ...this.parts] as [string, THREE.Group][]) group.traverse(node => {
      if (!(node instanceof THREE.Mesh) || !(node.material instanceof THREE.MeshStandardMaterial)) return;
      if (node.material === this.sensorMaterial) return; // Keep the live sensor signal independent of the selection.
      const material = node.material.clone(); node.material = material;
      this.surfaceMaterials.push({ material, part: id, color: material.color.clone(), emissive: material.emissive.clone(), intensity: material.emissiveIntensity });
    });
    if(!this.decorative)for (let i = 0; i < 64; i++) { const photon = new THREE.Mesh(new THREE.SphereGeometry(.028, 6, 6), new THREE.MeshBasicMaterial({ color: '#f3d7b5' })); this.photons.push(photon); this.scene.add(photon); }
    const raycaster = new THREE.Raycaster(); const pointer = new THREE.Vector2();
    this.renderer.domElement.addEventListener('click', (event) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
      raycaster.setFromCamera(pointer, this.camera);
      const hit = raycaster.intersectObjects([...this.parts.values()], true).find(hit=>!hit.object.userData.selectionOutline);
      if (hit?.object.userData.part) this.onSelect(hit.object.userData.part as string);
    });
    this.observer = new ResizeObserver(() => this.resize()); this.observer.observe(host); this.resize();
    this.renderer.setAnimationLoop(() => this.frame());
  }
  private resize() {
    const { width, height } = this.host.getBoundingClientRect();
    if (!width || !height) { if(this.decorative&&this.animationRunning){this.renderer.setAnimationLoop(null);this.animationRunning=false;} return; }
    if(this.decorative&&!this.animationRunning){this.renderer.setAnimationLoop(()=>this.frame());this.animationRunning=true;}
    this.renderer.setSize(width, height, false); this.camera.aspect = width / height; this.camera.updateProjectionMatrix(); this.fitView(true);
    this.outlineMaterial.resolution.set(width,height); this.outlineMaterial.linewidth = Math.max(3,Math.min(6,width/240));
  }
  private fitView(instant: boolean) {
    const bodyPosition = this.body.position.clone(), bodyRotation = this.body.rotation.y;
    const savedTransforms = new Map([...this.parts].map(([id,part]) => [id,{z:part.position.z,scale:part.scale.clone()}]));
    this.body.position.x = -3.5 * this.explode; this.body.rotation.y = -.25 * this.explode;
    this.body.updateMatrixWorld(true);
    const bounds = new THREE.Box3(), points: THREE.Vector3[] = [];
    const collect = (object: THREE.Object3D) => object.traverse(node => {
      if (node.userData.selectionOutline || !(node instanceof THREE.Mesh || node instanceof THREE.LineSegments)) return;
      const vertices = node.geometry.getAttribute('position');
      for (let i = 0; i < vertices.count; i++) {
        const point = new THREE.Vector3().fromBufferAttribute(vertices,i).applyMatrix4(node.matrixWorld); points.push(point); bounds.expandByPoint(point);
      }
    });
    collect(this.body);
    for (const [id,part] of this.parts) {
      part.position.z = this.targets.get(id)! + this.explode * this.shifts[id];
      // Reserve the same space for every selection: only the chosen part grows on screen.
      part.scale.setScalar(this.highlightScale);part.updateMatrixWorld(true);
      collect(part);
    }
    this.body.position.copy(bodyPosition); this.body.rotation.y = bodyRotation; this.body.updateMatrixWorld(true);
    for (const [id,part] of this.parts) { const saved=savedTransforms.get(id)!;part.position.z=saved.z;part.scale.copy(saved.scale);part.updateMatrixWorld(true); }
    const center = bounds.getCenter(new THREE.Vector3());
    const direction = this.overviewDirection.clone();
    const right = new THREE.Vector3().crossVectors(this.camera.up,direction).normalize();
    const up = new THREE.Vector3().crossVectors(direction,right);
    const projected = points.map(point => point.clone().sub(center));
    const horizontal = projected.map(point=>point.dot(right)), vertical = projected.map(point=>point.dot(up));
    center.addScaledVector(right,(Math.min(...horizontal)+Math.max(...horizontal))/2);
    center.addScaledVector(up,(Math.min(...vertical)+Math.max(...vertical))/2);
    const tanY = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)), tanX = tanY * this.camera.aspect;
    let distance = 0;
    for (const point of points) {
      const corner = point.clone().sub(center), depth = corner.dot(direction);
      distance = Math.max(distance, depth + Math.abs(corner.dot(right)) / tanX, depth + Math.abs(corner.dot(up)) / tanY);
    }
    distance *= 1.08;
    this.fitTarget.copy(center); this.fitPosition.copy(center).addScaledVector(direction,distance);
    this.controls.minDistance = distance * .6; this.controls.maxDistance = distance * 2.5;
    this.fitting = !instant;
    if (instant) { this.camera.position.copy(this.fitPosition); this.controls.target.copy(center); this.controls.update(); }
  }
  setExploded(value: number) { if (value === this.explode) return; this.explode = value; this.fitView(false); }
  setAperture(fStop: number) {
    this.value.aperture = fStop;this.shot = -1;
    const radius = Math.max(.035, Math.min(.68, .68 * 1.4 / fStop));
    this.apertureRadius = radius;
    this.iris.geometry.dispose(); this.iris.geometry = new THREE.RingGeometry(radius, .83, 64);
    this.irisBlades.forEach((blade, i) => {
      const angle = i / 7 * Math.PI * 2, distance = (radius + .83) / 2;
      blade.position.set(Math.cos(angle) * distance, Math.sin(angle) * distance, .03);
      blade.rotation.z = angle + .5 + (1 - radius / .68) * .28;
      blade.scale.x = (.83 - radius) / (.83 - .37);
    });
    this.iris.userData.aperture = fStop;
    if(this.highlighting && this.selected==='aperture')this.updateOutline();
  }
  setShutter(seconds: number) { this.exposureSeconds = Math.max(1 / 8000, Math.min(30, seconds));this.value.shutter = this.exposureSeconds; }
  setISO(iso: number) { this.value.iso = iso;this.lastSignalUpdate = 0; }
  select(id: string,highlight = true) {
    if(!this.parts.has(id))return;
    this.selected=id;
    this.highlighting=highlight;
    this.updateHighlight();
  }
  showOverview() {this.highlighting=false;this.updateHighlight();}
  private updateHighlight() {
    const accent = new THREE.Color('#cf786f'), ground = new THREE.Color('#151618');
    for(const surface of this.surfaceMaterials){
      const {material,part,color,emissive,intensity}=surface;
      material.color.copy(color);material.emissive.copy(emissive);material.emissiveIntensity=intensity;
      if(!this.highlighting)continue;
      if(part===this.selected){material.color.lerp(accent,.75);material.emissive.copy(accent);material.emissiveIntensity=.45;}
      else {
        const neutral=(color.r+color.g+color.b)/3;
        material.color.lerp(new THREE.Color(neutral,neutral,neutral),.7).lerp(ground,.22);
      }
    }
    this.updateOutline();
    const name=cameraParts.find(part=>part.id===this.selected)!.name;
    this.renderer.domElement.setAttribute('aria-label',this.highlighting?`Câmera completa, com ${name} ampliado e destacado em coral e contorno claro. Arraste para girar.`:'Câmera completa em três dimensões. Selecione uma peça para destacar no conjunto.');
    this.host.dataset.highlightedPart=this.highlighting?this.selected:'';
  }
  private updateOutline() {
    if(this.outline){this.outline.removeFromParent();this.outline.geometry.dispose();this.outline=undefined;}
    if(!this.highlighting)return;
    let surface: THREE.Mesh | undefined;
    this.parts.get(this.selected)!.traverse(node=>{if(!surface && node instanceof THREE.Mesh)surface=node;});
    if(!surface)return;
    const edges=new THREE.EdgesGeometry(surface.geometry,25);
    const geometry=new LineSegmentsGeometry().fromEdgesGeometry(edges);edges.dispose();
    this.outline=new LineSegments2(geometry,this.outlineMaterial);
    this.outline.userData.selectionOutline=true;this.outline.userData.part=this.selected;
    surface.add(this.outline);
  }
  fire() {
    this.shotDuration = 1000 + Math.max(0, Math.min(12, Math.log2(this.exposureSeconds * 4000))) * 170;
    this.shot = performance.now(); return this.shotDuration;
  }
  private frame() {
    if (this.disposed) return;
    const frameTime=performance.now();
    if(this.decorative&&frameTime-this.lastDecorativeFrame<50)return;
    if(this.decorative)this.lastDecorativeFrame=frameTime;
    const lerp = this.reduced ? 1 : .11;
    for (const [id, group] of this.parts) {
      group.position.z = THREE.MathUtils.lerp(group.position.z, this.targets.get(id)! + this.explode * this.shifts[id], lerp);
      group.scale.setScalar(THREE.MathUtils.lerp(group.scale.x,this.highlighting&&id===this.selected?this.highlightScale:1,lerp));
    }
    this.body.position.x = THREE.MathUtils.lerp(this.body.position.x, -3.5 * this.explode, lerp);
    this.body.rotation.y = THREE.MathUtils.lerp(this.body.rotation.y, -.25 * this.explode, lerp);
    const elapsed = this.shot < 0 ? -1 : performance.now() - this.shot;
    const exposing = elapsed >= 250 && elapsed < this.shotDuration - 350;
    const progress = elapsed < 0 ? 0 : THREE.MathUtils.clamp((elapsed-250)/(this.shotDuration-600),0,1);
    const phase = exposing ? 'exposing' : progress === 1 ? 'complete' : 'closed';
    const { light, gain, signal } = captureFactors(this.value);
    this.sensorMaterial.emissive.set(exposing ? '#d2e7ff' : '#000000');
    this.sensorMaterial.emissiveIntensity = Math.min(3,.25 + signal*progress*.45);
    this.shutterCurtains.scale.y = exposing ? .035 : 1;
    this.shutterCurtains.position.y = exposing ? .51 : 0;
    this.photons.forEach((p, i) => {
      const angle = i*2.39996323, radius = Math.sqrt(i/63)*.72;
      const x = Math.cos(angle)*radius, y = Math.sin(angle)*radius;
      const passesAperture = radius < this.apertureRadius * this.parts.get('aperture')!.scale.x;
      const source = this.parts.get('lens')!.position.z + 1.7;
      const stop = !passesAperture ? this.parts.get('aperture')!.position.z+.06 : !exposing ? this.parts.get('shutter')!.position.z+.06 : this.parts.get('sensor')!.position.z+.1;
      const travel = this.reduced ? (i%7)/7 : (performance.now()/1900+i*.381966)%1;
      p.position.set(x,y,source+(stop-source)*travel);
      (p.material as THREE.MeshBasicMaterial).color.set(passesAperture && exposing ? '#f3d7b5' : '#bb9d7d');
    });
    const now = performance.now();
    if(!this.decorative&&now-this.lastSignalUpdate>90) {
      this.lastSignalUpdate=now;
      const data=this.sensorTexture.image.data as Uint8Array;
      let seed=127;
      const level=28+Math.min(190,signal*progress*110),noise=Math.max(0,Math.log2(this.value.iso/100))*7;
      for(let i=0;i<data.length;i+=4) {
        seed=(seed*1664525+1013904223)>>>0;const sample=level+((seed%256)/255-.5)*noise;
        data[i]=Math.max(0,Math.min(255,sample*.7));data[i+1]=Math.max(0,Math.min(255,sample*.85));data[i+2]=Math.max(0,Math.min(255,sample));data[i+3]=255;
      }
      this.sensorTexture.needsUpdate=true;this.onFrame({phase,progress,light:light*progress,gain});
    }
    if (this.fitting) {
      this.camera.position.lerp(this.fitPosition,lerp); this.controls.target.lerp(this.fitTarget,lerp);
      if (this.camera.position.distanceToSquared(this.fitPosition) < .000001) this.fitting = false;
    }
    this.controls.update(); this.renderer.render(this.scene, this.camera);
  }
  dispose() {
    this.disposed = true; this.renderer.setAnimationLoop(null); this.observer.disconnect(); this.controls.dispose();
    if(this.outline){this.outline.removeFromParent();this.outline.geometry.dispose();}this.outlineMaterial.dispose();
    this.scene.traverse(node => { if (node instanceof THREE.Mesh) { node.geometry.dispose(); const materials = Array.isArray(node.material) ? node.material : [node.material]; materials.forEach(m => m.dispose()); } });
    this.sensorTexture.dispose();this.renderer.dispose(); this.renderer.domElement.remove();
  }
}
