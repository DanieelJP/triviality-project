#!/bin/bash

# Colores para mensajes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Iniciando configuración del proyecto Triviality...${NC}"

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker no está instalado. Instalando...${NC}"
    sudo apt-get update
    sudo apt-get install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER
    echo -e "${GREEN}Docker instalado correctamente${NC}"
    echo -e "${YELLOW}Por favor, cierra sesión y vuelve a iniciar sesión para que los cambios surtan efecto${NC}"
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}Docker Compose no está instalado. Instalando...${NC}"
    sudo apt-get update
    sudo apt-get install -y docker-compose
    echo -e "${GREEN}Docker Compose instalado correctamente${NC}"
fi

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js no está instalado. Instalando...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo -e "${GREEN}Node.js instalado correctamente${NC}"
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}npm no está instalado. Instalando...${NC}"
    sudo apt-get install -y npm
    echo -e "${GREEN}npm instalado correctamente${NC}"
fi

# Verificar si Composer está instalado
if ! command -v composer &> /dev/null; then
    echo -e "${YELLOW}Composer no está instalado. Instalando...${NC}"
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
    sudo php composer-setup.php --install-dir=/usr/local/bin --filename=composer
    php -r "unlink('composer-setup.php');"
    echo -e "${GREEN}Composer instalado correctamente${NC}"
fi

# Verificar si MySQL está instalado
if ! command -v mysql &> /dev/null; then
    echo -e "${YELLOW}MySQL no está instalado. Instalando...${NC}"
    sudo apt-get update
    sudo apt-get install -y mysql-server
    sudo systemctl start mysql
    sudo systemctl enable mysql
    echo -e "${GREEN}MySQL instalado correctamente${NC}"
    
    # Configurar contraseña de root
    echo -e "${YELLOW}Configurando contraseña de root de MySQL...${NC}"
    read -sp "Ingresa la contraseña de root para MySQL: " MYSQL_ROOT_PASSWORD
    echo ""
    sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$MYSQL_ROOT_PASSWORD';"
    sudo mysql -e "FLUSH PRIVILEGES;"
    echo -e "${GREEN}Contraseña de root configurada correctamente${NC}"
fi

echo -e "${GREEN}Verificando requisitos previos...${NC}"

# Verificar si el archivo .env.example existe
if [ ! -f .env.example ]; then
    echo -e "${RED}El archivo .env.example no existe. Creando archivo .env.example...${NC}"
    cat > .env.example << EOL
APP_NAME=Triviality
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=triviality
DB_USERNAME=laraveluser
DB_PASSWORD=Bifidus42

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_APP_NAME="${APP_NAME}"
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"

LIBRETRANSLATE_API_URL=http://localhost:5000
LIBRETRANSLATE_API_KEY=
EOL
    echo -e "${GREEN}Archivo .env.example creado correctamente${NC}"
fi

echo -e "${GREEN}Configurando el entorno...${NC}"

# Copiar .env.example a .env si no existe
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}Archivo .env creado desde .env.example${NC}"
fi

# Instalar dependencias del backend
echo -e "${GREEN}Instalando dependencias del backend...${NC}"
cd backend
composer install
cd ..

# Instalar dependencias del frontend
echo -e "${GREEN}Instalando dependencias del frontend...${NC}"
cd frontend
npm install
cd ..

# Configurar la base de datos
echo -e "${GREEN}Configurando la base de datos...${NC}"

# Configurar credenciales por defecto
DB_HOST="127.0.0.1"
DB_PORT="3306"
DB_DATABASE="triviality"
DB_USERNAME="laraveluser"
DB_PASSWORD="Bifidus42"

# Actualizar el archivo .env con las credenciales por defecto
sed -i "s/^DB_HOST=.*/DB_HOST=$DB_HOST/" .env
sed -i "s/^DB_PORT=.*/DB_PORT=$DB_PORT/" .env
sed -i "s/^DB_DATABASE=.*/DB_DATABASE=$DB_DATABASE/" .env
sed -i "s/^DB_USERNAME=.*/DB_USERNAME=$DB_USERNAME/" .env
sed -i "s/^DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env

# Solicitar contraseña de root de MySQL
echo -e "${YELLOW}Se necesita la contraseña de root de MySQL para configurar la base de datos...${NC}"
read -sp "Contraseña de root de MySQL: " MYSQL_ROOT_PASSWORD
echo ""

# Crear usuario y base de datos
echo -e "${GREEN}Creando usuario y base de datos...${NC}"
mysql -h $DB_HOST -P $DB_PORT -u root -p"$MYSQL_ROOT_PASSWORD" << EOF
CREATE DATABASE IF NOT EXISTS $DB_DATABASE;
CREATE USER IF NOT EXISTS '$DB_USERNAME'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_DATABASE.* TO '$DB_USERNAME'@'localhost';
FLUSH PRIVILEGES;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Usuario y base de datos creados correctamente${NC}"
else
    echo -e "${RED}Error al crear usuario o base de datos${NC}"
    exit 1
fi

# Importar el archivo SQL
echo -e "${GREEN}Importando el archivo SQL...${NC}"
mysql -h $DB_HOST -P $DB_PORT -u $DB_USERNAME -p$DB_PASSWORD $DB_DATABASE < scripts/sql/triviality_db.sql

# Generar clave de aplicación
echo -e "${GREEN}Generando clave de aplicación...${NC}"
cd backend
php artisan key:generate
cd ..

# Limpiar caché
echo -e "${GREEN}Limpiando caché...${NC}"
cd backend
php artisan config:clear
php artisan cache:clear
cd ..

# Configurar el traductor
echo -e "${GREEN}Configurando el servicio de traducción...${NC}"
chmod +x scripts/setup-translator.sh
./scripts/setup-translator.sh

# Iniciar los servicios
echo -e "${GREEN}Iniciando servicios...${NC}"

# Iniciar el servicio de traducción
echo -e "${GREEN}Iniciando servicio de traducción...${NC}"
chmod +x scripts/start-libretranslate.sh
./scripts/start-libretranslate.sh

# Iniciar el backend
echo -e "${GREEN}Iniciando backend...${NC}"
cd backend
php artisan serve &
cd ..

# Iniciar el frontend
echo -e "${GREEN}Iniciando frontend...${NC}"
cd frontend
npm run dev &
cd ..

# Verificar que todos los servicios estén funcionando
echo -e "${GREEN}Verificando servicios...${NC}"
chmod +x scripts/check-services.sh
./scripts/check-services.sh

echo -e "${GREEN}¡Configuración completada!${NC}"
echo -e "${GREEN}El backend está corriendo en http://localhost:8000${NC}"
echo -e "${GREEN}El frontend está corriendo en http://localhost:5173${NC}"
echo -e "${GREEN}El servicio de traducción está corriendo en http://localhost:5000${NC}"

# Mantener el script en ejecución
wait 