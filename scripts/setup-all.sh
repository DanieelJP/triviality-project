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

# Función para ejecutar comandos y verificar su resultado
function run_command {
    local cmd="$1"
    local error_msg="$2"
    
    echo_color $YELLOW "Ejecutando: $cmd"
    eval $cmd
    
    if [ $? -ne 0 ]; then
        echo_color $RED "ERROR: $error_msg"
        return 1
    else
        return 0
    fi
}

echo_color $BLUE "========================================================"
echo_color $BLUE "      Configuración Completa de Triviality Project      "
echo_color $BLUE "========================================================"
echo

# Verificar que estamos en el directorio correcto
if [ ! -f "composer.json" ] && [ ! -d "frontend" ]; then
    if [ -d "/var/www/html/triviality-project" ]; then
        echo_color $YELLOW "Cambiando al directorio del proyecto..."
        cd /var/www/html/triviality-project
    else
        echo_color $RED "Error: No se puede encontrar el directorio del proyecto."
        echo_color $RED "Asegúrate de ejecutar este script desde el directorio raíz del proyecto."
        exit 1
    fi
fi

# 1. Configurar Backend
echo_color $BLUE "Paso 1: Configurando Backend (Laravel)"
echo_color $BLUE "-------------------------------------------------------"

if [ -d "backend" ]; then
    cd backend
    
    echo_color $YELLOW "Instalando dependencias de Composer..."
    run_command "composer install" "No se pudieron instalar las dependencias de Composer."
    
    echo_color $YELLOW "Copiando archivo .env si no existe..."
    if [ ! -f ".env" ]; then
        run_command "cp .env.example .env" "No se pudo copiar el archivo .env.example"
        run_command "php artisan key:generate" "No se pudo generar la clave de la aplicación."
    fi
    
    echo_color $YELLOW "Verificando conexión a la base de datos..."
    DB_CONNECTION=$(grep DB_CONNECTION .env | cut -d '=' -f2)
    DB_HOST=$(grep DB_HOST .env | cut -d '=' -f2)
    DB_PORT=$(grep DB_PORT .env | cut -d '=' -f2)
    DB_DATABASE=$(grep DB_DATABASE .env | cut -d '=' -f2)
    DB_USERNAME=$(grep DB_USERNAME .env | cut -d '=' -f2)
    DB_PASSWORD=$(grep DB_PASSWORD .env | cut -d '=' -f2)
    
    echo_color $YELLOW "Configuración de base de datos actual:"
    echo "DB_CONNECTION=$DB_CONNECTION"
    echo "DB_HOST=$DB_HOST"
    echo "DB_PORT=$DB_PORT"
    echo "DB_DATABASE=$DB_DATABASE"
    echo "DB_USERNAME=$DB_USERNAME"
    echo "DB_PASSWORD=******"
    
    read -p "¿Deseas continuar con esta configuración de base de datos? (s/n): " CONFIRM_DB
    if [[ $CONFIRM_DB != "s" && $CONFIRM_DB != "S" ]]; then
        echo_color $YELLOW "Por favor, edita el archivo .env manualmente y vuelve a ejecutar este script."
        exit 1
    fi
    
    echo_color $YELLOW "Ejecutando migraciones de la base de datos..."
    run_command "php artisan migrate" "No se pudieron ejecutar las migraciones."
    
    cd ..
    echo_color $GREEN "Configuración del backend completada correctamente."
else
    echo_color $RED "ERROR: Directorio 'backend' no encontrado."
    exit 1
fi

echo

# 2. Configurar Frontend
echo_color $BLUE "Paso 2: Configurando Frontend (React)"
echo_color $BLUE "-------------------------------------------------------"

if [ -d "frontend" ]; then
    cd frontend
    
    echo_color $YELLOW "Instalando dependencias de Node.js..."
    run_command "npm install" "No se pudieron instalar las dependencias de Node.js."
    
    cd ..
    echo_color $GREEN "Configuración del frontend completada correctamente."
else
    echo_color $RED "ERROR: Directorio 'frontend' no encontrado."
    exit 1
fi

echo

# 3. Configurar Traductor Local
echo_color $BLUE "Paso 3: Configurando Traductor Local (LibreTranslate)"
echo_color $BLUE "-------------------------------------------------------"

echo_color $YELLOW "Ejecutando script de configuración del traductor..."
chmod +x scripts/setup-translator.sh
./scripts/setup-translator.sh

echo

# 4. Verificar servicios
echo_color $BLUE "Paso 4: Verificando servicios"
echo_color $BLUE "-------------------------------------------------------"

echo_color $YELLOW "¿Deseas iniciar los servicios ahora? (s/n): "
read START_SERVICES

if [[ $START_SERVICES == "s" || $START_SERVICES == "S" ]]; then
    echo_color $YELLOW "Iniciando servidor Laravel (en segundo plano)..."
    cd backend
    php artisan serve > /dev/null 2>&1 &
    LARAVEL_PID=$!
    cd ..
    
    echo_color $YELLOW "Iniciando servidor React (en segundo plano)..."
    cd frontend
    npm start > /dev/null 2>&1 &
    REACT_PID=$!
    cd ..
    
    echo_color $YELLOW "Esperando a que los servicios estén listos..."
    sleep 10
    
    echo_color $YELLOW "Ejecutando verificación de servicios..."
    chmod +x scripts/check-services.sh
    ./scripts/check-services.sh
    
    echo
    echo_color $YELLOW "Servicios iniciados:"
    echo "- Laravel (PID: $LARAVEL_PID)"
    echo "- React (PID: $REACT_PID)"
    echo "- LibreTranslate (Docker)"
    
    echo
    echo_color $GREEN "¡Configuración completada! La aplicación debería estar disponible en:"
    echo "- Frontend: http://localhost:3000"
    echo "- Backend API: http://localhost:8000/api"
    echo "- Traductor: http://localhost:5000"
else
    echo_color $YELLOW "Para iniciar los servicios manualmente:"
    echo "- Backend: cd backend && php artisan serve"
    echo "- Frontend: cd frontend && npm start"
    echo "- Verificar servicios: ./scripts/check-services.sh"
fi

echo
echo_color $BLUE "========================================================"
echo_color $GREEN "¡Configuración completada con éxito!"
echo_color $BLUE "========================================================" 