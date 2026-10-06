
/* ============================================================
   BAYLOS WHOLESALE PORTAL
   Frontend Application Logic
   ============================================================ */

"use strict";


/* ============================================================
   CONFIGURATION
   ============================================================ */

const BAYLOS_CONFIG = {
    whatsappAdminNumber: "6281234567890",
    currency: "IDR",

    tiers: {
        silver: {
            name: "Silver Level",
            shortName: "Silver",
            discount: 0.20,
            label: "20% OFF"
        },
        gold: {
            name: "Gold Level",
            shortName: "Gold",
            discount: 0.30,
            label: "30% OFF"
        },
        vip: {
            name: "VIP Level",
            shortName: "VIP",
            discount: 0.40,
            label: "40% OFF"
        }
    },

    demoUsers: [
        {
            email: "reseller@baylos.id",
            password: "baylos123",
            role: "reseller",
            name: "Baylos Partner",
            tier: "gold"
        },
        {
            email: "admin@baylos.id",
            password: "admin123",
            role: "admin",
            name: "Baylos Administrator",
            tier: "vip"
        }
    ]
};


/* ============================================================
   PRODUCT DATA
   ============================================================ */

let products = loadProductStore();

function loadProductStore(){
    try{
        const saved = localStorage.getItem("baylosProducts");
        if(saved){
            const parsed = JSON.parse(saved);
            if(Array.isArray(parsed) && parsed.length) return parsed;
        }
    }catch(error){ console.warn("Baylos product store reset.", error); }
    return (window.BAYLOS_PRODUCTS || []).map(product => ({...product, images:Array.isArray(product.images)?product.images:[product.image]}));
}

function persistProducts(){
    localStorage.setItem("baylosProducts", JSON.stringify(products));
}



/* ============================================================
   APPLICATION STATE
   ============================================================ */

let currentUser = null;

let currentTier = "gold";

let currentMediaProduct = null;

let currentOrderProduct = null;

let orderSelections = {};

let cart = [];


/* ============================================================
   DOM HELPERS
   ============================================================ */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);


/* ============================================================
   INITIALIZATION
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    lucide.createIcons();

    initializeAuthentication();

    initializeFilters();

    initializeTierSwitcher();

    initializeUserMenu();

    initializeCart();

    initializeAdmin();

    initializeGlobalKeyboardEvents();

    renderProducts();

    updateCartUI();
});


/* ============================================================
   AUTHENTICATION
   ============================================================ */

function initializeAuthentication() {

    const savedSession = localStorage.getItem("baylosSession");

    if (savedSession) {
        try {
            currentUser = JSON.parse(savedSession);

            currentTier = currentUser.tier || "gold";

            showApplication();

        } catch (error) {
            localStorage.removeItem("baylosSession");
        }
    }

    $("#loginForm").addEventListener("submit", handleLogin);

    $("#togglePassword").addEventListener("click", () => {

        const passwordInput = $("#loginPassword");

        const icon = $("#togglePassword i");

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            icon.setAttribute("data-lucide", "eye-off");

        } else {

            passwordInput.type = "password";

            icon.setAttribute("data-lucide", "eye");
        }

        lucide.createIcons();
    });
}


function handleLogin(event) {

    event.preventDefault();

    const email = $("#loginEmail").value.trim().toLowerCase();

    const password = $("#loginPassword").value;

    const remember = $("#rememberMe").checked;

    const user = BAYLOS_CONFIG.demoUsers.find(
        item => item.email === email && item.password === password
    );

    const errorBox = $("#loginError");

    if (!user) {

        errorBox.textContent =
            "Email atau password tidak sesuai. Gunakan kredensial demo yang tersedia.";

        errorBox.classList.remove("hidden");

        return;
    }

    errorBox.classList.add("hidden");

    currentUser = {
        email: user.email,
        role: user.role,
        name: user.name,
        tier: user.tier
    };

    currentTier = user.tier;

    if (remember) {

        localStorage.setItem(
            "baylosSession",
            JSON.stringify(currentUser)
        );

    } else {

        sessionStorage.setItem(
            "baylosSession",
            JSON.stringify(currentUser)
        );
    }

    showApplication();

    showToast(
        `Selamat datang, ${user.name}.`,
        "success"
    );
}


function showApplication() {

    $("#loginScreen").classList.add("hidden");

    $("#app").classList.remove("hidden");

    updateUserUI();

    setTier(currentTier, false);

    if (currentUser && currentUser.role === "admin") {
        $("#adminButton").classList.remove("hidden");
    } else {
        $("#adminButton").classList.add("hidden");
    }
}


function logout() {

    currentUser = null;

    localStorage.removeItem("baylosSession");

    sessionStorage.removeItem("baylosSession");

    $("#app").classList.add("hidden");

    $("#adminOverlay").classList.add("hidden");

    $("#loginScreen").classList.remove("hidden");

    $("#loginEmail").value = "";

    $("#loginPassword").value = "";

    $("#loginError").classList.add("hidden");

    $("#userMenu").classList.add("hidden");

    showToast("Anda telah keluar dari portal.", "info");
}


function updateUserUI() {

    if (!currentUser) {
        return;
    }

    $("#menuUserName").textContent = currentUser.name;

    $("#menuUserEmail").textContent = currentUser.email;
}


/* ============================================================
   TIER PRICING
   ============================================================ */

function initializeTierSwitcher() {

    $("#tierSelect").addEventListener("change", event => {

        setTier(event.target.value, true);

    });
}


function setTier(tierKey, notify = true) {

    if (!BAYLOS_CONFIG.tiers[tierKey]) {
        tierKey = "gold";
    }

    currentTier = tierKey;

    const tier = BAYLOS_CONFIG.tiers[currentTier];

    $("#tierSelect").value = currentTier;

    $("#activeTierBadge").textContent = tier.name;

    $("#activeDiscountBadge").textContent =
        `(${tier.label})`;

    $("#heroTier").textContent =
        `${tier.shortName} ${tier.discount * 100}%`;

    if (currentOrderProduct) {
        updateOrderPricing();
    }

    renderProducts();

    if (notify) {

        showToast(
            `Harga simulasi diubah ke ${tier.name} — ${tier.label}.`,
            "success"
        );
    }
}


