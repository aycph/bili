@echo off
start http://localhost:8000
cd frontend
ts-node ../backend/server.ts || pause