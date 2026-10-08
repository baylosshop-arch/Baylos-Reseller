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
