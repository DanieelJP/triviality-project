import axios from '../config/axios';
import { Question, Difficulty, SupportedLanguage } from '../types/trivia';

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
    }
}; 