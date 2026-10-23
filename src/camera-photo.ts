import * as THREE from 'three';
import { type Exposure, defaultExposure, captureFactors } from './models.ts';

export class CameraPhoto {
  private renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: 'low-power' });
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(38, 1.5, .1, 25);
  private object: THREE.Mesh;
  private context: CanvasRenderingContext2D;
  private observer: ResizeObserver;
  private noise = document.createElement('canvas');
  private value: Exposure = { ...defaultExposure };
  private progress = 1;
  private frame = document.createElement('canvas');
  private sceneKey = '';
  private compareBlur = false;

  constructor(private canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d')!;
    this.renderer.setSize(420,280); this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.scene.background = new THREE.Color('#24353f');
    this.scene.add(new THREE.HemisphereLight('#dceef5','#172128',2));
    const light = new THREE.DirectionalLight('#fff2da',4);
    light.position.set(-3,5,4); light.castShadow = true; this.scene.add(light);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(15,15),new THREE.MeshStandardMaterial({color:'#475b62',roughness:1}));
    ground.rotation.x = -Math.PI/2; ground.position.y = -.85; ground.receiveShadow = true; this.scene.add(ground);
    this.object = new THREE.Mesh(new THREE.IcosahedronGeometry(.78,0),new THREE.MeshStandardMaterial({color:'#cf786f',roughness:.4,metalness:.2,flatShading:true}));
    this.object.castShadow = true; this.scene.add(this.object);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.7,.09,12,64),new THREE.MeshStandardMaterial({color:'#c4d7de',roughness:.3,metalness:.65}));
    ring.position.set(-.8,.65,-4.5); this.scene.add(ring);
    for(const x of [-2.5,0,2.5]){
      const point=new THREE.Mesh(new THREE.SphereGeometry(.09,12,12),new THREE.MeshBasicMaterial({color:'#ffe4ad'}));point.position.set(x,1.8,-5);this.scene.add(point);
    }
    this.camera.position.set(2.5,1.8,5.5);this.camera.lookAt(Math.sin(1.2)*.8,0,0);
    this.frame.width=420;this.frame.height=280;
    this.noise.width = 210; this.noise.height = 140;
    this.observer = new ResizeObserver(()=>this.resize());this.observer.observe(canvas);this.resize();
  }
  setValue(value: Exposure) { this.value = { ...value }; this.progress = 1; this.draw(); }
  capture(progress: number) { this.progress = progress;this.draw(); }
  setBlurComparison(enabled: boolean) {this.compareBlur=enabled;this.draw();}
  private resize() {
    const width = Math.min(640,Math.max(210,Math.round(this.canvas.clientWidth)));
    this.canvas.width = width;this.canvas.height = Math.round(width*2/3);this.draw();
  }
  private draw() {
    const ctx = this.context, w = this.canvas.width, h = this.canvas.height;
    const {light: photons,gain} = captureFactors(this.value);
    const brightness = this.compareBlur ? Math.max(.015,this.progress) : Math.max(.015,Math.min(16,photons*gain*this.progress));
    const key=`${this.value.aperture}/${this.value.shutter}`;
    if(key!==this.sceneKey){this.renderScene();this.sceneKey=key;}
    ctx.fillStyle = '#000';ctx.fillRect(0,0,w,h);
    ctx.save();ctx.filter = `brightness(${brightness})`;
    ctx.drawImage(this.frame,0,0,w,h);
    ctx.restore();
    const noiseCtx = this.noise.getContext('2d')!, data = noiseCtx.createImageData(210,140);
    let seed = 127;
    const strength = Math.min(145,Math.max(0,Math.log2(this.value.iso/100))*18 + Math.max(0,-Math.log2(photons))*3);
    for(let i=0;i<data.data.length;i+=4) {
      seed = (seed*1664525+1013904223)>>>0;
      const channel = seed%256;
      data.data[i]=channel;data.data[i+1]=Math.min(255,channel+(seed%17)-8);data.data[i+2]=channel;
      data.data[i+3]=strength*this.progress;
    }
    noiseCtx.putImageData(data,0,0);
    ctx.save();ctx.globalCompositeOperation='soft-light';ctx.drawImage(this.noise,0,0,w,h);ctx.restore();
  }
  private renderScene() {
    const ctx=this.frame.getContext('2d')!,samples=24;
    const position=this.camera.position.clone();this.camera.updateMatrixWorld(true);
    const projection=this.camera.projectionMatrix.clone();
    const right=new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld,0),up=new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld,1);
    const focalPoint=new THREE.Vector3(Math.sin(1.2)*.8,0,0),distance=position.distanceTo(focalPoint);
    const lensRadius=.48/(2*Math.tan(THREE.MathUtils.degToRad(this.camera.fov/2)))/(2*this.value.aperture);
    ctx.clearRect(0,0,420,280);
    for(let i=0;i<samples;i++) {
      const angle=i*2.39996323,radius=Math.sqrt((i+.5)/samples)*lensRadius;
      const dx=Math.cos(angle)*radius,dy=Math.sin(angle)*radius;
      this.camera.position.copy(position).addScaledVector(right,dx).addScaledVector(up,dy);
      this.camera.projectionMatrix.copy(projection);
      this.camera.projectionMatrix.elements[8]-=projection.elements[0]*dx/distance;
      this.camera.projectionMatrix.elements[9]-=projection.elements[5]*dy/distance;
      this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert();
      const phase=1.2-this.value.shutter*3*i/(samples-1);
      this.object.position.x=Math.sin(phase)*.8;this.object.rotation.set(.25,phase,.35);
      this.renderer.render(this.scene,this.camera);
      ctx.globalAlpha=1/(i+1);ctx.drawImage(this.renderer.domElement,0,0);
    }
    ctx.globalAlpha=1;this.camera.position.copy(position);this.camera.projectionMatrix.copy(projection);this.camera.projectionMatrixInverse.copy(projection).invert();this.camera.updateMatrixWorld(true);
  }
  dispose() {
    this.observer.disconnect();this.scene.traverse(node=>{
      if(node instanceof THREE.Mesh){node.geometry.dispose();const materials=Array.isArray(node.material)?node.material:[node.material];materials.forEach(material=>material.dispose());}
    });this.renderer.dispose();
  }
}
