(function(){
  function initMap() {
    var el = document.getElementById('map');
    if (!el) return;

    var map = L.map(el, { zoomControl: true }).setView([19.4326, -99.1332], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    var A = L.marker([19.428, -99.163], { title: 'Origen' }).addTo(map).bindPopup('Origen');
    var B = L.marker([19.442, -99.097], { title: 'Destino' }).addTo(map).bindPopup('Destino');

    var routes = [
      { name: 'Rápida', color: '#2563eb', coords: [
        [19.428, -99.163], [19.433, -99.150], [19.436, -99.135], [19.438, -99.118], [19.442, -99.097]
      ]},
      { name: 'Escénica', color: '#f97316', coords: [
        [19.428, -99.163], [19.420, -99.150], [19.418, -99.130], [19.430, -99.110], [19.442, -99.097]
      ]},
      { name: 'Menos tráfico', color: '#a855f7', dashArray: '8,8', coords: [
        [19.428, -99.163], [19.435, -99.170], [19.445, -99.140], [19.448, -99.115], [19.442, -99.097]
      ]}
    ];

    var group = L.featureGroup([A, B]).addTo(map);

    routes.forEach(function(r){
      var line = L.polyline(r.coords, { color: r.color, weight: 5, opacity: 0.9, dashArray: r.dashArray || null }).addTo(map);
      line.bindTooltip(r.name, { sticky: true });
      group.addLayer(line);

      if (!r.dashArray){
        var anim = L.polyline(r.coords, { color: 'white', weight: 2, opacity: 0.5, dashArray: '6,14' }).addTo(map);
        group.addLayer(anim);
      }
    });

    map.fitBounds(group.getBounds().pad(0.2));

    var legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function () {
      var div = L.DomUtil.create('div', 'leaflet-bar p-2 bg-white shadow-sm rounded');
      div.innerHTML = '<strong>Posibles Rutas</strong><br/>' +
        '<span style="display:inline-block;width:12px;height:4px;background:#2563eb;margin-right:6px;"></span> Rápida<br/>' +
        '<span style="display:inline-block;width:12px;height:4px;background:#f97316;margin-right:6px;"></span> Escénica<br/>' +
        '<span style="display:inline-block;width:12px;height:0;border-top:4px dashed #a855f7;margin-right:6px;"></span> Menos tráfico';
      return div;
    };
    legend.addTo(map);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
  } else {
    initMap();
  }
})();
