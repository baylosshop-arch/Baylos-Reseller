/* Product media carousel component */
window.BaylosProductCarousel = {
  getImages(product){
    const list = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
    if (list.length) return list;
    return product.image ? [product.image] : ["https://placehold.co/800x1000?text=Baylos"];
  },
  markup(product){
    const images=this.getImages(product);
    const id=String(product.id).replace(/[^a-zA-Z0-9_-]/g,"");
    return `
      <div class="product-media-carousel" data-carousel="${id}">
        <div class="product-media-track">
          ${images.map((src,i)=>`
            <div class="product-media-slide">
              <img src="${src}" alt="${String(product.name||"Baylos").replace(/"/g,"&quot;")}" loading="${i===0?"eager":"lazy"}"
                   onerror="this.src='https://placehold.co/800x1000?text=Baylos'">
            </div>`).join("")}
        </div>
        ${images.length>1?`
          <div class="product-media-nav">
            <button type="button" data-carousel-prev aria-label="Foto sebelumnya"><i data-lucide="chevron-left" class="w-4 h-4"></i></button>
            <button type="button" data-carousel-next aria-label="Foto berikutnya"><i data-lucide="chevron-right" class="w-4 h-4"></i></button>
          </div>
          <div class="product-media-dots">
            ${images.map((_,i)=>`<button type="button" class="product-media-dot ${i===0?"active":""}" data-carousel-dot="${i}" aria-label="Foto ${i+1}"></button>`).join("")}
          </div>
          <div class="product-photo-hint">Geser untuk lihat foto</div>
          <div class="product-photo-counter"><span data-carousel-count>1</span>/${images.length}</div>
        `:""}
      </div>`;
  },
  init(root=document){
    root.querySelectorAll("[data-carousel]").forEach(carousel=>{
      if(carousel.dataset.ready==="1") return;
      carousel.dataset.ready="1";
      const track=carousel.querySelector(".product-media-track");
      const slides=carousel.querySelectorAll(".product-media-slide");
      if(slides.length<2) return;
      let index=0,startX=0,dragging=false;
      const go=(next)=>{
        index=(next+slides.length)%slides.length;
        track.style.transform=`translateX(-${index*100}%)`;
        carousel.querySelectorAll(".product-media-dot").forEach((d,i)=>d.classList.toggle("active",i===index));
        const counter=carousel.querySelector("[data-carousel-count]");
        if(counter) counter.textContent=String(index+1);
      };
      carousel.querySelector("[data-carousel-prev]")?.addEventListener("click",e=>{e.stopPropagation();go(index-1)});
      carousel.querySelector("[data-carousel-next]")?.addEventListener("click",e=>{e.stopPropagation();go(index+1)});
      carousel.querySelectorAll("[data-carousel-dot]").forEach(d=>d.addEventListener("click",e=>{e.stopPropagation();go(Number(d.dataset.carouselDot))}));
      carousel.addEventListener("pointerdown",e=>{startX=e.clientX;dragging=true;carousel.setPointerCapture?.(e.pointerId)});
      carousel.addEventListener("pointerup",e=>{
        if(!dragging) return; dragging=false;
        const dx=e.clientX-startX;
        if(Math.abs(dx)>45) go(dx<0?index+1:index-1);
      });
      carousel.addEventListener("pointercancel",()=>dragging=false);
    });
  }
};