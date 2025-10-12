(function(){
  async function postJSON(url, body){
    const res = await fetch(url, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(()=>({}));
    if(!res.ok) throw new Error(data.error || (data.errors && data.errors[0]?.msg) || "Error");
    return data;
  }

  function boot(){
    const form = document.getElementById("loginForm");
    const alertBox = document.getElementById("alert");
    const okBox = document.getElementById("ok");

    function showAlert(msg){
      alertBox.textContent = msg;
      alertBox.classList.remove("d-none");
      okBox.classList.add("d-none");
    }
    function showOk(msg){
      okBox.textContent = msg;
      okBox.classList.remove("d-none");
      alertBox.classList.add("d-none");
    }

    if (form){
      form.addEventListener("submit", async (e)=>{
        e.preventDefault();
        const fd = new FormData(form);
        const username = fd.get("username");
        const password = fd.get("password");
        try {
          await postJSON("/auth/auth", { username, password });
          localStorage.setItem("mobility_user", JSON.stringify({ username }));
          showOk("Login exitoso, redirigiendo…");
          location.href = "/dashboard";
        } catch(err){
          showAlert(err.message);
        }
      });
    }
  }

  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
