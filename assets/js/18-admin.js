/* ============================================================
   ADMIN
   ============================================================ */

function initializeAdmin() {
    $("#adminButton").addEventListener("click", openAdmin);
    const input=$("#editorPhotoInput"); if(input) input.addEventListener("change",handleEditorPhotoUpload);
}


function openAdmin() {

    if (
        !currentUser ||
        currentUser.role !== "admin"
    ) {

        showToast(
            "Akses Admin membutuhkan akun administrator.",
            "warning"
        );

        return;
    }

    $("#adminOverlay").classList.remove("hidden");

    document.body.style.overflow = "hidden";

    lucide.createIcons();
}


function closeAdmin() {

    $("#adminOverlay").classList.add("hidden");

    if (
        $("#mediaModal").classList.contains("hidden") &&
        $("#orderOverlay").classList.contains("hidden") &&
        $("#cartOverlay").classList.contains("hidden")
    ) {
        document.body.style.overflow = "";
    }
}
