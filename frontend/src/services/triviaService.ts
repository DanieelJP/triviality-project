import axios from '../config/axios';
import { Question, Difficulty } from '../types/trivia';

export const triviaService = {
    async getQuestions(amount: number = 10, difficulty: Difficulty = 'medium'): Promise<Question[]> {
        const response = await axios.get('/api/trivia/questions', {
            params: { amount, difficulty }
        });
        return response.data.results;
    }
}; 