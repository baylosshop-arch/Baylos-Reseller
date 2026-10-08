/* ============================================================
   PRODUCT DETAIL — mobile friendly modal
   ============================================================ */
function openProductDetail(productId){
  const p=products.find(x=>x.id===productId); if(!p) return;
  let modal=document.getElementById('productDetailModal');
  if(!modal){
    modal=document.createElement('div');
    modal.id='productDetailModal';
    modal.className='fixed inset-0 z-[145] modal-backdrop p-3 sm:p-5 overflow-y-auto';
    document.body.appendChild(modal);
  }
  const images=(Array.isArray(p.images)&&p.images.length?p.images:[p.image,p.image,p.image]).filter(Boolean);
  const tier=BAYLOS_CONFIG.tiers[currentTier];
  const price=calculateWholesalePrice(p.msrp);
  modal.innerHTML=`<div class="min-h-full flex items-center justify-center"><div class="w-full max-w-5xl bg-card rounded-3xl overflow-hidden border border-white/10 shadow-luxury"><div class="flex items-center justify-between p-4 sm:p-5 border-b border-white/5"><div><p class="text-gold text-[10px] uppercase tracking-[.2em] font-bold">Product Detail</p><h2 class="font-display text-2xl sm:text-3xl mt-1">${escapeHTML(p.name)}</h2></div><button onclick="closeProductDetail()" class="btn-dark w-10 h-10 rounded-xl flex items-center justify-center"><i data-lucide="x" class="w-4 h-4"></i></button></div><div class="grid lg:grid-cols-2"><div class="p-3 sm:p-5"><div id="detailMedia" class="relative aspect-[4/4.7] rounded-2xl overflow-hidden bg-obsidian"><div class="absolute inset-0">${images.map((src,i)=>`<img src="${escapeAttribute(src)}" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${i?'opacity-0':'opacity-100'}" data-detail-img="${i}" alt="${escapeAttribute(p.name)} ${i+1}">`).join('')}</div><button onclick="detailPrev()" class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-obsidian/80 border border-white/10 flex items-center justify-center"><i data-lucide="chevron-left" class="w-4 h-4"></i></button><button onclick="detailNext()" class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-obsidian/80 border border-white/10 flex items-center justify-center"><i data-lucide="chevron-right" class="w-4 h-4"></i></button><div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">${images.map((_,i)=>`<button onclick="detailShow(${i})" data-detail-dot="${i}" class="h-1.5 rounded-full ${i?'w-1.5 bg-white/40':'w-5 bg-gold'}"></button>`).join('')}</div></div></div><div class="p-5 sm:p-7"><div class="flex flex-wrap gap-2 mb-5"><span class="admin-chip px-3 py-1.5 rounded-lg text-[10px]">${escapeHTML(p.sku)}</span><span class="stock-ready px-3 py-1.5 rounded-lg border text-[10px] font-bold">${p.stock>0?'Ready Stock':'Out of Stock'}</span></div><p class="text-xs text-zinc-500">${escapeHTML(p.category)}</p><div class="mt-5"><p class="text-xs text-zinc-500 line-through">${formatRupiah(p.msrp)}</p><p class="font-display text-3xl text-gold mt-1">${formatRupiah(price)}</p><p class="text-xs text-zinc-500 mt-1">Harga ${tier.label} untuk partner Anda</p></div><p class="text-sm text-zinc-300 leading-6 mt-6">${escapeHTML(p.caption||'Produk Baylos untuk kebutuhan wholesale partner.')}</p><div class="grid grid-cols-2 gap-2 mt-7"><button onclick="closeProductDetail();openMediaModal(products.find(x=>x.id==='${escapeAttribute(p.id)}'))" class="btn-dark h-11 rounded-xl text-xs font-semibold">Download Aset</button><button onclick="closeProductDetail();openOrderDrawer(products.find(x=>x.id==='${escapeAttribute(p.id)}'))" class="btn-gold h-11 rounded-xl text-xs font-bold">+ Order Grosir</button></div></div></div></div></div>`;
  modal.classList.remove('hidden');
  window._detailIndex=0; window._detailImages=images;
  lucide.createIcons();
  const media=modal.querySelector('#detailMedia'); let sx=0;
  media.addEventListener('touchstart',e=>sx=e.changedTouches[0].clientX,{passive:true});
  media.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>40) detailShow(window._detailIndex+(d<0?1:-1));},{passive:true});
}
function detailShow(n){const imgs=document.querySelectorAll('[data-detail-img]'); if(!imgs.length)return; window._detailIndex=(n+imgs.length)%imgs.length; imgs.forEach((x,i)=>x.classList.toggle('opacity-100',i===window._detailIndex)||x.classList.toggle('opacity-0',i!==window._detailIndex)); document.querySelectorAll('[data-detail-dot]').forEach((x,i)=>{x.classList.toggle('bg-gold',i===window._detailIndex);x.classList.toggle('w-5',i===window._detailIndex);x.classList.toggle('bg-white/40',i!==window._detailIndex);x.classList.toggle('w-1.5',i!==window._detailIndex);});}
function detailPrev(){detailShow((window._detailIndex||0)-1)}
function detailNext(){detailShow((window._detailIndex||0)+1)}
function closeProductDetail(){const m=document.getElementById('productDetailModal');if(m)m.remove();}
