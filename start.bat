@echo off
start http://localhost:8001
cd frontend && node ../backend/server.js || pause