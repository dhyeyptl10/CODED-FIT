'use client';
import {useEffect,useState,useCallback} from 'react';
import {Product} from '@coded-fit/shared';
import {api} from '@/services/api';
export function useCatalog(){
 const [products,setProducts]=useState<Product[]>([]),[error,setError]=useState(''),[loading,setLoading]=useState(true),[attempt,setAttempt]=useState(0);
 const retry=useCallback(()=>setAttempt(n=>n+1),[]);
 useEffect(()=>{let active=true;setLoading(true);setError('');api.getProducts().then(data=>{if(active)setProducts(data.products.map(p=>({...p,id:p._id||p.id})));}).catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[attempt]);
 return {products,error,loading,retry};
}