function calculateWholesalePrice(msrp) {

    const tier = BAYLOS_CONFIG.tiers[currentTier];

    return Math.round(
        msrp * (1 - tier.discount)
    );
}


function formatRupiah(value) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: BAYLOS_CONFIG.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}


/* ============================================================
   PRODUCT RENDERING
   ============================================================ */

function renderProducts() {

    const search = $("#searchInput").value.trim().toLowerCase();

    const category = $("#categoryFilter").value;

    const stockFilter = $("#stockFilter").value;

    const filteredProducts = products.filter(product => {

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

    const article = document.createElement("article");
    article.className = "product-card bg-card rounded-2xl border border-white/5 overflow-hidden";

    const stockClass = product.stock < 10 ? "stock-low" : "stock-ready";
    const stockText = product.stock < 10 ? `Sisa ${product.stock} pcs` : `Ready: ${product.stock} pcs`;
    const wholesalePrice = calculateWholesalePrice(product.msrp);
    const tier = BAYLOS_CONFIG.tiers[currentTier];

    article.innerHTML = `
        <div class="relative aspect-[4/4.6] overflow-hidden bg-zinc-900">
            ${window.BaylosProductCarousel.markup(product)}
            <div class="absolute top-3 left-3 z-10">
                <span class="px-2.5 py-1.5 rounded-lg bg-obsidian/80 backdrop-blur-md text-[10px] uppercase tracking-wider text-champagne border border-white/10">
                    ${escapeHTML(product.category)}
                </span>
            </div>
            <div class="absolute top-3 right-3 z-10">
                <span class="px-2.5 py-1.5 rounded-lg ${stockClass} border text-[10px] font-bold">${stockText}</span>
            </div>
            <div class="absolute bottom-3 left-3 z-10">
                <span class="inline-flex px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-[10px] text-zinc-300 border border-white/10">
                    ${escapeHTML(product.sku)}
                </span>
            </div>
        </div>
        <div class="p-5">
            <div class="flex items-start justify-between gap-3">
                <div>
                    <h3 class="font-display text-xl leading-tight">${escapeHTML(product.name)}</h3>
                    <p class="text-xs text-zinc-600 mt-1">${escapeHTML(product.category)}</p>
                </div>
                <span class="text-[9px] text-zinc-600 whitespace-nowrap">${(product.images||[]).length || 1} foto</span>
            </div>
            <div class="mt-5 space-y-2">
                <div class="flex items-center justify-between">
                    <span class="text-xs text-zinc-600">MSRP</span>
                    <span class="text-xs text-zinc-500 line-through">${formatRupiah(product.msrp)}</span>
                </div>
                <div class="flex items-end justify-between gap-2">
                    <div>
                        <p class="text-[10px] uppercase tracking-wider text-gold">Harga Modal Reseller</p>
                        <p class="font-semibold text-lg text-ivory mt-1">${formatRupiah(wholesalePrice)}</p>
                    </div>
                    <span class="text-[10px] px-2 py-1 rounded-md bg-gold/10 text-gold border border-gold/10">${tier.label}</span>
                </div>
            </div>
            <div class="grid grid-cols-1 gap-2 mt-5">
                <button type="button" data-action="media" data-product-id="${escapeHTML(product.id)}" class="btn-dark h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
                    <i data-lucide="download" class="w-4 h-4 text-gold"></i> Download Aset
                </button>
                <button type="button" data-action="order" data-product-id="${escapeHTML(product.id)}" class="btn-gold h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                    <i data-lucide="shopping-bag" class="w-4 h-4"></i> + Order Grosir
                </button>
            </div>
        </div>`;

    article.querySelectorAll("button[data-action]").forEach(button => {
        button.addEventListener("click", () => {
            const selectedProduct = products.find(item => item.id === button.dataset.productId);
            if(!selectedProduct) return;
            if(button.dataset.action === "media") openMediaModal(selectedProduct);
            if(button.dataset.action === "order") openOrderDrawer(selectedProduct);
        });
    });

    window.BaylosProductCarousel.init(article);
    return article;
}


/* ============================================================
   FILTERS
   ============================================================ */

function initializeFilters() {

    $("#searchInput").addEventListener(
        "input",
        renderProducts
    );

    $("#categoryFilter").addEventListener(
        "change",
        renderProducts
    );

    $("#stockFilter").addEventListener(
        "change",
        renderProducts
    );

    $("#resetFilters").addEventListener(
        "click",
        resetFilters
    );
}


function resetFilters() {

    $("#searchInput").value = "";

    $("#categoryFilter").value = "all";

    $("#stockFilter").value = "all";

    renderProducts();

    showToast(
        "Filter telah direset.",
        "info"
    );
}


/* ============================================================
   MEDIA KIT
   ============================================================ */

function openMediaModal(product) {

    currentMediaProduct = product;

    $("#mediaProductName").textContent =
        product.name;

    const mediaImages = Array.isArray(product.images) && product.images.length ? product.images : [product.image];

    $("#mediaPreviewImage").src = mediaImages[0];

    $("#downloadImageLink").href = mediaImages[0];

    $("#downloadVideoLink").href =
        product.video;

    $("#captionText").value =
        product.caption;

    $("#mediaModal").classList.remove("hidden");

    document.body.style.overflow = "hidden";

    lucide.createIcons();
}


function closeMediaModal() {

    $("#mediaModal").classList.add("hidden");

    currentMediaProduct = null;

    if (
        $("#orderOverlay").classList.contains("hidden") &&
        $("#cartOverlay").classList.contains("hidden") &&
        $("#adminOverlay").classList.contains("hidden")
    ) {
        document.body.style.overflow = "";
    }
}


$("#copyCaptionButton").addEventListener(
    "click",
    async () => {

        const caption =
            $("#captionText").value;

        try {

            await navigator.clipboard.writeText(
                caption
            );

            showToast(
                "Caption berhasil disalin ke clipboard.",
                "success"
            );

        } catch (error) {

            const textarea =
                $("#captionText");

            textarea.removeAttribute("readonly");

            textarea.select();

            document.execCommand("copy");

            textarea.setAttribute(
                "readonly",
                "readonly"
            );

            window.getSelection().removeAllRanges();

            showToast(
                "Caption berhasil disalin.",
                "success"
            );
        }
    }
);


/* ============================================================
   QUICK ORDER DRAWER
   ============================================================ */

function openOrderDrawer(product) {

    currentOrderProduct = product;

    orderSelections = {};

    $("#orderProductName").textContent =
        product.name;

    $("#orderProductSku").textContent =
        product.sku;

    $("#orderMsrp").textContent =
        formatRupiah(product.msrp);

    $("#orderWholesalePrice").textContent =
        formatRupiah(
            calculateWholesalePrice(product.msrp)
        );

    $("#orderTierLabel").textContent =
        `${BAYLOS_CONFIG.tiers[currentTier].shortName} — ${BAYLOS_CONFIG.tiers[currentTier].discount * 100}%`;

    renderVariantMatrix();

    $("#orderOverlay").classList.remove("hidden");

    document.body.style.overflow = "hidden";

    updateOrderTotals();

    lucide.createIcons();
}


function closeOrderDrawer() {

    $("#orderOverlay").classList.add("hidden");

    currentOrderProduct = null;

    orderSelections = {};

    if (
        $("#mediaModal").classList.contains("hidden") &&
        $("#cartOverlay").classList.contains("hidden") &&
        $("#adminOverlay").classList.contains("hidden")
    ) {
        document.body.style.overflow = "";
    }
}


function renderVariantMatrix() {

    const container =
        $("#variantMatrix");

    container.innerHTML = "";

    if (!currentOrderProduct) {
        return;
    }

    const sizes =
        ["S", "M", "L", "XL"];

    currentOrderProduct.colors.forEach(
        (color, colorIndex) => {

            const row =
                document.createElement("div");

            row.className =
                "rounded-2xl bg-card border border-white/5 p-4";

            const colorTotal =
                sizes.reduce(
                    (total, size) =>
                        total + (color.stock[size] || 0),
                    0
                );

            row.innerHTML = `
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <p class="font-semibold text-sm">
                            ${escapeHTML(color.name)}
                        </p>
                        <p class="text-[10px] text-zinc-600 mt-1">
                            Total tersedia: ${colorTotal} pcs
                        </p>
                    </div>

                    <span class="w-3 h-3 rounded-full ${getColorDotClass(color.name)}"></span>
                </div>

                <div class="grid grid-cols-4 gap-2">
                    ${sizes.map(size => {

                        const stock =
                            color.stock[size] || 0;

                        const key =
                            createVariantKey(
                                currentOrderProduct.id,
                                color.name,
                                size
                            );

                        const disabled =
                            stock <= 0;

                        return `
                            <div
                                class="rounded-xl border border-white/5 p-2 ${disabled ? "variant-disabled" : ""}"
                            >
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-[10px] font-bold text-zinc-300">
                                        ${size}
                                    </span>

                                    <span class="text-[9px] ${stock < 5 ? "text-yellow-400" : "text-zinc-600"}">
                                        ${stock}
                                    </span>
                                </div>

                                <div class="flex items-center h-8 rounded-lg bg-obsidian border border-white/5 overflow-hidden">
                                    <button
                                        type="button"
                                        class="w-7 h-full flex items-center justify-center text-zinc-500 hover:text-gold"
                                        data-qty-action="minus"
                                        data-variant-key="${escapeAttribute(key)}"
                                    >
                                        <i data-lucide="minus" class="w-3 h-3"></i>
                                    </button>

                                    <input
                                        type="number"
                                        min="0"
                                        max="${stock}"
                                        value="${orderSelections[key] || 0}"
                                        class="quantity-input w-full h-full bg-transparent text-center text-[11px] outline-none"
                                        data-quantity-input
                                        data-variant-key="${escapeAttribute(key)}"
                                        ${disabled ? "disabled" : ""}
                                    >

                                    <button
                                        type="button"
                                        class="w-7 h-full flex items-center justify-center text-zinc-500 hover:text-gold"
                                        data-qty-action="plus"
                                        data-variant-key="${escapeAttribute(key)}"
                                    >
                                        <i data-lucide="plus" class="w-3 h-3"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join("")}
                </div>
            `;

            container.appendChild(row);
        }
    );

    attachQuantityEvents();

    lucide.createIcons();
}


function attachQuantityEvents() {

    $$("[data-qty-action]").forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const key =
                    button.dataset.variantKey;

                const action =
                    button.dataset.qtyAction;

                const input =
                    document.querySelector(
                        `[data-quantity-input][data-variant-key="${CSS.escape(key)}"]`
                    );

                if (!input) {
                    return;
                }

                let value =
                    parseInt(input.value, 10) || 0;

                const max =
                    parseInt(input.max, 10) || 0;

                if (action === "plus") {
                    value = Math.min(
                        value + 1,
                        max
                    );
                }

                if (action === "minus") {
                    value = Math.max(
                        value - 1,
                        0
                    );
                }

                input.value = value;

                orderSelections[key] = value;

                updateOrderTotals();
            }
        );
    });


    $$("[data-quantity-input]").forEach(input => {

        input.addEventListener(
            "input",
            () => {

                const key =
                    input.dataset.variantKey;

                const max =
                    parseInt(input.max, 10) || 0;

                let value =
                    parseInt(input.value, 10) || 0;

                value =
                    Math.max(
                        0,
                        Math.min(value, max)
                    );

                input.value = value;

                orderSelections[key] = value;

                updateOrderTotals();
            }
        );
    });
}


function createVariantKey(
    productId,
    color,
    size
) {

    return [
        productId,
        color,
        size
    ].join("::");
}


function parseVariantKey(key) {

    const parts =
        key.split("::");

    return {
        productId: parts[0],
        color: parts[1],
        size: parts[2]
    };
}


function updateOrderPricing() {

    if (!currentOrderProduct) {
        return;
    }

    const wholesalePrice =
        calculateWholesalePrice(
            currentOrderProduct.msrp
        );

    $("#orderWholesalePrice").textContent =
        formatRupiah(wholesalePrice);

    $("#orderTierLabel").textContent =
        `${BAYLOS_CONFIG.tiers[currentTier].shortName} — ${BAYLOS_CONFIG.tiers[currentTier].discount * 100}%`;

    updateOrderTotals();
}


function updateOrderTotals() {

    if (!currentOrderProduct) {
        return;
    }

    const wholesalePrice =
        calculateWholesalePrice(
            currentOrderProduct.msrp
        );

    const tier =
        BAYLOS_CONFIG.tiers[currentTier];

    let quantity =
        0;

    Object.entries(orderSelections).forEach(
        ([key, qty]) => {

            quantity +=
                Number(qty) || 0;
        }
    );

    const subtotal =
        quantity * wholesalePrice;

    const discount =
        quantity *
        currentOrderProduct.msrp *
        tier.discount;

    $("#orderSubtotal").textContent =
        formatRupiah(subtotal);

    $("#orderDiscount").textContent =
        `− ${formatRupiah(discount)}`;

    $("#orderTotal").textContent =
        formatRupiah(subtotal);

    $("#orderQtyTotal").textContent =
        `${quantity} pcs`;
}


/* ============================================================
   ADD ORDER TO CART
   ============================================================ */

function addOrderToCart() {

    if (!currentOrderProduct) {
        return;
    }

    const selectedVariants =
        Object.entries(orderSelections)
            .filter(([, qty]) => Number(qty) > 0)
            .map(([key, qty]) => {

                const parsed =
                    parseVariantKey(key);

                return {
                    ...parsed,
                    quantity: Number(qty)
                };
            });

    if (selectedVariants.length === 0) {

        showToast(
            "Pilih minimal satu varian dan jumlah order.",
            "warning"
        );

        return;
    }

    const existing =
        cart.find(
            item =>
                item.productId ===
                currentOrderProduct.id
        );

    if (existing) {

        selectedVariants.forEach(newVariant => {

            const oldVariant =
                existing.variants.find(
                    variant =>
                        variant.color === newVariant.color &&
                        variant.size === newVariant.size
                );

            if (oldVariant) {

                oldVariant.quantity +=
                    newVariant.quantity;

            } else {

                existing.variants.push(
                    newVariant
                );
            }
        });

    } else {

        cart.push({
            productId: currentOrderProduct.id,
            productName: currentOrderProduct.name,
            sku: currentOrderProduct.sku,
            msrp: currentOrderProduct.msrp,
            variants: selectedVariants
        });
    }

    saveCart();

    updateCartUI();

    showToast(
        `${currentOrderProduct.name} ditambahkan ke keranjang.`,
        "success"
    );

    closeOrderDrawer();
}


/* ============================================================
   CART
   ============================================================ */

function initializeCart() {

    const savedCart =
        localStorage.getItem("baylosCart");

    if (savedCart) {

        try {

            cart =
                JSON.parse(savedCart);

        } catch (error) {

            cart = [];
        }
    }

    $("#openCartButton").addEventListener(
        "click",
        openCart
    );

    $("#cartWhatsAppButton").addEventListener(
        "click",
        sendCartToWhatsApp
    );
}


function saveCart() {

    localStorage.setItem(
        "baylosCart",
        JSON.stringify(cart)
    );
}


function updateCartUI() {

    const count =
        getCartQuantity();

    $("#cartCount").textContent =
        count;

    renderCart();
}


function getCartQuantity() {

    return cart.reduce(
        (total, item) =>
            total +
            item.variants.reduce(
                (variantTotal, variant) =>
                    variantTotal +
                    variant.quantity,
                0
            ),
        0
    );
}


function getCartTotal() {

    return cart.reduce(
        (total, item) => {

            const price =
                calculateWholesalePrice(
                    item.msrp
                );

            const itemQuantity =
                item.variants.reduce(
                    (sum, variant) =>
                        sum + variant.quantity,
                    0
                );

            return total +
                price * itemQuantity;
        },
        0
    );
}


function renderCart() {

    const container =
        $("#cartItems");

    container.innerHTML = "";

    if (cart.length === 0) {

        $("#cartItems").classList.add("hidden");

        $("#emptyCart").classList.remove("hidden");

        $("#emptyCart").classList.add("flex");

        $("#cartTotal").textContent =
            formatRupiah(0);

        return;
    }

    $("#cartItems").classList.remove("hidden");

    $("#emptyCart").classList.add("hidden");

    $("#emptyCart").classList.remove("flex");

    cart.forEach((item, itemIndex) => {

        const price =
            calculateWholesalePrice(
                item.msrp
            );

        const quantity =
            item.variants.reduce(
                (sum, variant) =>
                    sum + variant.quantity,
                0
            );

        const subtotal =
            price * quantity;

        const card =
            document.createElement("div");

        card.className =
            "rounded-2xl bg-card border border-white/5 p-4";

        card.innerHTML = `
            <div class="flex items-start justify-between gap-3">
                <div>
                    <p class="font-semibold text-sm">
                        ${escapeHTML(item.productName)}
                    </p>

                    <p class="text-[10px] text-zinc-600 mt-1">
                        ${escapeHTML(item.sku)}
                    </p>
                </div>

                <button
                    type="button"
                    class="text-zinc-600 hover:text-red-400"
                    data-remove-cart="${itemIndex}"
                >
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>

            <div class="mt-4 space-y-2">
                ${item.variants.map((variant, variantIndex) => `
                    <div class="flex items-center justify-between text-xs">
                        <span class="text-zinc-500">
                            ${escapeHTML(variant.color)}
                            /
                            ${escapeHTML(variant.size)}
                        </span>

                        <span class="text-zinc-300">
                            ${variant.quantity} pcs
                        </span>
                    </div>
                `).join("")}
            </div>

            <div class="flex items-center justify-between border-t border-white/5 mt-4 pt-3">
                <span class="text-xs text-zinc-600">
                    ${quantity} pcs
                </span>

                <strong class="text-gold">
                    ${formatRupiah(subtotal)}
                </strong>
            </div>
        `;

        container.appendChild(card);
    });

    $$("[data-remove-cart]").forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const index =
                    Number(button.dataset.removeCart);

                const removed =
                    cart[index];

                cart.splice(index, 1);

                saveCart();

                updateCartUI();

                showToast(
                    `${removed.productName} dihapus dari keranjang.`,
                    "info"
                );
            }
        );
    });

    $("#cartTotal").textContent =
        formatRupiah(getCartTotal());

    lucide.createIcons();
}


function openCart() {

    renderCart();

    $("#cartOverlay").classList.remove("hidden");

    document.body.style.overflow = "hidden";
}


function closeCart() {

    $("#cartOverlay").classList.add("hidden");

    if (
        $("#mediaModal").classList.contains("hidden") &&
        $("#orderOverlay").classList.contains("hidden") &&
        $("#adminOverlay").classList.contains("hidden")
    ) {
        document.body.style.overflow = "";
    }
}


/* ============================================================
   WHATSAPP ORDER
   ============================================================ */

$("#sendWhatsAppButton").addEventListener(
    "click",
    () => {

        if (!currentOrderProduct) {
            return;
        }

        const selectedVariants =
            Object.entries(orderSelections)
                .filter(([, qty]) => Number(qty) > 0);

        if (selectedVariants.length === 0) {

            showToast(
                "Pilih minimal satu varian.",
                "warning"
            );

            return;
        }

        const tier =
            BAYLOS_CONFIG.tiers[currentTier];

        const wholesalePrice =
            calculateWholesalePrice(
                currentOrderProduct.msrp
            );

        let totalQuantity = 0;

        let total = 0;

        let message =
            `Halo Admin Baylos 👋\n\n` +
            `Saya ingin melakukan order grosir.\n\n` +
            `*Produk:* ${currentOrderProduct.name}\n` +
            `*SKU:* ${currentOrderProduct.sku}\n` +
            `*Tier:* ${tier.name} (${tier.label})\n\n` +
            `*Rincian Varian:*\n`;

        selectedVariants.forEach(
            ([key, qty]) => {

                const parsed =
                    parseVariantKey(key);

                const quantity =
                    Number(qty);

                totalQuantity +=
                    quantity;

                const subtotal =
                    quantity *
                    wholesalePrice;

                total +=
                    subtotal;

                message +=
                    `• ${parsed.color} / ${parsed.size} — ${quantity} pcs — ${formatRupiah(subtotal)}\n`;
            }
        );

        message +=
            `\n*Total Qty:* ${totalQuantity} pcs\n` +
            `*Total Harga:* ${formatRupiah(total)}\n\n` +
            `Mohon konfirmasi ketersediaan dan proses order. Terima kasih.`;

        openWhatsApp(message);
    }
);


function sendCartToWhatsApp() {

    if (cart.length === 0) {

        showToast(
            "Keranjang masih kosong.",
            "warning"
        );

        return;
    }

    const tier =
        BAYLOS_CONFIG.tiers[currentTier];

    let total =
        0;

    let totalQuantity =
        0;

    let message =
        `Halo Admin Baylos 👋\n\n` +
        `Saya ingin mengirim order dari Wholesale Cart.\n\n` +
        `*Tier:* ${tier.name} (${tier.label})\n\n` +
        `*Rincian Order:*\n`;

    cart.forEach(item => {

        const price =
            calculateWholesalePrice(
                item.msrp
            );

        message +=
            `\n*${item.productName}* (${item.sku})\n`;

        item.variants.forEach(variant => {

            const quantity =
                Number(variant.quantity);

            const subtotal =
                quantity * price;

            total +=
                subtotal;

            totalQuantity +=
                quantity;

            message +=
                `• ${variant.color} / ${variant.size} — ${quantity} pcs — ${formatRupiah(subtotal)}\n`;
        });
    });

    message +=
        `\n*Total Qty:* ${totalQuantity} pcs\n` +
        `*Total Order:* ${formatRupiah(total)}\n\n` +
        `Mohon konfirmasi order dan ketersediaan stok. Terima kasih.`;

    openWhatsApp(message);
}


function openWhatsApp(message) {

    const encoded =
        encodeURIComponent(message);

    const url =
        `https://wa.me/${BAYLOS_CONFIG.whatsappAdminNumber}?text=${encoded}`;

    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );
}


/* ============================================================
   USER MENU
   ============================================================ */

function initializeUserMenu() {

    $("#userMenuButton").addEventListener(
        "click",
        event => {

            event.stopPropagation();

            $("#userMenu").classList.toggle(
                "hidden"
            );
        }
    );

    $("#menuLogout").addEventListener(
        "click",
        logout
    );

    $("#menuProfile").addEventListener(
        "click",
        () => {

            $("#userMenu").classList.add("hidden");

            showToast(
                "Profil Partner dapat dihubungkan ke halaman account settings.",
                "info"
            );
        }
    );

    document.addEventListener(
        "click",
        event => {

            const menu =
                $("#userMenu");

            const button =
                $("#userMenuButton");

            if (
                !menu.contains(event.target) &&
                !button.contains(event.target)
            ) {
                menu.classList.add("hidden");
            }
        }
    );
}


/* ============================================================
   ADMIN
   ============================================================ */

function initializeAdmin() {

    $("#adminButton").addEventListener(
        "click",
        openAdmin
    );

    initializeAdminManager();
}


function openAdmin() {

    if (
        !currentUser ||
        currentUser.role !== "admin"
    ) {

        showToast(
            "Akses Admin membutuhkan akun administrator.",
            "warning"
        );

        return;
    }

    $("#adminOverlay").classList.remove("hidden");

    document.body.style.overflow = "hidden";

    lucide.createIcons();
}


function closeAdmin() {

    $("#adminOverlay").classList.add("hidden");

    if (
        $("#mediaModal").classList.contains("hidden") &&
        $("#orderOverlay").classList.contains("hidden") &&
        $("#cartOverlay").classList.contains("hidden")
    ) {
        document.body.style.overflow = "";
    }
}



/* ============================================================
   ADMIN PRODUCT + RESELLER MANAGER V3
   Local demo persistence. Ready for Supabase/API later.
   ============================================================ */
const DEMO_RESELLERS = [
  {name:"Nadia Boutique",email:"nadia@boutique.id",tier:"gold",status:"active"},
  {name:"Maison Aira",email:"maisonaira@store.id",tier:"vip",status:"active"},
  {name:"Luna Store",email:"luna@store.id",tier:"silver",status:"pending"},
  {name:"Aruna Fashion",email:"aruna@fashion.id",tier:"gold",status:"active"},
  {name:"Kirana Shop",email:"kirana@shop.id",tier:"silver",status:"suspended"}
];
let editingProductId=null;
let editorPhotos=[];
let editorColors=[];

function initializeAdminManager(){
  const add=$("#adminAddProductButton");
  if(add) add.addEventListener("click",()=>openProductEditor());
  $("#closeProductEditor")?.addEventListener("click",closeProductEditor);
  $("#cancelProductEditor")?.addEventListener("click",closeProductEditor);
  $("#productEditorForm")?.addEventListener("submit",saveProductFromEditor);
  $("#addPhotoUrlButton")?.addEventListener("click",()=>{editorPhotos.push("");renderEditorPhotos()});
  $("#addColorButton")?.addEventListener("click",()=>{editorColors.push({name:"Black Obsidian",stock:{S:0,M:0,L:0,XL:0}});renderEditorColors()});
  $("#adminProductSearch")?.addEventListener("input",renderAdminProducts);
  $("#adminCategoryFilter")?.addEventListener("change",renderAdminProducts);

  $$("[data-admin-target]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      $$("[data-admin-target]").forEach(x=>x.classList.remove("active"));
      btn.classList.add("active");
      const target=btn.dataset.adminTarget;
      if(target==="products"){
        $("#adminProductsSection")?.scrollIntoView({behavior:"smooth",block:"start"});
        renderAdminProducts();
      }else if(target==="resellers"){
        $("#adminResellersSection")?.scrollIntoView({behavior:"smooth",block:"start"});
        renderAdminResellers();
      }else{
        window.scrollTo({top:0,behavior:"smooth"});
      }
    });
  });
  renderAdminProducts();
  renderAdminResellers();
}

