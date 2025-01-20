const fs = require('fs');
const Papa = require('papaparse');

// Ruta del archivo CSV
const csvFilePath = 'data/datos_tijuana.csv';
// Ruta del archivo GeoJSON de salida
const geoJsonFilePath = 'data/datos_tijuana.geojson';

// Leer el archivo CSV
fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error leyendo el archivo CSV:', err);
        return;
    }

    // Parsear el CSV a JSON
    Papa.parse(data, {
        header: true, // Usa la primera fila como nombres de columna
        skipEmptyLines: true,
        complete: function (results) {
            const features = results.data.map(row => {
                const lat = parseFloat(row['Coordenada Latitud']);
                const lng = parseFloat(row['Coordenada Longitud']);

                if (!isNaN(lat) && !isNaN(lng)) {
                    return {
                        type: 'Feature',
                        properties: {
                            Nombre: row['Nombre Institucion'],
                            Tipo: row['Tipo INstitucion'],
                            Calle: row['Calle'],
                            Estado: row['Estado'],
                            Ciudad: row['Ciudad'],
                            PaginaWeb: row['Pagina Web']
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [lng, lat]
                        }
                    };
                } else {
                    console.warn(`Fila ignorada por coordenadas inválidas: ${JSON.stringify(row)}`);
                    return null;
                }
            }).filter(feature => feature !== null); // Eliminar las filas inválidas

            // Crear el objeto GeoJSON
            const geoJson = {
                type: 'FeatureCollection',
                features: features
            };

            // Escribir el archivo GeoJSON
            fs.writeFile(geoJsonFilePath, JSON.stringify(geoJson, null, 2), (err) => {
                if (err) {
                    console.error('Error escribiendo el archivo GeoJSON:', err);
                } else {
                    console.log(`Archivo GeoJSON creado en: ${geoJsonFilePath}`);
                }
            });
        }
    });
});
