#!/bin/bash
# =====================================================================================
# SIGMA PLI - SCRIPT DE INSTALAÇÃO COMPLETA
# Sistema de Gestão e Análise de Atas PLI-SP
# =====================================================================================
# Versão: 1.0
# Data: 15 de julho de 2025
# Compatibilidade: Ubuntu 20.04+, CentOS 8+, macOS 12+
# =====================================================================================

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Função para log com cores
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_step() { echo -e "${PURPLE}🚀 $1${NC}"; }

# Banner inicial
echo -e "${CYAN}"
echo "====================================================================================="
echo "🎯 SIGMA PLI - INSTALAÇÃO COMPLETA DE DEPENDÊNCIAS"
echo "    Sistema de Gestão e Análise de Atas PLI-SP"
echo "====================================================================================="
echo -e "${NC}"

# Verificar sistema operacional
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/debian_version ]; then
            OS="debian"
            log_info "Sistema detectado: Debian/Ubuntu"
        elif [ -f /etc/redhat-release ]; then
            OS="rhel"
            log_info "Sistema detectado: RHEL/CentOS/Rocky"
        else
            log_error "Sistema Linux não suportado"
            exit 1
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
        log_info "Sistema detectado: macOS"
    else
        log_error "Sistema operacional não suportado: $OSTYPE"
        exit 1
    fi
}

# Verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Instalar dependências do sistema para Debian/Ubuntu
install_debian_system_deps() {
    log_step "Instalando dependências do sistema (Debian/Ubuntu)..."
    
    sudo apt update
    sudo apt install -y \
        curl wget git build-essential software-properties-common \
        apt-transport-https ca-certificates gnupg lsb-release \
        unzip vim nano htop tree jq openssl ssl-cert \
        libc6-dev libssl-dev libffi-dev libxml2-dev libxslt1-dev \
        zlib1g-dev libjpeg-dev libpng-dev libfreetype6-dev \
        libblas-dev liblapack-dev libatlas-base-dev gfortran \
        python3 python3-pip python3-venv python3-dev \
        libpq-dev postgresql-client
        
    log_success "Dependências do sistema instaladas"
}

# Instalar dependências do sistema para RHEL/CentOS
install_rhel_system_deps() {
    log_step "Instalando dependências do sistema (RHEL/CentOS)..."
    
    sudo dnf update -y
    sudo dnf install -y epel-release
    sudo dnf install -y \
        curl wget git gcc gcc-c++ make \
        openssl-devel libffi-devel libxml2-devel libxslt-devel \
        zlib-devel libjpeg-devel libpng-devel freetype-devel \
        blas-devel lapack-devel atlas-devel \
        python3 python3-pip python3-devel \
        libpq-devel
        
    log_success "Dependências do sistema instaladas"
}

# Instalar dependências do sistema para macOS
install_macos_system_deps() {
    log_step "Instalando dependências do sistema (macOS)..."
    
    # Verificar se Homebrew está instalado
    if ! command_exists brew; then
        log_info "Instalando Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    
    brew update
    brew install \
        curl wget git openssl libffi libxml2 libxslt \
        jpeg libpng freetype openblas lapack \
        python3
        
    log_success "Dependências do sistema instaladas"
}

# Instalar Node.js
install_nodejs() {
    log_step "Instalando Node.js 18 LTS..."
    
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -ge 18 ]; then
            log_warning "Node.js $NODE_VERSION já instalado e compatível"
            return 0
        fi
    fi
    
    # Instalar NVM
    if [ ! -d "$HOME/.nvm" ]; then
        log_info "Instalando NVM..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
    fi
    
    # Carregar NVM
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    
    # Instalar Node.js
    nvm install 18
    nvm use 18
    nvm alias default 18
    
    # Verificar instalação
    node --version
    npm --version
    
    # Instalar ferramentas globais
    npm install -g nodemon pm2 webpack-cli eslint prettier npm-check-updates
    
    log_success "Node.js 18 LTS instalado com sucesso"
}

# Instalar PostgreSQL
install_postgresql() {
    log_step "Verificando PostgreSQL..."
    
    if command_exists psql; then
        PSQL_VERSION=$(psql --version | grep -oE '[0-9]+\.[0-9]+' | head -1 | cut -d'.' -f1)
        if [ "$PSQL_VERSION" -ge 15 ]; then
            log_warning "PostgreSQL $PSQL_VERSION já instalado e compatível"
            return 0
        fi
    fi
    
    log_info "Instalando PostgreSQL 15..."
    
    if [[ "$OS" == "debian" ]]; then
        sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
        wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
        sudo apt update
        sudo apt install -y postgresql-15 postgresql-contrib-15 postgresql-15-postgis-3
    elif [[ "$OS" == "rhel" ]]; then
        sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm
        sudo dnf install -y postgresql15-server postgresql15-contrib postgis33_15
        sudo /usr/pgsql-15/bin/postgresql-15-setup initdb
        sudo systemctl enable postgresql-15
        sudo systemctl start postgresql-15
    elif [[ "$OS" == "macos" ]]; then
        brew install postgresql@15 postgis
        brew services start postgresql@15
    fi
    
    log_success "PostgreSQL 15 instalado"
}

