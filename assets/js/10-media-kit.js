/* ============================================================
   MEDIA KIT
   ============================================================ */

function openMediaModal(product) {

    currentMediaProduct = product;

    $("#mediaProductName").textContent =
        product.name;

    $("#mediaPreviewImage").src =
        (product.images && product.images[0]) || product.image;

    $("#downloadImageLink").href =
        (product.images && product.images[0]) || product.image;

    $("#downloadVideoLink").href =
        product.video;

    $("#captionText").value =
        product.caption;

    $("#mediaModal").classList.remove("hidden");

    document.body.style.overflow = "hidden";

    lucide.createIcons();
}


function closeMediaModal() {

    $("#mediaModal").classList.add("hidden");

    currentMediaProduct = null;

    if (
        $("#orderOverlay").classList.contains("hidden") &&
        $("#cartOverlay").classList.contains("hidden") &&
        $("#adminOverlay").classList.contains("hidden")
    ) {
        document.body.style.overflow = "";
    }
}


$("#copyCaptionButton").addEventListener(
    "click",
    async () => {

        const caption =
            $("#captionText").value;

        try {

            await navigator.clipboard.writeText(
                caption
            );

            showToast(
                "Caption berhasil disalin ke clipboard.",
                "success"
            );

        } catch (error) {

            const textarea =
                $("#captionText");

            textarea.removeAttribute("readonly");

            textarea.select();

            document.execCommand("copy");

            textarea.setAttribute(
                "readonly",
                "readonly"
            );

            window.getSelection().removeAllRanges();

            showToast(
                "Caption berhasil disalin.",
                "success"
            );
        }
    }
);
