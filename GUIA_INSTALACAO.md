# 🚀 GUIA DE INSTALAÇÃO - SIGMA PLI

## Sistema de Gestão e Análise de Atas PLI-SP

---

## 📋 VISÃO GERAL

Este guia fornece **instruções completas** para instalar todas as dependências necessárias para executar o sistema SIGMA PLI em diferentes sistemas operacionais.

### 🎯 O que será instalado:
- **Node.js 18+ LTS** - Runtime JavaScript
- **Python 3.9+** - Para processamento NLP
- **PostgreSQL 15+** - Banco de dados principal
- **Docker** - Containerização (opcional)
- **Todas as dependências** - Pacotes Node.js e Python
- **Modelos NLP** - spaCy português e NLTK

---

## 🖥️ INSTALAÇÃO POR SISTEMA OPERACIONAL

### 🐧 Linux (Ubuntu/Debian, CentOS/RHEL)

```bash
# 1. Baixar e executar script de instalação
chmod +x install-dependencies.sh
./install-dependencies.sh

# 2. Seguir instruções na tela
```

### 🪟 Windows (PowerShell como Administrador)

```powershell
# 1. Abrir PowerShell como Administrador
# 2. Permitir execução de scripts
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# 3. Executar instalação
.\install-dependencies.ps1

# Parâmetros opcionais:
# .\install-dependencies.ps1 -SkipDocker    # Pular Docker
# .\install-dependencies.ps1 -SkipNodejs    # Pular Node.js
# .\install-dependencies.ps1 -SkipPython    # Pular Python
```

### 🍎 macOS

```bash
# 1. Instalar Xcode Command Line Tools
xcode-select --install

# 2. Executar script de instalação
chmod +x install-dependencies.sh
./install-dependencies.sh
```

---

## 📦 INSTALAÇÃO MANUAL

Se preferir instalar manualmente, siga os passos abaixo:

### 1️⃣ Dependências do Sistema

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install -y \
    curl wget git build-essential \
    python3 python3-pip python3-venv python3-dev \
    libpq-dev postgresql-client \
    openssl libssl-dev libffi-dev
```

#### CentOS/RHEL:
```bash
sudo dnf update -y
sudo dnf install -y \
    curl wget git gcc gcc-c++ make \
    python3 python3-pip python3-devel \
    libpq-devel openssl-devel libffi-devel
```

#### Windows:
- Instalar [Chocolatey](https://chocolatey.org/install)
- Executar como Administrador:
```powershell
choco install git python3 nodejs-lts postgresql15
```

#### macOS:
```bash
# Instalar Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar dependências
brew install git python3 node@18 postgresql@15
```

### 2️⃣ Node.js 18+ LTS

#### Opção A: Usando NVM (Recomendado)
```bash
# Instalar NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash

# Reiniciar terminal ou executar:
source ~/.bashrc

# Instalar Node.js 18
nvm install 18
nvm use 18
nvm alias default 18

# Verificar
node --version  # v18.x.x
npm --version   # 9.x.x
```

#### Opção B: Download Direto
- Baixar de [nodejs.org](https://nodejs.org/)
- Instalar versão 18.x LTS

### 3️⃣ Python 3.9+

#### Linux/macOS:
```bash
# Verificar versão (deve ser 3.9+)
python3 --version

# Se necessário, instalar via pyenv
curl https://pyenv.run | bash
pyenv install 3.11.5
pyenv global 3.11.5
```

#### Windows:
```powershell
# Via Chocolatey
choco install python3

# Ou download direto de python.org
```

### 4️⃣ PostgreSQL 15+

#### Ubuntu/Debian:
```bash
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
sudo apt install postgresql-15 postgresql-contrib-15
```

#### CentOS/RHEL:
```bash
sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm
sudo dnf install -y postgresql15-server postgresql15-contrib
sudo /usr/pgsql-15/bin/postgresql-15-setup initdb
sudo systemctl enable postgresql-15
sudo systemctl start postgresql-15
```

#### Windows:
```powershell
choco install postgresql15
```

#### macOS:
```bash
brew install postgresql@15
brew services start postgresql@15
```

### 5️⃣ Docker (Opcional)

#### Linux:
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# CentOS/RHEL
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install docker-ce docker-ce-cli containerd.io
sudo systemctl start docker
sudo systemctl enable docker
```

