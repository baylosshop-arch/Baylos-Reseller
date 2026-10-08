/* ============================================================
   USER MENU
   ============================================================ */

function initializeUserMenu() {

    $("#userMenuButton").addEventListener(
        "click",
        event => {

            event.stopPropagation();

            $("#userMenu").classList.toggle(
                "hidden"
            );
        }
    );

    $("#menuLogout").addEventListener(
        "click",
        logout
    );

    $("#menuProfile").addEventListener(
        "click",
        () => {

            $("#userMenu").classList.add("hidden");

            showToast(
                "Profil Partner dapat dihubungkan ke halaman account settings.",
                "info"
            );
        }
    );

    document.addEventListener(
        "click",
        event => {

            const menu =
                $("#userMenu");

            const button =
                $("#userMenuButton");

            if (
                !menu.contains(event.target) &&
                !button.contains(event.target)
            ) {
                menu.classList.add("hidden");
            }
        }
    );
}
