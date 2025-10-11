(function(){
  function setup(){
    var loginTab = document.getElementById("tab-login");
    var registerTab = document.getElementById("tab-register");
    var loginForm = document.getElementById("loginForm");
    var registerForm = document.getElementById("registerForm");
    var alertBox = document.getElementById("alert");
    var okBox = document.getElementById("ok");

    function activate(which){
      if (which === "login"){
        loginTab.classList.add("active"); registerTab.classList.remove("active");
        loginForm.classList.remove("d-none"); registerForm.classList.add("d-none");
      } else {
        registerTab.classList.add("active"); loginTab.classList.remove("active");
        registerForm.classList.remove("d-none"); loginForm.classList.add("d-none");
      }
      alertBox.classList.add("d-none"); okBox.classList.add("d-none");
    }
    loginTab.onclick = function(){ activate("login"); };
    registerTab.onclick = function(){ activate("register"); };

    var togglePwd = document.getElementById("togglePwd");
    if (togglePwd){
      togglePwd.onclick = function(){
        var pwd = loginForm.querySelector('input[name="password"]');
        var isPass = pwd.type === "password";
        pwd.type = isPass ? "text" : "password";
        togglePwd.innerHTML = isPass ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
      };
    }

    var AUTH_URL = "/auth/auth"; 

    function showError(msg){ alertBox.textContent = msg || "Error inesperado"; alertBox.classList.remove("d-none"); okBox.classList.add("d-none"); }
    function showOk(msg){ okBox.textContent = msg || "Operación exitosa"; okBox.classList.remove("d-none"); alertBox.classList.add("d-none"); }

    loginForm.addEventListener("submit", function(e){
      e.preventDefault();
      alertBox.classList.add("d-none"); okBox.classList.add("d-none");
      var fd = new FormData(loginForm); var data = {}; fd.forEach(function(v,k){ data[k]=v; });
      if (!data.email || !data.password) return showError("Completa email y contraseña");
      if (String(data.password).length < 8) return showError("La contraseña debe tener mínimo 8 caracteres");

      fetch(AUTH_URL, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(data) })
        .then(function(res){ return res.json().then(function(j){ return {ok:res.ok, json:j}; }); })
        .then(function(r){
          if (!r.ok){
            var msg = Array.isArray(r.json && r.json.errors) ? r.json.errors.map(function(e){return e.msg}).join(", ") : (r.json && r.json.error) || "Credenciales inválidas";
            throw new Error(msg);
          }
          localStorage.setItem("sessionEmail", (r.json.user && r.json.user.email) || data.email);
          showOk("Login exitoso.");

        })
        .catch(function(err){ showError(err.message); });
    });
  }
  if (document.readyState === "loading"){ document.addEventListener("DOMContentLoaded", setup); } else { setup(); }
})();