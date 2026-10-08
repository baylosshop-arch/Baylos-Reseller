/* ============================================================
   PRODUCT DATA
   ============================================================ */

const products = [
    {
        id: "BYL-OW-001",
        sku: "BYL-OW-001",
        name: "Aurelia Signature Trench",
        category: "Outerwear",
        msrp: 1299000,
        stock: 35,

        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=90",

        images: [
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=90",
            "https://images.unsplash.com/photo-1539533018447-63fcce2678e2?auto=format&fit=crop&w=1200&q=90",
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=90"
        ],

        video: "https://www.youtube.com/results?search_query=baylos+aurelia+trench",

        colors: [
            {
                name: "Black Obsidian",
                stock: {
                    S: 8,
                    M: 12,
                    L: 9,
                    XL: 6
                }
            },
            {
                name: "Champagne",
                stock: {
                    S: 4,
                    M: 6,
                    L: 3,
                    XL: 2
                }
            },
            {
                name: "Sage Green",
                stock: {
                    S: 2,
                    M: 4,
                    L: 2,
                    XL: 1
                }
            }
        ],

        caption:
            "✨ AURELIA SIGNATURE TRENCH ✨\n\n" +
            "Elevate your everyday look dengan outer premium yang clean, elegant, dan timeless.\n\n" +
            "Aurelia Signature Trench hadir dengan siluet refined yang mudah dipadukan untuk office look, brunch, hingga special occasion.\n\n" +
            "✓ Premium fashion piece\n" +
            "✓ Cutting elegant\n" +
            "✓ Easy to style\n" +
            "✓ Limited stock\n\n" +
            "DM kami untuk detail ukuran dan harga.\n\n" +
            "#Baylos #BaylosFashion #TrenchCoat #FashionReseller #ModestFashion"
    },

    {
        id: "BYL-MW-002",
        sku: "BYL-MW-002",
        name: "Sage Pleated Modest Set",
        category: "Modest Wear",
        msrp: 899000,
        stock: 7,

        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=90",

        images: [
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=90",
            "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=90",
            "https://images.unsplash.com/photo-1571513800374-df1bbe650e56?auto=format&fit=crop&w=1200&q=90"
        ],

        video: "https://www.youtube.com/results?search_query=baylos+sage+pleated+set",

        colors: [
            {
                name: "Black Obsidian",
                stock: {
                    S: 1,
                    M: 2,
                    L: 1,
                    XL: 1
                }
            },
            {
                name: "Champagne",
                stock: {
                    S: 0,
                    M: 1,
                    L: 0,
                    XL: 0
                }
            },
            {
                name: "Sage Green",
                stock: {
                    S: 1,
                    M: 0,
                    L: 0,
                    XL: 0
                }
            }
        ],

        caption:
            "SAGE PLEATED MODEST SET 🌿\n\n" +
            "Minimal, sophisticated, dan effortless.\n\n" +
            "Sage Pleated Modest Set dibuat untuk kamu yang ingin tampil polished tanpa terlihat berlebihan.\n\n" +
            "Pleated detail memberikan movement yang cantik, sementara siluet modest membuatnya versatile untuk berbagai occasion.\n\n" +
            "Stock terbatas — cocok untuk koleksi reseller yang ingin tampil premium.\n\n" +
            "#Baylos #ModestWear #PleatedSet #FashionReseller #BaylosPartner"
    },

    {
        id: "BYL-TP-003",
        sku: "BYL-TP-003",
        name: "Noir Essential Top",
        category: "Tops",
        msrp: 449000,
        stock: 42,

        image: "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=1200&q=90",

        images: [
            "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=1200&q=90",
            "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1200&q=90",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=90"
        ],

        video: "https://www.youtube.com/results?search_query=baylos+noir+essential+top",

        colors: [
            {
                name: "Black Obsidian",
                stock: {
                    S: 10,
                    M: 14,
                    L: 12,
                    XL: 6
                }
            },
            {
                name: "Champagne",
                stock: {
                    S: 3,
                    M: 4,
                    L: 2,
                    XL: 1
                }
            },
            {
                name: "Sage Green",
                stock: {
                    S: 2,
                    M: 3,
                    L: 2,
                    XL: 1
                }
            }
        ],

        caption:
            "NOIR ESSENTIAL TOP 🖤\n\n" +
            "The everyday essential, elevated.\n\n" +
            "Noir Essential Top membawa clean silhouette dengan karakter premium yang gampang dipasangkan dengan denim, tailored pants, skirt, maupun outerwear favorit.\n\n" +
            "Perfect untuk customer yang mencari basic piece dengan premium appearance.\n\n" +
            "Ready stock sekarang.\n\n" +
            "#Baylos #EssentialTop #MinimalFashion #FashionReseller #WholesaleFashion"
    },

    {
        id: "BYL-AC-004",
        sku: "BYL-AC-004",
        name: "Champagne Structured Bag",
        category: "Accessories",
        msrp: 699000,
        stock: 24,

        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=90",

        images: [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=90",
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=90",
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1200&q=90"
        ],

        video: "https://www.youtube.com/results?search_query=baylos+champagne+structured+bag",

        colors: [
            {
                name: "Black Obsidian",
                stock: {
                    S: 5,
                    M: 5,
                    L: 2,
                    XL: 0
                }
            },
            {
                name: "Champagne",
                stock: {
                    S: 4,
                    M: 4,
                    L: 2,
                    XL: 0
                }
            },
            {
                name: "Sage Green",
                stock: {
                    S: 1,
                    M: 1,
                    L: 0,
                    XL: 0
                }
            }
        ],

        caption:
            "CHAMPAGNE STRUCTURED BAG ✨\n\n" +
            "A refined statement piece for the modern wardrobe.\n\n" +
            "Structured silhouette, sophisticated finish, dan versatile color palette membuat bag ini mudah masuk ke berbagai style customer.\n\n" +
            "Bawa dari office sampai dinner tanpa perlu mengganti karakter look.\n\n" +
            "Limited quantity available.\n\n" +
            "#Baylos #StructuredBag #LuxuryBag #FashionAccessories #ResellerIndonesia"
    }
    ,{ id:"BYL-OW-005", sku:"BYL-OW-005", name:"Noir Tailored Blazer", category:"Outerwear", msrp:1099000, stock:22, image:"https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=90", images:["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=90","https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1200&q=90","https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=90"], video:"https://www.youtube.com/results?search_query=baylos+noir+blazer", colors:[{name:"Black Obsidian",stock:{S:6,M:7,L:5,XL:4}},{name:"Champagne",stock:{S:2,M:4,L:2,XL:1}},{name:"Sage Green",stock:{S:1,M:2,L:1,XL:0}}], caption:"Noir Tailored Blazer — refined tailoring for a polished Baylos look." },
    { id:"BYL-MW-006", sku:"BYL-MW-006", name:"Ivory Flow Abaya", category:"Modest Wear", msrp:999000, stock:18, image:"https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=90", images:["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=90","https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=1200&q=90","https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=1200&q=90"], video:"https://www.youtube.com/results?search_query=baylos+ivory+abaya", colors:[{name:"Black Obsidian",stock:{S:5,M:6,L:4,XL:2}},{name:"Champagne",stock:{S:2,M:3,L:2,XL:1}},{name:"Sage Green",stock:{S:1,M:2,L:1,XL:0}}], caption:"Ivory Flow Abaya — graceful, fluid and easy to style." },
    { id:"BYL-TP-007", sku:"BYL-TP-007", name:"Champagne Satin Shirt", category:"Tops", msrp:649000, stock:31, image:"https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=90", images:["https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=90","https://images.unsplash.com/photo-1564257577054-2e0f9a6b5f6b?auto=format&fit=crop&w=1200&q=90","https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=1200&q=90"], video:"https://www.youtube.com/results?search_query=baylos+champagne+satin+shirt", colors:[{name:"Black Obsidian",stock:{S:8,M:9,L:7,XL:4}},{name:"Champagne",stock:{S:3,M:5,L:3,XL:2}},{name:"Sage Green",stock:{S:2,M:3,L:2,XL:1}}], caption:"Champagne Satin Shirt — a polished essential for everyday premium styling." },
    { id:"BYL-AC-008", sku:"BYL-AC-008", name:"Sage Mini Shoulder Bag", category:"Accessories", msrp:579000, stock:26, image:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=90", images:["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=90","https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=90","https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1200&q=90"], video:"https://www.youtube.com/results?search_query=baylos+sage+shoulder+bag", colors:[{name:"Black Obsidian",stock:{S:10,M:0,L:0,XL:0}},{name:"Champagne",stock:{S:7,M:0,L:0,XL:0}},{name:"Sage Green",stock:{S:9,M:0,L:0,XL:0}}], caption:"Sage Mini Shoulder Bag — compact statement accessory with a refined finish." }
];
