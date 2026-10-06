'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useCustomizerStore } from '@/store/customizerStore';
import { useFitStore } from '@/store/fitStore';

function dispose(root: THREE.Object3D) {
  root.traverse(object => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose();
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        for (const value of Object.values(material)) if (value instanceof THREE.Texture) value.dispose();
        material.dispose();
      }
    }
  });
}

export function WardrobeScene() {
  const mount = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rotateRef = useRef(true);
  const [rotating, setRotating] = useState(true);
  const [skin, setSkin] = useState('#b97c59');
  const [pose, setPose] = useState('relaxed');
  const [modelUrl, setModelUrl] = useState('');
  const [notice, setNotice] = useState('Procedural preview · illustrative fit, not a body scan');
  const [error, setError] = useState('');
  const garment = useCustomizerStore();
  const body = useFitStore();

  useEffect(() => {rotateRef.current = rotating;}, [rotating]);
  useEffect(() => {
    if (!mount.current) return;
    const host=mount.current;
    let renderer: THREE.WebGLRenderer;
    try {renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});} catch {setError('3D is unavailable on this device. You can still edit your measurements and design.');return;}
    const scene=new THREE.Scene();scene.background=new THREE.Color('#e8e5df');scene.fog=new THREE.Fog('#e8e5df',8,18);sceneRef.current=scene;
    const camera=new THREE.PerspectiveCamera(34,1,.01,40);camera.position.set(2.4,1.5,4.1);
    const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.95,0);controls.enableDamping=true;controls.minDistance=1.6;controls.maxDistance=7;controls.maxPolarAngle=Math.PI*.52;controls.enablePan=false;controlsRef.current=controls;
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;host.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight('#ffffff','#6c685d',2));
    const key=new THREE.DirectionalLight('#fff4e0',3);key.position.set(3,5,3);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key);
    const rim=new THREE.DirectionalLight('#b2d4ff',2);rim.position.set(-3,2,-2);scene.add(rim);
    const floor=new THREE.Mesh(new THREE.CylinderGeometry(.85,.9,.06,80),new THREE.MeshStandardMaterial({color:'#c7c3ba',roughness:.8}));floor.position.y=-.04;floor.receiveShadow=true;scene.add(floor);
    const grid=new THREE.GridHelper(20,80,'#c2beb5','#dad6cf');grid.position.y=-.08;scene.add(grid);
    const resize=()=>{const w=host.clientWidth,h=host.clientHeight || 560;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();};
    const observer=new ResizeObserver(resize);observer.observe(host);resize();
    renderer.setAnimationLoop(()=>{controls.autoRotate=rotateRef.current;controls.autoRotateSpeed=.8;controls.update();renderer.render(scene,camera);});
    return ()=>{renderer.setAnimationLoop(null);observer.disconnect();controls.dispose();dispose(scene);renderer.dispose();renderer.domElement.remove();sceneRef.current=null;};
  },[]);

  useEffect(()=>{
    const scene=sceneRef.current;if(!scene)return;
    let cancelled=false;
    if(modelRef.current){scene.remove(modelRef.current);dispose(modelRef.current);}
    const root=new THREE.Group();modelRef.current=root;scene.add(root);
    const skinMaterial=new THREE.MeshStandardMaterial({color:skin,roughness:.78});
    const cloth=new THREE.MeshStandardMaterial({color:garment.colorHex,roughness:.94});
    const dark=new THREE.MeshStandardMaterial({color:'#242831',roughness:.9});
    const shoe=new THREE.MeshStandardMaterial({color:'#ece9e0',roughness:.8});
    const add=(geo:THREE.BufferGeometry,mat:THREE.Material,x:number,y:number,z:number,sx=1,sy=1,sz=1)=>{const mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);return mesh;};
    const sphere=(mat:THREE.Material,x:number,y:number,z:number,sx:number,sy:number,sz:number)=>add(new THREE.SphereGeometry(1,32,24),mat,x,y,z,sx,sy,sz);
    const chest=Math.max(.75,Math.min(1.5,body.chestIn/40));const waist=Math.max(.75,Math.min(1.5,body.waistIn/32));
    const ease=garment.fit==='oversized'?1.2:garment.fit==='relaxed'?1.1:garment.fit==='slim'?.96:1.03;
    // Elliptical ring mesh with subtle fold displacement and a tapered waist.
    function torso(mat:THREE.Material) {
      const geometry=new THREE.CylinderGeometry(.245*chest*ease,.205*waist*ease,.58,64,24,true);
      const vertices=geometry.attributes.position;
      for(let i=0;i<vertices.count;i++){const x=vertices.getX(i),y=vertices.getY(i),z=vertices.getZ(i);const angle=Math.atan2(z,x);const fold=.006*Math.sin(angle*13+y*18)*Math.sin((y+.29)/.58*Math.PI);vertices.setXYZ(i,x*(1+fold),y,z*.64+fold);}
      geometry.computeVertexNormals();add(geometry,mat,0,1.16,0);
    }
    root.scale.y=body.heightCm/178;
    sphere(skinMaterial,0,1.68,0,.108,.145,.105);
    add(new THREE.CylinderGeometry(.052,.06,.13,24),skinMaterial,0,1.49,0);
    sphere(dark,0,1.76,-.012,.112,.076,.107);
    for(const side of [-1,1]){
      sphere(skinMaterial,side*.106,1.675,0,.019,.033,.023);
      sphere(shoe,side*.039,1.70,.095,.025,.012,.007);
      sphere(dark,side*.039,1.70,.101,.009,.010,.005);
      sphere(shoe,side*.115,.06,.047,.089,.055,.17);
    }
    sphere(skinMaterial,0,1.663,.105,.021,.035,.025);
    const pants=garment.garmentType==='pants';
    torso(pants?dark:cloth);
    for(const side of [-1,1]){
      const leg=add(new THREE.CylinderGeometry(.11*(body.hipIn/38),.07,.77,32,12),pants?cloth:dark,side*.117,.49,0,1,1,.85);leg.rotation.z=side*-.035;
      const arm=new THREE.Group();arm.position.set(side*.23*chest*ease,1.39,0);arm.rotation.z=side*(pose==='spread'?.95:.20);root.add(arm);
      const sleeveLength=['tshirt','oversized-tee'].includes(garment.garmentType)?.23:.48;
      const sleeve=new THREE.Mesh(new THREE.CylinderGeometry(.086*ease,.06*ease,sleeveLength,32),pants?dark:cloth);sleeve.position.y=-sleeveLength/2;arm.add(sleeve);
      if(sleeveLength>.3){const cuff=new THREE.Mesh(new THREE.CylinderGeometry(.065*ease,.062*ease,garment.cuff==='french'?.09:.045,24),pants?dark:cloth);cuff.position.y=-sleeveLength+.01;cuff.rotation.z=garment.cuff==='mitered'?side*.18:0;arm.add(cuff);}
      const hand=new THREE.Mesh(new THREE.CapsuleGeometry(.041,.075,8,16),skinMaterial);hand.position.y=-.56;arm.add(hand);
      if(sleeveLength<.3){const forearm=new THREE.Mesh(new THREE.CapsuleGeometry(.053,.23,8,20),skinMaterial);forearm.position.y=-.38;arm.add(forearm);}
    }
    const collar=add(new THREE.TorusGeometry(.071,.018,12,48),pants?dark:cloth,0,1.457,0,1,1,.85);collar.rotation.x=Math.PI/2;
    if(['shirt','jacket'].includes(garment.garmentType)) {
      const buttons=new THREE.MeshStandardMaterial({color:garment.button==='mother-of-pearl'?'#fffaf0':'#514c43',roughness:.4});
      for(let i=0;i<6;i++) sphere(buttons,0,1.38-i*.078,.163,.007,.007,.004);
      if(garment.collar!=='band')for(const side of [-1,1]){const flap=add(new THREE.BoxGeometry(garment.collar==='cutaway'?.11:.08,garment.collar==='cuban'?.15:.12,.014),cloth,side*.065,1.41,.12);flap.rotation.z=side*(garment.collar==='cutaway'?-.8:garment.collar==='cuban'?-.55:-.38);}
      if(garment.pocket!=='none')add(new THREE.BoxGeometry(.075,.085,.008),cloth,-.13,1.29,.16);
    }
    if(garment.garmentType==='hoodie'){
      sphere(cloth,0,1.45,-.05,.145,.13,.13);
      add(new THREE.BoxGeometry(.24,.12,.028),cloth,0,1.01,.15);
      for(const side of [-1,1])add(new THREE.CylinderGeometry(.004,.004,.17,8),shoe,side*.04,1.32,.15);
    }
    if(garment.monogramEnabled && garment.monogramText){
      const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const ctx=canvas.getContext('2d')!;ctx.fillStyle='#ffffff';ctx.font='bold 72px sans-serif';ctx.textAlign='center';ctx.fillText(garment.monogramText.slice(0,12),256,90);
      const texture=new THREE.CanvasTexture(canvas);const material=new THREE.MeshStandardMaterial({map:texture,transparent:true,depthWrite:false});add(new THREE.PlaneGeometry(.18,.045),material,0,1.27,.174);
    }
    if(modelUrl){
      setNotice('Loading your GLB model…');
      new GLTFLoader().load(modelUrl,gltf=>{
        if(cancelled){dispose(gltf.scene);return;}
        while(root.children.length){const child=root.children[0];root.remove(child);dispose(child);}
        const box=new THREE.Box3().setFromObject(gltf.scene);const size=box.getSize(new THREE.Vector3());const scale=1.78/Math.max(size.y,.01);gltf.scene.scale.setScalar(scale);const center=box.getCenter(new THREE.Vector3());gltf.scene.position.set(-center.x*scale,-box.min.y*scale,-center.z*scale);
        gltf.scene.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=true;if(/garment|cloth|shirt|hoodie|pants/i.test(o.name)){const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>{if(m instanceof THREE.MeshStandardMaterial)m.color.set(garment.colorHex);});}if(o.morphTargetDictionary && o.morphTargetInfluences){for(const [name,index] of Object.entries(o.morphTargetDictionary)){const value=name==='chest'?(body.chestIn-36)/16:name==='waist'?(body.waistIn-28)/20:0;o.morphTargetInfluences[index as number]=THREE.MathUtils.clamp(value,0,1);}}}});
        root.add(gltf.scene);setNotice('Imported GLB · garment color and named body morphs supported');
      },undefined,()=>{if(!cancelled)setNotice('Model could not load. Showing procedural preview.');});
    }else setNotice('Procedural preview · illustrative fit, not a body scan');
    return ()=>{cancelled=true;};
  },[garment.garmentType,garment.colorHex,garment.fit,garment.button,garment.collar,garment.cuff,garment.pocket,garment.monogramEnabled,garment.monogramText,body.heightCm,body.chestIn,body.waistIn,body.hipIn,skin,pose,modelUrl]);

  useEffect(()=>()=>{if(modelUrl)URL.revokeObjectURL(modelUrl);},[modelUrl]);
  return <div className="relative h-full min-h-[360px] rounded-2xl overflow-hidden border border-stone-300 bg-stone-200">
    <div ref={mount} className="absolute inset-0" />
    <div className="absolute top-4 left-4 right-4 flex justify-between gap-2 pointer-events-none"><div><p className="text-[10px] tracking-[.25em] font-bold">CODED FIT / CHARACTER LAB</p><p className="text-xs mt-1">{notice}</p></div><span className="text-xs">360°</span></div>
    {error && <p role="alert" className="absolute top-24 p-6">{error}</p>}
    <div className="absolute bottom-4 left-4 right-4 space-y-3 rounded-xl bg-white/90 backdrop-blur p-3 text-xs">
      <div className="flex flex-wrap items-center gap-3"><button onClick={()=>setRotating(!rotating)}>{rotating?'Pause rotation':'Rotate'}</button><button onClick={()=>controlsRef.current?.reset()}>Reset view</button><label>Pose <select aria-label="Character pose" value={pose} onChange={e=>setPose(e.target.value)}><option value="relaxed">Relaxed</option><option value="spread">Fitting</option></select></label><label className="flex items-center gap-2">Skin <input aria-label="Skin tone" type="color" value={skin} onChange={e=>setSkin(e.target.value)} className="w-7 h-6" /></label></div>
      <div className="flex justify-between gap-2 items-center"><span className="text-stone-500">Drag to orbit · pinch or scroll to zoom</span><label className="cursor-pointer font-semibold">Import GLB<input type="file" accept=".glb" className="sr-only" onChange={e=>{const f=e.target.files?.[0];if(!f)return;if(f.size>30*1024*1024){setNotice('Choose a GLB under 30 MB.');return;}setModelUrl(URL.createObjectURL(f));}} /></label>{modelUrl && <button onClick={()=>setModelUrl('')}>Clear model</button>}</div>
    </div>
  </div>;
}
