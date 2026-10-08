/* ============================================================
   PRODUCT RENDERING
   ============================================================ */

function renderProducts() {

    const search = $("#searchInput").value.trim().toLowerCase();

    const category = $("#categoryFilter").value;

    const stockFilter = $("#stockFilter").value;

    const filteredProducts = products.filter(product => product.active !== false).filter(product => {

        const matchesSearch =
            !search ||
            product.name.toLowerCase().includes(search) ||
            product.sku.toLowerCase().includes(search);

        const matchesCategory =
            category === "all" ||
            product.category === category;

        const matchesStock =
            stockFilter === "all" ||
            (
                stockFilter === "ready" &&
                product.stock >= 10
            ) ||
            (
                stockFilter === "low" &&
                product.stock < 10
            );

        return matchesSearch &&
               matchesCategory &&
               matchesStock;
    });

    const grid = $("#productGrid");

    grid.innerHTML = "";

    filteredProducts.forEach(product => {

        grid.appendChild(
            createProductCard(product)
        );
    });

    $("#emptyProducts").classList.toggle(
        "hidden",
        filteredProducts.length > 0
    );

    $("#productGrid").classList.toggle(
        "hidden",
        filteredProducts.length === 0
    );

    $("#productCount").textContent =
        `${filteredProducts.length} Items`;

    if (!search && category === "all" && stockFilter === "all") {

        $("#filterResultText").textContent =
            "Menampilkan semua produk";

    } else {

        $("#filterResultText").textContent =
            `${filteredProducts.length} produk sesuai filter`;
    }

    lucide.createIcons();
}


function createProductCard(product) {
    const article=document.createElement("article"); article.className="product-card bg-card rounded-2xl border border-white/5 overflow-hidden";
    const stockClass=product.stock<10?"stock-low":"stock-ready", stockText=product.stock<10?`Sisa ${product.stock} pcs`:`Ready: ${product.stock} pcs`, wholesalePrice=calculateWholesalePrice(product.msrp), tier=BAYLOS_CONFIG.tiers[currentTier];
    const images=Array.isArray(product.images)&&product.images.length>=3?product.images:[product.image,product.image,product.image];
    article.innerHTML=`<div class="product-media relative aspect-[4/4.6] overflow-hidden bg-zinc-900"><div class="absolute inset-0 product-slides"></div><button type="button" data-carousel="prev" class="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-obsidian/80 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-obsidian transition"><i data-lucide="chevron-left" class="w-4 h-4"></i></button><button type="button" data-carousel="next" class="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-obsidian/80 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-obsidian transition"><i data-lucide="chevron-right" class="w-4 h-4"></i></button><div class="absolute top-3 left-3 z-10"><span class="px-2.5 py-1.5 rounded-lg bg-obsidian/80 text-[10px] uppercase tracking-wider text-champagne border border-white/10">${escapeHTML(product.category)}</span></div><div class="absolute top-3 right-3 z-10"><span class="px-2.5 py-1.5 rounded-lg ${stockClass} border text-[10px] font-bold">${stockText}</span></div><div class="absolute bottom-3 left-3 right-3 z-10 flex justify-between"><span class="px-2.5 py-1.5 rounded-lg bg-black/60 text-[10px] text-zinc-300 border border-white/10">${escapeHTML(product.sku)}</span><span class="px-2.5 py-1.5 rounded-lg bg-black/60 text-[10px] text-zinc-300 border border-white/10" data-photo-counter>1 / ${images.length}</span></div><div class="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5" data-dots>${images.map((_,i)=>`<button type="button" data-dot="${i}" class="h-1.5 rounded-full ${i===0?'bg-gold w-5':'bg-white/40 w-1.5'} transition-all"></button>`).join('')}</div></div><div class="p-5"><h3 class="font-display text-xl leading-tight">${escapeHTML(product.name)}</h3><p class="text-xs text-zinc-600 mt-1">${escapeHTML(product.category)}</p><div class="mt-5 space-y-2"><div class="flex items-center justify-between"><span class="text-xs text-zinc-600">MSRP</span><span class="text-xs text-zinc-500 line-through">${formatRupiah(product.msrp)}</span></div><div class="flex items-end justify-between gap-2"><div><p class="text-[10px] uppercase tracking-wider text-gold">Harga Modal Reseller</p><p class="font-semibold text-lg text-ivory mt-1">${formatRupiah(wholesalePrice)}</p></div><span class="text-[10px] px-2 py-1 rounded-md bg-gold/10 text-gold border border-gold/10">${tier.label}</span></div></div><div class="grid gap-2 mt-5"><button type="button" data-action="media" data-product-id="${product.id}" class="btn-dark h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"><i data-lucide="download" class="w-4 h-4 text-gold"></i>Download Aset</button><button type="button" data-action="order" data-product-id="${product.id}" class="btn-gold h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-2"><i data-lucide="shopping-bag" class="w-4 h-4"></i>+ Order Grosir</button></div></div>`;
    const media=article.querySelector('.product-media'), slides=article.querySelector('.product-slides'); slides.innerHTML=images.map((src,i)=>`<img src="${src}" alt="${escapeHTML(product.name)} - foto ${i+1}" class="product-image absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${i===0?'opacity-100':'opacity-0'}" loading="lazy" draggable="false">`).join('');
    let index=0; const imgs=[...slides.querySelectorAll('img')], counter=article.querySelector('[data-photo-counter]'), dots=[...article.querySelectorAll('[data-dot]')];
    const showImage=n=>{index=(n+images.length)%images.length;imgs.forEach((img,i)=>{img.classList.toggle('opacity-100',i===index);img.classList.toggle('opacity-0',i!==index)});counter.textContent=`${index+1} / ${images.length}`;dots.forEach((d,i)=>{d.classList.toggle('bg-gold',i===index);d.classList.toggle('bg-white/40',i!==index);d.classList.toggle('w-5',i===index);d.classList.toggle('w-1.5',i!==index)})};
    article.querySelector('[data-carousel="prev"]').addEventListener('click',e=>{e.stopPropagation();showImage(index-1)}); article.querySelector('[data-carousel="next"]').addEventListener('click',e=>{e.stopPropagation();showImage(index+1)}); dots.forEach(d=>d.addEventListener('click',e=>{e.stopPropagation();showImage(Number(d.dataset.dot))}));
    let touchStartX=0; media.addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0].clientX},{passive:true}); media.addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-touchStartX;if(Math.abs(delta)>40)showImage(index+(delta<0?1:-1))},{passive:true});
    article.querySelectorAll('button[data-action]').forEach(button=>button.addEventListener('click',()=>{const selectedProduct=products.find(item=>item.id===button.dataset.productId);if(!selectedProduct)return;if(button.dataset.action==='media')openMediaModal(selectedProduct);else openOrderDrawer(selectedProduct)})); return article;
}
