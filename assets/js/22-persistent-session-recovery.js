/* ============================================================
   PERSISTENT SESSION RECOVERY
   ============================================================ */

(function recoverSession() {

    if (currentUser) {
        return;
    }

    const session =
        sessionStorage.getItem("baylosSession");

    if (!session) {
        return;
    }

    try {

        currentUser =
            JSON.parse(session);

        currentTier =
            currentUser.tier || "gold";

        showApplication();

    } catch (error) {

        sessionStorage.removeItem(
            "baylosSession"
        );
    }
})();
