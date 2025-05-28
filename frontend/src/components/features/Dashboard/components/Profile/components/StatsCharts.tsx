import React from 'react';
import { useIntl } from 'react-intl';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import './StatsCharts.css';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
);

interface StatsChartsProps {
    stats: {
        total_games: number;
        total_points: number;
        accuracy: number;
        avg_response_time: number;
    };
}

const StatsCharts: React.FC<StatsChartsProps> = ({ stats }) => {
    const intl = useIntl();

    // Configuración común para los gráficos
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
        },
    };

    // Datos para el gráfico de métricas generales
    const metricsChartData = {
        labels: [
            intl.formatMessage({ id: 'stats.accuracy', defaultMessage: 'Precisión' }),
            intl.formatMessage({ id: 'stats.avgTime', defaultMessage: 'Tiempo Promedio (s)' }),
            intl.formatMessage({ id: 'stats.pointsPerGame', defaultMessage: 'Puntos por Partida' }),
        ],
        datasets: [
            {
                label: intl.formatMessage({ id: 'stats.performance', defaultMessage: 'Rendimiento' }),
                data: [
                    stats.accuracy,
                    stats.avg_response_time,
                    stats.total_points / stats.total_games
                ],
                backgroundColor: [
                    'rgba(76, 175, 80, 0.7)',  // Verde
                    'rgba(255, 152, 0, 0.7)',  // Naranja
                    'rgba(183, 28, 28, 0.7)',  // Rojo
                ],
                borderColor: [
                    'rgba(76, 175, 80, 1)',
                    'rgba(255, 152, 0, 1)',
                    'rgba(183, 28, 28, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Datos para el gráfico de distribución de puntos
    const pointsDistributionData = {
        labels: [
            intl.formatMessage({ id: 'stats.pointsEarned', defaultMessage: 'Puntos Ganados' }),
            intl.formatMessage({ id: 'stats.remainingPoints', defaultMessage: 'Puntos Restantes' }),
        ],
        datasets: [{
            data: [
                stats.total_points,
                stats.total_games * 100 - stats.total_points // Asumiendo 100 puntos máximos por juego
            ],
            backgroundColor: [
                'rgba(183, 28, 28, 0.7)',
                'rgba(224, 224, 224, 0.7)',
            ],
            borderColor: [
                'rgba(183, 28, 28, 1)',
                'rgba(224, 224, 224, 1)',
            ],
            borderWidth: 1,
        }],
    };

    return (
        <div className="stats-charts">
            <div className="chart-row">
                <div className="chart-container">
                    <h3>
                        {intl.formatMessage({ 
                            id: 'stats.generalMetrics', 
                            defaultMessage: 'Métricas Generales' 
                        })}
                    </h3>
                    <div className="chart-wrapper">
                        <Bar 
                            data={metricsChartData} 
                            options={{
                                ...commonOptions,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                    }
                                }
                            }} 
                        />
                    </div>
                </div>
                <div className="chart-container">
                    <h3>
                        {intl.formatMessage({ 
                            id: 'stats.pointsDistribution', 
                            defaultMessage: 'Distribución de Puntos' 
                        })}
                    </h3>
                    <div className="chart-wrapper">
                        <Doughnut 
                            data={pointsDistributionData} 
                            options={{
                                ...commonOptions,
                                cutout: '60%',
                            }} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsCharts; 