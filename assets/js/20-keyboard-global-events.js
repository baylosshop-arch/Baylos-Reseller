/* ============================================================
   KEYBOARD / GLOBAL EVENTS
   ============================================================ */

function initializeGlobalKeyboardEvents() {

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeMediaModal();

                closeOrderDrawer();

                closeCart();

                closeAdmin();
            }
        }
    );


    $("#mediaModal").addEventListener(
        "click",
        event => {

            if (
                event.target ===
                $("#mediaModal")
            ) {
                closeMediaModal();
            }
        }
    );


    $("#orderOverlay").addEventListener(
        "click",
        event => {

            if (
                event.target ===
                $("#orderOverlay")
            ) {
                closeOrderDrawer();
            }
        }
    );


    $("#cartOverlay").addEventListener(
        "click",
        event => {

            if (
                event.target ===
                $("#cartOverlay")
            ) {
                closeCart();
            }
        }
    );
}
