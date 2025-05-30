import axios from '../config/axios';
import { Question, Difficulty, SupportedLanguage } from '../types/trivia';

interface GameAnswer {
    question: string;
    given_answer: string;
    correct_answer: string;
    is_correct: boolean;
    response_time: number;
    points_earned: number;
}

interface GameResults {
    game_id: number;
    total_points: number;
    experience_gained: number;
    bonuses: {
        streak: number;
        quick: number;
        difficulty: number;
    };
    new_level: number;
    experience_points: number;
    next_level_xp: number;
    progress: number;
}

interface SaveGameRequest {
    difficulty: Difficulty;
    category: string;
    answers: GameAnswer[];
}

export const triviaService = {
    async getQuestions(
        amount: number = 10, 
        difficulty: Difficulty = 'medium', 
        language: SupportedLanguage = 'es'
    ): Promise<Question[]> {
        const response = await axios.get('/api/trivia/questions', {
            params: { amount, difficulty, language }
        });
        return response.data.results;
    },

    async saveGameResults(data: SaveGameRequest): Promise<GameResults> {
        const response = await axios.post('/api/trivia/save-results', data);
        return response.data;
    }
}; 