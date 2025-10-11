export function mountVisual(containerId){
  const host = document.getElementById(containerId);
  if (!host) return;

  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 900 420");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.style.display = "block";
  host.appendChild(svg);


  for (let y = 40; y <= 380; y += 40){
    const line = document.createElementNS(NS, "line");
    line.setAttribute("x1", "40");
    line.setAttribute("x2", "860");
    line.setAttribute("y1", y);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", "rgba(15,23,42,.08)");
    line.setAttribute("stroke-width", "2");
    svg.appendChild(line);
  }


  const defs = document.createElementNS(NS, "defs");
  defs.innerHTML = `
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="rgba(2,6,23,.15)"/>
    </filter>
  `;
  svg.appendChild(defs);


  const paths = [
    { d: "M80,300 C220,260 340,200 520,240 C650,270 730,180 820,160", color:"#3b82f6" }, // blue
    { d: "M80,250 C220,210 360,180 520,190 C650,200 700,260 820,260", color:"#f97393" }, // pink-ish
    { d: "M80,320 C240,320 380,280 520,300 C640,320 730,300 820,300", color:"#a78bfa" }  // purple
  ];

  const pathElems = paths.map(p => {
    const path = document.createElementNS(NS, "path");
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


  const dots = [
    { cx: 220, cy: 260, r: 7, fill:"#3b82f6" },
    { cx: 720, cy: 200, r: 8, fill:"#f97393" },
  ].map(cfg => {
    const c = document.createElementNS(NS, "circle");
    Object.entries(cfg).forEach(([k,v]) => c.setAttribute(k, String(v)));
    c.setAttribute("filter", "url(#softShadow)");
    svg.appendChild(c);
    return c;
  });


  pathElems.forEach((p, i) => {
    const base = 180 + i*60;
    gsap.fromTo(p, { strokeDashoffset: 0 }, { strokeDashoffset: -400, duration: base/60, ease:"none", repeat:-1 });
  });

 
  dots.forEach((d, i) => {
    const delta = i ? 10 : 14;
    gsap.to(d, { yoyo:true, repeat:-1, duration: 2 + i, attr:{ cy: `+=${delta}` }, ease:"sine.inOut" });
  });
}
