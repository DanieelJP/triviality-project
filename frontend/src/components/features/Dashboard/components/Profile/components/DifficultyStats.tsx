import React from 'react';
import { useIntl } from 'react-intl';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface DifficultyStat {
    question_difficulty: string;
    total_questions: number;
    correct_answers: number;
    accuracy_percentage: number;
}

interface DifficultyStatsProps {
    stats: DifficultyStat[];
}

const DifficultyStats: React.FC<DifficultyStatsProps> = ({ stats }) => {
    const intl = useIntl();

    return (
        <div className="difficulty-stats">
            <h3>{intl.formatMessage({ id: 'profile.stats.difficultyPerformance', defaultMessage: 'Rendimiento por Dificultad' })}</h3>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={stats}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 60
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="question_difficulty"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval={0}
                            label={{
                                value: intl.formatMessage({ id: 'profile.stats.difficulties', defaultMessage: 'Dificultades' }),
                                position: 'insideBottom',
                                offset: -10
                            }}
                        />
                        <YAxis
                            label={{
                                value: intl.formatMessage({ id: 'profile.stats.values', defaultMessage: 'Valores' }),
                                angle: -90,
                                position: 'insideLeft'
                            }}
                        />
                        <Tooltip
                            formatter={(value: number, name: string) => {
                                switch (name) {
                                    case 'total_questions':
                                        return [value, intl.formatMessage({ id: 'profile.stats.totalQuestions', defaultMessage: 'Total de Preguntas' })];
                                    case 'correct_answers':
                                        return [value, intl.formatMessage({ id: 'profile.stats.correctAnswers', defaultMessage: 'Respuestas Correctas' })];
                                    case 'accuracy_percentage':
                                        return [`${value}%`, intl.formatMessage({ id: 'profile.stats.accuracy', defaultMessage: 'Precisión' })];
                                    default:
                                        return [value, name];
                                }
                            }}
                        />
                        <Legend
                            formatter={(value: string) => {
                                switch (value) {
                                    case 'total_questions':
                                        return intl.formatMessage({ id: 'profile.stats.totalQuestions', defaultMessage: 'Total de Preguntas' });
                                    case 'correct_answers':
                                        return intl.formatMessage({ id: 'profile.stats.correctAnswers', defaultMessage: 'Respuestas Correctas' });
                                    case 'accuracy_percentage':
                                        return intl.formatMessage({ id: 'profile.stats.accuracy', defaultMessage: 'Precisión' });
                                    default:
                                        return value;
                                }
                            }}
                        />
                        <Bar dataKey="total_questions" fill="#8884d8" />
                        <Bar dataKey="correct_answers" fill="#82ca9d" />
                        <Bar dataKey="accuracy_percentage" fill="#ffc658" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DifficultyStats; 