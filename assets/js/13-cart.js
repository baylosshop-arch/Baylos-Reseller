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
