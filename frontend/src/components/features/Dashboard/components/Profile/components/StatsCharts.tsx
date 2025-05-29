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
                labels: {
                    font: {
                        size: 12
                    },
                    color: '#333'
                }
            },
            tooltip: {
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 12
                },
                callbacks: {
                    label: function(context: any) {
                        const value = context.raw;
                        if (context.datasetIndex === 0) {
                            if (context.dataIndex === 0) {
                                return `${value.toFixed(2)}%`;
                            } else if (context.dataIndex === 1) {
                                return `${value.toFixed(2)}s`;
                            } else {
                                return `${value.toFixed(2)} ${intl.formatMessage({ id: 'profile.stats.points', defaultMessage: 'points' })}`;
                            }
                        }
                        return `${value} ${intl.formatMessage({ id: 'profile.stats.points', defaultMessage: 'points' })}`;
                    }
                }
            }
        },
    };

    // Datos para el gráfico de métricas generales
    const metricsChartData = {
        labels: [
            intl.formatMessage({ id: 'profile.stats.accuracy', defaultMessage: 'Accuracy' }),
            intl.formatMessage({ id: 'profile.stats.avgTime', defaultMessage: 'Average Time' }),
            intl.formatMessage({ id: 'profile.stats.pointsPerGame', defaultMessage: 'Points per Game' }),
        ],
        datasets: [
            {
                label: intl.formatMessage({ id: 'profile.stats.performance', defaultMessage: 'Performance' }),
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
            intl.formatMessage({ id: 'profile.stats.pointsEarned', defaultMessage: 'Points Earned' }),
            intl.formatMessage({ id: 'profile.stats.remainingPoints', defaultMessage: 'Remaining Points' }),
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
                            id: 'profile.stats.generalMetrics', 
                            defaultMessage: 'General Metrics' 
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
                                        title: {
                                            display: true,
                                            text: intl.formatMessage({ 
                                                id: 'profile.stats.values', 
                                                defaultMessage: 'Values' 
                                            }),
                                            color: '#333'
                                        },
                                        ticks: {
                                            color: '#333',
                                            callback: function(value: any) {
                                                return value + (value === 100 ? '%' : '');
                                            }
                                        }
                                    },
                                    x: {
                                        ticks: {
                                            color: '#333'
                                        }
                                    }
                                }
                            }} 
                        />
                    </div>
                </div>
                <div className="chart-container">
                    <h3>
                        {intl.formatMessage({ 
                            id: 'profile.stats.pointsDistribution', 
                            defaultMessage: 'Points Distribution' 
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