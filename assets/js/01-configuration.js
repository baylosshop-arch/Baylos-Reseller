/* ============================================================
   CONFIGURATION
   ============================================================ */

const BAYLOS_CONFIG = {
    whatsappAdminNumber: "6288214822434",
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
