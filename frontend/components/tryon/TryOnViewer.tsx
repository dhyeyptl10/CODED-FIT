'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, RefreshCw, AlertCircle, ArrowLeftRight } from 'lucide-react';
import {useCatalog} from '@/lib/useCatalog';
import { api } from '@/services/api';

export const TryOnViewer: React.FC = () => {
  const {products}=useCatalog();
  const [selectedGarment,setSelectedGarment]=useState('');
  const [consent,setConsent]=useState(false);
  const streamRef=useRef<MediaStream | null>(null);
  useEffect(()=>()=>{streamRef.current?.getTracks().forEach(t=>t.stop());},[]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [resultPhoto, setResultPhoto] = useState<string | null>(null);
  const [splitPos, setSplitPos] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(false);
  const [providerNotice, setProviderNotice] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  useEffect(()=>{if(cameraActive && videoRef.current && streamRef.current){videoRef.current.srcObject=streamRef.current;void videoRef.current.play().catch(()=>setProviderNotice('Camera playback failed.'));}},[cameraActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 800, facingMode: 'user' }
      });
      streamRef.current=stream;
      setCameraActive(true);
    } catch (e) {
      alert('Camera permission denied or camera unavailable.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 800;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const data = canvas.toDataURL('image/jpeg');
      setPhoto(data);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size>8*1024*1024){setProviderNotice('Choose a JPG, PNG or WebP under 8 MB.');return;}
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateTryOn = async () => {
    if (!photo || !selectedGarment || !consent) {setProviderNotice('Choose a garment and consent to photo processing first.');return;}
    try {
      setLoading(true);
      setProviderNotice(null);

      const task = await api.createTryOnTask({
        userImage: photo,
        garmentImage: products.find(p=>p.id===selectedGarment)?.images[0],
        garmentType: products.find(p=>p.id===selectedGarment)?.category==='Bottoms'?'bottom':'top'
      });

      if (task.unavailable) {
        setProviderNotice(
          task.message || 'AI Try-On provider is not configured. (Set VTO_PROVIDER and YouCam API keys in backend/.env)'
        );
        return;
      }

      if(task.taskId){
        for(let attempt=0;attempt<30;attempt++){
          const result=await api.getTryOnStatus(task.taskId);
          if(result.resultImageUrl){setResultPhoto(result.resultImageUrl);return;}
          if(result.status==='failed')throw new Error('Try-on generation failed.');
          await new Promise(resolve=>setTimeout(resolve,2000));
        }
        setProviderNotice('Generation is taking longer than expected. Please retry later.');
      }
    } catch (e: any) {
      setProviderNotice(e.message || 'Virtual fitting failed. Please ensure photo is well-lit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto p-4 sm:p-6">
      <div className="p-4 bg-white rounded-xl space-y-3 lg:col-span-2"><label className="block text-sm">Garment<select className="block border p-2 rounded-lg w-full" value={selectedGarment} onChange={e=>setSelectedGarment(e.target.value)}><option value="">Choose from the catalog</option>{products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label className="flex gap-2 text-xs"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} />I consent to sending this photo to the configured try-on provider. I have permission to use this photo.</label></div>
      {/* 1. Viewport / Split Screen */}
      <div className="flex-1 bg-porcelain rounded-2xl border border-border-light overflow-hidden shadow-sm flex flex-col items-center justify-center min-h-[520px] relative">
        {cameraActive ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-black">
            <video ref={videoRef} className="w-full h-full object-cover" />
            {/* AR Biometric guidelines */}
            <div className="absolute inset-0 pointer-events-none border-2 border-gold/40 m-8 rounded-3xl flex flex-col items-center justify-between py-6">
              <div className="w-24 h-32 rounded-full border border-gold/60" />
              <div className="w-48 h-0.5 bg-gold/40" />
              <div className="w-40 h-0.5 bg-gold/40" />
            </div>

            <button
              onClick={capturePhoto}
              className="absolute bottom-6 bg-gold hover:bg-gold-light text-obsidian px-6 py-3 rounded-full font-mono font-bold text-xs shadow-xl tracking-wider uppercase transition-colors"
            >
              SNAP PHOTO
            </button>
          </div>
        ) : photo ? (
          <div className="relative w-full h-full min-h-[520px] select-none">
            {resultPhoto ? (
              // Split Slider
              <div className="relative w-full h-full overflow-hidden">
                <img src={resultPhoto} alt="Tailored Result" className="w-full h-full object-cover" />
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden"
                  style={{ width: `${splitPos}%` }}
                >
                  <img
                    src={photo}
                    alt="Original Photo"
                    className="w-full h-full object-cover max-w-none"
                    style={{ width: '100%' }}
                  />
                </div>
                {/* Divider bar */}
                <div
                  className="absolute inset-y-0 w-1 bg-porcelain shadow-lg cursor-ew-resize"
                  style={{ left: `${splitPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-obsidian text-porcelain flex items-center justify-center shadow-lg border-2 border-porcelain">
                    <ArrowLeftRight size={14} />
                  </div>
                </div>
                {/* Invisible input range */}
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={splitPos}
                  onChange={(e) => setSplitPos(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
                />
              </div>
            ) : (
              <img src={photo} alt="Raw Input" className="w-full h-full object-cover" />
            )}
          </div>
        ) : (
          <div className="text-center p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-alabaster flex items-center justify-center text-gray-400 mx-auto border border-border-light">
              <Camera size={28} />
            </div>
            <div>
              <h3 className="font-headline font-bold text-base text-obsidian uppercase">
                NO PHOTO LOADED
              </h3>
              <p className="text-xs font-mono text-gray-500 mt-1 max-w-sm">
                Take a photo with your webcam or upload a full-body portrait for AI neural garment draping.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={startCamera}
                className="bg-obsidian hover:bg-gold text-porcelain hover:text-obsidian px-4 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-colors flex items-center gap-1.5"
              >
                <Camera size={14} />
                <span>OPEN CAMERA</span>
              </button>
              <label className="bg-alabaster hover:bg-gray-200 text-obsidian border border-border-light px-4 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-colors cursor-pointer flex items-center gap-1.5">
                <Upload size={14} />
                <span>UPLOAD FILE</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 2. Controls Panel */}
      <div className="w-full lg:w-88 space-y-6">
        <div className="p-6 bg-porcelain rounded-2xl border border-border-light shadow-sm space-y-4">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
            AI VIRTUAL FITTING PROTOCOL
          </span>
          <h2 className="font-headline font-black text-xl text-obsidian tracking-tight uppercase">
            LIVE AR DRAPE
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed font-body">
            Our neural draping engine aligns garment seams to your shoulders and chest contours with millimeter accuracy.
          </p>

          {photo && (
            <div className="space-y-3 pt-2">
              <button
                onClick={handleGenerateTryOn}
                disabled={loading}
                className="w-full bg-vermillion hover:bg-vermillion-glow text-porcelain py-3.5 rounded-xl font-mono font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Sparkles size={16} />
                <span>{loading ? 'DRAPING ONTO PHOTO...' : 'GENERATE AI TRY-ON'}</span>
              </button>

              <button
                onClick={() => {
                  setPhoto(null);
                  setResultPhoto(null);
                  stopCamera();
                }}
                className="w-full bg-alabaster hover:bg-gray-200 text-obsidian py-2.5 rounded-lg font-mono text-xs font-bold border border-border-light transition-colors"
              >
                RETAKE / RESET PHOTO
              </button>
            </div>
          )}

          {providerNotice && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs font-mono text-amber-800 flex items-start gap-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-600" />
              <span>{providerNotice}</span>
            </div>
          )}
        </div>

        {/* Quality Guidelines */}
        <div className="p-5 bg-alabaster rounded-xl border border-border-light text-xs font-mono space-y-2 text-gray-600">
          <span className="font-bold text-obsidian block uppercase">FOR OPTIMAL FITTING:</span>
          <ul className="list-disc pl-4 space-y-1 text-[11px]">
            <li>Stand in good frontal lighting with camera at chest height.</li>
            <li>Wear fitted clothing (tee or tank) for accurate landmark detection.</li>
            <li>Ensure entire upper body is visible in the viewfinder.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
