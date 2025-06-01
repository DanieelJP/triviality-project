#!/bin/bash

# Colores para mensajes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Verificando servicios...${NC}"

# Verificar servicio de traducción
echo -e "${YELLOW}Verificando servicio de traducción...${NC}"
if curl -s http://localhost:5000 > /dev/null; then
    echo -e "${GREEN}✓ Servicio de traducción está funcionando${NC}"
else
    echo -e "${RED}✗ Servicio de traducción no está funcionando${NC}"
    echo -e "${YELLOW}Intenta iniciar el servicio con: ./scripts/start-libretranslate.sh${NC}"
fi

# Verificar backend
echo -e "${YELLOW}Verificando backend...${NC}"
if curl -s http://localhost:8000/api/trivia/questions?amount=1 > /dev/null; then
    echo -e "${GREEN}✓ Backend está funcionando${NC}"
else
    echo -e "${RED}✗ Backend no está funcionando${NC}"
    echo -e "${YELLOW}Intenta iniciar el servicio con: cd backend && php artisan serve${NC}"
fi

# Verificar frontend
echo -e "${YELLOW}Verificando frontend...${NC}"
if curl -s http://localhost:5173 > /dev/null; then
    echo -e "${GREEN}✓ Frontend está funcionando${NC}"
else
    echo -e "${RED}✗ Frontend no está funcionando${NC}"
    echo -e "${YELLOW}Intenta iniciar el servicio con: cd frontend && npm run dev${NC}"
fi

# Verificar base de datos
echo -e "${YELLOW}Verificando base de datos...${NC}"
if mysql -h localhost -u root -e "USE triviality_db;" 2>/dev/null; then
    echo -e "${GREEN}✓ Base de datos está funcionando${NC}"
else
    echo -e "${RED}✗ Base de datos no está funcionando${NC}"
    echo -e "${YELLOW}Verifica que MySQL esté instalado y corriendo${NC}"
fi

echo -e "${YELLOW}Verificación completada${NC}"
