export const AUTH_URL = "/auth/auth"; 

export function setupTabs(){
  const loginTab = document.getElementById("tab-login");
  const registerTab = document.getElementById("tab-register");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const alertBox = document.getElementById("alert");
  const okBox = document.getElementById("ok");

  const activate = (which) => {
    if (which === "login"){
      loginTab.classList.add("active"); registerTab.classList.remove("active");
      loginForm.classList.remove("d-none"); registerForm.classList.add("d-none");
    } else {
      registerTab.classList.add("active"); loginTab.classList.remove("active");
      registerForm.classList.remove("d-none"); loginForm.classList.add("d-none");
    }
    alertBox.classList.add("d-none"); okBox.classList.add("d-none");
  };
  loginTab.onclick = () => activate("login");
  registerTab.onclick = () => activate("register");

  const togglePwd = document.getElementById("togglePwd");
  togglePwd.onclick = () => {
    const pwd = loginForm.querySelector('input[name="password"]');
    const isPass = pwd.type === "password";
    pwd.type = isPass ? "text" : "password";
    togglePwd.innerHTML = isPass ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
  };

  return { alertBox, okBox, loginForm, registerForm };
}

export function wireLogin({ alertBox, okBox, loginForm }){
  function showError(msg){ alertBox.textContent = msg || "Error inesperado"; alertBox.classList.remove("d-none"); okBox.classList.add("d-none"); }
  function showOk(msg){ okBox.textContent = msg || "Operación exitosa"; okBox.classList.remove("d-none"); alertBox.classList.add("d-none"); }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    alertBox.classList.add("d-none"); okBox.classList.add("d-none");

    const data = Object.fromEntries(new FormData(loginForm));
    if (!data.email || !data.password) return showError("Completa email y contraseña");
    if (data.password.length < 8) return showError("La contraseña debe tener mínimo 8 caracteres");

    try {
      const res = await fetch(AUTH_URL, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok) {
        const fromValidator = Array.isArray(json?.errors) ? json.errors.map(e => e.msg).join(", ") : null;
        throw new Error(fromValidator || json?.error || "Credenciales inválidas");
      }
      localStorage.setItem("sessionEmail", json?.user?.email || data.email);
      showOk("Login exitoso.");
      
    } catch (err) { showError(err.message); }
  });
}
