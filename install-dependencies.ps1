# =====================================================================================
# SIGMA PLI - SCRIPT DE INSTALAÇÃO COMPLETA (Windows PowerShell)
# Sistema de Gestão e Análise de Atas PLI-SP
# =====================================================================================
# Versão: 1.0
# Data: 15 de julho de 2025
# Compatibilidade: Windows 10+, Windows Server 2019+
# =====================================================================================

param(
    [switch]$SkipNodejs,
    [switch]$SkipPython,
    [switch]$SkipDocker,
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"

# Cores para output
$colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Blue"
    Magenta = "Magenta"
    Cyan = "Cyan"
    White = "White"
}

# Funções de log
function Write-LogInfo($message) {
    Write-Host "ℹ️  $message" -ForegroundColor $colors.Blue
}

function Write-LogSuccess($message) {
    Write-Host "✅ $message" -ForegroundColor $colors.Green
}

function Write-LogWarning($message) {
    Write-Host "⚠️  $message" -ForegroundColor $colors.Yellow
}

function Write-LogError($message) {
    Write-Host "❌ $message" -ForegroundColor $colors.Red
}

function Write-LogStep($message) {
    Write-Host "🚀 $message" -ForegroundColor $colors.Magenta
}

# Banner inicial
Write-Host @"
=====================================================================================
🎯 SIGMA PLI - INSTALAÇÃO COMPLETA DE DEPENDÊNCIAS (Windows)
    Sistema de Gestão e Análise de Atas PLI-SP
=====================================================================================
"@ -ForegroundColor $colors.Cyan

