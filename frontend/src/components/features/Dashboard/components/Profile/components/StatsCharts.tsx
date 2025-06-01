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
        recent_games?: Array<{
            game_id: number;
            points: number;
            date: string;
        }>;
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
                                return `${value.toFixed(2)} ${intl.formatMessage({ id: 'profile.stats.points', defaultMessage: 'puntos' })}`;
                            }
                        }
                        return `${value} ${intl.formatMessage({ id: 'profile.stats.points', defaultMessage: 'puntos' })}`;
                    }
                }
            }
        },
    };

    // Datos para el gráfico de métricas de rendimiento
    const performanceChartData = {
        labels: [
            intl.formatMessage({ id: 'profile.stats.accuracy', defaultMessage: 'Precisión' }),
            intl.formatMessage({ id: 'profile.stats.avgTime', defaultMessage: 'Tiempo Promedio' }),
        ],
        datasets: [
            {
                label: intl.formatMessage({ id: 'profile.stats.performance', defaultMessage: 'Rendimiento' }),
                data: [
                    stats.accuracy,
                    stats.avg_response_time,
                ],
                backgroundColor: [
                    'rgba(76, 175, 80, 0.7)',  // Verde
                    'rgba(255, 152, 0, 0.7)',  // Naranja
                ],
                borderColor: [
                    'rgba(76, 175, 80, 1)',
                    'rgba(255, 152, 0, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Datos para el gráfico de puntos por juego
    const pointsPerGameData = {
        labels: stats.recent_games?.map(game => 
            intl.formatDate(new Date(game.date), {
                day: 'numeric',
                month: 'short'
            })
        ) || [],
        datasets: [
            {
                label: intl.formatMessage({ id: 'profile.stats.points', defaultMessage: 'puntos' }),
                data: stats.recent_games?.map(game => game.points) || [],
                backgroundColor: 'rgba(183, 28, 28, 0.7)',  // Rojo
                borderColor: 'rgba(183, 28, 28, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Datos para el gráfico de distribución de puntos
    const pointsDistributionData = {
        labels: [
            intl.formatMessage({ id: 'profile.stats.pointsEarned', defaultMessage: 'Puntos Ganados' }),
            intl.formatMessage({ id: 'profile.stats.remainingPoints', defaultMessage: 'Puntos Restantes' }),
            intl.formatMessage({ id: 'profile.stats.potentialPoints', defaultMessage: 'Puntos Potenciales' }),
        ],
        datasets: [{
            data: [
                stats.total_points,
                stats.total_games * 100 - stats.total_points, // Puntos restantes
                stats.total_games * 100 // Puntos potenciales totales
            ],
            backgroundColor: [
                'rgba(183, 28, 28, 0.7)',  // Rojo para puntos ganados
                'rgba(224, 224, 224, 0.7)', // Gris para puntos restantes
                'rgba(33, 150, 243, 0.3)',  // Azul claro para puntos potenciales
            ],
            borderColor: [
                'rgba(183, 28, 28, 1)',
                'rgba(224, 224, 224, 1)',
                'rgba(33, 150, 243, 0.5)',
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
                            id: 'profile.stats.performanceMetrics', 
                            defaultMessage: 'Métricas de Rendimiento' 
                        })}
                    </h3>
                    <div className="chart-wrapper">
                        <Bar 
                            data={performanceChartData} 
                            options={{
                                ...commonOptions,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: intl.formatMessage({ 
                                                id: 'profile.stats.values', 
                                                defaultMessage: 'Valores' 
                                            }),
                                            color: '#333'
                                        },
                                        ticks: {
                                            color: '#333',
                                            callback: function(value: any) {
                                                return value + (value === 100 ? '%' : 's');
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
                            id: 'profile.stats.recentGames', 
                            defaultMessage: 'Últimas Partidas' 
                        })}
                    </h3>
                    <div className="chart-wrapper">
                        <Bar 
                            data={pointsPerGameData} 
                            options={{
                                ...commonOptions,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        max: 100,
                                        title: {
                                            display: true,
                                            text: intl.formatMessage({ 
                                                id: 'profile.stats.points', 
                                                defaultMessage: 'puntos' 
                                            }),
                                            color: '#333'
                                        },
                                        ticks: {
                                            color: '#333',
                                            stepSize: 20
                                        }
                                    },
                                    x: {
                                        ticks: {
                                            color: '#333',
                                            maxRotation: 45,
                                            minRotation: 45
                                        }
                                    }
                                },
                                plugins: {
                                    ...commonOptions.plugins,
                                    tooltip: {
                                        ...commonOptions.plugins.tooltip,
                                        callbacks: {
                                            label: function(context: any) {
                                                const value = context.raw;
                                                return `${intl.formatMessage({ 
                                                    id: 'profile.stats.points', 
                                                    defaultMessage: 'puntos' 
                                                })}: ${value}`;
                                            }
                                        }
                                    }
                                }
                            }} 
                        />
                    </div>
                </div>
            </div>
            <div className="chart-row">
                <div className="chart-container full-width">
                    <h3>
                        {intl.formatMessage({ 
                            id: 'profile.stats.pointsDistribution', 
                            defaultMessage: 'Distribución de Puntos' 
                        })}
                    </h3>
                    <div className="chart-wrapper">
                        <Doughnut 
                            data={pointsDistributionData} 
                            options={{
                                ...commonOptions,
                                cutout: '60%',
                                plugins: {
                                    ...commonOptions.plugins,
                                    tooltip: {
                                        ...commonOptions.plugins.tooltip,
                                        callbacks: {
                                            label: function(context: any) {
                                                const value = context.raw;
                                                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                                const percentage = Math.round((value / total) * 100);
                                                return `${context.label}: ${value} (${percentage}%)`;
                                            }
                                        }
                                    }
                                }
                            }} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsCharts; 