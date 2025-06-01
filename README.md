# 🎮 Triviality Project

<div align="center">
  <img src="frontend/public/logo.svg" alt="Triviality Logo" width="200"/>
  <br/>
  <p><i>¡Juega, aprende y compite en el mejor juego de trivia!</i></p>
</div>

## 📝 Descripción
Triviality es un juego de preguntas y respuestas basado en la API Open Trivia Database. El proyecto utiliza Laravel para el backend y React con Vite para el frontend.

## 🛠️ Requisitos Previos

Asegúrate de tener instalados los siguientes requisitos antes de continuar:

- ⚡ PHP 8.x
- 📦 Composer
- 🟢 Node.js y npm
- 🐬 MySQL
- 🐧 Ubuntu Server (o similar)
- 🐳 Docker (para el traductor local)

## 🚀 Configuración Rápida (Todo en Uno)

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
1. 🔧 Configurar el backend Laravel (instalar dependencias, configurar .env, ejecutar migraciones)
2. 🎨 Configurar el frontend React (instalar dependencias)
3. 🌐 Instalar y configurar el traductor local LibreTranslate
4. ✅ Ofrecer iniciar todos los servicios y verificar su estado

> **Nota**: Durante la ejecución, el script te pedirá:
> - 📊 Configurar la base de datos (nombre, usuario y contraseña)
> - 🔐 Crear la base de datos y el usuario si no existen
> - 🚀 Confirmar si deseas iniciar los servicios automáticamente

## ⚙️ Configuración Manual del Entorno

### 1. 🎯 Backend (Laravel)

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

# Migrar base de datos
php artisan migrate

# Iniciar servidor Laravel
php artisan serve
```

### 2. 🎨 Frontend (React + Vite)

```bash
# Entrar al directorio frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### 3. 🌐 Instalar Servicio de Traducción Local (LibreTranslate)
Para mejorar el rendimiento de las traducciones, se utiliza un servidor local de LibreTranslate que elimina la dependencia de servicios externos.

```bash
# Ejecutar el script de instalación del traductor
cd /var/www/html/triviality-project
chmod +x scripts/setup-translator.sh
./scripts/setup-translator.sh
```

El script realizará las siguientes acciones:
1. 🔍 Verificar si Docker está instalado (instalarlo si es necesario)
2. 🐳 Crear y configurar el contenedor de LibreTranslate
3. 🔄 Configurar el contenedor para reiniciarse automáticamente
4. ✅ Probar el servicio de traducción

Una vez configurado, el servicio estará disponible en:
- 🌐 URL: http://localhost:5000
- 🔌 API Endpoint: http://localhost:5000/translate (no visible en navegador)

> **Nota importante**: La primera vez que se inicia LibreTranslate, descargará los modelos de idioma necesarios, lo que puede tardar varios minutos. Durante este tiempo, el servicio no estará completamente operativo.

## 💻 Flujo de Trabajo

### Desarrollo
1. 🚀 Inicia el servidor Laravel:
   ```bash
   cd backend && php artisan serve
   ```
2. 🎨 Inicia el servidor Vite:
   ```bash
   cd frontend && npm run dev
   ```
3. 🔍 Verifica que el servicio de traducción esté funcionando:
   ```bash
   docker ps | grep libretranslate
   ```
4. 🌐 Accede a la aplicación:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/api
   - Traductor: http://localhost:5000

Los cambios se actualizarán automáticamente (hot reload). No necesitas ejecutar `npm run build` para ver los cambios.

### Producción
1. 🏗️ Compila el frontend:
   ```bash
   cd frontend && npm run build
   ```
2. ⚙️ Configura Apache para servir la aplicación en producción.
3. 🔄 Reinicia Apache:
   ```bash
   sudo systemctl restart apache2
   ```
4. 🔍 Verifica que el servicio de traducción esté funcionando:
   ```bash
   docker ps | grep libretranslate
   ```

## 📁 Estructura del Proyecto

```
triviality-project/
├── backend/                  # Aplicación Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/  # Controladores de la API
│   │   │   └── Middleware/   # Middleware de autenticación
│   │   └── Models/          # Modelos de la base de datos
│   ├── config/              # Configuración de Laravel
│   ├── database/            # Migraciones y seeders
│   └── routes/              # Rutas de la API
├── frontend/                # Aplicación React + Vite
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── services/       # Servicios de API
│   │   └── App.tsx         # Componente principal
│   └── package.json        # Dependencias de React
├── scripts/                 # Scripts de configuración
│   ├── setup-translator.sh  # Script de instalación del traductor
│   ├── check-services.sh    # Script de verificación de servicios
│   └── setup-all.sh        # Script de configuración completa
└── .env                    # Variables de entorno
```

## 🔌 Endpoints de la API

### 🔐 Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cierre de sesión

### 🎮 Trivia
- `GET /api/trivia/questions` - Obtiene preguntas de trivia (traducidas)
- `GET /api/trivia/categories` - Obtiene las categorías de trivia

## 🚨 Solución de Problemas

### ❌ Error "ERR_CONNECTION_REFUSED"
Si ves este error al intentar registrar o iniciar sesión:
1. 🔍 Verifica que el servidor Laravel esté corriendo:
   ```bash
   ps aux | grep "php artisan serve"
   ```
2. 🚀 Si no está corriendo, inicia el servidor:
   ```bash
   cd backend && php artisan serve
   ```

### 🌐 Problemas con el servicio de traducción
Si las traducciones no funcionan correctamente:
1. 🔍 Verifica que el contenedor esté en ejecución: `docker ps | grep libretranslate`
2. 📋 Revisa los logs del contenedor: `docker logs libretranslate`
3. 🔄 Reinicia el contenedor si es necesario: `docker restart libretranslate`
4. 🌐 Verifica si puedes acceder a la interfaz web: http://localhost:5000

### Se puede comprobar si los servicios andan activos
```bash
./scripts/check-services.sh
```

### 🔒 Problemas con permisos
Si experimentas problemas con permisos en la carpeta del proyecto:

```bash
sudo chown -R $USER:www-data /var/www/html/triviality-project
sudo chmod -R 775 /var/www/html/triviality-project
```

## 🛠️ Tecnologías Utilizadas

- **Backend**: Laravel, PHP, MySQL
- **Frontend**: React, TypeScript, Vite, Axios
- **Traducción**: LibreTranslate (Docker), API local
- **Autenticación**: Laravel Sanctum



