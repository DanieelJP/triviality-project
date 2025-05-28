import React from 'react';
import { useIntl } from 'react-intl';
import './CategoryStats.css';

interface CategoryStatsProps {
    stats: Array<{
        category: string;
        total_questions: number;
        correct_answers: number;
        accuracy_percentage: number;
    }>;
}

const CategoryStats: React.FC<CategoryStatsProps> = ({ stats }) => {
    const intl = useIntl();

    return (
        <div className="category-stats">
            <h3>
                {intl.formatMessage({ 
                    id: 'profile.stats.categoryTitle', 
                    defaultMessage: 'Rendimiento por Categoría' 
                })}
            </h3>
            <div className="category-grid">
                {stats.map((category, index) => (
                    <div key={index} className="category-card">
                        <div className="category-header">
                            <h4>{category.category}</h4>
                            <span className="accuracy">
                                {category.accuracy_percentage.toFixed(1)}%
                            </span>
                        </div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill"
                                style={{ width: `${category.accuracy_percentage}%` }}
                            />
                        </div>
                        <div className="category-details">
                            <span>
                                {intl.formatMessage(
                                    { 
                                        id: 'profile.stats.correctOf', 
                                        defaultMessage: '{correct} de {total} correctas'
                                    },
                                    {
                                        correct: category.correct_answers,
                                        total: category.total_questions
                                    }
                                )}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryStats; 