# Instalar Docker
install_docker() {
    log_step "Verificando Docker..."
    
    if command_exists docker; then
        log_warning "Docker já está instalado"
        return 0
    fi
    
    log_info "Instalando Docker..."
    
    if [[ "$OS" == "debian" ]]; then
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        sudo apt update
        sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    elif [[ "$OS" == "rhel" ]]; then
        sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
        sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        sudo systemctl enable docker
        sudo systemctl start docker
    elif [[ "$OS" == "macos" ]]; then
        log_warning "No macOS, instale Docker Desktop manualmente: https://docs.docker.com/docker-for-mac/install/"
        return 0
    fi
    
    # Adicionar usuário ao grupo docker (Linux apenas)
    if [[ "$OS" != "macos" ]]; then
        sudo usermod -aG docker $USER
        log_warning "Reinicie o terminal ou faça logout/login para usar Docker sem sudo"
    fi
    
    log_success "Docker instalado"
}

# Criar ambiente virtual Python
create_python_venv() {
    log_step "Criando ambiente virtual Python..."
    
    if [ -d "venv_sigma_pli" ]; then
        log_warning "Ambiente virtual já existe, removendo o antigo..."
        rm -rf venv_sigma_pli
    fi
    
    python3 -m venv venv_sigma_pli
    source venv_sigma_pli/bin/activate
    
    # Atualizar pip
    pip install --upgrade pip setuptools wheel
    
    log_success "Ambiente virtual Python criado"
}

# Instalar dependências Python
install_python_deps() {
    log_step "Instalando dependências Python..."
    
    if [ ! -f "requirements.txt" ]; then
        log_error "Arquivo requirements.txt não encontrado!"
        return 1
    fi
    
    # Ativar ambiente virtual
    source venv_sigma_pli/bin/activate
    
    # Instalar dependências
    pip install -r requirements.txt
    
    # Baixar modelos spaCy
    log_info "Baixando modelos spaCy..."
    python -m spacy download pt_core_news_sm
    
    # Baixar dados NLTK
    log_info "Baixando dados NLTK..."
    python -c "
import nltk
try:
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True) 
    nltk.download('wordnet', quiet=True)
    nltk.download('vader_lexicon', quiet=True)
    nltk.download('averaged_perceptron_tagger', quiet=True)
    print('Dados NLTK baixados com sucesso')
except Exception as e:
    print(f'Erro ao baixar dados NLTK: {e}')
"
    
    deactivate
    log_success "Dependências Python instaladas"
}

# Instalar dependências Node.js
install_nodejs_deps() {
    log_step "Instalando dependências Node.js..."
    
    if [ ! -f "package.json" ]; then
        log_error "Arquivo package.json não encontrado!"
        return 1
    fi
    
    # Limpar cache npm
    npm cache clean --force
    
    # Instalar dependências
    npm install
    
    # Verificar vulnerabilidades
    npm audit || log_warning "Algumas vulnerabilidades encontradas, execute 'npm audit fix' se necessário"
    
    log_success "Dependências Node.js instaladas"
}

# Configurar banco de dados
setup_database() {
    log_step "Configurando banco de dados..."
    
    # Verificar se PostgreSQL está rodando
    if ! sudo systemctl is-active --quiet postgresql 2>/dev/null && ! sudo systemctl is-active --quiet postgresql-15 2>/dev/null; then
        log_warning "PostgreSQL não está rodando, tentando iniciar..."
        sudo systemctl start postgresql 2>/dev/null || sudo systemctl start postgresql-15 2>/dev/null || true
    fi
    
    # Verificar se arquivo SQL existe
    if [ -f "database/install_sigma_pli_final.sql" ]; then
        log_info "Arquivo SQL de instalação encontrado"
        log_warning "Execute manualmente: psql -h host -U user -d pli_db -f database/install_sigma_pli_final.sql"
    else
        log_warning "Arquivo SQL de instalação não encontrado em database/"
    fi
}

