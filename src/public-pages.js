const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const known = new Set(['/','/index','/urunler','/siparis','/hakkimizda','/sektorler','/iletisim','/kvkk','/referanslar']);

export async function publicPage(request,env,url){
 const path=url.pathname.replace(/\.html$/,'').replace(/\/$/,'')||'/';
 if(!known.has(path) && (!/\.[a-z0-9]+$/i.test(url.pathname) || /\.html$/i.test(url.pathname)))return notFound(request,env);
 const response=await env.ASSETS.fetch(request);
 if(!known.has(path) && (response.headers.get('content-type')||'').includes('text/html'))return notFound(request,env);
 if(path!=='/urunler' || !response.ok)return response;
 const p=url.searchParams;
 const key=p.get('u')?'u='+p.get('u'):p.get('g')?'g='+p.get('g')+(p.get('a')?'&a='+p.get('a'):''):'';
 if(!key){
  if(!p.get('q'))return response;
  const html=(await response.text()).replace('</head>','<meta name="robots" content="noindex, follow"></head>');
  const headers=new Headers(response.headers);headers.delete('content-length');headers.delete('etag');
  return new Response(request.method==='HEAD'?null:html,{status:200,headers});
 }
 const dataResponse=await env.ASSETS.fetch(new Request(new URL('/catalog-pages.json',url)));
 if(!dataResponse.ok)return response;
 const data=await dataResponse.json();
 const info=data[key];
 // Preserve legacy category aliases; the client resolves those.
 if(!info){if(p.get('u'))return notFound(request,env);return response;}
 const canonical='https://ferrapro.com'+info.path;
 let html=await response.text();
 const title=info.name+' · FerraPro';
 html=html.replace(/<title>[^<]*<\/title>/,`<title>${escape(title)}</title>`)
 .replace(/(<meta name="description" content=")[^"]*/,(_,start)=>start+escape(info.description))
 .replace(/(<link rel="canonical" href=")[^"]*/,(_,start)=>start+escape(canonical));
 for(const [field,value]of Object.entries({title,description:info.description,url:canonical,image:info.image?'https://ferrapro.com'+info.image:'https://ferrapro.com/img/home/refresh-hero.webp'})){
  html=html.replace(new RegExp('(<meta property="og:'+field+'" content=")[^"]*'),(_,start)=>start+escape(value));
 }
 const crumbs=[{name:'Ana sayfa',item:'https://ferrapro.com/'},{name:'Ürünler',item:'https://ferrapro.com/urunler'}];
 if(info.group)crumbs.push({name:info.group,item:'https://ferrapro.com'+info.groupPath});
 if(info.sub)crumbs.push({name:info.sub,item:'https://ferrapro.com'+info.subPath});
 crumbs.push({name:info.name,item:canonical});
 const schema={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs.map((x,i)=>({'@type':'ListItem',position:i+1,...x}))};
 html=html.replace('</head>',`<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>${p.get('q')?'<meta name="robots" content="noindex, follow">':''}</head>`);
 html=html.replace('<h1 id="baslik">Ürünler</h1>',`<h1 id="baslik">${escape(info.name)}</h1>`);
 html=html.replace('<div id="liste"></div>',`<div id="liste"><p>${escape(info.description)}</p><a class="btn" href="/siparis?${escape(new URLSearchParams({satir:info.name}).toString())}">Görüşme talebi bırakın</a></div>`);
 const headers=new Headers(response.headers); headers.delete('content-length');headers.delete('etag');headers.set('content-type','text/html; charset=utf-8');
 return new Response(request.method==='HEAD'?null:html,{status:200,headers});
}

async function notFound(request,env){
 const response=await env.ASSETS.fetch(new Request(new URL('/404',request.url)));
 return new Response(request.method==='HEAD'?null:response.body,{status:404,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-cache'}});
}
