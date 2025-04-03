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

# Función para verificar si un comando existe
function command_exists {
    command -v "$1" >/dev/null 2>&1
}

echo_color $BLUE "========================================================"
echo_color $BLUE "    Configuración del Traductor Local para Triviality    "
echo_color $BLUE "========================================================"
echo

# Verificar si Docker está instalado
if ! command_exists docker; then
    echo_color $YELLOW "Docker no está instalado. Instalando Docker..."
    
    # Actualizar repositorios
    sudo apt-get update
    
    # Instalar paquetes necesarios
    sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common

    # Añadir clave GPG oficial de Docker
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

    # Configurar el repositorio estable de Docker
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Actualizar los repositorios de APT con los repositorios de Docker
    sudo apt-get update

    # Instalar Docker
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io

    # Añadir el usuario actual al grupo docker
    sudo usermod -aG docker $USER
    
    echo_color $GREEN "Docker instalado correctamente!"
    echo_color $YELLOW "IMPORTANTE: Es posible que necesites cerrar sesión y volver a iniciar sesión para que los cambios surtan efecto."
else
    echo_color $GREEN "Docker ya está instalado. Continuando..."
fi

echo

# Verificar si el contenedor de LibreTranslate ya existe
if [ "$(sudo docker ps -a -q -f name=libretranslate)" ]; then
    echo_color $YELLOW "El contenedor LibreTranslate ya existe."
    
    # Verificar si el contenedor está en ejecución
    if [ "$(sudo docker ps -q -f name=libretranslate)" ]; then
        echo_color $GREEN "El contenedor LibreTranslate ya está en ejecución."
    else
        echo_color $YELLOW "El contenedor LibreTranslate existe pero no está en ejecución. Iniciándolo..."
        sudo docker start libretranslate
        echo_color $GREEN "Contenedor LibreTranslate iniciado correctamente!"
    fi
else
    echo_color $YELLOW "Creando contenedor LibreTranslate..."
    sudo docker run -d --name libretranslate -p 5000:5000 --restart always libretranslate/libretranslate
    echo_color $GREEN "Contenedor LibreTranslate creado e iniciado correctamente!"
fi

# Verificar si el contenedor está configurado para reiniciarse automáticamente
RESTART_POLICY=$(sudo docker inspect --format "{{ .HostConfig.RestartPolicy.Name }}" libretranslate 2>/dev/null)
if [ "$RESTART_POLICY" != "always" ]; then
    echo_color $YELLOW "Configurando el contenedor para reiniciarse automáticamente..."
    sudo docker update --restart=always libretranslate
    echo_color $GREEN "Configuración de reinicio automático aplicada correctamente!"
fi

echo
echo_color $BLUE "Probando el servicio de traducción..."

# Esperar a que el servicio esté listo
echo_color $YELLOW "Esperando a que el servicio esté listo (puede tardar unos segundos)..."
sleep 10

# Probar el servicio de traducción
TEST_RESULT=$(curl -s -X POST "http://localhost:5000/translate" \
    -H "Content-Type: application/json" \
    -d '{"q":"Hello World","source":"en","target":"es"}')

if [[ $TEST_RESULT == *"Hola Mundo"* ]]; then
    echo_color $GREEN "¡Prueba exitosa! El servicio de traducción está funcionando correctamente."
else
    echo_color $YELLOW "El servicio de traducción aún no está listo. Esto es normal si es la primera vez que ejecutas el contenedor."
    echo_color $YELLOW "LibreTranslate está descargando los modelos de idioma necesarios, lo que puede tardar varios minutos."
    echo_color $YELLOW "Puedes verificar el estado con: sudo docker logs libretranslate"
fi

echo
echo_color $BLUE "========================================================"
echo_color $GREEN "Configuración completada."
echo_color $GREEN "El servicio de traducción estará disponible en: http://localhost:5000"
echo_color $BLUE "========================================================" 