/**
 * CODED FIT — Garment-aware customization catalog
 * One editor, multiple real garment silhouettes + print zones.
 */
const GARMENTS = [
  {
    id:'tee-classic', name:'Classic T-Shirt', category:'T-Shirts', basePrice:999, printPrice:299,
    fabrics:['280 GSM Organic Cotton','240 GSM Combed Cotton','220 GSM Pique'],
    sizes:['XS','S','M','L','XL','XXL'],
    colors:[
      {id:'black',label:'Black',hex:'#17181b'},{id:'white',label:'White',hex:'#f7f7f5'},
      {id:'red',label:'Red',hex:'#d71920'},{id:'sky',label:'Sky Blue',hex:'#75c8ee'},
      {id:'cream',label:'Cream',hex:'#e8ddc8'},{id:'navy',label:'Navy',hex:'#20324a'}
    ],
    svgViewBox:{w:400,h:520},
    printAreas:{
      front:{x:128,y:145,w:144,h:205}, back:{x:128,y:145,w:144,h:205},
      leftSleeve:{x:74,y:112,w:50,h:90}, rightSleeve:{x:276,y:112,w:50,h:90}
    },
    silhouette:{front:`<path class="garment-body-fill" d="M145 55 Q200 82 255 55 L345 105 L307 205 L270 188 L270 460 Q200 475 130 460 L130 188 L93 205 L55 105 Z"/><path class="garment-detail" d="M145 55 Q200 86 255 55 M130 188 L145 55 M270 188 L255 55 M132 451 Q200 466 268 451"/>`,
      back:`<path class="garment-body-fill" d="M145 55 Q200 48 255 55 L345 105 L307 205 L270 188 L270 460 Q200 475 130 460 L130 188 L93 205 L55 105 Z"/><path class="garment-detail" d="M145 55 Q200 48 255 55 M130 188 L145 55 M270 188 L255 55 M132 451 Q200 466 268 451"/>`}
  },
  {
    id:'oversized-tee', name:'Oversized T-Shirt', category:'T-Shirts', basePrice:1299, printPrice:349,
    fabrics:['280 GSM Heavyweight Cotton','300 GSM Premium Jersey'], sizes:['XS','S','M','L','XL','XXL'],
    colors:[
      {id:'black',label:'Black',hex:'#17181b'},{id:'white',label:'White',hex:'#f7f7f5'},
      {id:'sky',label:'Sky Blue',hex:'#75c8ee'},{id:'red',label:'Red',hex:'#d71920'},
      {id:'sand',label:'Sand',hex:'#cbb89b'},{id:'forest',label:'Forest',hex:'#324d3d'}
    ],
    svgViewBox:{w:440,h:540},
    printAreas:{front:{x:138,y:150,w:164,h:220},back:{x:138,y:150,w:164,h:220},leftSleeve:{x:67,y:120,w:62,h:105},rightSleeve:{x:311,y:120,w:62,h:105}},
    silhouette:{front:`<path class="garment-body-fill" d="M140 54 Q220 92 300 54 L395 102 L348 228 L302 205 L302 475 Q220 493 138 475 L138 205 L92 228 L45 102 Z"/><path class="garment-detail" d="M140 54 Q220 94 300 54 M138 205 L140 54 M302 205 L300 54 M140 465 Q220 485 300 465"/>`,
      back:`<path class="garment-body-fill" d="M140 54 Q220 45 300 54 L395 102 L348 228 L302 205 L302 475 Q220 493 138 475 L138 205 L92 228 L45 102 Z"/><path class="garment-detail" d="M140 54 Q220 45 300 54 M138 205 L140 54 M302 205 L300 54 M140 465 Q220 485 300 465"/>`}
  },
  {
    id:'hoodie-heavy', name:'Heavyweight Hoodie', category:'Hoodies', basePrice:1999, printPrice:399,
    fabrics:['450 GSM French Terry','380 GSM Brushed Fleece','500 GSM Premium Loopback'], sizes:['S','M','L','XL','XXL'],
    colors:[
      {id:'black',label:'Black',hex:'#141518'},{id:'white',label:'Off White',hex:'#f3f1eb'},
      {id:'red',label:'Red',hex:'#d71920'},{id:'sky',label:'Sky Blue',hex:'#75c8ee'},
      {id:'grey',label:'Heather Grey',hex:'#8b8d91'},{id:'sage',label:'Sage',hex:'#82947f'}
    ],
    svgViewBox:{w:440,h:560},
    printAreas:{front:{x:140,y:170,w:160,h:220},back:{x:140,y:170,w:160,h:220},leftSleeve:{x:55,y:125,w:70,h:150},rightSleeve:{x:315,y:125,w:70,h:150}},
    silhouette:{front:`<path class="garment-body-fill" d="M154 75 Q220 105 286 75 L390 130 L346 250 L300 225 L300 495 Q220 515 140 495 L140 225 L94 250 L50 130 Z"/><path class="garment-detail" d="M154 75 Q220 105 286 75 L268 42 Q220 15 172 42 Z M160 78 Q220 118 280 78 M140 225 L154 75 M300 225 L286 75 M158 485 Q220 505 282 485"/>`,
      back:`<path class="garment-body-fill" d="M154 75 Q220 55 286 75 L390 130 L346 250 L300 225 L300 495 Q220 515 140 495 L140 225 L94 250 L50 130 Z"/><path class="garment-detail" d="M154 75 Q220 55 286 75 L268 42 Q220 15 172 42 Z M140 225 L154 75 M300 225 L286 75 M158 485 Q220 505 282 485"/>`}
  },
  {
    id:'boxy-shirt', name:'Boxy Oxford Shirt', category:'Shirts', basePrice:1799, printPrice:349,
    fabrics:['180 GSM Oxford Cotton','160 GSM Poplin','210 GSM Twill'], sizes:['S','M','L','XL','XXL'],
    colors:[
      {id:'white',label:'White',hex:'#f7f7f4'},{id:'sky',label:'Sky Blue',hex:'#75c8ee'},
      {id:'red',label:'Red',hex:'#d71920'},{id:'black',label:'Black',hex:'#17181b'},
      {id:'blue',label:'Powder Blue',hex:'#a7cde2'},{id:'cream',label:'Cream',hex:'#e9dfcf'}
    ],
    svgViewBox:{w:440,h:560},
    printAreas:{front:{x:145,y:150,w:150,h:240},back:{x:145,y:150,w:150,h:240},leftSleeve:{x:52,y:115,w:74,h:160},rightSleeve:{x:314,y:115,w:74,h:160}},
    silhouette:{front:`<path class="garment-body-fill" d="M162 62 L205 80 L220 94 L235 80 L278 62 L390 120 L342 245 L300 222 L300 500 L140 500 L140 222 L98 245 L50 120 Z"/><path class="garment-detail" d="M162 62 L205 80 L220 112 L235 80 L278 62 M220 112 L220 500 M146 205 L205 220 M294 205 L235 220 M220 112 L205 80 L220 65 L235 80 Z M142 490 L298 490"/>`,
      back:`<path class="garment-body-fill" d="M162 62 L205 80 L220 94 L235 80 L278 62 L390 120 L342 245 L300 222 L300 500 L140 500 L140 222 L98 245 L50 120 Z"/><path class="garment-detail" d="M162 62 L205 80 L220 105 L235 80 L278 62 M140 222 L162 62 M300 222 L278 62 M142 490 L298 490"/>`}
  },
  {
    id:'cargo-pants', name:'Relaxed Cargo Pants', category:'Pants', basePrice:2299, printPrice:299,
    fabrics:['320 GSM Ripstop','280 GSM Cotton Twill','Nylon Utility Blend'], sizes:['28','30','32','34','36','38','40'],
    colors:[
      {id:'black',label:'Black',hex:'#17181b'},{id:'olive',label:'Olive',hex:'#59624b'},
      {id:'beige',label:'Sand',hex:'#c9b99e'},{id:'sky',label:'Sky Blue',hex:'#75c8ee'},
      {id:'red',label:'Red',hex:'#d71920'}
    ],
    svgViewBox:{w:440,h:600},
    printAreas:{front:{x:122,y:95,w:80,h:350},back:{x:238,y:95,w:80,h:350},leftLeg:{x:122,y:95,w:80,h:350},rightLeg:{x:238,y:95,w:80,h:350}},
    silhouette:{front:`<path class="garment-body-fill" d="M118 48 L206 55 L215 300 L205 555 L105 555 L120 300 Z M222 55 L312 48 L320 300 L335 555 L235 555 L225 300 Z"/><path class="garment-detail" d="M120 92 L200 100 M240 100 L320 92 M110 300 L205 300 M235 300 L330 300 M118 500 L205 500 M235 500 L330 500"/>`,
      back:`<path class="garment-body-fill" d="M118 48 L206 55 L215 300 L205 555 L105 555 L120 300 Z M222 55 L312 48 L320 300 L335 555 L235 555 L225 300 Z"/><path class="garment-detail" d="M120 92 L200 100 M240 100 L320 92 M110 300 L205 300 M235 300 L330 300 M118 500 L205 500 M235 500 L330 500"/>`}
  }
];

function getGarmentById(id){ return GARMENTS.find(g=>g.id===id)||GARMENTS[0]; }
