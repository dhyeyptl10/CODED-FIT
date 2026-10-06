'use client';
import {useEffect} from 'react';
import {api} from '@/services/api';
import {useAuthStore} from '@/store/authStore';
import {useCartStore} from '@/store/cartStore';
export function SessionRestore(){
 useEffect(()=>{
  let active=true;
  const restore=()=>{
   void useCartStore.persist.rehydrate();
   const token=localStorage.getItem('coded_token');
   if(!token){useAuthStore.setState({user:null,token:null,isAuthenticated:false});return;}
   api.getMe().then(({user})=>{if(active&&localStorage.getItem('coded_token')===token)useAuthStore.getState().setAuth(user,token);}).catch(()=>{/* A temporary connection failure must not erase a session. */});
  };
  const storage=(event:StorageEvent)=>{if(event.key==='coded-fit-cart-v2')void useCartStore.persist.rehydrate();else if(event.key==='coded_token')restore();};
  restore();window.addEventListener('storage',storage);window.addEventListener('codedfit:resume',restore);
  return()=>{active=false;window.removeEventListener('storage',storage);window.removeEventListener('codedfit:resume',restore);};
 },[]);
 return null;
}
