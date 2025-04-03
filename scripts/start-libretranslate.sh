#!/bin/bash
if [ ! "$(sudo docker ps -a -q -f name=libretranslate)" ]; then sudo docker run -d --name libretranslate -p 5000:5000 --restart always libretranslate/libretranslate; else if [ ! "$(sudo docker ps -q -f name=libretranslate)" ]; then sudo docker start libretranslate; else echo "El contenedor ya está en ejecución"; fi; fi
