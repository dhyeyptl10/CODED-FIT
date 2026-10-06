'use client';
import {Suspense} from 'react';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import PrintStudio from '@/components/design-studio/PrintStudio';
import TailoringStudio from '@/components/bespoke/TailoringStudio';
function Studio(){const params=useSearchParams();return params.get('mode')==='tailoring'?<><div className="studio-mode-link"><Link href="/bespoke">← Back to garment & print studio</Link></div><TailoringStudio/></>:<PrintStudio/>;}
export default function Page(){return <Suspense fallback={<p className="p-8" role="status">Opening your studio…</p>}><Studio/></Suspense>;}
