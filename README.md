# Triviality Project

## Descripción
Triviality es un juego de preguntas y respuestas basado en la API Open Trivia Database. El proyecto utiliza Laravel para el backend y React para el frontend.

## Requisitos Previos

Asegúrate de tener instalados los siguientes requisitos antes de continuar:

- PHP 8.x
- Composer
- Node.js y npm
- MySQL
- Ubuntu Server (o similar)
- Docker (para el traductor local)

## Configuración Rápida (Todo en Uno)

Para configurar todo el entorno de forma automática, incluyendo backend, frontend y traductor local, use el script de configuración completa:

```bash
# Clonar el repositorio (si aún no lo has hecho)
git clone https://github.com/DanieelJP/triviality-project.git
cd triviality-project

# Hacer el script ejecutable
chmod +x scripts/setup-all.sh

# ⚠️IMPORTANTE EJECUTAR EN RAÍZ DE PROYECTO⚠️
# Ejecutar el script de configuración completa
./scripts/setup-all.sh
```

Este script realizará todas las siguientes tareas automáticamente:
1. Configurar el backend Laravel (instalar dependencias, configurar .env, ejecutar migraciones)
2. Configurar el frontend React (instalar dependencias)
3. Instalar y configurar el traductor local LibreTranslate
4. Ofrecer iniciar todos los servicios y verificar su estado

> **Nota**: Durante la ejecución, el script te pedirá:
> - Configurar la base de datos (nombre, usuario y contraseña)
> - Crear la base de datos y el usuario si no existen
> - Confirmar si deseas iniciar los servicios automáticamente

Para una configuración manual paso a paso, sigue las instrucciones detalladas a continuación.

## Configuración Manual del Entorno

### 1. Backend (Laravel)

```bash
# Entrar al directorio backend
cd backend

# Instalar dependencias
composer install

# Configurar entorno
cp .env.example .env
php artisan key:generate

# Configurar base de datos en .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=triviality
# DB_USERNAME=triviality_user
# DB_PASSWORD=

# El script de configuración te guiará para crear la base de datos
# y configurar un usuario con los permisos necesarios.

# Crear base de datos (alternativa manual)
# mysql -u root -p -e "CREATE DATABASE triviality;"
# mysql -u root -p -e "CREATE USER 'triviality_user'@'localhost' IDENTIFIED BY 'tu_contraseña';"
# mysql -u root -p -e "GRANT ALL PRIVILEGES ON triviality.* TO 'triviality_user'@'localhost';"
# mysql -u root -p -e "FLUSH PRIVILEGES;"

# Migrar base de datos
php artisan migrate

# Iniciar servidor Laravel
php artisan serve
```

### 2. Frontend (React)

```bash
# Entrar al directorio frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

### 3. Instalar Servicio de Traducción Local (LibreTranslate)
Para mejorar el rendimiento de las traducciones, se utiliza un servidor local de LibreTranslate que elimina la dependencia de servicios externos.

```bash
# Ejecutar el script de instalación del traductor
cd /var/www/html/triviality-project
chmod +x scripts/setup-translator.sh
./scripts/setup-translator.sh
```

El script realizará las siguientes acciones:
1. Verificar si Docker está instalado (instalarlo si es necesario)
2. Crear y configurar el contenedor de LibreTranslate
3. Configurar el contenedor para reiniciarse automáticamente
4. Probar el servicio de traducción

Una vez configurado, el servicio estará disponible en:
- URL: http://localhost:5000
- API Endpoint: http://localhost:5000/translate (no visible en navegador)

> **Nota importante**: La primera vez que se inicia LibreTranslate, descargará los modelos de idioma necesarios, lo que puede tardar varios minutos. Durante este tiempo, el servicio no estará completamente operativo.

### 4. Verificar Instalación y Servicios
Para verificar que todos los servicios estén funcionando correctamente, se proporciona un script de verificación:

```bash
# Ejecutar el script de verificación de servicios
cd /var/www/html/triviality-project
chmod +x scripts/check-services.sh
./scripts/check-services.sh
```

Este script verificará:
1. La instalación de Docker
2. El estado del contenedor LibreTranslate
3. La disponibilidad de la API de traducción
4. El estado del servidor Laravel
5. La disponibilidad de la API de Laravel
6. El estado del servidor React

Si algún servicio no está funcionando correctamente, el script proporcionará recomendaciones para solucionarlo.

## Flujo de Trabajo

### Desarrollo
1. Inicia el servidor Laravel:
   ```bash
   cd backend && php artisan serve
   ```
2. Inicia el servidor React:
   ```bash
   cd frontend && npm start
   ```
3. Verifica que el servicio de traducción esté funcionando:
   ```bash
   docker ps | grep libretranslate
   ```
4. Accede a la aplicación:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
   - Traductor: http://localhost:5000

Los cambios se actualizarán automáticamente (hot reload). No necesitas ejecutar `npm run build` para ver los cambios.

### Producción
1. Compila el frontend:
   ```bash
   cd frontend && npm run build
   ```
2. Configura Apache para servir la aplicación en producción.
3. Reinicia Apache:
   ```bash
   sudo systemctl restart apache2
   ```
4. Verifica que el servicio de traducción esté funcionando:
   ```bash
   docker ps | grep libretranslate
   ```

## Configuración Alternativa con Apache VirtualHost (Opcional)

Si prefieres usar Apache como proxy para los servidores de desarrollo, sigue estos pasos adicionales:

```bash
# Habilitar módulos necesarios
sudo a2enmod proxy proxy_http proxy_wstunnel rewrite

