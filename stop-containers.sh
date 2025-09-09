#!/bin/bash
# Script para parar todos os contêineres Docker da aplicação Bets
# Autor: Sistema de Apostas de Futebol
# Data: 2024

set -e

echo "========================================"
echo "   Parando Contêineres - Bets App"
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
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose não está instalado"
    exit 1
fi

# Verificar se Docker está rodando
if ! docker info &> /dev/null; then
    log_error "Docker não está rodando"
    exit 1
fi

log_info "Parando todos os contêineres da aplicação..."
echo

# Parar e remover contêineres
if docker-compose down; then
    log_success "Contêineres parados com sucesso"
else
    log_warning "Falha ao parar contêineres com docker-compose"
    log_info "Tentando parar contêineres individualmente..."
    
    # Tentar parar contêineres individualmente
    docker stop bets-frontend bets-backend bets-postgres 2>/dev/null || true
    docker rm bets-frontend bets-backend bets-postgres 2>/dev/null || true
    
    log_success "Contêineres parados individualmente"
fi

echo
log_info "Verificando contêineres restantes..."
docker ps -a --filter "name=bets"

echo
log_info "Limpando recursos não utilizados (opcional)..."
read -p "Deseja limpar volumes e redes não utilizados? (s/N): " cleanup
if [[ $cleanup =~ ^[Ss]$ ]]; then
    log_info "Limpando volumes órfãos..."
    docker volume prune -f
    log_info "Limpando redes não utilizadas..."
    docker network prune -f
    log_success "Limpeza concluída"
else
    log_info "Limpeza pulada"
fi

echo
echo "========================================"
echo "        CONTÊINERES PARADOS!"
echo "========================================"
echo
echo "🚀 Para iniciar novamente: ./start-containers.sh"
echo "📋 Para ver todos os contêineres: docker ps -a"
echo "📊 Para ver logs: docker-compose logs"
echo