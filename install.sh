#!/bin/bash
echo "🔧 Instalando dependencias para Puppeteer..."
apt-get update && apt-get install -y \
    libnss3 \
    libatk-bridge2.0-0 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxi6 \
    libxtst6 \
    libappindicator3-1 \
    libasound2 \
    xdg-utils \
    fonts-liberation

echo "✅ Dependencias instaladas correctamente."
