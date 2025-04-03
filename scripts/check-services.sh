#!/bin/bash

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
function echo_color {
    echo -e "${1}${2}${NC}"
}

# Función para verificar si un servicio está activo
function check_service {
    local name=$1
    local command=$2
    local expected_output=$3
    
    echo -n "Verificando $name... "
    local result=$(eval $command 2>/dev/null)
    
    if [[ "$result" == *"$expected_output"* ]]; then
        echo_color $GREEN "✓ OK"
        return 0
    else
        echo_color $RED "✗ ERROR"
        return 1
    fi
}

echo_color $BLUE "========================================================"
echo_color $BLUE "      Verificación de Servicios para Triviality         "
echo_color $BLUE "========================================================"
echo

# 1. Verificar Docker
check_service "Docker" "docker --version" "Docker version"
DOCKER_STATUS=$?

if [ $DOCKER_STATUS -ne 0 ]; then
    echo_color $YELLOW "Docker no está instalado o no está funcionando correctamente."
    echo_color $YELLOW "Ejecuta el script de instalación del traductor para instalar Docker:"
    echo_color $YELLOW "  ./scripts/setup-translator.sh"
    echo
fi

# 2. Verificar contenedor LibreTranslate
check_service "contenedor LibreTranslate" "sudo docker ps | grep libretranslate" "libretranslate"
LIBRETRANSLATE_STATUS=$?

if [ $LIBRETRANSLATE_STATUS -ne 0 ]; then
    echo_color $YELLOW "El contenedor LibreTranslate no está en ejecución."
    echo_color $YELLOW "Verifica su estado con: docker ps -a | grep libretranslate"
    echo_color $YELLOW "Inicia el contenedor con: docker start libretranslate"
    echo_color $YELLOW "O ejecuta el script de instalación: ./scripts/setup-translator.sh"
    echo
fi

# 3. Verificar API de LibreTranslate
check_service "API de LibreTranslate" "curl -s http://localhost:5000/languages | grep -o '\"code\":\"es\"'" '"code":"es"'
LIBRETRANSLATE_API_STATUS=$?

if [ $LIBRETRANSLATE_API_STATUS -ne 0 ]; then
    echo_color $YELLOW "La API de LibreTranslate no está respondiendo correctamente."
    echo_color $YELLOW "Revisa los logs del contenedor: sudo docker logs libretranslate"
    echo_color $YELLOW "El contenedor podría estar descargando modelos de lenguaje."
    echo
fi

# 4. Verificar proceso Laravel
check_service "servidor Laravel" "ps aux | grep '[a]rtisan serve'" "artisan serve"
LARAVEL_STATUS=$?

if [ $LARAVEL_STATUS -ne 0 ]; then
    echo_color $YELLOW "El servidor Laravel no está en ejecución."
    echo_color $YELLOW "Inicia el servidor con: cd backend && php artisan serve"
    echo
fi

# 5. Verificar API Laravel
check_service "API Laravel" "curl -s http://localhost:8000/api/trivia/questions?amount=1 | grep -o 'response_code'" "response_code"
LARAVEL_API_STATUS=$?

if [ $LARAVEL_API_STATUS -ne 0 ]; then
    echo_color $YELLOW "La API de Laravel no está respondiendo correctamente."
    echo_color $YELLOW "Verifica los logs: tail -f backend/storage/logs/laravel.log"
    echo
fi

# 6. Verificar proceso React
check_service "servidor React" "ps aux | grep '[r]eact-scripts start'" "react-scripts start"
REACT_STATUS=$?

if [ $REACT_STATUS -ne 0 ]; then
    echo_color $YELLOW "El servidor React no está en ejecución."
    echo_color $YELLOW "Inicia el servidor con: cd frontend && npm start"
    echo
fi

echo
echo_color $BLUE "========================================================"

# Calcular estado general
TOTAL_CHECKS=6
PASSED_CHECKS=0
[ $DOCKER_STATUS -eq 0 ] && ((PASSED_CHECKS++))
[ $LIBRETRANSLATE_STATUS -eq 0 ] && ((PASSED_CHECKS++))
[ $LIBRETRANSLATE_API_STATUS -eq 0 ] && ((PASSED_CHECKS++))
[ $LARAVEL_STATUS -eq 0 ] && ((PASSED_CHECKS++))
[ $LARAVEL_API_STATUS -eq 0 ] && ((PASSED_CHECKS++))
[ $REACT_STATUS -eq 0 ] && ((PASSED_CHECKS++))

echo -n "Estado general: "
if [ $PASSED_CHECKS -eq $TOTAL_CHECKS ]; then
    echo_color $GREEN "✓ Todos los servicios están funcionando correctamente ($PASSED_CHECKS/$TOTAL_CHECKS)"
elif [ $PASSED_CHECKS -ge $(($TOTAL_CHECKS / 2)) ]; then
    echo_color $YELLOW "⚠ Algunos servicios no están funcionando ($PASSED_CHECKS/$TOTAL_CHECKS)"
else
    echo_color $RED "✗ La mayoría de los servicios no están funcionando ($PASSED_CHECKS/$TOTAL_CHECKS)"
fi

echo_color $BLUE "========================================================"

echo
echo "Para más información sobre cómo solucionar problemas, consulta README.md"
echo 
