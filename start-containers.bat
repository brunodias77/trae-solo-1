@echo off
REM Script para iniciar todos os contêineres Docker da aplicação Bets
REM Autor: Sistema de Apostas de Futebol
REM Data: 2024

echo ========================================
echo  Iniciando PostgreSQL - Bets App
echo ========================================
echo.

REM Verificar se Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Docker não está instalado ou não está no PATH
    echo Por favor, instale o Docker Desktop: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Verificar se Docker está rodando
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Docker não está rodando
    echo Por favor, inicie o Docker Desktop e tente novamente
    pause
    exit /b 1
)

echo [INFO] Docker está rodando corretamente
echo.

REM Verificar se arquivo .env existe
if not exist ".env" (
    echo [AVISO] Arquivo .env não encontrado
    echo Copiando .env.example para .env...
    copy ".env.example" ".env" >nul
    echo [INFO] Arquivo .env criado. Configure as variáveis antes de continuar.
    echo.
)

REM Parar contêineres existentes (se houver)
echo [INFO] Parando contêineres existentes...
docker-compose down >nul 2>&1

REM Iniciar PostgreSQL
echo [INFO] Iniciando PostgreSQL...
echo.
docker-compose up -d

if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Falha ao iniciar contêineres
    echo Verifique os logs com: docker-compose logs
    pause
    exit /b 1
)

echo.
echo [INFO] Aguardando PostgreSQL ficar pronto...
echo.

REM Aguardar PostgreSQL ficar pronto
echo [INFO] Verificando PostgreSQL...
:wait_postgres
timeout /t 2 >nul
docker-compose exec -T postgres pg_isready -U postgres >nul 2>&1
if %errorlevel% neq 0 (
    echo Aguardando PostgreSQL...
    goto wait_postgres
)
echo [OK] PostgreSQL está pronto

echo.
echo ========================================
echo        POSTGRESQL PRONTO!
echo ========================================
echo.
echo [POSTGRES] localhost:5432
echo.
echo Status do contêiner:
docker-compose ps
echo.
echo PRÓXIMOS PASSOS:
echo 1. Inicie o backend: cd backend/src/BetsAPI && dotnet run
echo 2. Inicie o frontend: cd frontend && ng serve
echo.
echo Para parar o PostgreSQL: stop-containers.bat
echo Para ver logs: docker-compose logs -f
echo.
pause