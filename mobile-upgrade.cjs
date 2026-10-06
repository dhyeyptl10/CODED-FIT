const fs=require('fs');const edit=(p,fn)=>fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')));
fs.mkdirSync('mobile-app/legacy',{recursive:true});
for(const [file,path] of Object.entries({'(tabs)/shop':'/shop','(tabs)/cart':'/cart','(tabs)/bespoke':'/visualizer','(tabs)/tryon':'/try-on','design-studio':'/studio'})){
  const source='mobile-app/app/'+file+'.tsx';fs.copyFileSync(source,'mobile-app/legacy/'+file.replace('(tabs)/','')+'.tsx');
  fs.writeFileSync(source,`import React from 'react';\nimport Storefront from '${file.startsWith('(tabs)')?'../../':'../'}components/Storefront';\nexport default function Screen(){return <Storefront path="${path}" />;}\n`);
}
edit('mobile-app/tsconfig.json',s=>{const p=JSON.parse(s);p.exclude=[...(p.exclude || []),'legacy'];return JSON.stringify(p,null,2)});
edit('mobile-app/app/login.tsx',s=>s.replace("import AsyncStorage from", "import {getApiBaseUrl} from '../services/api';\nimport AsyncStorage from").replace(/\/\/ ── Dummy credentials[\s\S]*?export default/, 'export default').replace(/    \/\/ Simulate API delay[\s\S]*?\n    setLoading\(false\);\n  \};/,`    try {
      const base=await getApiBaseUrl();
      const response=await fetch(base+'/auth/'+(mode==='signup'?'register':'login'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.trim(),password,name:name.trim()})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.message || 'Authentication failed');
      await AsyncStorage.setItem('@CODED_FIT_TOKEN',data.token);
      await AsyncStorage.setItem('CF_USER',JSON.stringify({...data.user,loggedIn:true}));
      router.replace('/(tabs)');
    }catch(e:any){Alert.alert('Sign-in failed',e.message);}finally{setLoading(false);}
  };`).replace(/ADMIN_CREDS.email/g,"'Your administrator email'").replace(/ADMIN_CREDS.password/g,"'Your password'").replace(/DEMO_CUSTOMER.email/g,"''").replace(/DEMO_CUSTOMER.password/g,"''"));
edit('mobile-app/app/login.tsx',s=>s.replace("await AsyncStorage.setItem('CF_USER', JSON.stringify({ role: 'guest', loggedIn: false }));","await AsyncStorage.removeItem('@CODED_FIT_TOKEN');\n    await AsyncStorage.setItem('CF_USER', JSON.stringify({ role: 'guest', loggedIn: false }));"));
