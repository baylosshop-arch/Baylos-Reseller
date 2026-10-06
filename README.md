# Baylos Reseller Portal v3

Versi ini menggunakan `Baylos-Reseller-main(1).zip` sebagai base utama dan mempertahankan portal reseller sebelumnya.

## Struktur
- `index.html` — UI utama
- `assets/css/baylos.css` — seluruh styling
- `assets/js/app.js` — authentication, catalog, tier, cart, quick order, media kit, admin
- `assets/js/data/products.js` — seed produk demo
- `assets/js/components/product-carousel.js` — carousel foto produk

## Admin V3
Login demo admin:
- Email: `admin@baylos.id`
- Password: `admin123`

Admin sekarang dapat:
- melihat Product Manager
- tambah produk
- edit produk
- arsipkan produk
- mengatur MSRP dan stok
- mengatur varian warna + S/M/L/XL
- memasukkan minimal 3 URL foto
- mengatur video/caption
- melihat dan mengubah tier reseller demo
- suspend/aktifkan reseller demo

Perubahan produk dan reseller pada demo disimpan di `localStorage` browser. Ini sengaja dibuat sebagai layer sementara yang mudah diganti ke Supabase/API tanpa mengubah UI.

## Etalase
Setiap produk mempunyai minimal 3 foto dan dapat:
- swipe kiri/kanan
- tombol next/previous
- dots
- counter foto

## Catatan
Ini masih frontend/demo. Untuk production, autentikasi, upload file, inventory, reseller, dan order harus dipindahkan ke backend/database seperti Supabase atau API server.
