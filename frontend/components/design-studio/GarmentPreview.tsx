'use client';
import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import type {StudioDesign,PrintLayer,PrintSide} from './types';

function outline(type:string){
 const s=new THREE.Shape();
 if(type==='pants'){
  s.moveTo(-.66,1);s.lineTo(.66,1);s.lineTo(.61,-1.15);s.lineTo(.12,-1.15);s.lineTo(0,.05);s.lineTo(-.12,-1.15);s.lineTo(-.61,-1.15);s.closePath();return s;
 }
 const long=['hoodie','shirt','jacket'].includes(type),wide=type==='oversized-tee'?1.1:1;
 s.moveTo(-.28,1);s.quadraticCurveTo(0,.69,.28,1);s.lineTo(.72*wide,.90);
 s.lineTo(long?1.22:1.40,long?-.65:.53);s.lineTo(long?.88:1.13,long?-.78:.10);
 s.lineTo(.68*wide,.27);s.lineTo(.72*wide,-.95);s.quadraticCurveTo(0,-1.03,-.72*wide,-.95);
 s.lineTo(-.68*wide,.27);s.lineTo(long?-.88:-1.13,long?-.78:.10);s.lineTo(long?-1.22:-1.40,long?-.65:.53);s.lineTo(-.72*wide,.90);s.closePath();return s;
}
function release(group:THREE.Object3D){group.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material]){if(m.map)m.map.dispose();m.dispose();}}});}
function texture(color:string,layers:PrintLayer[],side:PrintSide){
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1024;const ctx=canvas.getContext('2d')!;
 const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;
 const images=new Map<string,HTMLImageElement>();let cancelled=false;
 const draw=()=>{
  if(cancelled)return;ctx.clearRect(0,0,1024,1024);ctx.fillStyle=color;ctx.fillRect(0,0,1024,1024);
  ctx.fillStyle='rgba(128,128,128,.05)';for(let x=0;x<1024;x+=4)ctx.fillRect(x,0,1,1024);
  const shading=ctx.createLinearGradient(200,0,824,0);shading.addColorStop(0,'#00000014');shading.addColorStop(.35,'#ffffff05');shading.addColorStop(.8,'#00000000');shading.addColorStop(1,'#00000018');ctx.fillStyle=shading;ctx.fillRect(0,0,1024,1024);
  for(const l of layers.filter(l=>l.side===side)){
   ctx.save();ctx.translate(512+(l.x-50)*3.3,530+(l.y-50)*5);ctx.rotate(l.rotation*Math.PI/180);ctx.fillStyle=l.color;ctx.textAlign='center';ctx.textBaseline='middle';const width=l.scale*5;
   if(l.kind==='image'){const image=images.get(l.id);if(image){const ratio=image.naturalHeight/image.naturalWidth;const w=width/Math.max(1,ratio),h=width*Math.min(1,ratio);ctx.drawImage(image,-w/2,-h/2,w,h);}}
   else{ctx.font=`900 ${l.kind==='art'?width:width/Math.max(l.text.length*.57,2)}px ${l.font}`;ctx.fillText(l.text,0,0,width);}
   ctx.restore();
  }map.needsUpdate=true;
 };
 for(const l of layers.filter(l=>l.side===side&&l.kind==='image'&&l.image)){const image=new Image();image.onload=()=>{images.set(l.id,image);draw();};image.src=l.image!;}
 draw();return {map,cancel:()=>{cancelled=true;}};
}
export function GarmentPreview({design,side,rotate,captureRef}:{design:StudioDesign;side:PrintSide;rotate:boolean;captureRef:React.MutableRefObject<null|(()=>string)>}){
 const mount=useRef<HTMLDivElement>(null),scene=useRef<THREE.Scene|null>(null),root=useRef<THREE.Group|null>(null),controls=useRef<OrbitControls|null>(null),camera=useRef<THREE.PerspectiveCamera|null>(null),rotateRef=useRef(rotate);
 const [error,setError]=useState('');
 useEffect(()=>{rotateRef.current=rotate;},[rotate]);
 useEffect(()=>{
  const host=mount.current;if(!host)return;let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});}catch{setError('3D isn’t available in this browser. Your design controls still work; try a browser with WebGL enabled.');return;}
  const world=new THREE.Scene();world.background=new THREE.Color('#f4f4f4');scene.current=world;
  const cam=new THREE.PerspectiveCamera(36,1,.1,50);cam.position.set(0,.1,5.6);camera.current=cam;
  const orbit=new OrbitControls(cam,renderer.domElement);controls.current=orbit;orbit.enableDamping=true;orbit.enablePan=false;orbit.minDistance=3.5;orbit.maxDistance=8;orbit.minPolarAngle=.5;orbit.maxPolarAngle=2.5;orbit.target.set(0,0,0);
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;host.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-label','Interactive 3D garment preview. Drag to rotate and pinch to zoom.');
  world.add(new THREE.HemisphereLight('#ffffff','#b1b1b1',2.4));const light=new THREE.DirectionalLight('#fff',3);light.position.set(2,4,5);world.add(light);const rim=new THREE.DirectionalLight('#fff',2);rim.position.set(-3,2,-4);world.add(rim);
  const resize=()=>{const w=Math.max(host.clientWidth,1),h=Math.max(host.clientHeight,1);renderer.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix();};const observer=new ResizeObserver(resize);observer.observe(host);resize();
  renderer.setAnimationLoop(()=>{orbit.autoRotate=rotateRef.current&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches;orbit.autoRotateSpeed=1.2;orbit.update();renderer.render(world,cam);});
  captureRef.current=()=>{renderer.render(world,cam);return renderer.domElement.toDataURL('image/png');};
  const lost=(e:Event)=>{e.preventDefault();setError('The 3D preview paused. Reload the page to restore it; save your draft first.');};renderer.domElement.addEventListener('webglcontextlost',lost);
  return()=>{renderer.setAnimationLoop(null);observer.disconnect();orbit.dispose();release(world);renderer.dispose();renderer.domElement.remove();captureRef.current=null;scene.current=null;};
 },[captureRef]);
 useEffect(()=>{const cam=camera.current,orbit=controls.current;if(!cam||!orbit)return;cam.position.set(0,.1,side==='front'?5.6:-5.6);orbit.target.set(0,0,0);orbit.update();},[side]);
 useEffect(()=>{
  if(!scene.current)return;if(root.current){scene.current.remove(root.current);release(root.current);}const group=new THREE.Group();root.current=group;scene.current.add(group);
  const front=texture(design.colorHex,design.layers,'front'),back=texture(design.colorHex,design.layers,'back');
  const materials=[new THREE.MeshStandardMaterial({map:front.map,roughness:.96}),new THREE.MeshStandardMaterial({map:back.map,roughness:.96}),new THREE.MeshStandardMaterial({color:design.colorHex,roughness:1})];
  const geometry=new THREE.ExtrudeGeometry(outline(design.garmentType),{depth:.16,bevelEnabled:true,bevelSize:.055,bevelThickness:.075,bevelSegments:5,steps:1,curveSegments:28});geometry.translate(0,0,-.08);geometry.computeBoundingBox();
  const pos=geometry.attributes.position,norm=geometry.attributes.normal,uv=geometry.attributes.uv,bounds=geometry.boundingBox!;geometry.clearGroups();
  for(let i=0;i<pos.count;i+=3){const z=norm.getZ(i);const material=z>.9?0:z<-.9?1:2;geometry.addGroup(i,3,material);for(let j=i;j<i+3;j++){let u=(pos.getX(j)-bounds.min.x)/(bounds.max.x-bounds.min.x);if(material===1)u=1-u;uv.setXY(j,u,(pos.getY(j)-bounds.min.y)/(bounds.max.y-bounds.min.y));}}
  const body=new THREE.Mesh(geometry,materials);group.add(body);
  const detail=new THREE.MeshStandardMaterial({color:design.colorHex,roughness:.96});
  if(design.garmentType==='hoodie'){
   const hood=new THREE.Mesh(new THREE.SphereGeometry(.39,40,24,0,Math.PI*2,0,Math.PI*.65),detail);hood.position.set(0,1.04,-.10);hood.scale.set(1,1,.65);group.add(hood);
   const pocket=new THREE.Mesh(new THREE.BoxGeometry(.70,.31,.045),detail.clone());pocket.position.set(0,-.63,.17);group.add(pocket);
   for(const x of [-.15,.15]){const cord=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.35,12),new THREE.MeshStandardMaterial({color:'#dddddd'}));cord.position.set(x,.58,.22);group.add(cord);}
  }
  if(['shirt','jacket'].includes(design.garmentType)){
   const seam=new THREE.Mesh(new THREE.BoxGeometry(.035,1.65,.02),detail.clone());seam.position.set(0,-.07,.164);group.add(seam);
   for(let i=0;i<7;i++){const button=new THREE.Mesh(new THREE.SphereGeometry(.026,16,12),new THREE.MeshStandardMaterial({color:'#b4b4b4',metalness:.3,roughness:.6}));button.position.set(0,.60-i*.22,.185);button.scale.z=.35;group.add(button);}
   for(const x of [-1,1]){const collar=new THREE.Mesh(new THREE.BoxGeometry(.25,.24,.04),detail.clone());collar.position.set(x*.19,.87,.17);collar.rotation.z=x*.45;group.add(collar);}
  }
  const ease=design.fit==='oversized'?1.13:design.fit==='relaxed'?1.06:design.fit==='slim'?.94:1;group.scale.x=ease;
  return()=>{front.cancel();back.cancel();};
 },[design]);
 return <div className="studio-preview" ref={mount}>{error&&<p role="alert" className="studio-render-error">{error}</p>}</div>;
}

