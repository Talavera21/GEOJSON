function initMap() {
    const map = L.map('map').setView([32.51485569447309, -117.03517236749207], 10);

    // Agregar capa base del mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Cargar y dibujar el GeoJSON
    fetch('data/datos_tijuana.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                if (feature.properties) {
                    layer.bindPopup(`
                        <b>Nombre:</b> ${feature.properties.Nombre}<br>
                        <b>Tipo:</b> ${feature.properties.Tipo}<br>
                        <b>Calle:</b> ${feature.properties.Calle}<br>
                        <b>Estado:</b> ${feature.properties.Estado}<br>
                        <b>Ciudad:</b> ${feature.properties.Ciudad}<br>
                        <b>Página Web:</b> <a href="${feature.properties.PaginaWeb}" target="_blank">${feature.properties.PaginaWeb}</a>
                    `);
                }
            }
        }).addTo(map);
    })
    .catch(error => console.error('Error loading GeoJSON:', error));
}
