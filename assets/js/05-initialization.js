/* ============================================================
   INITIALIZATION
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    lucide.createIcons();

    initializeAuthentication();

    initializeProductRail();
    initializeFilters();

    initializeTierSwitcher();

    initializeUserMenu();

    initializeCart();

    initializeAdmin();

    loadSavedProducts();
    const editorPhotoInput=$("#editorPhotoInput");
    if(editorPhotoInput) editorPhotoInput.addEventListener("change",handleEditorPhotoUpload);

    initializeGlobalKeyboardEvents();

    renderProducts();

    updateCartUI();
});