function renderAdminProducts(){
  const tbody=$("#adminProductTable");
  if(!tbody) return;
  const search=($("#adminProductSearch")?.value||"").toLowerCase().trim();
  const cat=$("#adminCategoryFilter")?.value||"all";
  const list=products.filter(p=>{
    const hit=!search || `${p.name} ${p.sku}`.toLowerCase().includes(search);
    const ok=cat==="all" || p.category===cat;
    return hit && ok;
  });
  tbody.innerHTML=list.map(p=>{
    const imgs=Array.isArray(p.images)&&p.images.length?p.images:[p.image];
    return `<tr class="border-b border-white/5 admin-product-row">
      <td class="px-3 py-3"><div class="flex items-center gap-3"><img src="${escapeAttribute(imgs[0]||"https://placehold.co/200?text=Baylos")}" onerror="this.src='https://placehold.co/200?text=Baylos'" alt=""><div><p class="font-medium">${escapeHTML(p.name)}</p><p class="text-[10px] text-zinc-600">${imgs.length} foto</p></div></div></td>
      <td class="px-3 py-3 text-zinc-400">${escapeHTML(p.sku)}</td>
      <td class="px-3 py-3 text-zinc-400">${escapeHTML(p.category)}</td>
      <td class="px-3 py-3">${formatRupiah(p.msrp)}</td>
      <td class="px-3 py-3 ${p.stock<10?"text-yellow-400":"text-green-400"}">${p.stock} pcs</td>
      <td class="px-3 py-3"><div class="flex justify-end gap-2">
        <button type="button" class="btn-dark w-9 h-9 rounded-lg flex items-center justify-center" data-admin-edit="${escapeAttribute(p.id)}" title="Edit"><i data-lucide="pencil" class="w-3.5 h-3.5 text-gold"></i></button>
        <button type="button" class="btn-dark w-9 h-9 rounded-lg flex items-center justify-center" data-admin-delete="${escapeAttribute(p.id)}" title="Arsipkan"><i data-lucide="archive" class="w-3.5 h-3.5 text-red-300"></i></button>
      </div></td>
    </tr>`;
  }).join("") || `<tr><td colspan="6" class="px-3 py-12 text-center text-zinc-600">Tidak ada produk.</td></tr>`;

  tbody.querySelectorAll("[data-admin-edit]").forEach(b=>b.addEventListener("click",()=>openProductEditor(b.dataset.adminEdit)));
  tbody.querySelectorAll("[data-admin-delete]").forEach(b=>b.addEventListener("click",()=>archiveProduct(b.dataset.adminDelete)));
  lucide.createIcons();
}

