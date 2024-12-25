// Función para cargar datos desde un archivo CSV
function loadCSV(url) {
    return new Promise((resolve, reject) => {
        Papa.parse(url, {
            download: true,
            header: true,
            complete: (results) => {
                resolve(results.data);
            },
            error: (error) => {
                reject(error);
            }
        });
    });
}

// Cargar datos y crear gráficos
async function loadDataAndCreateCharts() {
    try {
        // Cargar datos del archivo lugares.csv
        const lugaresData = await loadCSV('Tablas/Lugares obtenidos por años (10 años).csv');

        // Crear gráfico de dispersión
        const scatterChartData1 = lugaresData.map(d => ({ x: parseFloat(d.Año), y: parseFloat(d.Categoría1) }));
        const scatterChartData2 = lugaresData.map(d => ({ x: parseFloat(d.Año), y: parseFloat(d.Categoría2) })); // Nueva columna

        const ctxScatter = document.getElementById('myScatterChart').getContext('2d');
        const scatterChart = new Chart(ctxScatter, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Categoría 11-12 años',
                        data: scatterChartData1,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        pointRadius: 5
                    },
                    {
                        label: 'Categoría 13-14 años',
                        data: scatterChartData2,
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        pointRadius: 5
                    }
                ]
            },
            options: {
                scales: {
                    x: { title: { display: true, text: 'Año' } },
                    y: { title: { display: true, text: 'Posición' } }
                }
            }
        });

        // Cargar datos del archivo preguntas.csv
        const preguntasData = await loadCSV('Tablas/Preguntas del Programa de preparación del deportista (Comisión Nacional de Beisbol).csv');

        // Crear gráfico de barras
        const barLabels = preguntasData.map(d => d.Categorías);
        const barValues = preguntasData.map(d => parseInt(d.Alum));
        const barValuesExtra = preguntasData.map(d => parseFloat(d.Inicio)); // Nueva columna
        const barValuesAdicionales = preguntasData.map(d => parseFloat(d.Final)); // Nueva columna

        const ctxBar = document.getElementById('myBarChart').getContext('2d');
        const barChart = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: barLabels,
                datasets: [
                    {
                        label: 'Inicio Resp. Positivo',
                        data: barValuesExtra,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Final Resp. Positivo',
                        data: barValuesAdicionales,
                        backgroundColor: 'rgba(255, 159, 64, 0.6)',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    x: { title: { display: true, text: 'Categorías' } },
                    y: { beginAtZero: true , title: { display: true, text: 'Resp. Positivo (%)' } }
                }
            }
        });

        // Crear gráfico de barras horizontales
        const ctxHorizontalBar = document.getElementById('myHorizontalBarChart').getContext('2d');
        const horizontalBarChart = new Chart(ctxHorizontalBar, {
            type: 'bar',
            data: {
                labels: barLabels,
                datasets: [
                    {
                        label: '# de Alumnos',
                        data: barValues,
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: { 
                    x: { beginAtZero: true },
                    y: { title: { display: true, text: 'Categorías' } }
                },
                indexAxis: 'y',
                // Elements options apply to all of the options unless overridden in a dataset
                // In this case, we are setting the border of each horizontal bar to be 2px wide
                elements: {
                    bar: {
                    borderWidth: 2,
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                    position: 'right',
                    },
                }
            }
        });

    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

let mySecondScatterChart;

async function createScatterChart(year) {
    const data = await loadCSV(`Tablas/Resultados Ofensivos ${year} (13 - 14 años).csv`);
    const scatterData1 = data.map(d => ({ x: d.Aspectos, y: parseFloat(d.er) }));
    const scatterData2 = data.map(d => ({ x: d.Aspectos, y: parseFloat(d.do) }));
    // const { scatterData1, scatterData2 } = await fetchData(year);

    if (mySecondScatterChart) {
        mySecondScatterChart.destroy(); // Destruir el gráfico anterior
    }

    const ctx = document.getElementById('mySecondScatterChart').getContext('2d');
    mySecondScatterChart = new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: [
                {
                    label: '1er Año',
                    data: scatterData1,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    pointRadius: 5
                },
                {
                    label: '2do Año',
                    data: scatterData2,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    pointRadius: 5
                }
            ]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Aspectos' } },
                y: { title: { display: true, text: 'Valores' } }
            }
        }
    });
}

document.getElementById('yearSelector').addEventListener('change', function() {
    const selectedYear = this.value;
    document.getElementById('h2result').innerText = `Resultados Ofensivos ${selectedYear} (13 - 14 años)`
    createScatterChart(selectedYear);
});

// Cargar el gráfico inicial
createScatterChart('2007');

// Llamar a la función para cargar datos y crear gráficos
loadDataAndCreateCharts();
