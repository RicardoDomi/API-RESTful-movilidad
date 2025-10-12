(function(){
  const API_BASE = ""; 
  let map, markersLayer;
  let journeys = [];
  const history = [];

  const $ = (id)=> document.getElementById(id);
  const fmtKm = (km)=> `${Number(km).toFixed(2)} km`;
  const fmtMin = (min)=> `${Number(min).toFixed(1)} min`;

  function initMap() {
    map = L.map('map').setView([20.6736, -103.344], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);
    markersLayer = L.layerGroup().addTo(map);
  }

  function drawJourneyOnMap(j) {
    markersLayer.clearLayers();
    const points = Array.isArray(j.route_points) ? j.route_points : [];
    if (points.length) {
      const latlngs = points.map(p => [p.lat || p.latitude, p.lng || p.longitude]);
      const poly = L.polyline(latlngs).addTo(markersLayer);
      map.fitBounds(poly.getBounds(), { padding: [20,20] });
    } else {
      const center = map.getCenter();
      L.marker(center).bindPopup(`${j.start_location} → ${j.end_location}`).addTo(markersLayer).openPopup();
    }
  }

  function computeOptimal() {
    if (!journeys.length) return ($('optimalRoute').textContent = "Sin datos todavía.");
    const byDistance = [...journeys].sort((a,b)=>a.distance-b.distance)[0];
    const byDuration = [...journeys].sort((a,b)=>a.duration-b.duration)[0];
    const best = (byDuration.duration <= byDistance.duration) ? byDuration : byDistance;
    $('optimalRoute').innerHTML = `
      <div><strong>Mejor estimación:</strong> ${best.start_location} → ${best.end_location}</div>
      <div><span class="badge bg-success me-1">Distancia</span> ${fmtKm(best.distance)}</div>
      <div><span class="badge bg-info me-1">Duración</span> ${fmtMin(best.duration)}</div>
      <button class="btn btn-sm btn-outline-primary mt-2" id="verEnMapa">Ver en mapa</button>
    `;
    $('verEnMapa').onclick = ()=> drawJourneyOnMap(best);
  }

  function renderLists(filter="") {
    const jl = $('journeysList'); jl.innerHTML = "";
    const pl = $('popularList'); pl.innerHTML = "";
    const hl = $('historyList'); hl.innerHTML = "";

    const f = filter.trim().toLowerCase();
    const filtered = journeys.filter(j =>
      (j.start_location && j.start_location.toLowerCase().includes(f)) ||
      (j.end_location && j.end_location.toLowerCase().includes(f))
    );

    filtered.forEach(j => {
      const li = document.createElement('li');
      li.className = "list-group-item";
      li.innerHTML = `
        <span>${j.start_location} → ${j.end_location}<br>
          <small class="text-secondary">${fmtKm(j.distance)} · ${fmtMin(j.duration)}</small>
        </span>
        <div class="d-flex gap-2">
          <span class="badge rounded-pill text-bg-light border">${(j.usage_count||0)} usos</span>
          <button class="btn btn-sm btn-outline-primary">Mapa</button>
        </div>`;
      li.querySelector("button").onclick = () => {
        drawJourneyOnMap(j);
        history.unshift({id:j.id, start:j.start_location, end:j.end_location, ts: new Date().toISOString()});
        renderHistory();
      };
      jl.appendChild(li);
    });

    journeys.filter(j => j.is_popular).forEach(j=>{
      const li = document.createElement('li');
      li.className = "list-group-item d-flex justify-content-between";
      li.innerHTML = `<span>${j.start_location} → ${j.end_location}</span><span class="badge bg-warning-subtle text-dark">${j.rating||0} ★</span>`;
      pl.appendChild(li);
    });
  }

  function renderHistory() {
    const hl = $('historyList'); hl.innerHTML = "";
    history.slice(0,10).forEach(h => {
      const li = document.createElement('li');
      li.className = "list-group-item d-flex justify-content-between";
      const d = new Date(h.ts);
      li.innerHTML = `<span>${h.start} → ${h.end}</span><small class="text-secondary">${d.toLocaleString()}</small>`;
      hl.appendChild(li);
    });
  }

  async function loadJourneys() {
    const res = await fetch(`${API_BASE}/routes/all_journeys`);
    if (!res.ok) throw new Error("No fue posible cargar /routes/all_journeys");
    const data = await res.json();
    journeys = Array.isArray(data.journeys) ? data.journeys : (Array.isArray(data) ? data : []);
    computeOptimal();
    renderLists($('filterText').value);
    const m = $('metrics');
    m.innerHTML = `
      <div>Total recorridos: <strong>${journeys.length}</strong></div>
      <div>Populares: <strong>${journeys.filter(j=>j.is_popular).length}</strong></div>
      <div>Uso acumulado: <strong>${journeys.reduce((s,j)=>s+(j.usage_count||0),0)}</strong></div>
    `;
  }

  async function createJourney(form) {
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.distance = Number(payload.distance);
    payload.duration = Number(payload.duration);
    payload.date_time = new Date(payload.date_time).toISOString();
    try {
      if (payload.route_points) payload.route_points = JSON.parse(payload.route_points);
    } catch(e){ payload.route_points = []; }
    const res = await fetch(`${API_BASE}/routes/new_journey`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("No se pudo crear el recorrido");
    await loadJourneys();
  }

  function parseUsernameFromStorage(){
    try { return JSON.parse(localStorage.getItem("mobility_user")||"{}").username || ""; }
    catch(e){ return ""; }
  }

  function boot(){
    $('username').textContent = parseUsernameFromStorage();
    initMap();
    loadJourneys().catch(err=>{
      $('optimalRoute').textContent = "Error cargando datos.";
      console.error(err);
    });
    $('btnRefrescar').onclick = ()=> loadJourneys();
    $('filterText').addEventListener('input', (e)=> renderLists(e.target.value));
    $('newJourneyForm').addEventListener('submit', async (e)=>{
      e.preventDefault();
      try { await createJourney(e.target); e.target.reset(); }
      catch(err){ alert(err.message); }
    });
    $('logoutBtn').onclick = ()=>{ localStorage.removeItem("mobility_user"); location.href="/login"; };
  }

  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
