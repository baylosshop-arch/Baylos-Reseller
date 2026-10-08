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
