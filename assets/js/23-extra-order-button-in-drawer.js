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
