'use client';
import {useState} from 'react';
import {useCustomizerStore} from '@/store/customizerStore';
import {useAuthStore} from '@/store/authStore';
import {api} from '@/services/api';
export function SavedLooks(){
  const [looks,setLooks]=useState<any[]>([]);const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);
  const {isAuthenticated,openLoginModal}=useAuthStore();
  async function run(save:boolean){if(!isAuthenticated){openLoginModal('email');return;}setBusy(true);try{if(save)await api.saveDesign({name:'My '+useCustomizerStore.getState().garmentType,configuration:useCustomizerStore.getState().getCustomizationSnapshot()});const data=await api.getDesigns();setLooks(data.designs);setMessage(save?'Outfit saved to your account.':'Saved outfits loaded.');}catch(e:any){setMessage(e.message);}finally{setBusy(false);}}
  return <section className="p-4 border rounded-xl bg-white space-y-3"><div className="flex gap-4 text-sm"><button disabled={busy} onClick={()=>run(true)}>Save outfit</button><button disabled={busy} onClick={()=>run(false)}>My wardrobe</button><a href="/try-on">Try on a real photo →</a></div><p role="status" className="text-xs text-stone-600">{message || 'Save a look, change garments, and compare your own outfits.'}</p><div className="flex flex-wrap gap-2">{looks.map(l=><button className="border rounded-lg p-2 text-xs" key={l._id} onClick={()=>{const c=l.configuration;useCustomizerStore.setState({garmentType:c.garmentType,colorHex:c.colorHex,colorName:c.colorName,fit:c.fit,collar:c.collar,cuff:c.cuff,button:c.button,fabricId:c.fabricId,fabricName:c.fabricName,monogramText:c.monogram?.text || '',monogramEnabled:!!c.monogram?.enabled});}}>{l.name}</button>)}</div></section>;
}
