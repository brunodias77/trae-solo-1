@echo off
REM Script para parar todos os contêineres Docker da aplicação Bets
REM Autor: Sistema de Apostas de Futebol
REM Data: 2024

echo ========================================
echo   Parando Contêineres - Bets App
echo ========================================
echo.

REM Verificar se Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Docker não está instalado ou não está no PATH
    pause
    exit /b 1
)

REM Verificar se Docker está rodando
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Docker não está rodando
    pause
    exit /b 1
)

echo [INFO] Parando todos os contêineres da aplicação...
echo.

REM Parar e remover contêineres
docker-compose down

if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Falha ao parar contêineres
    echo Tentando parar contêineres individualmente...
    
    REM Tentar parar contêineres individualmente
    docker stop bets-frontend bets-backend bets-postgres >nul 2>&1
    docker rm bets-frontend bets-backend bets-postgres >nul 2>&1
    
    echo [INFO] Contêineres parados individualmente
else
    echo [OK] Contêineres parados com sucesso
fi

echo.
echo [INFO] Verificando contêineres restantes...
docker ps -a --filter "name=bets"

echo.
echo [INFO] Limpando recursos não utilizados (opcional)...
set /p cleanup="Deseja limpar volumes e redes não utilizados? (s/N): "
if /i "%cleanup%"=="s" (
    echo [INFO] Limpando volumes órfãos...
    docker volume prune -f
    echo [INFO] Limpando redes não utilizadas...
    docker network prune -f
    echo [OK] Limpeza concluída
) else (
    echo [INFO] Limpeza pulada
)

echo.
echo ========================================
echo        CONTÊINERES PARADOS!
echo ========================================
echo.
echo Para iniciar novamente: start-containers.bat
echo Para ver todos os contêineres: docker ps -a
echo.
pause