# Criar arquivo .env se não existir
setup_env_file() {
    log_step "Configurando arquivo de ambiente..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            log_success "Arquivo .env criado a partir de .env.example"
        else
            log_warning "Criando arquivo .env básico..."
            cat > .env << 'EOF'
# SIGMA PLI - Configurações de Ambiente
NODE_ENV=development
PORT=3000
HOST=localhost

# Banco de Dados PostgreSQL
DB_HOST=pli-db.c6j00cu4izbw.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=pli_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=true

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=24h

# Upload
UPLOAD_MAX_SIZE=50mb
UPLOAD_PATH=./uploads

# NLP
NLP_MODEL=pt_core_news_sm
NLP_TIMEOUT=30000

# Logs
LOG_LEVEL=info
LOG_FILE=./logs/app.log
EOF
            log_success "Arquivo .env básico criado"
        fi
        log_warning "Configure o arquivo .env com suas credenciais antes de executar"
    else
        log_warning "Arquivo .env já existe"
    fi
}

# Verificar instalação
verify_installation() {
    log_step "Verificando instalação..."
    
    local errors=0
    
    # Verificar Node.js
    if command_exists node; then
        log_success "Node.js: $(node --version)"
    else
        log_error "Node.js não encontrado"
        ((errors++))
    fi
    
    # Verificar npm
    if command_exists npm; then
        log_success "npm: $(npm --version)"
    else
        log_error "npm não encontrado"
        ((errors++))
    fi
    
    # Verificar Python
    if command_exists python3; then
        log_success "Python: $(python3 --version)"
    else
        log_error "Python3 não encontrado"
        ((errors++))
    fi
    
    # Verificar PostgreSQL
    if command_exists psql; then
        log_success "PostgreSQL: $(psql --version)"
    else
        log_error "PostgreSQL não encontrado"
        ((errors++))
    fi
    
    # Verificar Docker
    if command_exists docker; then
        log_success "Docker: $(docker --version)"
    else
        log_warning "Docker não encontrado (opcional)"
    fi
    
    # Verificar ambiente virtual Python
    if [ -d "venv_sigma_pli" ]; then
        log_success "Ambiente virtual Python: OK"
    else
        log_error "Ambiente virtual Python não encontrado"
        ((errors++))
    fi
    
    # Verificar dependências Node.js
    if [ -d "node_modules" ]; then
        log_success "Dependências Node.js: OK"
    else
        log_error "Dependências Node.js não instaladas"
        ((errors++))
    fi
    
    # Verificar spaCy
    if [ -d "venv_sigma_pli" ]; then
        source venv_sigma_pli/bin/activate
        if python -c "import spacy; nlp = spacy.load('pt_core_news_sm')" 2>/dev/null; then
            log_success "spaCy modelo português: OK"
        else
            log_error "spaCy modelo português não encontrado"
            ((errors++))
        fi
        deactivate
    fi
    
    return $errors
}

# Função principal
main() {
    log_info "Iniciando instalação completa do SIGMA PLI..."
    
    # Detectar sistema operacional
    detect_os
    
    # Instalar dependências do sistema
    case $OS in
        "debian")
            install_debian_system_deps
            ;;
        "rhel")
            install_rhel_system_deps
            ;;
        "macos")
            install_macos_system_deps
            ;;
    esac
    
    # Instalar componentes principais
    install_nodejs
    install_postgresql
    install_docker
    
    # Configurar Python
    create_python_venv
    install_python_deps
    
    # Instalar dependências Node.js
    install_nodejs_deps
    
    # Configurações adicionais
    setup_database
    setup_env_file
    
    # Verificar instalação
    if verify_installation; then
        echo ""
        log_success "🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
        echo ""
        echo -e "${CYAN}📋 PRÓXIMOS PASSOS:${NC}"
        echo "1. Configurar arquivo .env com suas credenciais"
        echo "2. Executar script SQL: psql -h host -U user -d pli_db -f database/install_sigma_pli_final.sql"
        echo "3. Ativar ambiente Python: source venv_sigma_pli/bin/activate"
        echo "4. Iniciar aplicação: npm run dev"
        echo ""
        echo -e "${CYAN}🔑 COMANDOS ÚTEIS:${NC}"
        echo "   npm run dev           # Modo desenvolvimento"
        echo "   npm run build         # Build para produção"
        echo "   npm test              # Executar testes"
        echo "   docker-compose up     # Executar com Docker"
        echo ""
        echo -e "${GREEN}✅ Sistema SIGMA PLI pronto para uso!${NC}"
    else
        echo ""
        log_error "❌ INSTALAÇÃO CONCLUÍDA COM ERROS!"
        echo "Verifique os erros acima e execute novamente se necessário."
        exit 1
    fi
}

# Executar função principal
main "$@"
