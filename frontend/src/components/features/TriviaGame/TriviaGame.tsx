import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question, Difficulty } from '../../../types/trivia';
import { triviaService } from '../../../services/triviaService';
import { Logo } from '../../common/Logo';
import '../../../styles/components/TriviaGame.css';

const TriviaGame: React.FC = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [showScore, setShowScore] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
    const [scoreUpdated, setScoreUpdated] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const results = await triviaService.getQuestions(10, selectedDifficulty);
            setQuestions(results);
            setError('');
            setGameStarted(true);
        } catch (err) {
            setError('Error al cargar las preguntas');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = async (answer: string) => {
        setSelectedAnswer(answer);
        const isCorrect = answer === questions[currentQuestion].correct_answer;
        setIsAnswerCorrect(isCorrect);

        if (isCorrect) {
            setScore(score + 1);
            setScoreUpdated(true);
            setTimeout(() => setScoreUpdated(false), 500);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        setSelectedAnswer(null);
        setIsAnswerCorrect(null);

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            setShowScore(true);
        }
    };

    const restartGame = () => {
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
        setGameStarted(false);
        setQuestions([]);
    };

    if (loading) return (
        <>
            <div className="loading-text">Cargando preguntas...</div>
            <Logo />
        </>
    );

    if (error) return (
        <>
            <div className="error-container">
                <p className="error-text">{error}</p>
                <button className="retry-button" onClick={fetchQuestions}>
                    Reintentar
                </button>
            </div>
            <Logo />
        </>
    );

    if (!gameStarted) {
        return (
            <>
                <div className="trivia-container">
                    <div className="trivia-card">
                        <h2 className="trivia-title">¡Bienvenido a Triviality!</h2>
                        <div className="difficulty-section">
                            <label className="difficulty-label">
                                Selecciona la dificultad:
                            </label>
                            <div className="difficulty-buttons">
                                {(['easy', 'medium', 'hard'] as Difficulty[]).map((difficulty) => (
                                    <button
                                        key={difficulty}
                                        onClick={() => setSelectedDifficulty(difficulty)}
                                        className={`difficulty-button ${selectedDifficulty === difficulty ? 'selected' : ''}`}
                                    >
                                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="text-center">
                            <button className="start-button" onClick={fetchQuestions}>
                                Play
                            </button>
                        </div>
                    </div>
                </div>
                <Logo />
            </>
        );
    }
    
    if (questions.length === 0) return null;
    
    if (showScore) {
        return (
            <>
                <div className="trivia-container">
                    <div className="trivia-card score-screen">
                        <h2 className="score-title">¡Juego terminado!</h2>
                        <p className="score-text">Tu puntuación: {score} de {questions.length}</p>
                        <button className="play-again-button" onClick={restartGame}>
                            Jugar de nuevo
                        </button>
                    </div>
                </div>
                <Logo />
            </>
        );
    }

    const currentQ = questions[currentQuestion];
    const allAnswers = [...currentQ.incorrect_answers, currentQ.correct_answer]
        .sort(() => Math.random() - 0.5);

    return (
        <>
            <div className="trivia-container">
                <div className="trivia-card">
                    <div className="game-header">
                        <span className="question-counter">
                            Pregunta {currentQuestion + 1} de {questions.length}
                        </span>
                        <span className={`score-counter ${scoreUpdated ? 'score-updated' : ''}`}>
                            Puntuación: {score}
                        </span>
                    </div>
                    <div className="tags-container">
                        <span className="category-tag">
                            {currentQ.category}
                        </span>
                        <span className="difficulty-tag">
                            {currentQ.difficulty.toUpperCase()}
                        </span>
                    </div>
                    <h2 className="question-text" dangerouslySetInnerHTML={{ __html: currentQ.question }}></h2>
                    <div className="answers-container">
                        {allAnswers.map((answer, index) => {
                            let buttonClass = 'answer-button';
                            if (selectedAnswer) {
                                if (answer === currentQ.correct_answer) {
                                    buttonClass += ' correct';
                                } else if (answer === selectedAnswer && answer !== currentQ.correct_answer) {
                                    buttonClass += ' incorrect';
                                }
                            }
                            return (
                                <button
                                    key={index}
                                    onClick={() => !selectedAnswer && handleAnswer(answer)}
                                    className={buttonClass}
                                    dangerouslySetInnerHTML={{ __html: answer }}
                                    disabled={!!selectedAnswer}
                                ></button>
                            );
                        })}
                    </div>
                </div>
            </div>
            <Logo inGame={true} />
        </>
    );
};

export default TriviaGame; 