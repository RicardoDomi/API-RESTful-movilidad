(() => {
  'use strict';

  const $ = (id)=> document.getElementById(id);

  
  const MAPLIBRE_JS_URL  = "https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.js";
  const MAPLIBRE_CSS_URL = "https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.css";

  function ensureMapLibreLoaded() {
    if (window.maplibregl?.Map) return Promise.resolve();
    
    if (!document.querySelector(`link[href="${MAPLIBRE_CSS_URL}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = MAPLIBRE_CSS_URL;
      document.head.appendChild(link);
    }
    
    if (!document.querySelector(`script[src="${MAPLIBRE_JS_URL}"]`)) {
      return new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = MAPLIBRE_JS_URL;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("No se pudo cargar MapLibre GL"));
        document.head.appendChild(s);
      });
    }
  
    return new Promise((resolve) => {
      const check = () => (window.maplibregl?.Map ? resolve() : setTimeout(check, 30));
      check();
    });
  }

  let historyMapML, routeSourceId = 'hist-route', stopsSourceId = 'hist-stops';
  let historyFallbackMarker;

  function toGeo(linePoints) {
    const pts = Array.isArray(linePoints) ? linePoints : [];
    const coords = pts.map(p => {
      const lat = (p?.lat ?? p?.latitude);
      const lng = (p?.lng ?? p?.longitude);
      const nlat = Number(lat), nlng = Number(lng);
      return (Number.isFinite(nlat) && Number.isFinite(nlng)) ? [nlng, nlat] : null;
    }).filter(Boolean);

    let bounds = null;
    if (coords.length) {
      let minX = coords[0][0], minY = coords[0][1];
      let maxX = coords[0][0], maxY = coords[0][1];
      for (const [x,y] of coords) {
        if (x < minX) minX = x; if (y < minY) minY = y;
        if (x > maxX) maxX = x; if (y > maxY) maxY = y;
      }
      bounds = [[minX, minY], [maxX, maxY]];
    }

    return {
      line: { type:'Feature', geometry:{ type:'LineString', coordinates: coords } },
      stops: {
        type:'FeatureCollection',
        features: coords.length ? [
          { type:'Feature', geometry:{ type:'Point', coordinates: coords[0] } },
          { type:'Feature', geometry:{ type:'Point', coordinates: coords[coords.length-1] } }
        ] : []
      },
      bounds
    };
  }

  
  async function initHistoryMapML() {
    if (historyMapML) return;
    const el = document.getElementById('historyMap');
    if (!el) {
      console.error(' No existe #historyMap en el HTML');
      return;
    }

    await ensureMapLibreLoaded();

    historyMapML = new maplibregl.Map({
      container: el,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
      },
      center: [-103.344, 20.6736],
      zoom: 12
    });

    historyMapML.on('load', () => {

      historyMapML.addSource(routeSourceId, {
        type: 'geojson',
        data: { type:'Feature', geometry:{ type:'LineString', coordinates: [] } }
      });
      historyMapML.addLayer({
        id: 'hist-route-line',
        type: 'line',
        source: routeSourceId,
        paint: { 'line-width': 4, 'line-color': '#2563eb' }
      });

      historyMapML.addSource(stopsSourceId, {
        type: 'geojson',
        data: { type:'FeatureCollection', features: [] }
      });
      historyMapML.addLayer({
        id: 'hist-stops-circle',
        type: 'circle',
        source: stopsSourceId,
        paint: {
          'circle-radius': 6,
          'circle-color': '#10b981',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      
      new maplibregl.Marker().setLngLat([-103.344, 20.6736]).addTo(historyMapML);
      setTimeout(() => historyMapML && historyMapML.resize(), 150);
    });
  }


  function showJourneyOnHistoryMap(journey) {
    initHistoryMapML().then(() => {
      if (!historyMapML) return;

      if (!historyMapML.isStyleLoaded()) {
        historyMapML.once('load', () => showJourneyOnHistoryMap(journey));
        return;
      }

      if (historyFallbackMarker) {
        historyFallbackMarker.remove();
        historyFallbackMarker = null;
      }

      const { line, stops, bounds } = toGeo(journey?.route_points);
      const routeSrc = historyMapML.getSource(routeSourceId);
      const stopsSrc = historyMapML.getSource(stopsSourceId);

      routeSrc && routeSrc.setData(line);
      stopsSrc && stopsSrc.setData(stops);

      if (bounds) {
        historyMapML.fitBounds(bounds, { padding: 30, linear: true });
      } else {
        const c = historyMapML.getCenter();
        historyFallbackMarker = new maplibregl.Marker().setLngLat([c.lng, c.lat]).addTo(historyMapML);
      }

      setTimeout(() => historyMapML && historyMapML.resize(), 120);
    }).catch(err => console.error('Error inicializando MapLibre:', err));
  }

  
  window.appMaps = window.appMaps || {};
  if (!window.appMaps.initHistoryMapML) window.appMaps.initHistoryMapML = initHistoryMapML;
  if (!window.appMaps.showJourneyOnHistoryMap) window.appMaps.showJourneyOnHistoryMap = showJourneyOnHistoryMap;

  
  let allJourneys = [];
  let filtered = [];

  function fmtKm(n){ return `${(Number(n)||0).toFixed(2)} km`; }
  function fmtMin(n){ return `${(Number(n)||0).toFixed(1)} min`; }
  function fmtDate(s){
    if (!s) return '—';
    const d = new Date(s);
    return isNaN(d) ? '—' : d.toLocaleString();
  }

  function renderList(list){
    const box = $('histList');
    if (!box) return;
    if (!Array.isArray(list) || !list.length) {
      box.innerHTML = `<div style="padding:10px;color:#666;">Sin recorridos</div>`;
      return;
    }
    box.innerHTML = list.map(j => {
      const title = j?.title || j?.name || `Recorrido #${j?.id ?? ''}`;
      const when  = j?.date || j?.created_at || j?.meta?.captured_at || '';
      const dist  = j?.meta?.distance_km ?? null;
      const dur   = j?.meta?.duration_min ?? j?.meta?.duration ?? null;

      return `
      <button class="hist-item" style="
        width:100%;text-align:left;background:#fff;border:0;border-bottom:1px solid #f0f0f0;cursor:pointer;
        padding:10px 12px; display:flex; flex-direction:column; gap:4px;">
        <span style="font-weight:600;">${title}</span>
        <span style="font-size:12px;color:#666;">${fmtDate(when)}</span>
        <span style="font-size:12px;color:#444;">
          ${dist!=null? `Distancia: ${fmtKm(dist)} • `:''}
          Puntos: ${j?.route_points?.length || 0}
          ${dur? ` • Duración: ${fmtMin(dur)}`:''}
        </span>
      </button>`;
    }).join('');

    
    Array.from(box.querySelectorAll('.hist-item')).forEach((btn, i) => {
      const j = list[i];
      btn.addEventListener('click', () => {
        try {
          
          showJourneyOnHistoryMap(j);
        } catch {
          
          try { window.appMaps?.drawJourneyOnMap?.(j); } catch {}
        }
      });
    });
  }

  function applyFilter(){
    const q = $('histSearch')?.value?.trim().toLowerCase() || '';
    filtered = allJourneys.filter(j => {
      if (!q) return true;
      const hay = `${j?.title||''} ${j?.name||''} ${j?.meta?.tag||''}`.toLowerCase();
      return hay.includes(q);
    });
    renderList(filtered);
  }

  async function loadJourneys(){
    try {
      const res = await fetch('/api/journeys'); // <-- cambia si tu endpoint es otro
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      allJourneys = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
    } catch {
    
      const now = Date.now();
      const mk=(id, km=5.2, lat=20.6736, lng=-103.344)=>{
        const pts=[]; for(let i=0;i<20;i++) pts.push({lat:lat+i*0.0012,lng:lng+i*0.0015});
        return { id, title:`Recorrido ${id}`,
          date:new Date(now - id*86400000).toISOString(),
          meta:{ distance_km: km }, route_points: pts };
      };
      allJourneys = [mk(1,7.8), mk(2,3.1,20.68,-103.37), mk(3,12.4,20.66,-103.31)];
    }
    filtered = allJourneys.slice();
    renderList(filtered);
  }

  function togglePanel(){
    const panel = $('histPanel');
    if (!panel) return;
    const show = panel.style.display === 'none' || panel.style.display === '';
    panel.style.display = show ? 'block' : 'none';
    if (show && !allJourneys.length) loadJourneys();
  }

  
  window.appHistory = {
    load: loadJourneys,
    toggle: togglePanel
  };

  
  document.addEventListener('DOMContentLoaded', () => {
    
    const el = document.getElementById('historyMap');
    if (el) initHistoryMapML();

    
    $('btnToggleHistory')?.addEventListener('click', togglePanel);
    $('histReload')?.addEventListener('click', loadJourneys);
    $('histSearch')?.addEventListener('input', applyFilter);
  });
})();
