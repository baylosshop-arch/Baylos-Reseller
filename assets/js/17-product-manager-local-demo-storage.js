/* ============================================================
   PRODUCT MANAGER / LOCAL DEMO STORAGE
   ============================================================ */
let editorPhotos = [];
let editorColors = [];
const PRODUCT_STORAGE_KEY = "baylosProducts";

function loadSavedProducts(){
  try{
    const raw=localStorage.getItem(PRODUCT_STORAGE_KEY);
    if(!raw) return;
    const saved=JSON.parse(raw);
    if(!Array.isArray(saved)) return;
    saved.forEach(sp=>{
      const idx=products.findIndex(p=>p.id===sp.id);
      if(idx>=0) products[idx]=Object.assign({},products[idx],sp);
      else products.push(sp);
    });
  }catch(e){ console.warn("Baylos product storage error",e); }
}
function persistProducts(){
  try{ localStorage.setItem(PRODUCT_STORAGE_KEY,JSON.stringify(products)); }
  catch(e){ showToast("Penyimpanan browser penuh. Kurangi ukuran foto atau hapus foto lama.","warning"); }
}
function openProductEditor(productId=null){
  const modal=$("#productEditorModal"); if(!modal)return;
  const product=productId?products.find(p=>p.id===productId):null;
  $("#productEditorTitle").textContent=product?"Edit Produk":"Tambah Produk";
  $("#editorProductId").value=product?.id||"";
  $("#editorName").value=product?.name||"";
  $("#editorSku").value=product?.sku||"";
  $("#editorCategory").value=product?.category||"Outerwear";
  $("#editorMsrp").value=product?.msrp||"";
  $("#editorStock").value=product?.stock??0;
  $("#editorActive").value=String(product?.active!==false);
  $("#editorVideo").value=product?.video||"";
  $("#editorCaption").value=product?.caption||"";
  editorPhotos=(product?.images||[]).slice(0,10).map(src=>({src}));
  editorColors=JSON.parse(JSON.stringify(product?.colors||[{name:"Black Obsidian",stock:{S:0,M:0,L:0,XL:0}},{name:"Champagne",stock:{S:0,M:0,L:0,XL:0}},{name:"Sage Green",stock:{S:0,M:0,L:0,XL:0}}]));
  renderEditorPhotos(); renderEditorColors();
  modal.classList.remove("hidden"); document.body.style.overflow="hidden"; lucide.createIcons();
}
function closeProductEditor(){
  $("#productEditorModal").classList.add("hidden");
  if($("#adminOverlay").classList.contains("hidden") && $("#mediaModal").classList.contains("hidden") && $("#orderOverlay").classList.contains("hidden")) document.body.style.overflow="";
}
function renderEditorPhotos(){
  const box=$("#editorPhotoPreview"), hint=$("#editorPhotoHint"), validation=$("#editorValidation");
  box.innerHTML=editorPhotos.map((photo,i)=>`<div class="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-zinc-900"><img src="${escapeAttribute(photo.src)}" class="w-full h-full object-cover" alt="Foto ${i+1}"><span class="absolute top-1.5 left-1.5 px-1.5 py-1 rounded-md bg-obsidian/85 text-[9px]">${i+1}</span><div class="absolute inset-x-1.5 bottom-1.5 flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition"><button type="button" onclick="moveEditorPhoto(${i},-1)" class="flex-1 h-7 rounded-md bg-obsidian/90 text-[9px]" ${i===0?'disabled':''}>←</button><button type="button" onclick="moveEditorPhoto(${i},1)" class="flex-1 h-7 rounded-md bg-obsidian/90 text-[9px]" ${i===editorPhotos.length-1?'disabled':''}>→</button><button type="button" onclick="removeEditorPhoto(${i})" class="flex-1 h-7 rounded-md bg-red-500/80 text-[9px]">×</button></div></div>`).join('');
  hint.textContent=editorPhotos.length<3?`Tambahkan ${3-editorPhotos.length} foto lagi. Minimal 3 foto wajib.`:`${editorPhotos.length}/10 foto siap. Foto pertama menjadi foto utama.`;
  validation.textContent=editorPhotos.length<3?`Minimal 3 foto diperlukan (${editorPhotos.length}/3).`:`${editorPhotos.length} foto siap disimpan.`;
  validation.className=`text-xs ${editorPhotos.length<3?'text-yellow-400':'text-green-400'}`;
}
function removeEditorPhoto(i){ editorPhotos.splice(i,1); renderEditorPhotos(); }
function moveEditorPhoto(i,d){ const j=i+d;if(j<0||j>=editorPhotos.length)return;[editorPhotos[i],editorPhotos[j]]=[editorPhotos[j],editorPhotos[i]];renderEditorPhotos(); }
async function compressImage(file){
  return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>{const img=new Image();img.onload=()=>{const max=1400,scale=Math.min(1,max/Math.max(img.width,img.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',.78));};img.onerror=reject;img.src=reader.result;};reader.onerror=reject;reader.readAsDataURL(file);});
}
async function handleEditorPhotoUpload(event){
  const files=Array.from(event.target.files||[]); if(!files.length)return;
  if(editorPhotos.length+files.length>10){showToast("Maksimal 10 foto per produk.","warning");event.target.value="";return;}
  showToast("Memproses foto...","info");
  for(const file of files){try{editorPhotos.push({src:await compressImage(file)});}catch(e){console.warn(e);}}
  event.target.value=""; renderEditorPhotos();
}
function addEditorColor(){editorColors.push({name:"Warna Baru",stock:{S:0,M:0,L:0,XL:0}});renderEditorColors();}
function removeEditorColor(i){editorColors.splice(i,1);renderEditorColors();}
function renderEditorColors(){
  const box=$("#editorColors");
  box.innerHTML=editorColors.map((c,i)=>`<div class="rounded-xl border border-white/5 p-3 grid grid-cols-[1fr_repeat(4,70px)_36px] gap-2 items-end overflow-x-auto"><label class="min-w-[130px]"><span class="text-[10px] text-zinc-600">Warna</span><input value="${escapeAttribute(c.name)}" oninput="editorColors[${i}].name=this.value" class="input-luxury h-10 px-3 text-xs mt-1 w-full"></label>${['S','M','L','XL'].map(size=>`<label class="min-w-[60px]"><span class="text-[10px] text-zinc-600">${size}</span><input type="number" min="0" value="${c.stock?.[size]||0}" oninput="editorColors[${i}].stock.${size}=Math.max(0,parseInt(this.value||0,10))" class="input-luxury h-10 px-2 text-xs mt-1 w-full text-center"></label>`).join('')}<button type="button" onclick="removeEditorColor(${i})" class="w-9 h-10 rounded-lg bg-red-500/10 text-red-300">×</button></div>`).join('');
}
function saveProductFromEditor(event){
  event.preventDefault();
  if(editorPhotos.length<3){showToast("Minimal 3 foto wajib untuk produk.","warning");return;}
  const id=$("#editorProductId").value||$("#editorSku").value.trim();
  const duplicate=products.find(p=>p.sku.toLowerCase()===$("#editorSku").value.trim().toLowerCase() && p.id!==id); if(duplicate){showToast("SKU sudah digunakan produk lain.","warning");return;}
  const data={id,sku:$("#editorSku").value.trim(),name:$("#editorName").value.trim(),category:$("#editorCategory").value,msrp:Number($("#editorMsrp").value)||0,stock:Number($("#editorStock").value)||0,active:$("#editorActive").value==='true',images:editorPhotos.map(x=>x.src),image:editorPhotos[0].src,video:$("#editorVideo").value.trim(),caption:$("#editorCaption").value.trim(),colors:JSON.parse(JSON.stringify(editorColors))};
  const idx=products.findIndex(p=>p.id===id); if(idx>=0) products[idx]=Object.assign({},products[idx],data); else products.push(data);
  persistProducts(); closeProductEditor(); renderProducts();
  if(!$("#adminOverlay").classList.contains("hidden")){showAdminSection('products');}
  showToast(idx>=0?"Produk berhasil diperbarui.":"Produk baru berhasil ditambahkan.","success");
}
