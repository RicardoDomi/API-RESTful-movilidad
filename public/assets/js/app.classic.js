(function(){
 
  function mountVisual(containerId){
    var host = document.getElementById(containerId);
    if (!host) return;
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 900 420");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.display = "block";
    host.appendChild(svg);

    for (var y = 40; y <= 380; y += 40){
      var line = document.createElementNS(NS, "line");
      line.setAttribute("x1", "40");
      line.setAttribute("x2", "860");
      line.setAttribute("y1", y);
      line.setAttribute("y2", y);
      line.setAttribute("stroke", "rgba(15,23,42,.08)");
      line.setAttribute("stroke-width", "2");
      svg.appendChild(line);
    }

    var defs = document.createElementNS(NS, "defs");
    defs.innerHTML = '<filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="rgba(2,6,23,.15)"/></filter>';
    svg.appendChild(defs);

    var pathsCfg = [
      { d: "M80,300 C220,260 340,200 520,240 C650,270 730,180 820,160", color:"#3b82f6" },
      { d: "M80,250 C220,210 360,180 520,190 C650,200 700,260 820,260", color:"#f97393" },
      { d: "M80,320 C240,320 380,280 520,300 C640,320 730,300 820,300", color:"#a78bfa" }
    ];
    var pathElems = pathsCfg.map(function(p){
      var path = document.createElementNS(NS, "path");
      path.setAttribute("d", p.d);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", p.color);
      path.setAttribute("stroke-width", "6");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-dasharray", "14 12");
      path.setAttribute("filter", "url(#softShadow)");
      svg.appendChild(path);
      return path;
    });

    var dots = [
      { cx: 220, cy: 260, r: 7, fill:"#3b82f6" },
      { cx: 720, cy: 200, r: 8, fill:"#f97393" },
    ].map(function(cfg){
      var c = document.createElementNS(NS, "circle");
      Object.keys(cfg).forEach(function(k){ c.setAttribute(k, String(cfg[k])); });
      c.setAttribute("filter", "url(#softShadow)");
      svg.appendChild(c);
      return c;
    });

    pathElems.forEach(function(p, i){
      var base = 180 + i*60;
      if (window.gsap) {
        gsap.fromTo(p, { strokeDashoffset: 0 }, { strokeDashoffset: -400, duration: base/60, ease:"none", repeat:-1 });
      }
    });

    dots.forEach(function(d, i){
      var delta = i ? 10 : 14;
      if (window.gsap) {
        gsap.to(d, { yoyo:true, repeat:-1, duration: 2 + i, attr:{ cy: "+=" + delta }, ease:"sine.inOut" });
      }
    });
  }

  function setupTabs(){
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

    return { alertBox: alertBox, okBox: okBox, loginForm: loginForm };
  }

  function wireLogin(ctx){
    var alertBox = ctx.alertBox, okBox = ctx.okBox, loginForm = ctx.loginForm;
    var AUTH_URL = "/auth/auth"; // ajusta a "/auth" si limpias router
    function showError(msg){ alertBox.textContent = msg || "Error inesperado"; alertBox.classList.remove("d-none"); okBox.classList.add("d-none"); }
    function showOk(msg){ okBox.textContent = msg || "Operación exitosa"; okBox.classList.remove("d-none"); alertBox.classList.add("d-none"); }

    loginForm.addEventListener("submit", function(e){
      e.preventDefault();
      alertBox.classList.add("d-none"); okBox.classList.add("d-none");
      var fd = new FormData(loginForm);
      var data = {}; fd.forEach(function(v,k){ data[k]=v; });
      if (!data.email || !data.password) return showError("Completa email y contraseña");
      if (String(data.password).length < 8) return showError("La contraseña debe tener mínimo 8 caracteres");

      fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      .then(function(res){ return res.json().then(function(j){ return { ok: res.ok, json: j }; }); })
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

  function boot(){
    mountVisual('vizStage');
    var ctx = setupTabs();
    wireLogin(ctx);
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