# Configurar VirtualHost
sudo nano /etc/apache2/sites-available/triviality.conf
```

### Configuración para Desarrollo
```apache
<VirtualHost *:80>
    ServerName triviality.local
    
    # Proxy para el frontend en modo desarrollo
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    # Proxy para el backend
    ProxyPass /api http://localhost:8000/api
    ProxyPassReverse /api http://localhost:8000/api

    # WebSocket para Hot Module Replacement
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} =websocket [NC]
    RewriteRule /(.*)           ws://localhost:3000/$1 [P,L]
    
    # Logs
    ErrorLog ${APACHE_LOG_DIR}/triviality-error.log
    CustomLog ${APACHE_LOG_DIR}/triviality-access.log combined
</VirtualHost>
```

### Configuración para Producción
```apache
<VirtualHost *:80>
    ServerName triviality.local
    DocumentRoot /var/www/html/triviality-project/frontend/build

    # Configuración del frontend
    <Directory /var/www/html/triviality-project/frontend/build>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Proxy para el backend
    ProxyPass /api http://localhost:8000/api
    ProxyPassReverse /api http://localhost:8000/api

    # Logs
    ErrorLog ${APACHE_LOG_DIR}/triviality-error.log
    CustomLog ${APACHE_LOG_DIR}/triviality-access.log combined
</VirtualHost>
```

Si usas esta configuración, añade el dominio local:
```bash
# Añadir dominio local
sudo nano /etc/hosts
# Añadir: 127.0.0.1 triviality.local
```

Y habilita el sitio:
```bash
# Habilitar sitio y reiniciar Apache
sudo a2ensite triviality.conf
sudo systemctl restart apache2
```

> **Nota**: Los scripts de configuración automática NO configuran VirtualHost. Esta es una opción avanzada manual.

## Solución de Problemas

### Error "Missing script: dev"
El proyecto utiliza `npm start` en lugar de `npm run dev` para el servidor de desarrollo.

### Cambios no visibles en desarrollo
Verifica que:
- El servidor Laravel esté corriendo (`php artisan serve`).
- El servidor React esté corriendo (`npm start`).
- Si usas Apache como proxy, verifica que esté configurado correctamente.

### Problemas con el servicio de traducción
Si las traducciones no funcionan correctamente:
1. Verifica que el contenedor esté en ejecución: `docker ps | grep libretranslate`
2. Revisa los logs del contenedor: `docker logs libretranslate`
3. Reinicia el contenedor si es necesario: `docker restart libretranslate`
4. Verifica si puedes acceder a la interfaz web: http://localhost:5000
5. Ejecuta el script de configuración nuevamente: `./scripts/setup-translator.sh`

### Problemas con permisos
Si experimentas problemas con permisos en la carpeta del proyecto:

```bash
sudo chown -R $USER:www-data /var/www/html/triviality-project
sudo chmod -R 775 /var/www/html/triviality-project
```

### Apache no se reinicia
Para verificar errores en Apache:

```bash
sudo systemctl status apache2
sudo tail -f /var/log/apache2/error.log
```

## Tecnologías Utilizadas

- **Backend**: Laravel, PHP, MySQL
- **Frontend**: React, TypeScript, Axios
- **Traducción**: LibreTranslate (Docker), API local

## Verificar Instalación

- **Backend**: http://localhost:8000/api
- **Frontend**: http://localhost:3000
- **Traductor**: http://localhost:5000

## Estructura del Proyecto

```
triviality-project/
├── app/                      # Código de la aplicación Laravel
├── config/                   # Archivos de configuración
├── database/                 # Migraciones y seeders
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   └── App.tsx           # Componente principal
│   └── package.json          # Dependencias de React
├── scripts/                  # Scripts de configuración
│   ├── setup-translator.sh   # Script de instalación del traductor
│   ├── check-services.sh     # Script de verificación de servicios
│   ├── setup-all.sh          # Script de configuración completa
│   └── start-libretranslate.sh # Script rápido para iniciar el traductor
├── public/                   # Archivos públicos
├── routes/                   # Rutas de la API
└── .env                      # Variables de entorno
```

## Endpoints de la API

- `GET /api/trivia/questions` - Obtiene preguntas de trivia (traducidas).
- `GET /api/trivia/categories` - Obtiene las categorías de trivia.



