#!/bin/bash
set -e

echo "📦 Instalando dependencias del backend..."
pip install -r requirements.txt

echo "📦 Instalando dependencias del frontend..."
cd frontend
npm install

echo "🏗️  Compilando frontend..."
npm run build

echo "✅ Build completado!"