function renderAdminResellers(){
  const tbody=$("#adminResellerTable");
  if(!tbody) return;
  const stored=JSON.parse(localStorage.getItem("baylosResellers")||"null")||DEMO_RESELLERS;
  localStorage.setItem("baylosResellers",JSON.stringify(stored));
  tbody.innerHTML=stored.map((r,i)=>`<tr class="border-b border-white/5">
    <td class="px-5 py-4 font-medium">${escapeHTML(r.name)}</td>
    <td class="px-5 py-4 text-zinc-500">${escapeHTML(r.email)}</td>
    <td class="px-5 py-4"><select data-reseller-tier="${i}" class="bg-obsidian border border-white/10 rounded-lg px-2 py-1 text-xs"><option value="silver" ${r.tier==="silver"?"selected":""}>Silver 20%</option><option value="gold" ${r.tier==="gold"?"selected":""}>Gold 30%</option><option value="vip" ${r.tier==="vip"?"selected":""}>VIP 40%</option></select></td>
    <td class="px-5 py-4"><span class="reseller-status-${escapeHTML(r.status)}">${escapeHTML(r.status)}</span></td>
    <td class="px-5 py-4"><button type="button" class="text-xs text-gold" data-reseller-toggle="${i}">${r.status==="suspended"?"Aktifkan":"Suspend"}</button></td>
  </tr>`).join("");
  tbody.querySelectorAll("[data-reseller-tier]").forEach(sel=>sel.addEventListener("change",()=>{
    const arr=JSON.parse(localStorage.getItem("baylosResellers")||"[]");
    arr[Number(sel.dataset.resellerTier)].tier=sel.value;
    localStorage.setItem("baylosResellers",JSON.stringify(arr));
    showToast("Tier reseller berhasil diperbarui.","success");
  }));
  tbody.querySelectorAll("[data-reseller-toggle]").forEach(btn=>btn.addEventListener("click",()=>{
    const arr=JSON.parse(localStorage.getItem("baylosResellers")||"[]");
    const i=Number(btn.dataset.resellerToggle);
    arr[i].status=arr[i].status==="suspended"?"active":"suspended";
    localStorage.setItem("baylosResellers",JSON.stringify(arr));
    renderAdminResellers();
  }));
}

