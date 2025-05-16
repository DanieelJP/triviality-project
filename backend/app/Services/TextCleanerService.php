<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class TextCleanerService
{
    /**
     * Convierte entidades HTML a su representación correcta
     *
     * @param string $text
     * @return string
     */
    public function decodeHtmlEntities(string $text): string
    {
        return html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }

    /**
     * Verifica si un texto es un nombre propio que no debe traducirse
     *
     * @param string $text
     * @return bool
     */
    public function isProperName(string $text): bool
    {
        
        // Detectar palabras en camelCase (posiblemente nombres de productos o marcas)
        if (preg_match('/^[a-z]+[A-Z][a-zA-Z]*$/', $text)) {
            return true;
        }
        
        // Detectar palabras con primera letra mayúscula y sin espacios (posiblemente nombres propios)
        if (preg_match('/^[A-Z][a-z]+$/', $text) && !preg_match('/[\s\p{P}]/', $text)) {
            return true;
        }
        
        // Detectar abreviaturas (todas mayúsculas)
        if (preg_match('/^[A-Z]{2,}$/', $text)) {
            return true;
        }
        
        // Detectar palabras con números y letras mezclados (posiblemente modelos o códigos)
        if (preg_match('/^[A-Za-z0-9]+$/', $text) && preg_match('/[0-9]/', $text) && preg_match('/[A-Za-z]/', $text)) {
            return true;
        }

        return false;
    }

    /**
     * Limpia un texto traducido eliminando comentarios, sufijos y otros elementos no deseados
     *
     * @param string $text
     * @return string
     */
    public function cleanTranslatedText(string $text): string
    {
        if (empty($text)) {
            return '';
        }

        // Eliminar etiquetas HTML
        $text = strip_tags(trim($text));

        return $text;
    }
} 