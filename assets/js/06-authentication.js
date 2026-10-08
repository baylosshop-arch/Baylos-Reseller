/* ============================================================
   AUTHENTICATION
   ============================================================ */

function initializeAuthentication() {

    const savedSession = localStorage.getItem("baylosSession");

    if (savedSession) {
        try {
            currentUser = JSON.parse(savedSession);

            currentTier = currentUser.tier || "gold";

            showApplication();

        } catch (error) {
            localStorage.removeItem("baylosSession");
        }
    }

    $("#loginForm").addEventListener("submit", handleLogin);
    $("#authModalForm").addEventListener("submit", handleAuthModalSubmit);

    $("#togglePassword").addEventListener("click", () => {

        const passwordInput = $("#loginPassword");

        const icon = $("#togglePassword i");

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            icon.setAttribute("data-lucide", "eye-off");

        } else {

            passwordInput.type = "password";

            icon.setAttribute("data-lucide", "eye");
        }

        lucide.createIcons();
    });
}



function handleAuthModalSubmit(event){
 event.preventDefault();
 const email=$("#authModalEmail").value.trim().toLowerCase();
 if(authModalMode==='forgot'){closeAuthModal();showToast('Instruksi reset password demo telah dikirim ke '+email+'.','success');return;}
 const name=$("#registerName").value.trim();
 const business=$("#registerBusiness").value.trim();
 const whatsapp=$("#registerWhatsapp").value.trim();
 const city=$("#registerCity").value.trim();
 const social=$("#registerSocial").value.trim();
 const password=$("#authModalPassword").value;
 const confirm=$("#authModalPasswordConfirm").value;
 if(!name||!business||!whatsapp||!city||!email||!password||!confirm){showToast('Lengkapi semua data pendaftaran.','warning');return;}
 if(password.length<6){showToast('Password minimal 6 karakter.','warning');return;}
 if(password!==confirm){showToast('Konfirmasi password tidak sama.','warning');return;}
 if(!$("#registerTerms").checked){showToast('Anda harus menyetujui Partner Terms.','warning');return;}
 const users=JSON.parse(localStorage.getItem('baylosUsers')||'[]');
 if(users.some(u=>u.email===email)||BAYLOS_CONFIG.demoUsers.some(u=>u.email===email)){showToast('Email sudah terdaftar.','warning');return;}
 const user={id:'RS-'+Date.now(),email,password,role:'reseller',name,business,whatsapp,city,social,tier:'silver',status:'pending',createdAt:new Date().toISOString()};
 users.push(user); localStorage.setItem('baylosUsers',JSON.stringify(users)); closeAuthModal(); showRegistrationSuccess();
}

function showRegistrationSuccess(){
  const existing=document.getElementById('registrationSuccess');
  if(existing) existing.remove();
  const box=document.createElement('div'); box.id='registrationSuccess'; box.className='fixed inset-0 z-[210] modal-backdrop p-4 flex items-center justify-center';
  box.innerHTML=`<div class="glass rounded-3xl p-7 max-w-md w-full text-center shadow-luxury"><div class="w-14 h-14 mx-auto rounded-2xl bg-yellow-500/10 flex items-center justify-center"><i data-lucide="clock-3" class="w-7 h-7 text-yellow-400"></i></div><p class="text-gold text-[10px] uppercase tracking-[.2em] font-bold mt-5">Registration Submitted</p><h2 class="font-display text-3xl mt-2">Become a Baylos Partner</h2><p class="text-sm text-zinc-400 mt-4 leading-6">Terima kasih telah mendaftar sebagai Baylos Reseller Partner.<br>Account kamu sedang menunggu persetujuan admin.</p><div class="mt-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-4"><div class="text-xs text-zinc-500">Status</div><div class="mt-1 text-yellow-400 font-bold">● PENDING REVIEW</div></div><button onclick="document.getElementById('registrationSuccess').remove()" class="btn-gold w-full h-12 rounded-xl font-bold mt-5">Kembali ke Login</button></div>`; document.body.appendChild(box); lucide.createIcons();
}


function handleLogin(event) {

    event.preventDefault();

    const email = $("#loginEmail").value.trim().toLowerCase();

    const password = $("#loginPassword").value;

    const remember = $("#rememberMe").checked;

    const registeredUsers = JSON.parse(localStorage.getItem("baylosUsers") || "[]");
    const user = [...BAYLOS_CONFIG.demoUsers, ...registeredUsers].find(
        item => item.email === email && item.password === password
    );

    const errorBox = $("#loginError");

    if (!user) {
        errorBox.textContent = "Email atau password tidak sesuai.";
        errorBox.classList.remove("hidden");
        return;
    }

    if (user.role === "reseller" && user.status && user.status !== "approved") {
        errorBox.textContent = user.status === "suspended" ? "Akun reseller Anda sedang ditangguhkan oleh admin." : "Akun Anda masih PENDING REVIEW. Tunggu persetujuan admin Baylos.";
        errorBox.classList.remove("hidden");
        return;
    }

    errorBox.classList.add("hidden");

    currentUser = {
        email: user.email,
        role: user.role,
        name: user.name,
        tier: user.tier
    };

    currentTier = user.tier;

    if (remember) {

        localStorage.setItem(
            "baylosSession",
            JSON.stringify(currentUser)
        );

    } else {

        sessionStorage.setItem(
            "baylosSession",
            JSON.stringify(currentUser)
        );
    }

    showApplication();

    showToast(
        `Selamat datang, ${user.name}.`,
        "success"
    );
}


function showApplication() {

    $("#loginScreen").classList.add("hidden");

    $("#app").classList.remove("hidden");

    updateUserUI();
    updateDashboardStats();
    showResellerView("dashboard");

    setTier(currentTier, false);

    if (currentUser && currentUser.role === "admin") {
        $("#adminButton").classList.remove("hidden");
    } else {
        $("#adminButton").classList.add("hidden");
    }
}


function logout() {

    currentUser = null;

    localStorage.removeItem("baylosSession");

    sessionStorage.removeItem("baylosSession");

    $("#app").classList.add("hidden");

    $("#adminOverlay").classList.add("hidden");

    $("#loginScreen").classList.remove("hidden");

    $("#loginEmail").value = "";

    $("#loginPassword").value = "";

    $("#loginError").classList.add("hidden");

    $("#userMenu").classList.add("hidden");

    showToast("Anda telah keluar dari portal.", "info");
}


function updateUserUI() {

    if (!currentUser) {
        return;
    }

    $("#menuUserName").textContent = currentUser.name;

    $("#menuUserEmail").textContent = currentUser.email;
}
