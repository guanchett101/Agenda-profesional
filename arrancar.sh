#!/bin/bash

echo "🚀 Arrancando Agenda Profesional..."
echo ""

# Arrancar backend
echo "📡 Iniciando Backend..."
gnome-terminal -- bash -c "cd '$PWD' && source venv/bin/activate && uvicorn backend:app --reload --host 0.0.0.0 --port 8000; exec bash"

# Esperar 3 segundos
sleep 3

# Arrancar frontend
echo "🎨 Iniciando Frontend..."
gnome-terminal -- bash -c "cd '$PWD/frontend' && npm run dev -- --host; exec bash"

echo ""
echo "✅ Agenda Profesional arrancada!"
echo ""
echo "📍 Accede desde este PC: http://localhost:5173"
echo "🌐 Accede desde otras PCs: http://$(hostname -I | awk '{print $1}'):5173"
echo ""
echo "Para detener: Cierra las terminales o presiona Ctrl+C en cada una"