#### Windows:
- Baixar [Docker Desktop](https://docs.docker.com/docker-for-windows/install/)

#### macOS:
- Baixar [Docker Desktop](https://docs.docker.com/docker-for-mac/install/)

---

## 🔧 CONFIGURAÇÃO DO PROJETO

### 1️⃣ Clonar Repositório
```bash
git clone <repository-url>
cd SIGMA_PLI
```

### 2️⃣ Configurar Ambiente Python
```bash
# Criar ambiente virtual
python3 -m venv venv_sigma_pli

# Ativar ambiente virtual
# Linux/macOS:
source venv_sigma_pli/bin/activate
# Windows:
venv_sigma_pli\Scripts\activate

# Atualizar pip
pip install --upgrade pip setuptools wheel

# Instalar dependências
pip install -r requirements.txt

# Baixar modelos spaCy
python -m spacy download pt_core_news_sm

# Baixar dados NLTK
python -c "
import nltk
nltk.download('punkt')
nltk.download('stopwords') 
nltk.download('wordnet')
nltk.download('vader_lexicon')
nltk.download('averaged_perceptron_tagger')
"
```

### 3️⃣ Configurar Dependências Node.js
```bash
# Limpar cache
npm cache clean --force

# Instalar dependências
npm install

# Instalar ferramentas globais (opcional)
npm install -g nodemon pm2 webpack-cli
```

### 4️⃣ Configurar Banco de Dados
```bash
# Conectar ao PostgreSQL
psql -h pli-db.c6j00cu4izbw.us-east-1.rds.amazonaws.com -U postgres -d pli_db

# Executar script de instalação
\i database/install_sigma_pli_final.sql

# Ou via linha de comando:
psql -h pli-db.c6j00cu4izbw.us-east-1.rds.amazonaws.com -U postgres -d pli_db -f database/install_sigma_pli_final.sql
```

### 5️⃣ Configurar Variáveis de Ambiente
```bash
# Copiar arquivo exemplo
cp .env.example .env

# Editar configurações
nano .env
```

**Configurações principais no .env:**
```env
# Banco de Dados
DB_HOST=pli-db.c6j00cu4izbw.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=pli_db
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

# JWT
JWT_SECRET=sua_chave_secreta_super_segura

# Aplicação
NODE_ENV=development
PORT=3000
```

---

## 🚀 EXECUTAR O SISTEMA

### Modo Desenvolvimento
```bash
# Ativar ambiente Python
source venv_sigma_pli/bin/activate  # Linux/macOS
# venv_sigma_pli\Scripts\activate    # Windows

# Iniciar servidor
npm run dev
```

### Modo Produção
```bash
# Build
npm run build

# Iniciar com PM2
npm run start:prod
```

### Com Docker
```bash
# Desenvolvimento
docker-compose -f docker-compose.dev.yml up

# Produção
docker-compose up -d
```

---

## ✅ VERIFICAÇÃO DA INSTALAÇÃO

Execute os comandos abaixo para verificar se tudo está funcionando:

```bash
# Verificar versões
node --version     # ≥ v18.0.0
npm --version      # ≥ 9.0.0
python3 --version  # ≥ 3.9.0
psql --version     # ≥ 15.0

# Testar Python NLP
python -c "
import spacy
nlp = spacy.load('pt_core_news_sm')
print('✅ spaCy funcionando')

import nltk
print('✅ NLTK funcionando')

import pandas, numpy, sklearn
print('✅ Bibliotecas de análise funcionando')
"

# Testar conexão com banco
npm run test:db

# Executar testes
npm test
```

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### ❌ Erro: "python: command not found"
```bash
# Linux/macOS: Criar alias
echo 'alias python=python3' >> ~/.bashrc
source ~/.bashrc

# Ou usar python3 diretamente
python3 -m venv venv_sigma_pli
```

### ❌ Erro: "Permission denied" (Linux)
```bash
# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Logout e login novamente
```

### ❌ Erro: spaCy modelo não encontrado
```bash
# Ativar ambiente virtual primeiro
source venv_sigma_pli/bin/activate

# Reinstalar modelo
python -m spacy download pt_core_news_sm --force
```

### ❌ Erro: PostgreSQL conexão
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Verificar configurações de conexão no .env
# Testar conexão manual:
psql -h host -U user -d database -c "SELECT version();"
```

### ❌ Erro: "EACCES" npm
```bash
# Configurar npm para não usar sudo
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

---

## 📚 DOCUMENTAÇÃO ADICIONAL

- **[Requisitos Completos](./REQUISITOS_COMPLETOS_SIGMA_PLI.md)** - Documentação técnica completa
- **[Dependências Detalhadas](./DEPENDENCIAS_COMPLETAS_SIGMA_PLI.md)** - Lista completa de dependências
- **[Roadmap](./ROADMAP.md)** - Planejamento de desenvolvimento
- **[Como Rodar API](./COMO_RODAR_API.md)** - Instruções específicas da API

---

## 🆘 SUPORTE

Se encontrar problemas durante a instalação:

1. **Verifique os logs** de erro detalhadamente
2. **Consulte a seção** de solução de problemas acima
3. **Execute novamente** o script de instalação
4. **Verifique as versões** das dependências

---

## 📝 NOTAS IMPORTANTES

- ⚠️ **Execute como administrador** no Windows
- ⚠️ **Use ambiente virtual Python** sempre
- ⚠️ **Configure .env** antes de executar
- ⚠️ **Reinicie o terminal** após instalações
- ⚠️ **Verifique firewall** para PostgreSQL remoto

---

**✅ Sistema SIGMA PLI pronto para desenvolvimento e produção!** 🎉
