// Lógica de Autenticación, Roles y Recuperación con Supabase

document.addEventListener("DOMContentLoaded", () => {
  // 1. Mostrar / Ocultar Contraseña (Ojito)
  const togglePassword = document.getElementById("toggle-password");
  const passwordInput = document.getElementById("password");
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      togglePassword.innerHTML = type === "password" 
        ? `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
        : `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
    });
  }

  // 2. Formulario de Inicio de Sesión
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = passwordInput.value;

      if (typeof supabaseClient === 'undefined' || !supabaseClient) {
        alert("Error: Supabase no está conectado.");
        return;
      }

      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) {
        alert("Error al iniciar sesión: " + error.message);
        return;
      }

      // Obtener rol del usuario
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile && profile.role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'cliente.html';
      }
    });
  }

  // 3. Modal de Recuperación de Contraseña
  const forgotLink = document.getElementById("forgot-password-link");
  const forgotModal = document.getElementById("forgot-modal");
  const closeForgot = document.getElementById("close-forgot");
  const forgotForm = document.getElementById("forgot-form");

  if (forgotLink && forgotModal) {
    forgotLink.addEventListener("click", (e) => {
      e.preventDefault();
      forgotModal.classList.add("open");
    });
    closeForgot.addEventListener("click", () => forgotModal.classList.remove("open"));

    forgotForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const recoveryEmail = document.getElementById("recovery-email").value;
      
      const { error } = await supabaseClient.auth.resetPasswordForEmail(recoveryEmail, {
        redirectTo: window.location.origin + '/login.html?reset=true',
      });

      if (error) {
        alert("Error: " + error.message);
      } else {
        alert("¡Enlace de recuperación enviado a tu correo Gmail!");
        forgotModal.classList.remove("open");
      }
    });
  }
});