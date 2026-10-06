export function createProductCard(product,{onOrder,onAsset}={}){
const card=document.createElement("article");card.className="product-card";
const images=product.images?.length?product.images:["https://placehold.co/900x1100/18181b/d4af37?text=Baylos"];let index=0;
card.innerHTML=`<div class="photo-carousel"><div class="photo-track"></div><span class="stock-badge">${product.stock<=10?"LOW STOCK":"READY STOCK"} · ${product.stock}</span><span class="photo-counter">1 / ${images.length}</span><div class="photo-nav"><button class="photo-prev" type="button" aria-label="Foto sebelumnya"><i class="fa-solid fa-chevron-left"></i></button><button class="photo-next" type="button" aria-label="Foto berikutnya"><i class="fa-solid fa-chevron-right"></i></button></div><div class="photo-dots"></div></div><div class="card-body"><div class="product-category">${product.category}</div><div class="product-name">${escapeHtml(product.name)}</div><div class="sku">SKU ${escapeHtml(product.sku)}</div><div class="price-row"><div><div class="price-label">Harga reseller · GOLD 30%</div><div class="price">${money(product.msrp*.7)}</div></div><div class="msrp">${money(product.msrp)}</div></div><div class="card-actions"><button class="asset-btn" type="button"><i class="fa-regular fa-images"></i> Download Aset</button><button class="order-btn" type="button"><i class="fa-solid fa-plus"></i> Order Grosir</button></div></div>`;
const track=card.querySelector(".photo-track"),dots=card.querySelector(".photo-dots"),counter=card.querySelector(".photo-counter");
images.forEach((src,i)=>{const slide=document.createElement("div");slide.className="photo-slide";slide.innerHTML=`<img src="${src}" alt="${escapeHtml(product.name)} - foto ${i+1}" loading="${i?"lazy":"eager"}">`;track.appendChild(slide);const dot=document.createElement("span");dot.className=`photo-dot ${i===0?"active":""}`;dots.appendChild(dot)});
const render=()=>{track.style.transform=`translateX(-${index*100}%)`;counter.textContent=`${index+1} / ${images.length}`;dots.querySelectorAll(".photo-dot").forEach((d,i)=>d.classList.toggle("active",i===index))};
card.querySelector(".photo-prev").onclick=()=>{index=(index-1+images.length)%images.length;render()};
card.querySelector(".photo-next").onclick=()=>{index=(index+1)%images.length;render()};
card.querySelector(".asset-btn").onclick=()=>onAsset?.(product);card.querySelector(".order-btn").onclick=()=>onOrder?.(product);
let startX=0,delta=0;const viewport=card.querySelector(".photo-carousel");
viewport.addEventListener("pointerdown",e=>{startX=e.clientX;delta=0});
viewport.addEventListener("pointermove",e=>{if(startX)delta=e.clientX-startX});
viewport.addEventListener("pointerup",()=>{if(Math.abs(delta)>45){index=delta<0?(index+1)%images.length:(index-1+images.length)%images.length;render()}startX=0;delta=0});
return card;
}
function money(v){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Math.round(v))}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
