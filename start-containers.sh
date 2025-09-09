#!/bin/bash
# Script para iniciar todos os contêineres Docker da aplicação Bets
# Autor: Sistema de Apostas de Futebol
# Data: 2024

set -e

echo "========================================"
echo "  Iniciando PostgreSQL - Bets App"
echo "========================================"
echo

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERRO]${NC} $1"
}

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    log_error "Docker não está instalado"
    echo "Por favor, instale o Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose não está instalado"
    echo "Por favor, instale o Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

# Verificar se Docker está rodando
if ! docker info &> /dev/null; then
    log_error "Docker não está rodando"
    echo "Por favor, inicie o Docker e tente novamente"
    exit 1
fi

log_success "Docker está rodando corretamente"
echo

# Verificar se arquivo .env existe
if [ ! -f ".env" ]; then
    log_warning "Arquivo .env não encontrado"
    if [ -f ".env.example" ]; then
        log_info "Copiando .env.example para .env..."
        cp ".env.example" ".env"
        log_info "Arquivo .env criado. Configure as variáveis antes de continuar."
    else
        log_error "Arquivo .env.example não encontrado"
        exit 1
    fi
    echo
fi

# Parar contêineres existentes (se houver)
log_info "Parando contêineres existentes..."
docker-compose down &> /dev/null || true

# Iniciar PostgreSQL
log_info "Iniciando PostgreSQL..."
echo
docker-compose up -d

if [ $? -ne 0 ]; then
    echo
    log_error "Falha ao iniciar contêineres"
    echo "Verifique os logs com: docker-compose logs"
    exit 1
fi

echo
log_info "Aguardando PostgreSQL ficar pronto..."
echo

# Aguardar PostgreSQL ficar pronto
log_info "Verificando PostgreSQL..."
while ! docker-compose exec -T postgres pg_isready -U postgres &> /dev/null; do
    echo "Aguardando PostgreSQL..."
    sleep 2
done
log_success "PostgreSQL está pronto"

echo
echo "========================================"
echo "        POSTGRESQL PRONTO!"
echo "========================================"
echo
echo "🗄️  POSTGRES:  localhost:5432"
echo
echo "Status do contêiner:"
docker-compose ps
echo
echo "PRÓXIMOS PASSOS:"
echo "1. Inicie o backend: cd backend/src/BetsAPI && dotnet run"
echo "2. Inicie o frontend: cd frontend && ng serve"
echo
echo "Para parar o PostgreSQL: ./stop-containers.sh"
echo "Para ver logs: docker-compose logs -f"
echo