function openProductEditor(id=null){
  editingProductId=id;
  const p=id?products.find(x=>x.id===id):null;
  $("#productEditorTitle").textContent=p?"Edit Produk":"Tambah Produk";
  $("#editorProductId").value=p?.id||"";
  $("#editorName").value=p?.name||"";
  $("#editorSku").value=p?.sku||"BYL-NEW-"+String(Date.now()).slice(-4);
  $("#editorCategory").value=p?.category||"Outerwear";
  $("#editorMsrp").value=p?.msrp||0;
  $("#editorStock").value=p?.stock||0;
  $("#editorVideo").value=p?.video||"";
  $("#editorCaption").value=p?.caption||"";
  editorPhotos=[...(p?.images||p?.image?[p?.image]:[])];
  if(editorPhotos.length<3) while(editorPhotos.length<3) editorPhotos.push("");
  editorColors=JSON.parse(JSON.stringify(p?.colors||[
    {name:"Black Obsidian",stock:{S:0,M:0,L:0,XL:0}},
    {name:"Champagne",stock:{S:0,M:0,L:0,XL:0}},
    {name:"Sage Green",stock:{S:0,M:0,L:0,XL:0}}
  ]));
  renderEditorPhotos(); renderEditorColors();
  $("#productEditorModal").classList.remove("hidden");
  document.body.style.overflow="hidden";
  lucide.createIcons();
}

