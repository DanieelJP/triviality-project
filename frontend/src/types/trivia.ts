export interface Question {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

export type Difficulty = 'easy' | 'medium' | 'hard';

// Idiomas soportados para la traducción
export type SupportedLanguage = 
    | 'sq' // Albanés
    | 'de' // Alemán
    | 'ar' // Árabe
    | 'az' // Azerbaijani
    | 'eu' // Basque
    | 'bn' // Bengalí
    | 'bg' // Búlgaro
    | 'cs' // Checo
    | 'zh' // Chino
    | 'zt' // Chino (tradicional)
    | 'ko' // Coreano
    | 'da' // Danés
    | 'sk' // Eslovaco
    | 'sl' // Esloveno
    | 'es' // Español
    | 'eo' // Esperanto
    | 'et' // Estonio
    | 'fi' // Finlandés
    | 'fr' // Francés
    | 'gl' // Galician
    | 'el' // Griego
    | 'he' // Hebreo
    | 'hi' // Hindi
    | 'nl' // Holandés
    | 'hu' // Húngaro
    | 'id' // Indonesio
    | 'en' // Inglés
    | 'ga' // Irlandés
    | 'it' // Italiano
    | 'ja' // Japonés
    | 'lv' // Letón
    | 'lt' // Lituano
    | 'ms' // Malayo
    | 'nb' // Noruego
    | 'fa' // Persa
    | 'pl' // Polaco
    | 'pt' // Portugués
    | 'pt-BR' // Portuguese (Brazil)
    | 'ro' // Rumano
    | 'ru' // Ruso
    | 'sr' // Serbio
    | 'sv' // Suecia
    | 'tl' // Tagalo
    | 'th' // Tailandés
    | 'tr' // Turco
    | 'uk' // Ucraniano
    | 'ur' // Urdu
    | 'vi'; // Vietnamita 