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


function escapeHtml(value){ return String(value??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

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