function closeProductEditor(){
  $("#productEditorModal")?.classList.add("hidden");
  if($("#adminOverlay")?.classList.contains("hidden") && $("#mediaModal")?.classList.contains("hidden") && $("#orderOverlay")?.classList.contains("hidden") && $("#cartOverlay")?.classList.contains("hidden")) document.body.style.overflow="";
}

function renderEditorPhotos(){
  const inputs=$("#editorPhotoInputs"), preview=$("#editorPhotoPreview");
  if(!inputs||!preview) return;
  inputs.innerHTML=editorPhotos.map((url,i)=>`<div class="flex gap-2"><input data-photo-input="${i}" class="input-luxury h-10 px-3 text-xs flex-1" value="${escapeAttribute(url)}" placeholder="https://.../foto-${i+1}.jpg"><button type="button" class="btn-dark w-10 h-10 rounded-xl" data-photo-remove="${i}" ${editorPhotos.length<=3?"disabled":""}><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button></div>`).join("");
  preview.innerHTML=editorPhotos.filter(Boolean).map((u,i)=>`<div class="admin-thumb"><img src="${escapeAttribute(u)}" onerror="this.src='https://placehold.co/400x400?text=Foto'"><button type="button" data-photo-preview-remove="${i}">×</button></div>`).join("");
  inputs.querySelectorAll("[data-photo-input]").forEach(inp=>inp.addEventListener("input",()=>{editorPhotos[Number(inp.dataset.photoInput)]=inp.value;renderEditorPhotosPreviewOnly()}));
  inputs.querySelectorAll("[data-photo-remove]").forEach(b=>b.addEventListener("click",()=>{if(editorPhotos.length>3){editorPhotos.splice(Number(b.dataset.photoRemove),1);renderEditorPhotos()}}));
  preview.querySelectorAll("[data-photo-preview-remove]").forEach(b=>b.addEventListener("click",()=>{if(editorPhotos.length>3){editorPhotos.splice(Number(b.dataset.photoPreviewRemove),1);renderEditorPhotos()}}));
  lucide.createIcons();
}
function renderEditorPhotosPreviewOnly(){
  const preview=$("#editorPhotoPreview"); if(!preview)return;
  preview.innerHTML=editorPhotos.filter(Boolean).map((u,i)=>`<div class="admin-thumb"><img src="${escapeAttribute(u)}" onerror="this.src='https://placehold.co/400x400?text=Foto'"></div>`).join("");
}
function renderEditorColors(){
  const box=$("#editorColors"); if(!box)return;
  box.innerHTML=editorColors.map((c,i)=>`<div class="rounded-2xl bg-obsidian border border-white/5 p-3">
    <div class="flex gap-2 items-center mb-3"><input class="input-luxury h-9 px-3 text-xs flex-1" data-color-name="${i}" value="${escapeAttribute(c.name)}"><button type="button" class="btn-dark w-9 h-9 rounded-lg" data-color-remove="${i}" ${editorColors.length<=1?"disabled":""}>×</button></div>
    <div class="grid grid-cols-4 gap-2">${["S","M","L","XL"].map(s=>`<label class="text-[9px] text-zinc-600">SIZE ${s}<input type="number" min="0" class="input-luxury w-full h-9 px-2 mt-1 text-xs" data-color-stock="${i}:${s}" value="${Number(c.stock?.[s]||0)}"></label>`).join("")}</div>
  </div>`).join("");
  box.querySelectorAll("[data-color-name]").forEach(i=>i.addEventListener("input",()=>editorColors[Number(i.dataset.colorName)].name=i.value));
  box.querySelectorAll("[data-color-stock]").forEach(i=>i.addEventListener("input",()=>{const [ci,s]=i.dataset.colorStock.split(":");editorColors[Number(ci)].stock[s]=Math.max(0,Number(i.value)||0)}));
  box.querySelectorAll("[data-color-remove]").forEach(b=>b.addEventListener("click",()=>{if(editorColors.length>1){editorColors.splice(Number(b.dataset.colorRemove),1);renderEditorColors()}}));
}

