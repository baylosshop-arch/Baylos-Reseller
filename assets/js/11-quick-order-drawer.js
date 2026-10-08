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