# Verificar se executando como administrador
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Verificar se comando existe
function Test-Command($command) {
    try {
        Get-Command $command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Instalar Chocolatey
function Install-Chocolatey {
    Write-LogStep "Verificando Chocolatey..."
    
    if (Test-Command "choco") {
        Write-LogWarning "Chocolatey já está instalado"
        return
    }
    
    Write-LogInfo "Instalando Chocolatey..."
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    
    # Atualizar PATH
    $env:PATH += ";C:\ProgramData\chocolatey\bin"
    
    Write-LogSuccess "Chocolatey instalado com sucesso"
}

# Instalar Git
function Install-Git {
    Write-LogStep "Verificando Git..."
    
    if (Test-Command "git") {
        Write-LogWarning "Git já está instalado"
        return
    }
    
    Write-LogInfo "Instalando Git..."
    choco install git -y
    
    # Atualizar PATH
    refreshenv
    
    Write-LogSuccess "Git instalado"
}

# Instalar Node.js
function Install-NodeJS {
    if ($SkipNodejs) {
        Write-LogWarning "Pulando instalação do Node.js (parâmetro -SkipNodejs)"
        return
    }
    
    Write-LogStep "Verificando Node.js..."
    
    if (Test-Command "node") {
        $nodeVersion = (node --version).Replace('v', '').Split('.')[0]
        if ([int]$nodeVersion -ge 18) {
            Write-LogWarning "Node.js $nodeVersion já instalado e compatível"
            return
        }
    }
    
    Write-LogInfo "Instalando Node.js 18 LTS..."
    choco install nodejs-lts -y --version=18.17.1
    
    # Atualizar PATH
    refreshenv
    
    # Verificar instalação
    $nodeVer = node --version
    $npmVer = npm --version
    Write-LogSuccess "Node.js $nodeVer e npm $npmVer instalados"
    
    # Instalar ferramentas globais
    Write-LogInfo "Instalando ferramentas globais..."
    npm install -g nodemon pm2 webpack-cli eslint prettier npm-check-updates
    
    Write-LogSuccess "Node.js 18 LTS instalado com sucesso"
}

# Instalar Python
function Install-Python {
    if ($SkipPython) {
        Write-LogWarning "Pulando instalação do Python (parâmetro -SkipPython)"
        return
    }
    
    Write-LogStep "Verificando Python..."
    
    if (Test-Command "python") {
        $pythonVersion = (python --version).Split(' ')[1].Split('.')[0..1] -join '.'
        if ([float]$pythonVersion -ge 3.9) {
            Write-LogWarning "Python $pythonVersion já instalado e compatível"
            return
        }
    }
    
    Write-LogInfo "Instalando Python 3.11..."
    choco install python3 -y --version=3.11.5
    
    # Atualizar PATH
    refreshenv
    
    # Verificar instalação
    $pythonVer = python --version
    Write-LogSuccess "Python $pythonVer instalado"
}

# Instalar PostgreSQL
function Install-PostgreSQL {
    Write-LogStep "Verificando PostgreSQL..."
    
    if (Test-Command "psql") {
        Write-LogWarning "PostgreSQL já está instalado"
        return
    }
    
    Write-LogInfo "Instalando PostgreSQL 15..."
    choco install postgresql15 -y --params '/Password:postgres123'
    
    # Atualizar PATH
    refreshenv
    
    Write-LogSuccess "PostgreSQL 15 instalado"
    Write-LogWarning "Senha padrão do postgres: postgres123"
}

# Instalar Docker Desktop
function Install-Docker {
    if ($SkipDocker) {
        Write-LogWarning "Pulando instalação do Docker (parâmetro -SkipDocker)"
        return
    }
    
    Write-LogStep "Verificando Docker..."
    
    if (Test-Command "docker") {
        Write-LogWarning "Docker já está instalado"
        return
    }
    
    Write-LogInfo "Instalando Docker Desktop..."
    choco install docker-desktop -y
    
    Write-LogSuccess "Docker Desktop instalado"
    Write-LogWarning "Reinicie o sistema para completar a instalação do Docker"
}

# Instalar ferramentas de desenvolvimento
function Install-DevTools {
    Write-LogStep "Instalando ferramentas de desenvolvimento..."
    
    $tools = @(
        "vscode",
        "7zip",
        "curl",
        "wget",
        "jq",
        "notepadplusplus"
    )
    
    foreach ($tool in $tools) {
        try {
            Write-LogInfo "Instalando $tool..."
            choco install $tool -y
        }
        catch {
            Write-LogWarning "Erro ao instalar ${tool}: $($_.Exception.Message)"
        }
    }
    
    Write-LogSuccess "Ferramentas de desenvolvimento instaladas"
}

# Criar ambiente virtual Python
function New-PythonVenv {
    Write-LogStep "Criando ambiente virtual Python..."
    
    if (Test-Path "venv_sigma_pli") {
        Write-LogWarning "Ambiente virtual já existe, removendo o antigo..."
        Remove-Item -Path "venv_sigma_pli" -Recurse -Force
    }
    
    python -m venv venv_sigma_pli
    
    # Ativar ambiente virtual
    & ".\venv_sigma_pli\Scripts\Activate.ps1"
    
    # Atualizar pip
    python -m pip install --upgrade pip setuptools wheel
    
    Write-LogSuccess "Ambiente virtual Python criado"
}

# Instalar dependências Python
function Install-PythonDeps {
    Write-LogStep "Instalando dependências Python..."
    
    if (-not (Test-Path "requirements.txt")) {
        Write-LogError "Arquivo requirements.txt não encontrado!"
        return
    }
    
    # Ativar ambiente virtual
    & ".\venv_sigma_pli\Scripts\Activate.ps1"
    
    # Instalar dependências
    pip install -r requirements.txt
    
    # Baixar modelos spaCy
    Write-LogInfo "Baixando modelos spaCy..."
    python -m spacy download pt_core_news_sm
    
    # Baixar dados NLTK
    Write-LogInfo "Baixando dados NLTK..."
    python -c @"
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
"@
    
    deactivate
    Write-LogSuccess "Dependências Python instaladas"
}

# Instalar dependências Node.js
function Install-NodeJSDeps {
    Write-LogStep "Instalando dependências Node.js..."
    
    if (-not (Test-Path "package.json")) {
        Write-LogError "Arquivo package.json não encontrado!"
        return
    }
    
    # Limpar cache npm
    npm cache clean --force
    
    # Instalar dependências
    npm install
    
    # Verificar vulnerabilidades
    try {
        npm audit
    }
    catch {
        Write-LogWarning "Algumas vulnerabilidades encontradas, execute 'npm audit fix' se necessário"
    }
    
    Write-LogSuccess "Dependências Node.js instaladas"
}

# Configurar arquivo .env
function New-EnvFile {
    Write-LogStep "Configurando arquivo de ambiente..."
    
    if (Test-Path ".env") {
        Write-LogWarning "Arquivo .env já existe"
        return
    }
    
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-LogSuccess "Arquivo .env criado a partir de .env.example"
    }
    else {
        Write-LogWarning "Criando arquivo .env básico..."
        $envContent = @"
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
"@
        Set-Content -Path ".env" -Value $envContent -Encoding UTF8
        Write-LogSuccess "Arquivo .env básico criado"
    }
    
    Write-LogWarning "Configure o arquivo .env com suas credenciais antes de executar"
}

# Verificar instalação
function Test-Installation {
    Write-LogStep "Verificando instalação..."
    
    $errors = 0
    
    # Verificar Node.js
    if (Test-Command "node") {
        $nodeVer = node --version
        Write-LogSuccess "Node.js: $nodeVer"
    }
    else {
        Write-LogError "Node.js não encontrado"
        $errors++
    }
    
    # Verificar npm
    if (Test-Command "npm") {
        $npmVer = npm --version
        Write-LogSuccess "npm: $npmVer"
    }
    else {
        Write-LogError "npm não encontrado"
        $errors++
    }
    
    # Verificar Python
    if (Test-Command "python") {
        $pythonVer = python --version
        Write-LogSuccess "Python: $pythonVer"
    }
    else {
        Write-LogError "Python não encontrado"
        $errors++
    }
    
    # Verificar PostgreSQL
    if (Test-Command "psql") {
        try {
            $psqlVer = (psql --version).Split(' ')[2]
            Write-LogSuccess "PostgreSQL: $psqlVer"
        }
        catch {
            Write-LogSuccess "PostgreSQL: Instalado"
        }
    }
    else {
        Write-LogError "PostgreSQL não encontrado"
        $errors++
    }
    
    # Verificar Docker
    if (Test-Command "docker") {
        try {
            $dockerVer = (docker --version).Split(' ')[2].TrimEnd(',')
            Write-LogSuccess "Docker: $dockerVer"
        }
        catch {
            Write-LogWarning "Docker instalado mas pode precisar de reinicialização"
        }
    }
    else {
        Write-LogWarning "Docker não encontrado (opcional)"
    }
    
    # Verificar ambiente virtual Python
    if (Test-Path "venv_sigma_pli") {
        Write-LogSuccess "Ambiente virtual Python: OK"
    }
    else {
        Write-LogError "Ambiente virtual Python não encontrado"
        $errors++
    }
    
    # Verificar dependências Node.js
    if (Test-Path "node_modules") {
        Write-LogSuccess "Dependências Node.js: OK"
    }
    else {
        Write-LogError "Dependências Node.js não instaladas"
        $errors++
    }
    
    # Verificar spaCy
    if (Test-Path "venv_sigma_pli") {
        try {
            & ".\venv_sigma_pli\Scripts\Activate.ps1"
            $spacyTest = python -c "import spacy; nlp = spacy.load('pt_core_news_sm'); print('OK')" 2>$null
            if ($spacyTest -eq "OK") {
                Write-LogSuccess "spaCy modelo português: OK"
            }
            else {
                Write-LogError "spaCy modelo português não encontrado"
                $errors++
            }
            deactivate
        }
        catch {
            Write-LogError "Erro ao verificar spaCy"
            $errors++
        }
    }
    
    return $errors
}

# Função principal
function Main {
    Write-LogInfo "Iniciando instalação completa do SIGMA PLI..."
    
    # Verificar privilégios de administrador
    if (-not (Test-Administrator)) {
        Write-LogError "Este script deve ser executado como Administrador!"
        Write-LogInfo "Clique com botão direito no PowerShell e selecione 'Executar como administrador'"
        exit 1
    }
    
    try {
        # Instalar componentes base
        Install-Chocolatey
        Install-Git
        Install-DevTools
        
        # Instalar componentes principais
        Install-NodeJS
        Install-Python
        Install-PostgreSQL
        Install-Docker
        
        # Configurar Python
        New-PythonVenv
        Install-PythonDeps
        
        # Instalar dependências Node.js
        Install-NodeJSDeps
        
        # Configurações adicionais
        New-EnvFile
        
        # Verificar instalação
        $errors = Test-Installation
        
        if ($errors -eq 0) {
            Write-Host ""
            Write-LogSuccess "🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
            Write-Host ""
            Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor $colors.Cyan
            Write-Host "1. Configurar arquivo .env com suas credenciais"
            Write-Host "2. Executar script SQL no PostgreSQL"
            Write-Host "3. Ativar ambiente Python: .\venv_sigma_pli\Scripts\Activate.ps1"
            Write-Host "4. Iniciar aplicação: npm run dev"
            Write-Host ""
            Write-Host "🔑 COMANDOS ÚTEIS:" -ForegroundColor $colors.Cyan
            Write-Host "   npm run dev           # Modo desenvolvimento"
            Write-Host "   npm run build         # Build para produção"
            Write-Host "   npm test              # Executar testes"
            Write-Host "   docker-compose up     # Executar com Docker"
            Write-Host ""
            Write-Host "✅ Sistema SIGMA PLI pronto para uso!" -ForegroundColor $colors.Green
        }
        else {
            Write-Host ""
            Write-LogError "❌ INSTALAÇÃO CONCLUÍDA COM $errors ERRO(S)!"
            Write-Host "Verifique os erros acima e execute novamente se necessário."
            exit 1
        }
    }
    catch {
        Write-LogError "Erro durante a instalação: $_"
        exit 1
    }
}

# Executar função principal
Main
