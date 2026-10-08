/* ============================================================
   TOAST
   ============================================================ */

let toastTimer = null;


function showToast(
    message,
    type = "success"
) {

    const toast =
        $("#toast");

    const messageElement =
        $("#toastMessage");

    const iconContainer =
        $("#toastIcon");

    messageElement.textContent =
        message;

    const configurations = {
        success: {
            icon: "check",
            classes: "bg-green-500/10",
            iconClasses: "text-green-400"
        },

        warning: {
            icon: "triangle-alert",
            classes: "bg-yellow-500/10",
            iconClasses: "text-yellow-400"
        },

        info: {
            icon: "info",
            classes: "bg-blue-500/10",
            iconClasses: "text-blue-400"
        },

        error: {
            icon: "x",
            classes: "bg-red-500/10",
            iconClasses: "text-red-400"
        }
    };

    const config =
        configurations[type] ||
        configurations.success;

    iconContainer.className =
        `w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${config.classes}`;

    iconContainer.innerHTML =
        `<i data-lucide="${config.icon}" class="w-4 h-4 ${config.iconClasses}"></i>`;

    lucide.createIcons();

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer =
        setTimeout(
            () => {
                toast.classList.remove("show");
            },
            3200
        );
}
