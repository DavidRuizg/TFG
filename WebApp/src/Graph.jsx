import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export function Graph({ tableData, type }) {
    const dataGraph = [...tableData];

    const labels = dataGraph.map(item => item.Hora);

    const metric = (type == 'Power') ? 'Potencia' 
    : (type == 'Voltage') ? 'Voltaje' 
    : (type == 'Current') ? 'Intensidad'
    : (type == 'Energy') ? 'Energia'
    : (type == 'Frequency') ? 'Frecuencia'
    : 'Factor de potencia';

    const metricVal = (type == 'Power') ? dataGraph.map(item => item.Potencia) 
    : (type == 'Voltage') ? dataGraph.map(item => item.Voltaje)
    : (type == 'Current') ? dataGraph.map(item => item.Intensidad)
    : (type == 'Energy') ? dataGraph.map(item => item.Energia)
    : (type == 'Frequency') ? dataGraph.map(item => item.Frecuencia)
    : dataGraph.map(item => item.FactorPotencia);

    const color = (type == 'Power') ? '#012f49' 
    : (type == 'Voltage') ? '#688a95'
    : (type == 'Current') ? '#22FFD0'
    : (type == 'Energy') ? '#22C3FF'
    : (type == 'Frequency') ? '#2258FF'
    : '#00E8FF';

    const unit = (type == 'Power') ? 'Vatios (W)' 
    : (type == 'Voltage') ? 'Voltios (V)'
    : (type == 'Current') ? 'Amperios (A)'
    : (type == 'Energy') ? 'Kilovatios-hora (kWh)'
    : (type == 'Frequency') ? 'Hercios (Hz)'
    : 'Factor de potencia';

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
    
    return (
        <Line data={data} options={options}/>
    );
    
}