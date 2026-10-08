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