function saveProductFromEditor(e){
  e.preventDefault();
  const photos=editorPhotos.map(x=>x.trim()).filter(Boolean);
  if(photos.length<3){showToast("Produk harus memiliki minimal 3 foto.","warning");return;}
  const totalByVariants=editorColors.reduce((sum,c)=>sum+Object.values(c.stock||{}).reduce((a,n)=>a+Number(n||0),0),0);
  const data={
    id:editingProductId||$("#editorSku").value.trim(),
    sku:$("#editorSku").value.trim(),
    name:$("#editorName").value.trim(),
    category:$("#editorCategory").value,
    msrp:Number($("#editorMsrp").value)||0,
    stock:Number($("#editorStock").value)||totalByVariants,
    images:photos,
    image:photos[0],
    video:$("#editorVideo").value.trim(),
    caption:$("#editorCaption").value.trim(),
    colors:editorColors
  };
  if(!data.id||!data.sku||!data.name){showToast("Nama dan SKU wajib diisi.","warning");return;}
  const existing=products.findIndex(x=>x.id===data.id);
  if(existing>=0) products[existing]=data; else products.unshift(data);
  persistProducts();
  renderProducts();
  renderAdminProducts();
  closeProductEditor();
  showToast(existing>=0?"Produk berhasil diperbarui.":"Produk baru berhasil ditambahkan.","success");
}
function archiveProduct(id){
  const p=products.find(x=>x.id===id);
  if(!p)return;
  if(!confirm(`Arsipkan produk "${p.name}"?`))return;
  products=products.filter(x=>x.id!==id);
  persistProducts(); renderProducts(); renderAdminProducts();
  showToast("Produk berhasil diarsipkan.","success");
}


