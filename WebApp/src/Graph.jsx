import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

// Función que genera un gráfico de líneas con los datos de la tabla pasados como parámetro según el tipo de métrica especificada como parámetro
export function Graph({ tableData, type }) {
    // Copia de los datos de la tabla
    const dataGraph = [...tableData];

    // Extracción de las etiquetas de la gráfica: Eje horizontal X
    const labels = dataGraph.map(item => item.Hora);

    // Selección de la métrica a representar en la gráfica según el tipo especificado
    const metric = (type == 'Power') ? 'Potencia' 
    : (type == 'Voltage') ? 'Voltaje' 
    : (type == 'Current') ? 'Intensidad'
    : (type == 'Energy') ? 'Energia'
    : (type == 'Frequency') ? 'Frecuencia'
    : 'Factor de potencia';

    // Extracción de los valores de la métrica a representar en la gráfica
    const metricVal = (type == 'Power') ? dataGraph.map(item => item.Potencia) 
    : (type == 'Voltage') ? dataGraph.map(item => item.Voltaje)
    : (type == 'Current') ? dataGraph.map(item => item.Intensidad)
    : (type == 'Energy') ? dataGraph.map(item => item.Energia)
    : (type == 'Frequency') ? dataGraph.map(item => item.Frecuencia)
    : dataGraph.map(item => item.FactorPotencia);

    // Selección del color de la gráfica según el tipo de métrica especificado
    const color = (type == 'Power') ? '#012f49' 
    : (type == 'Voltage') ? '#688a95'
    : (type == 'Current') ? '#22FFD0'
    : (type == 'Energy') ? '#22C3FF'
    : (type == 'Frequency') ? '#2258FF'
    : '#00E8FF';

    // Selección de la unidad de la métrica según el tipo especificado
    const unit = (type == 'Power') ? 'Vatios (W)' 
    : (type == 'Voltage') ? 'Voltios (V)'
    : (type == 'Current') ? 'Amperios (A)'
    : (type == 'Energy') ? 'Kilovatios-hora (kWh)'
    : (type == 'Frequency') ? 'Hercios (Hz)'
    : 'Factor de potencia';

    // Definición de los datos
    const data = {
        labels,
        datasets: [
          {
            label: metric,
            data: metricVal,
            borderColor: color,
            backgroundColor: color,
          },
        ],
      };
    // Opciones de la gráfica
    const options = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        stacked: false,
        plugins: {
            title: {
                display: true,
                text: 'Evolución temporal: ' + metric,
                font: {
                    size: 20,
                    weight: 'bold',
                },
            },
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: unit,
                    font: {
                        size: 16,
                        weight: 'bold',
                    },
                },
            },
        },
    };
    // Renderización de la gráfica de tipo línea
    return (
        <Line data={data} options={options}/>
    );
    
}