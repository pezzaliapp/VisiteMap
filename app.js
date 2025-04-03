
const form = document.getElementById("visitaForm");
const lista = document.getElementById("listaVisite");
const mappaBtn = document.getElementById("mostraMappa");

let visite = JSON.parse(localStorage.getItem("visiteMap")) || [];

function salvaVisite() {
  localStorage.setItem("visiteMap", JSON.stringify(visite));
  mostraVisite();
}

function mostraVisite() {
  lista.innerHTML = "";
  visite.forEach((v, i) => {
    const li = document.createElement("li");
    li.textContent = `${v.data} - ${v.cliente} - ${v.indirizzo}`;
    lista.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const cliente = document.getElementById("cliente").value;
  const indirizzo = document.getElementById("indirizzo").value;
  const data = document.getElementById("data").value;
  const note = document.getElementById("note").value;

  visite.push({ cliente, indirizzo, data, note });
  salvaVisite();
  form.reset();
});

mappaBtn.addEventListener("click", () => {
  let kml = `<?xml version="1.0" encoding="UTF-8"?>
  <kml xmlns="http://www.opengis.net/kml/2.2"><Document>`;
  visite.forEach((v) => {
    kml += `<Placemark>
      <name>${v.cliente}</name>
      <description>${v.note || ""} - ${v.data}</description>
      <address>${v.indirizzo}</address>
    </Placemark>`;
  });
  kml += `</Document></kml>`;

  // 1. Scarica il file localmente
  const blob = new Blob([kml], { type: "application/vnd.google-earth.kml+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "visite.kml";
  a.click();

  // 2. Prova ad aprire Google Maps con link al file KML online
  const publicKmlUrl = "https://www.alessandropezzali.it/VisiteMap/visite.kml";
  setTimeout(() => {
    window.open("https://www.google.com/maps?q=" + encodeURIComponent(publicKmlUrl), "_blank");
  }, 500);
});

mostraVisite();