/* ============================================================
   TOAST
   ============================================================ */

let toastTimer = null;


function showToast(
    message,
    type = "success"
) {

    const toast =
        $("#toast");

    const messageElement =
        $("#toastMessage");

    const iconContainer =
        $("#toastIcon");

    messageElement.textContent =
        message;

    const configurations = {
        success: {
            icon: "check",
            classes: "bg-green-500/10",
            iconClasses: "text-green-400"
        },

        warning: {
            icon: "triangle-alert",
            classes: "bg-yellow-500/10",
            iconClasses: "text-yellow-400"
        },

        info: {
            icon: "info",
            classes: "bg-blue-500/10",
            iconClasses: "text-blue-400"
        },

        error: {
            icon: "x",
            classes: "bg-red-500/10",
            iconClasses: "text-red-400"
        }
    };

    const config =
        configurations[type] ||
        configurations.success;

    iconContainer.className =
        `w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${config.classes}`;

    iconContainer.innerHTML =
        `<i data-lucide="${config.icon}" class="w-4 h-4 ${config.iconClasses}"></i>`;

    lucide.createIcons();

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer =
        setTimeout(
            () => {
                toast.classList.remove("show");
            },
            3200
        );
}


/* ============================================================
   KEYBOARD / GLOBAL EVENTS
   ============================================================ */

function initializeGlobalKeyboardEvents() {

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeMediaModal();

                closeOrderDrawer();

                closeCart();

                closeAdmin();
            }
        }
    );


    $("#mediaModal").addEventListener(
        "click",
        event => {

            if (
                event.target ===
                $("#mediaModal")
            ) {
                closeMediaModal();
            }
        }
    );


    $("#orderOverlay").addEventListener(
        "click",
        event => {

            if (
                event.target ===
                $("#orderOverlay")
            ) {
                closeOrderDrawer();
            }
        }
    );


    $("#cartOverlay").addEventListener(
        "click",
        event => {

            if (
                event.target ===
                $("#cartOverlay")
            ) {
                closeCart();
            }
        }
    );
}


/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function escapeAttribute(value) {

    return String(value)
        .replaceAll("\\", "\\\\")
        .replaceAll('"', '\\"');
}


function getColorDotClass(colorName) {

    const name =
        colorName.toLowerCase();

    if (name.includes("black")) {
        return "bg-zinc-900 border border-zinc-500";
    }

    if (name.includes("champagne")) {
        return "bg-[#C5A880]";
    }

    if (name.includes("sage")) {
        return "bg-[#8A9A7B]";
    }

    return "bg-zinc-500";
}


/* ============================================================
   PERSISTENT SESSION RECOVERY
   ============================================================ */

(function recoverSession() {

    if (currentUser) {
        return;
    }

    const session =
        sessionStorage.getItem("baylosSession");

    if (!session) {
        return;
    }

    try {

        currentUser =
            JSON.parse(session);

        currentTier =
            currentUser.tier || "gold";

        showApplication();

    } catch (error) {

        sessionStorage.removeItem(
            "baylosSession"
        );
    }
})();


/* ============================================================
   EXTRA: ORDER BUTTON IN DRAWER
   ============================================================ */

const orderDrawerObserver =
    new MutationObserver(() => {

        if (!$("#orderOverlay").classList.contains("hidden")) {

            const existingButton =
                document.querySelector(
                    "#addToCartFromDrawer"
                );

            if (!existingButton) {

                const footer =
                    $("#sendWhatsAppButton");

                if (footer) {

                    const addButton =
                        document.createElement("button");

                    addButton.id =
                        "addToCartFromDrawer";

                    addButton.type =
                        "button";

                    addButton.className =
                        "w-full h-11 mt-2 rounded-xl btn-dark text-sm font-semibold flex items-center justify-center gap-2";

                    addButton.innerHTML =
                        `
                            <i data-lucide="shopping-bag" class="w-4 h-4 text-gold"></i>
                            Tambahkan ke Keranjang
                        `;

                    addButton.addEventListener(
                        "click",
                        addOrderToCart
                    );

                    footer.parentElement.insertBefore(
                        addButton,
                        footer
                    );

                    lucide.createIcons();
                }
            }
        }
    });

orderDrawerObserver.observe(
    $("#orderOverlay"),
    {
        attributes: true,
        attributeFilter: ["class"]
    }
);


/* ============================================================
   FINAL ICON REFRESH
   ============================================================ */

lucide.createIcons();

