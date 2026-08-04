@echo off
chcp 65001 >nul
start "" msedge --app="file:///%~dp0index.html" --window-size=1280,840
