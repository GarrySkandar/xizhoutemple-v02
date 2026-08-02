const hotspotsLayer = document.getElementById('hotspots');

HALLS.forEach((hall) => {
  const a = document.createElement('a');
  a.className = 'hotspot';
  a.href = `halls/${encodeURIComponent(hall.id)}.html`;
  a.style.left = `${hall.x}%`;
  a.style.top = `${hall.y}%`;
  a.style.width = `${hall.w}%`;
  a.style.height = `${hall.h}%`;
  a.setAttribute('aria-label', hall.name);
  a.innerHTML = `<span>${hall.name}</span>`;
  hotspotsLayer.appendChild(a);
});
