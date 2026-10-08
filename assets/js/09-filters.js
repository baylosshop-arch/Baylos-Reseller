/* ============================================================
   FILTERS
   ============================================================ */

function initializeProductRail(){const rail=$("#productGrid"),prev=$("#productRailPrev"),next=$("#productRailNext");if(!rail||!prev||!next)return;const amount=()=>Math.max(300,Math.min(700,rail.clientWidth*.78));prev.addEventListener("click",()=>rail.scrollBy({left:-amount(),behavior:"smooth"}));next.addEventListener("click",()=>rail.scrollBy({left:amount(),behavior:"smooth"}));}


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
