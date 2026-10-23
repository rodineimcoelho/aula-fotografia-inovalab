import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { lightingColors, type LightingSettings } from './lighting-config.ts';

export class LightingScene {
  private renderer = new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power',preserveDrawingBuffer:true});
  private scene = new THREE.Scene();
  private overview = new THREE.PerspectiveCamera(40,1,.1,40);
  private photo = new THREE.PerspectiveCamera(40,1,.1,30);
  private controls: OrbitControls;
  private observer: ResizeObserver;
  private ambient = new THREE.HemisphereLight('#e5ecf2','#37424c',.12);
  private keys: THREE.DirectionalLight[] = [];
  private fixtures = new THREE.Group();
  private panel: THREE.Mesh;
  private stand: THREE.Mesh;
  private backdrop: THREE.Mesh;
  private sky: THREE.Mesh;
  private mixedFill = new THREE.DirectionalLight('#6d9dff',.85);
  private mixedPanel: THREE.Mesh;
  private view: 'photo'|'overview' = 'photo';
  private frame = 0;
  private disposed = false;
  private labels = new Map<string,HTMLSpanElement>();

  constructor(private host: HTMLElement) {
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));
    this.renderer.setClearColor('#151618',0);this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFShadowMap;this.renderer.shadowMap.autoUpdate=false;
    this.renderer.domElement.setAttribute('role','img');
    this.renderer.domElement.setAttribute('aria-label','Simulação 3D de um assunto, uma fonte de luz e suas sombras.');
    host.replaceChildren(this.renderer.domElement);
    for(const name of ['Fonte','Assunto','Câmera']){const label=document.createElement('span');label.className='lighting-label';label.textContent=name;label.hidden=true;host.append(label);this.labels.set(name,label);}
    this.overview.position.set(7,5.5,9);this.overview.lookAt(0,1.1,0);
    this.photo.position.set(0,1.9,4.8);this.photo.lookAt(0,1.05,0);
    this.controls=new OrbitControls(this.overview,this.renderer.domElement);this.controls.target.set(0,1.1,0);this.controls.update();
    this.controls.enableDamping=false;this.controls.enablePan=false;this.controls.minDistance=7;this.controls.maxDistance=18;
    this.controls.maxPolarAngle=Math.PI*.47;this.controls.addEventListener('change',()=>this.schedule());this.controls.enabled=false;
    this.scene.add(this.ambient);
    const neutral=new THREE.MeshStandardMaterial({color:'#bcbeb7',roughness:.76});
    const head=new THREE.Mesh(new THREE.SphereGeometry(.62,48,32),neutral);head.position.set(0,1.42,0);head.castShadow=true;head.receiveShadow=true;this.scene.add(head);
    const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(.32,.55,.8,48),neutral);pedestal.position.y=.4;pedestal.castShadow=true;pedestal.receiveShadow=true;this.scene.add(pedestal);
    const cube=new THREE.Mesh(new THREE.BoxGeometry(.55,.55,.55),new THREE.MeshStandardMaterial({color:'#cf786f',roughness:.7}));
    cube.position.set(1,.275,.15);cube.rotation.y=.24;cube.castShadow=true;cube.receiveShadow=true;this.scene.add(cube);
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(14,14),new THREE.MeshStandardMaterial({color:'#657275',roughness:1}));
    floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;this.scene.add(floor);
    this.backdrop=new THREE.Mesh(new THREE.PlaneGeometry(16,9),new THREE.MeshStandardMaterial({color:'#52616a',roughness:1}));
    this.backdrop.position.set(0,4,-5.5);this.backdrop.receiveShadow=true;this.scene.add(this.backdrop);
    const skyGeometry=new THREE.PlaneGeometry(16,9);
    skyGeometry.setAttribute('color',new THREE.Float32BufferAttribute([.2,.36,.68,.2,.36,.68,.95,.7,.42,.95,.7,.42],3));
    this.sky=new THREE.Mesh(skyGeometry,new THREE.MeshBasicMaterial({vertexColors:true}));this.sky.position.set(0,4,-5.45);this.sky.visible=false;this.scene.add(this.sky);
    for(let i=0;i<9;i++) {
      const key=new THREE.DirectionalLight('#fff8eb',3.3/9);key.castShadow=true;
      key.shadow.mapSize.set(512,512);key.shadow.camera.left=-4;key.shadow.camera.right=4;key.shadow.camera.top=4;key.shadow.camera.bottom=-4;
      key.shadow.camera.near=.1;key.shadow.camera.far=16;key.shadow.normalBias=.025;key.target.position.set(0,1.1,0);
      this.keys.push(key);this.scene.add(key,key.target);
    }
    this.panel=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({color:'#fff8eb',side:THREE.DoubleSide}));this.fixtures.add(this.panel);
    this.stand=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,1,10),new THREE.MeshBasicMaterial({color:'#929b9f'}));this.fixtures.add(this.stand);
    const cameraMarker=new THREE.Group();
    cameraMarker.add(new THREE.Mesh(new THREE.BoxGeometry(.5,.3,.2),new THREE.MeshBasicMaterial({color:'#a5afb1'})));
    const lens=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.22,16),new THREE.MeshBasicMaterial({color:'#52616a'}));lens.rotation.x=Math.PI/2;lens.position.z=-.16;cameraMarker.add(lens);
    cameraMarker.position.set(0,1.6,4.5);this.fixtures.add(cameraMarker);this.scene.add(this.fixtures);
    this.mixedFill.position.set(3,2,-1);this.mixedFill.target.position.set(0,1.2,0);this.scene.add(this.mixedFill,this.mixedFill.target);
    this.mixedPanel=new THREE.Mesh(new THREE.PlaneGeometry(.7,.7),new THREE.MeshBasicMaterial({color:'#6d9dff',side:THREE.DoubleSide}));
    this.mixedPanel.position.copy(this.mixedFill.position);this.mixedPanel.lookAt(0,1.2,0);this.fixtures.add(this.mixedPanel);
    this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(host);this.resize();
  }
  setValue(value: LightingSettings) {
    const angle=THREE.MathUtils.degToRad(value.angle),source=new THREE.Vector3(4*Math.sin(angle),3.4,4*Math.cos(angle)),target=new THREE.Vector3(0,1.1,0);
    const normal=target.clone().sub(source).normalize(),right=new THREE.Vector3().crossVectors(normal,new THREE.Vector3(0,1,0)).normalize(),up=new THREE.Vector3().crossVectors(right,normal);
    const color=lightingColors[value.color]??lightingColors.neutral;
    this.keys.forEach((key,i)=>{
      const jitterX=Math.sin(i*11.7)*.23,jitterY=Math.cos(i*8.3)*.23;
      key.position.copy(source).addScaledVector(right,((i%3)-1+jitterX)*value.size/2).addScaledVector(up,(Math.floor(i/3)-1+jitterY)*value.size/2);
      key.color.set(color);key.intensity=3.3*value.power/9;key.shadow.needsUpdate=true;
      key.shadow.radius=value.size>1?6:1;
    });
    this.ambient.intensity=value.fill;this.mixedFill.visible=value.mixed;this.mixedFill.intensity=.85*value.power;
    this.mixedPanel.visible=value.mixed;this.sky.visible=value.sky;this.backdrop.visible=!value.sky;
    this.panel.position.copy(source);this.panel.scale.set(value.size,value.size,1);this.panel.lookAt(target);(this.panel.material as THREE.MeshBasicMaterial).color.set(color);
    this.stand.position.set(source.x,source.y/2,source.z);this.stand.scale.y=source.y;
    this.renderer.shadowMap.needsUpdate=true;this.schedule();
  }
  setView(view: 'photo'|'overview') {this.view=view;this.controls.enabled=view==='overview';this.fixtures.visible=view==='overview';this.schedule();}
  private resize() {
    const {width,height}=this.host.getBoundingClientRect();if(!width||!height)return;
    this.renderer.setSize(width,height,false);for(const camera of [this.overview,this.photo]){camera.aspect=width/height;camera.updateProjectionMatrix();}this.schedule();
  }
  private schedule() {
    if(this.frame||this.disposed)return;this.frame=requestAnimationFrame(()=>{
      this.frame=0;if(this.disposed)return;this.renderer.render(this.scene,this.view==='photo'?this.photo:this.overview);
      const positions:Record<string,THREE.Vector3>={Fonte:this.panel.position,Assunto:new THREE.Vector3(0,2.1,0),'Câmera':new THREE.Vector3(0,1.6,4.5)};
      const {width,height}=this.host.getBoundingClientRect();
      this.labels.forEach((label,name)=>{
        const point=positions[name].clone().project(this.overview);label.hidden=this.view!=='overview'||point.z>1||point.z< -1;
        if(label.hidden)return;
        label.style.left=`${Math.max(4,Math.min(width-label.offsetWidth-4,(point.x+1)*width/2+8))}px`;
        label.style.top=`${Math.max(label.offsetHeight+4,Math.min(height-4,(1-point.y)*height/2-8))}px`;
      });
    });
  }
  dispose() {
    this.disposed=true;cancelAnimationFrame(this.frame);this.observer.disconnect();this.controls.dispose();
    this.keys.forEach(light=>light.shadow.dispose());this.scene.traverse(node=>{if(node instanceof THREE.Mesh){node.geometry.dispose();const materials=Array.isArray(node.material)?node.material:[node.material];materials.forEach(material=>material.dispose());}});
    this.renderer.dispose();this.renderer.domElement.remove();this.labels.forEach(label=>label.remove());
  }
}
