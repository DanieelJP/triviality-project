<?php

namespace App\Interfaces;

interface TranslationInterface
{
    /**
     * Establece el idioma de destino para la traducción
     *
     * @param string $lang
     * @return void
     */
    public function setTargetLang(string $lang): void;

    /**
     * Traduce un texto al idioma configurado
     *
     * @param string $text
     * @return string
     */
    public function translate(string $text): string;

    /**
     * Traduce un array de textos al idioma configurado
     *
     * @param array $items
     * @return array
     */
    public function translateArray(array $items): array;

    /**
     * Traduce una pregunta completa (con sus opciones)
     *
     * @param array $question
     * @return array
     */
    public function translateQuestion(array $question): array;

    /**
     * Traduce múltiples preguntas de manera optimizada
     *
     * @param array $questions
     * @return array
     */
    public function translateQuestionsOptimized(array $questions): array;

    /**
     * Limpia un texto de posibles problemas
     *
     * @param string $text
     * @return string
     */
    public function cleanText(string $text): string;
} 