@echo off
start http://localhost:8000
cd frontend && node ../backend/server.js || pause