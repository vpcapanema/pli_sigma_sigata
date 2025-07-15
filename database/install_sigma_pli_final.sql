-- =====================================================================================
-- SIGMA PLI - BANCO DE DADOS COMPLETO E DEFINITIVO
-- Sistema de Gestão e Análise de Atas PLI-SP
-- =====================================================================================
-- Versão: 1.0 Final
-- Data: 15 de julho de 2025
-- Autor: GitHub Copilot
-- Conexão: pli-db.c6j00cu4izbw.us-east-1.rds.amazonaws.com:5432 (pli_db)
-- =====================================================================================

-- =====================================================================================
-- PASSO 1: EXTENSÕES E CONFIGURAÇÕES
-- =====================================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";     -- UUIDs
CREATE EXTENSION IF NOT EXISTS "postgis";       -- Geolocalização
CREATE EXTENSION IF NOT EXISTS "pg_trgm";       -- Busca fuzzy
CREATE EXTENSION IF NOT EXISTS "unaccent";      -- Normalização de texto

-- Criar schemas organizacionais
CREATE SCHEMA IF NOT EXISTS cadastro;           -- Pessoas físicas e jurídicas
CREATE SCHEMA IF NOT EXISTS usuarios;           -- Sistema de usuários e auditoria
CREATE SCHEMA IF NOT EXISTS sigata;             -- Documentos e análises SIGATA

-- =====================================================================================
-- PASSO 2: SCHEMA CADASTRO - GESTÃO DE PESSOAS
-- =====================================================================================

-- TABELA: cadastro.pessoa_juridica
CREATE TABLE IF NOT EXISTS cadastro.pessoa_juridica (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    inscricao_estadual VARCHAR(20),
    inscricao_municipal VARCHAR(20),
    situacao_receita_federal VARCHAR(50) DEFAULT 'ATIVA',
    data_abertura DATE,
    natureza_juridica VARCHAR(100),
    porte_empresa VARCHAR(50),
    regime_tributario VARCHAR(50),
    
    -- Endereço completo
    cep VARCHAR(10),
    logradouro VARCHAR(255),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    pais VARCHAR(50) DEFAULT 'Brasil',
    coordenadas GEOMETRY(POINT, 4326),
    
    -- Contatos
    telefone_principal VARCHAR(20),
    telefone_secundario VARCHAR(20),
    email_principal VARCHAR(255),
    email_secundario VARCHAR(255),
    website VARCHAR(255),
    
    -- Auditoria
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_exclusao TIMESTAMP DEFAULT NULL
);

-- Índices otimizados para pessoa_juridica
CREATE INDEX IF NOT EXISTS idx_pessoa_juridica_cnpj ON cadastro.pessoa_juridica(cnpj);
CREATE INDEX IF NOT EXISTS idx_pessoa_juridica_razao_social ON cadastro.pessoa_juridica(razao_social);
CREATE INDEX IF NOT EXISTS idx_pessoa_juridica_ativo ON cadastro.pessoa_juridica(ativo);
CREATE INDEX IF NOT EXISTS idx_pessoa_juridica_coordenadas ON cadastro.pessoa_juridica USING GIST(coordenadas);

-- TABELA: cadastro.pessoa_fisica
CREATE TABLE IF NOT EXISTS cadastro.pessoa_fisica (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cpf VARCHAR(14) UNIQUE NOT NULL,
    nome_completo VARCHAR(255) NOT NULL,
    nome_social VARCHAR(255),
    data_nascimento DATE,
    sexo VARCHAR(20),
    estado_civil VARCHAR(30),
    nacionalidade VARCHAR(50) DEFAULT 'Brasileira',
    naturalidade VARCHAR(100),
    nome_pai VARCHAR(255),
    nome_mae VARCHAR(255),
    
    -- Documentos pessoais
    rg VARCHAR(20),
    rg_orgao_expedidor VARCHAR(10),
    rg_data_expedicao DATE,
    titulo_eleitor VARCHAR(15),
    zona_eleitoral VARCHAR(10),
    secao_eleitoral VARCHAR(10),
    pis_pasep VARCHAR(15),
    
    -- Endereço completo
    cep VARCHAR(10),
    logradouro VARCHAR(255),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    pais VARCHAR(50) DEFAULT 'Brasil',
    coordenadas GEOMETRY(POINT, 4326),
    
    -- Contatos
    telefone_principal VARCHAR(20),
    telefone_secundario VARCHAR(20),
    email_principal VARCHAR(255),
    email_secundario VARCHAR(255),
    
    -- Dados profissionais
    profissao VARCHAR(100),
    escolaridade VARCHAR(30),
    renda_mensal DECIMAL(12,2),
    
    -- Auditoria
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_exclusao TIMESTAMP DEFAULT NULL
);

-- Constraints de validação para pessoa_fisica
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_pessoa_fisica_sexo') THEN
        ALTER TABLE cadastro.pessoa_fisica 
        ADD CONSTRAINT chk_pessoa_fisica_sexo 
        CHECK (sexo IN ('MASCULINO', 'FEMININO', 'NAO_BINARIO', 'PREFIRO_NAO_INFORMAR'));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_pessoa_fisica_estado_civil') THEN
        ALTER TABLE cadastro.pessoa_fisica 
        ADD CONSTRAINT chk_pessoa_fisica_estado_civil 
        CHECK (estado_civil IN ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL', 'SEPARADO'));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_pessoa_fisica_escolaridade') THEN
        ALTER TABLE cadastro.pessoa_fisica 
        ADD CONSTRAINT chk_pessoa_fisica_escolaridade 
        CHECK (escolaridade IN ('FUNDAMENTAL', 'MEDIO', 'SUPERIOR', 'POS_GRADUACAO', 'MESTRADO', 'DOUTORADO'));
    END IF;
END $$;

-- Índices otimizados para pessoa_fisica
CREATE INDEX IF NOT EXISTS idx_pessoa_fisica_cpf ON cadastro.pessoa_fisica(cpf);
CREATE INDEX IF NOT EXISTS idx_pessoa_fisica_nome ON cadastro.pessoa_fisica(nome_completo);
CREATE INDEX IF NOT EXISTS idx_pessoa_fisica_ativo ON cadastro.pessoa_fisica(ativo);
CREATE INDEX IF NOT EXISTS idx_pessoa_fisica_coordenadas ON cadastro.pessoa_fisica USING GIST(coordenadas);

-- =====================================================================================
-- PASSO 3: SCHEMA USUARIOS - AUTENTICAÇÃO E AUDITORIA
-- =====================================================================================

-- TABELA: usuarios.usuario_sistema
CREATE TABLE IF NOT EXISTS usuarios.usuario_sistema (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(32),
    duplo_fator_habilitado BOOLEAN DEFAULT FALSE,
    duplo_fator_chave_secreta VARCHAR(32),
    
    -- Vinculação exclusiva com pessoas (física OU jurídica)
    pessoa_fisica_id UUID REFERENCES cadastro.pessoa_fisica(id),
    pessoa_juridica_id UUID REFERENCES cadastro.pessoa_juridica(id),
    
    -- Perfil e permissões
    tipo_usuario VARCHAR(20) NOT NULL,
    nivel_acesso INTEGER DEFAULT 1,
    departamento VARCHAR(100),
    cargo VARCHAR(100),
    
    -- Status e controle de acesso
    ativo BOOLEAN DEFAULT TRUE,
    email_verificado BOOLEAN DEFAULT FALSE,
    primeiro_acesso BOOLEAN DEFAULT TRUE,
    data_ultimo_login TIMESTAMP,
    tentativas_login INTEGER DEFAULT 0,
    bloqueado_ate TIMESTAMP,
    
    -- Preferências do usuário
    fuso_horario VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    idioma VARCHAR(5) DEFAULT 'pt-BR',
    tema_interface VARCHAR(20) DEFAULT 'light',
    
    -- Auditoria completa
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    criado_por_id UUID REFERENCES usuarios.usuario_sistema(id),
    atualizado_por_id UUID REFERENCES usuarios.usuario_sistema(id),
    data_exclusao TIMESTAMP DEFAULT NULL
);

-- Constraints de validação para usuario_sistema
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_usuario_tipo') THEN
        ALTER TABLE usuarios.usuario_sistema 
        ADD CONSTRAINT chk_usuario_tipo 
        CHECK (tipo_usuario IN ('ADMIN', 'GESTOR', 'ANALISTA', 'OPERADOR', 'VISUALIZADOR'));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_usuario_nivel_acesso') THEN
        ALTER TABLE usuarios.usuario_sistema 
        ADD CONSTRAINT chk_usuario_nivel_acesso 
        CHECK (nivel_acesso BETWEEN 1 AND 5);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_usuario_vinculacao_exclusiva') THEN
        ALTER TABLE usuarios.usuario_sistema 
        ADD CONSTRAINT chk_usuario_vinculacao_exclusiva 
        CHECK (
            (pessoa_fisica_id IS NOT NULL AND pessoa_juridica_id IS NULL) OR
            (pessoa_fisica_id IS NULL AND pessoa_juridica_id IS NOT NULL)
        );
    END IF;
END $$;

-- Índices otimizados para usuario_sistema
CREATE INDEX IF NOT EXISTS idx_usuario_username ON usuarios.usuario_sistema(username);
CREATE INDEX IF NOT EXISTS idx_usuario_email ON usuarios.usuario_sistema(email);
CREATE INDEX IF NOT EXISTS idx_usuario_tipo ON usuarios.usuario_sistema(tipo_usuario);
CREATE INDEX IF NOT EXISTS idx_usuario_ativo ON usuarios.usuario_sistema(ativo);

-- TABELA: usuarios.usuario_historico_formularios (Sistema de Transparência Total)
CREATE TABLE IF NOT EXISTS usuarios.usuario_historico_formularios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios.usuario_sistema(id),
    
    -- Versionamento completo
    versao_formulario INTEGER NOT NULL,
    tipo_operacao VARCHAR(20) NOT NULL,
    
    -- Snapshot completo dos dados (transparência total)
    formulario_dados_completos JSONB NOT NULL,
    formulario_html_renderizado TEXT,
    
    -- Rastreamento granular de alterações
    campos_alterados JSONB,
    valores_anteriores JSONB,
    valores_novos JSONB,
    
    -- Justificativa obrigatória
    motivo_alteracao TEXT,
    observacoes TEXT,
    
    -- Rastreabilidade completa
    operacao_realizada_por_id UUID NOT NULL REFERENCES usuarios.usuario_sistema(id),
    endereco_ip_operacao INET,
    agente_usuario_operacao TEXT,
    data_operacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Integridade e verificação
    hash_formulario VARCHAR(64),
    hash_verificado BOOLEAN DEFAULT FALSE,
    
    -- Comprovante oficial com validade jurídica
    numero_comprovante VARCHAR(50) UNIQUE,
    comprovante_pdf BYTEA,
    comprovante_html TEXT,
    
    -- Assinatura digital (preparado para certificação)
    assinatura_digital JSONB,
    certificado_digital TEXT,
    
    -- Auditoria
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Constraints para histórico de formulários
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_historico_tipo_operacao') THEN
        ALTER TABLE usuarios.usuario_historico_formularios 
        ADD CONSTRAINT chk_historico_tipo_operacao 
        CHECK (tipo_operacao IN ('CRIACAO', 'ATUALIZACAO', 'EXCLUSAO', 'REATIVACAO'));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uk_usuario_versao') THEN
        ALTER TABLE usuarios.usuario_historico_formularios 
        ADD CONSTRAINT uk_usuario_versao 
        UNIQUE (usuario_id, versao_formulario);
    END IF;
END $$;

-- Índices para auditoria e consulta
CREATE INDEX IF NOT EXISTS idx_historico_usuario ON usuarios.usuario_historico_formularios(usuario_id);
CREATE INDEX IF NOT EXISTS idx_historico_versao ON usuarios.usuario_historico_formularios(usuario_id, versao_formulario);
CREATE INDEX IF NOT EXISTS idx_historico_data ON usuarios.usuario_historico_formularios(data_operacao);
CREATE INDEX IF NOT EXISTS idx_historico_operador ON usuarios.usuario_historico_formularios(operacao_realizada_por_id);
CREATE INDEX IF NOT EXISTS idx_historico_comprovante ON usuarios.usuario_historico_formularios(numero_comprovante);
CREATE INDEX IF NOT EXISTS idx_historico_hash ON usuarios.usuario_historico_formularios(hash_formulario);

-- =====================================================================================
-- PASSO 4: VIEWS DO SCHEMA USUARIOS
-- =====================================================================================

-- View completa de usuários com junção dinâmica pessoa física/jurídica
CREATE OR REPLACE VIEW usuarios.v_usuario_sistema_completo AS
SELECT 
    -- Dados do usuário
    u.id as usuario_id,
    u.username,
    u.email,
    u.tipo_usuario,
    u.nivel_acesso,
    u.departamento,
    u.cargo,
    u.ativo,
    u.email_verificado,
    u.primeiro_acesso,
    u.data_ultimo_login,
    u.tentativas_login,
    u.bloqueado_ate,
    u.fuso_horario,
    u.idioma,
    u.tema_interface,
    u.data_criacao as usuario_criado_em,
    u.data_atualizacao as usuario_atualizado_em,
    
    -- Indicadores de tipo de pessoa
    CASE WHEN u.pessoa_fisica_id IS NOT NULL THEN 'PESSOA_FISICA' 
         WHEN u.pessoa_juridica_id IS NOT NULL THEN 'PESSOA_JURIDICA' 
         ELSE 'NAO_VINCULADO' END as tipo_pessoa,
    
    -- Dados da pessoa física (quando aplicável)
    u.pessoa_fisica_id,
    pf.cpf,
    pf.nome_completo,
    pf.nome_social,
    pf.data_nascimento,
    pf.sexo,
    pf.estado_civil,
    pf.rg,
    pf.rg_orgao_expedidor,
    pf.telefone_principal as pf_telefone_principal,
    pf.telefone_secundario as pf_telefone_secundario,
    pf.email_principal as pf_email_principal,
    pf.email_secundario as pf_email_secundario,
    pf.profissao,
    pf.escolaridade,
    pf.renda_mensal,
    
    -- Endereço pessoa física
    pf.cep as pf_cep,
    pf.logradouro as pf_logradouro,
    pf.numero as pf_numero,
    pf.complemento as pf_complemento,
    pf.bairro as pf_bairro,
    pf.cidade as pf_cidade,
    pf.estado as pf_estado,
    pf.pais as pf_pais,
    pf.coordenadas as pf_coordenadas,
    
    -- Dados da pessoa jurídica (quando aplicável)
    u.pessoa_juridica_id,
    pj.cnpj,
    pj.razao_social,
    pj.nome_fantasia,
    pj.inscricao_estadual,
    pj.inscricao_municipal,
    pj.situacao_receita_federal,
    pj.data_abertura,
    pj.natureza_juridica,
    pj.porte_empresa,
    pj.regime_tributario,
    pj.telefone_principal as pj_telefone_principal,
    pj.telefone_secundario as pj_telefone_secundario,
    pj.email_principal as pj_email_principal,
    pj.email_secundario as pj_email_secundario,
    pj.website,
    
    -- Endereço pessoa jurídica
    pj.cep as pj_cep,
    pj.logradouro as pj_logradouro,
    pj.numero as pj_numero,
    pj.complemento as pj_complemento,
    pj.bairro as pj_bairro,
    pj.cidade as pj_cidade,
    pj.estado as pj_estado,
    pj.pais as pj_pais,
    pj.coordenadas as pj_coordenadas,
    
    -- Campos unificados (dinâmicos baseados no tipo)
    COALESCE(pf.nome_completo, pj.razao_social) as nome_display,
    COALESCE(pf.cpf, pj.cnpj) as documento_principal,
    COALESCE(pf.telefone_principal, pj.telefone_principal) as telefone_display,
    COALESCE(pf.email_principal, pj.email_principal, u.email) as email_display,
    COALESCE(pf.cidade, pj.cidade) as cidade_display,
    COALESCE(pf.estado, pj.estado) as estado_display,
    COALESCE(pf.coordenadas, pj.coordenadas) as coordenadas_display,
    
    -- Dados de auditoria
    criador.username as criado_por_username,
    atualizador.username as atualizado_por_username,
    
    -- Estatísticas do usuário
    (SELECT COUNT(*) 
     FROM sigata.documento_base db 
     WHERE db.usuario_upload_id = u.id AND db.data_exclusao IS NULL
    ) as total_documentos_carregados,
    
    (SELECT COUNT(*) 
     FROM sigata.relatorio_base rb 
     WHERE rb.gerado_por_id = u.id AND rb.data_exclusao IS NULL
    ) as total_relatorios_gerados,
    
    -- Status consolidado
    CASE 
        WHEN u.ativo = false THEN 'INATIVO'
        WHEN u.bloqueado_ate IS NOT NULL AND u.bloqueado_ate > CURRENT_TIMESTAMP THEN 'BLOQUEADO'
        WHEN u.primeiro_acesso = true THEN 'PRIMEIRO_ACESSO'
        WHEN u.email_verificado = false THEN 'EMAIL_NAO_VERIFICADO'
        ELSE 'ATIVO'
    END as status_usuario
    
FROM usuarios.usuario_sistema u
    LEFT JOIN cadastro.pessoa_fisica pf ON u.pessoa_fisica_id = pf.id AND pf.data_exclusao IS NULL
    LEFT JOIN cadastro.pessoa_juridica pj ON u.pessoa_juridica_id = pj.id AND pj.data_exclusao IS NULL
    LEFT JOIN usuarios.usuario_sistema criador ON u.criado_por_id = criador.id
    LEFT JOIN usuarios.usuario_sistema atualizador ON u.atualizado_por_id = atualizador.id
WHERE u.data_exclusao IS NULL;

-- View simplificada para consultas básicas
CREATE OR REPLACE VIEW usuarios.v_usuario_sistema_basico AS
SELECT 
    u.id,
    u.username,
    u.email,
    u.tipo_usuario,
    u.nivel_acesso,
    u.ativo,
    u.data_ultimo_login,
    u.data_criacao,
    
    -- Tipo de pessoa vinculada
    CASE WHEN u.pessoa_fisica_id IS NOT NULL THEN 'PESSOA_FISICA' 
         WHEN u.pessoa_juridica_id IS NOT NULL THEN 'PESSOA_JURIDICA' 
         ELSE 'NAO_VINCULADO' END as tipo_pessoa,
    
    -- Nome/Razão social unificado
    COALESCE(pf.nome_completo, pj.razao_social) as nome_display,
    
    -- Documento unificado 
    COALESCE(pf.cpf, pj.cnpj) as documento_principal,
    
    -- Status consolidado
    CASE 
        WHEN u.ativo = false THEN 'INATIVO'
        WHEN u.bloqueado_ate IS NOT NULL AND u.bloqueado_ate > CURRENT_TIMESTAMP THEN 'BLOQUEADO'
        WHEN u.primeiro_acesso = true THEN 'PRIMEIRO_ACESSO'
        ELSE 'ATIVO'
    END as status_usuario
    
FROM usuarios.usuario_sistema u
    LEFT JOIN cadastro.pessoa_fisica pf ON u.pessoa_fisica_id = pf.id AND pf.data_exclusao IS NULL
    LEFT JOIN cadastro.pessoa_juridica pj ON u.pessoa_juridica_id = pj.id AND pj.data_exclusao IS NULL
WHERE u.data_exclusao IS NULL;

-- =====================================================================================
-- PASSO 5: SCHEMA SIGATA - DOCUMENTOS E ANÁLISES
-- =====================================================================================

-- TABELA: sigata.documento_base (Núcleo do sistema de documentos)
CREATE TABLE IF NOT EXISTS sigata.documento_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_documento VARCHAR(50) UNIQUE NOT NULL,
    tipo_documento VARCHAR(30) NOT NULL,
    subtipo_documento VARCHAR(50),
    categoria VARCHAR(50),
    titulo_documento VARCHAR(255) NOT NULL,
    descricao TEXT,
    palavras_chave TEXT[],
    
    -- Upload e controle
    usuario_upload_id UUID NOT NULL REFERENCES usuarios.usuario_sistema(id),
    data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    endereco_ip_upload INET,
    agente_usuario TEXT,
    
    -- Status de processamento
    status_processamento VARCHAR(20) DEFAULT 'PENDENTE',
    data_inicio_processamento TIMESTAMP,
    data_fim_processamento TIMESTAMP,
    
    -- Auditoria
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_exclusao TIMESTAMP DEFAULT NULL
);

-- Constraints para documento_base
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_documento_tipo') THEN
        ALTER TABLE sigata.documento_base 
        ADD CONSTRAINT chk_documento_tipo 
        CHECK (tipo_documento IN ('ATA', 'RELATORIO', 'CONTRATO', 'OFICIO', 'MEMORANDO', 'OUTROS'));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_documento_status') THEN
        ALTER TABLE sigata.documento_base 
        ADD CONSTRAINT chk_documento_status 
        CHECK (status_processamento IN ('PENDENTE', 'PROCESSANDO', 'CONCLUIDO', 'ERRO', 'REJEITADO'));
    END IF;
END $$;

-- Índices para documento_base
CREATE INDEX IF NOT EXISTS idx_documento_codigo ON sigata.documento_base(codigo_documento);
CREATE INDEX IF NOT EXISTS idx_documento_tipo ON sigata.documento_base(tipo_documento);
CREATE INDEX IF NOT EXISTS idx_documento_status ON sigata.documento_base(status_processamento);
CREATE INDEX IF NOT EXISTS idx_documento_usuario ON sigata.documento_base(usuario_upload_id);
CREATE INDEX IF NOT EXISTS idx_documento_data_upload ON sigata.documento_base(data_upload);

-- TABELA: sigata.documento_arquivo (Gestão de arquivos)
CREATE TABLE IF NOT EXISTS sigata.documento_arquivo (
    documento_id UUID PRIMARY KEY REFERENCES sigata.documento_base(id) ON DELETE CASCADE,
    
    -- Dados do arquivo original
    nome_arquivo_original VARCHAR(500) NOT NULL,
    tamanho_arquivo_bytes BIGINT NOT NULL,
    tipo_mime VARCHAR(100) NOT NULL,
    encoding_arquivo VARCHAR(50),
    hash_arquivo VARCHAR(64) UNIQUE NOT NULL,
    
    -- Armazenamento e localização
    caminho_arquivo_sistema TEXT,
    bucket_s3 VARCHAR(100),
    chave_s3 TEXT,
    url_temporaria TEXT,
    data_expiracao_url TIMESTAMP,
    
    -- Processamento e extração
    arquivo_texto_extraido TEXT,
    metadata_arquivo JSONB,
    thumbnail_base64 TEXT,
    
    -- Backup e versionamento
    backup_realizado BOOLEAN DEFAULT FALSE,
    versao_arquivo INTEGER DEFAULT 1,
    arquivo_pai_id UUID REFERENCES sigata.documento_base(id)
);

-- Índices para documento_arquivo
CREATE INDEX IF NOT EXISTS idx_arquivo_hash ON sigata.documento_arquivo(hash_arquivo);
CREATE INDEX IF NOT EXISTS idx_arquivo_tipo_mime ON sigata.documento_arquivo(tipo_mime);
CREATE INDEX IF NOT EXISTS idx_arquivo_tamanho ON sigata.documento_arquivo(tamanho_arquivo_bytes);

-- TABELA: sigata.documento_nlp_metricas (Métricas de processamento)
CREATE TABLE IF NOT EXISTS sigata.documento_nlp_metricas (
    documento_id UUID PRIMARY KEY REFERENCES sigata.documento_base(id) ON DELETE CASCADE,
    
    -- Métricas de qualidade
    metrica_qualidade_geral DECIMAL(8,6),
    metrica_extracao_texto DECIMAL(8,6),
    metrica_deteccao_idioma DECIMAL(8,6),
    metrica_analise_sentimento DECIMAL(8,6),
    metrica_extracao_entidades DECIMAL(8,6),
    
    -- Estatísticas do texto
    total_caracteres INTEGER,
    total_palavras INTEGER,
    total_paragrafos INTEGER,
    densidade_informacao DECIMAL(8,6),
    complexidade_leitura DECIMAL(8,6),
    
    -- Métricas de performance
    tempo_extracao_texto_ms INTEGER,
    tempo_analise_nlp_ms INTEGER,
    tempo_processamento_total_ms INTEGER,
    memoria_utilizada_mb INTEGER,
    
    -- Palavras-chave extraídas
    nlp_palavras_chave JSONB,
    frequencia_palavras JSONB,
    
    -- Dados do modelo utilizado
    modelo_nlp_utilizado VARCHAR(100),
    versao_modelo VARCHAR(20),
    configuracao_modelo JSONB
);

-- TABELA: sigata.documento_nlp_dados (Resultados do processamento NLP)
CREATE TABLE IF NOT EXISTS sigata.documento_nlp_dados (
    documento_id UUID PRIMARY KEY REFERENCES sigata.documento_base(id) ON DELETE CASCADE,
    
    -- Dados extraídos
    nlp_entidades_extraidas JSONB,
    participantes_extraidos JSONB,
    nlp_resumo_automatico TEXT,
    nlp_palavras_frequentes JSONB,
    decisoes_extraidas JSONB,
    acoes_extraidas JSONB,
    
    -- Vetor de busca (full-text search)
    vetor_busca TSVECTOR
);

-- Índice para busca de texto completo
CREATE INDEX IF NOT EXISTS idx_nlp_vetor_busca ON sigata.documento_nlp_dados USING gin(vetor_busca);

-- TABELA: sigata.documento_ata_dados (Dados específicos de atas)
CREATE TABLE IF NOT EXISTS sigata.documento_ata_dados (
    documento_id UUID PRIMARY KEY REFERENCES sigata.documento_base(id) ON DELETE CASCADE,
    
    -- Informações da reunião
    reuniao_titulo VARCHAR(500),
    reuniao_data DATE,
    reuniao_hora_inicio TIME,
    reuniao_hora_fim TIME,
    reuniao_local VARCHAR(500),
    reuniao_tipo VARCHAR(100),
    reuniao_modalidade VARCHAR(50),
    
    -- Participação
    total_participantes INTEGER DEFAULT 0,
    participantes_presentes JSONB,
    participantes_ausentes JSONB,
    convidados JSONB,
    
    -- Estrutura da ata
    pauta_reuniao JSONB,
    decisoes_tomadas JSONB,
    acoes_definidas JSONB,
    pendencias JSONB,
    proximos_passos JSONB,
    
    -- Validação e aprovação
    ata_aprovada BOOLEAN DEFAULT FALSE,
    data_aprovacao TIMESTAMP,
    aprovada_por JSONB,
    observacoes_aprovacao TEXT
);

-- Constraints para ata_dados
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_ata_modalidade') THEN
        ALTER TABLE sigata.documento_ata_dados 
        ADD CONSTRAINT chk_ata_modalidade 
        CHECK (reuniao_modalidade IN ('PRESENCIAL', 'REMOTA', 'HIBRIDA'));
    END IF;
END $$;

-- Índices para ata_dados
CREATE INDEX IF NOT EXISTS idx_ata_data_reuniao ON sigata.documento_ata_dados(reuniao_data);
CREATE INDEX IF NOT EXISTS idx_ata_local ON sigata.documento_ata_dados(reuniao_local);
CREATE INDEX IF NOT EXISTS idx_ata_aprovada ON sigata.documento_ata_dados(ata_aprovada);
CREATE INDEX IF NOT EXISTS idx_ata_total_participantes ON sigata.documento_ata_dados(total_participantes);

-- TABELA: sigata.documento_qualidade (Controle de qualidade)
CREATE TABLE IF NOT EXISTS sigata.documento_qualidade (
    documento_id UUID PRIMARY KEY REFERENCES sigata.documento_base(id) ON DELETE CASCADE,
    
    -- Validação automática
    validacao_automatica_executada BOOLEAN DEFAULT FALSE,
    pontuacao_qualidade_automatica DECIMAL(8,6),
    problemas_detectados JSONB,
    sugestoes_melhoria JSONB,
    
    -- Validação manual
    validacao_manual_executada BOOLEAN DEFAULT FALSE,
    validador_usuario_id UUID REFERENCES usuarios.usuario_sistema(id),
    data_validacao_manual TIMESTAMP,
    pontuacao_qualidade_manual DECIMAL(8,6),
    comentarios_validador TEXT,
    
    -- Resultado final
    validacao_aprovada BOOLEAN DEFAULT FALSE,
    necessita_revisao BOOLEAN DEFAULT FALSE,
    bloqueado_para_uso BOOLEAN DEFAULT FALSE,
    motivo_bloqueio TEXT
);

-- TABELA: sigata.documento_controle (Controle e metadados)
CREATE TABLE IF NOT EXISTS sigata.documento_controle (
    documento_id UUID PRIMARY KEY REFERENCES sigata.documento_base(id) ON DELETE CASCADE,
    
    -- Controle de acesso
    visibilidade VARCHAR(20) DEFAULT 'PRIVADO',
    compartilhado_com JSONB,
    permissoes_especiais JSONB,
    
    -- Relacionamentos
    documento_pai_id UUID REFERENCES sigata.documento_base(id),
    documentos_relacionados JSONB,
    tags JSONB,
    
    -- Processamento
    prioridade_processamento INTEGER DEFAULT 1,
    tentativas_processamento INTEGER DEFAULT 0,
    ultimo_erro_processamento TEXT,
    
    -- Retenção e arquivamento
    data_retencao DATE,
    politica_retencao VARCHAR(50),
    arquivado BOOLEAN DEFAULT FALSE,
    data_arquivamento TIMESTAMP,
    
    -- Validação
    validado_por_id UUID REFERENCES usuarios.usuario_sistema(id),
    data_validacao TIMESTAMP,
    comentarios_validacao TEXT
);

-- Constraints para documento_controle
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_controle_visibilidade') THEN
        ALTER TABLE sigata.documento_controle 
        ADD CONSTRAINT chk_controle_visibilidade 
        CHECK (visibilidade IN ('PUBLICO', 'PRIVADO', 'RESTRITO'));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_controle_prioridade') THEN
        ALTER TABLE sigata.documento_controle 
        ADD CONSTRAINT chk_controle_prioridade 
        CHECK (prioridade_processamento BETWEEN 1 AND 5);
    END IF;
END $$;

-- Índices para documento_controle
CREATE INDEX IF NOT EXISTS idx_controle_visibilidade ON sigata.documento_controle(visibilidade);
CREATE INDEX IF NOT EXISTS idx_controle_arquivado ON sigata.documento_controle(arquivado);
CREATE INDEX IF NOT EXISTS idx_controle_prioridade ON sigata.documento_controle(prioridade_processamento);

-- =====================================================================================
-- PASSO 6: SISTEMA DE RELATÓRIOS
-- =====================================================================================

-- TABELA: sigata.relatorio_base (Núcleo do sistema de relatórios)
CREATE TABLE IF NOT EXISTS sigata.relatorio_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_relatorio VARCHAR(50) UNIQUE NOT NULL,
    titulo_relatorio VARCHAR(255) NOT NULL,
    descricao TEXT,
    
    -- Período e escopo
    data_inicio_periodo DATE NOT NULL,
    data_fim_periodo DATE NOT NULL,
    tipo_periodo VARCHAR(20),
    escopo_relatorio VARCHAR(30) NOT NULL,
    
    -- Atas incluídas
    atas_incluidas JSONB,
    total_atas_analisadas INTEGER DEFAULT 0,
    filtros_aplicados JSONB,
    
    -- Controle de geração
    gerado_por_id UUID NOT NULL REFERENCES usuarios.usuario_sistema(id),
    data_geracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Auditoria
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_exclusao TIMESTAMP DEFAULT NULL
);

-- Constraints para relatorio_base
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_relatorio_periodo') THEN
        ALTER TABLE sigata.relatorio_base 
        ADD CONSTRAINT chk_relatorio_periodo 
        CHECK (data_inicio_periodo <= data_fim_periodo);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_relatorio_tipo_periodo') THEN
        ALTER TABLE sigata.relatorio_base 
        ADD CONSTRAINT chk_relatorio_tipo_periodo 
        CHECK (tipo_periodo IN ('DIARIO', 'SEMANAL', 'MENSAL', 'TRIMESTRAL', 'ANUAL', 'PERSONALIZADO'));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_relatorio_escopo') THEN
        ALTER TABLE sigata.relatorio_base 
        ADD CONSTRAINT chk_relatorio_escopo 
        CHECK (escopo_relatorio IN ('GERAL', 'POR_CATEGORIA', 'POR_USUARIO', 'POR_TIPO_DOCUMENTO'));
    END IF;
END $$;

-- Índices para relatorio_base
CREATE INDEX IF NOT EXISTS idx_relatorio_codigo ON sigata.relatorio_base(codigo_relatorio);
CREATE INDEX IF NOT EXISTS idx_relatorio_periodo ON sigata.relatorio_base(data_inicio_periodo, data_fim_periodo);
CREATE INDEX IF NOT EXISTS idx_relatorio_gerado_por ON sigata.relatorio_base(gerado_por_id);

-- TABELA: sigata.relatorio_resultados (Resultados consolidados)
CREATE TABLE IF NOT EXISTS sigata.relatorio_resultados (
    relatorio_id UUID PRIMARY KEY REFERENCES sigata.relatorio_base(id) ON DELETE CASCADE,
    
    -- Resumos consolidados
    resumo_geral_periodo TEXT,
    palavras_chave_gerais JSONB,
    resumo_por_topicos JSONB,
    palavras_chave_por_topico JSONB,
    
    -- Análises agregadas
    participantes_mais_ativos JSONB,
    organizacoes_mais_presentes JSONB,
    sentimento_geral_periodo VARCHAR(20),
    distribuicao_sentimentos JSONB,
    decisoes_consolidadas JSONB,
    acoes_consolidadas JSONB,
    locais_mais_utilizados JSONB,
    horarios_preferenciais JSONB,
    
    -- Métricas consolidadas
    qualidade_media_geral DECIMAL(8,6),
    metrica_performance_media DECIMAL(8,6),
    tempo_processamento_total_ms INTEGER
);

-- TABELA: sigata.relatorio_controle (Controle de relatórios)
CREATE TABLE IF NOT EXISTS sigata.relatorio_controle (
    relatorio_id UUID PRIMARY KEY REFERENCES sigata.relatorio_base(id) ON DELETE CASCADE,
    
    -- Geração do relatório
    formato_relatorio VARCHAR(20) DEFAULT 'HTML',
    modelo_utilizado VARCHAR(50),
    relatorio_html TEXT,
    relatorio_dados_brutos JSONB,
    graficos_incluidos JSONB,
    status_geracao VARCHAR(20) DEFAULT 'CONCLUIDO',
    tempo_geracao_ms INTEGER,
    
    -- Agendamento
    relatorio_agendado BOOLEAN DEFAULT FALSE,
    frequencia_agendamento VARCHAR(20),
    proximo_agendamento TIMESTAMP,
    relatorio_pai_id UUID REFERENCES sigata.relatorio_base(id),
    
    -- Compartilhamento
    visibilidade VARCHAR(20) DEFAULT 'PRIVADO',
    compartilhado_com JSONB,
    
    -- Versionamento
    versao_relatorio INTEGER DEFAULT 1
);

-- =====================================================================================
-- PASSO 7: VIEWS DE CONSULTA
-- =====================================================================================

-- View básica de documentos
CREATE OR REPLACE VIEW sigata.v_documentos_basico AS
SELECT 
    db.id,
    db.codigo_documento,
    db.titulo_documento,
    db.tipo_documento,
    db.categoria,
    db.status_processamento,
    db.data_upload,
    da.nome_arquivo_original,
    da.tamanho_arquivo_bytes,
    u.username as carregado_por
FROM sigata.documento_base db
    LEFT JOIN sigata.documento_arquivo da ON db.id = da.documento_id
    LEFT JOIN usuarios.usuario_sistema u ON db.usuario_upload_id = u.id
WHERE db.data_exclusao IS NULL
ORDER BY db.data_upload DESC;

-- View de estatísticas do sistema
CREATE OR REPLACE VIEW sigata.v_stats_basico AS
SELECT 
    (SELECT COUNT(*) FROM usuarios.usuario_sistema WHERE data_exclusao IS NULL AND ativo = true) as usuarios_ativos,
    (SELECT COUNT(*) FROM sigata.documento_base WHERE data_exclusao IS NULL) as total_documentos,
    (SELECT COUNT(*) FROM sigata.documento_base WHERE data_exclusao IS NULL AND tipo_documento = 'ATA') as total_atas,
    (SELECT COUNT(*) FROM sigata.relatorio_base WHERE data_exclusao IS NULL) as total_relatorios,
    CURRENT_TIMESTAMP as atualizado_em;

-- =====================================================================================
-- PASSO 8: FUNÇÕES AUXILIARES
-- =====================================================================================

-- Função para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION update_data_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para gerar números de comprovante únicos
CREATE OR REPLACE FUNCTION gerar_numero_comprovante()
RETURNS TEXT AS $$
DECLARE
    numero TEXT;
    existe BOOLEAN := TRUE;
    counter INTEGER := 0;
BEGIN
    WHILE existe AND counter < 100 LOOP
        numero := 'SIGMA-' || EXTRACT(YEAR FROM CURRENT_DATE)::text || '-' || 
                  LPAD((EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT % 1000000)::text, 6, '0');
        
        SELECT EXISTS(
            SELECT 1 FROM usuarios.usuario_historico_formularios 
            WHERE numero_comprovante = numero
        ) INTO existe;
        
        counter := counter + 1;
    END LOOP;
    
    RETURN numero;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================================
-- PASSO 9: TRIGGERS
-- =====================================================================================

-- Triggers para atualização automática de timestamps
CREATE OR REPLACE TRIGGER trg_update_data_atualizacao_pessoa_fisica
    BEFORE UPDATE ON cadastro.pessoa_fisica
    FOR EACH ROW EXECUTE FUNCTION update_data_atualizacao();

CREATE OR REPLACE TRIGGER trg_update_data_atualizacao_pessoa_juridica
    BEFORE UPDATE ON cadastro.pessoa_juridica
    FOR EACH ROW EXECUTE FUNCTION update_data_atualizacao();

CREATE OR REPLACE TRIGGER trg_update_data_atualizacao_usuario_sistema
    BEFORE UPDATE ON usuarios.usuario_sistema
    FOR EACH ROW EXECUTE FUNCTION update_data_atualizacao();

CREATE OR REPLACE TRIGGER trg_update_data_atualizacao_documento_base
    BEFORE UPDATE ON sigata.documento_base
    FOR EACH ROW EXECUTE FUNCTION update_data_atualizacao();

CREATE OR REPLACE TRIGGER trg_update_data_atualizacao_relatorio_base
    BEFORE UPDATE ON sigata.relatorio_base
    FOR EACH ROW EXECUTE FUNCTION update_data_atualizacao();

-- =====================================================================================
-- PASSO 10: DADOS INICIAIS
-- =====================================================================================

-- Inserir pessoa física para administrador
INSERT INTO cadastro.pessoa_fisica (
    nome_completo, 
    cpf, 
    telefone_principal, 
    data_nascimento,
    email_principal
) VALUES (
    'Administrador SIGMA PLI',
    '00000000000',
    '(11) 99999-9999',
    '1980-01-01',
    'admin@sigma-pli.com.br'
) ON CONFLICT (cpf) DO NOTHING;

-- Inserir usuário administrador do sistema
INSERT INTO usuarios.usuario_sistema (
    username,
    email,
    senha_hash,
    tipo_usuario,
    ativo,
    pessoa_fisica_id
) 
SELECT 
    'admin',
    'admin@sigma-pli.com.br',
    '$2b$12$LQv3c1yqBwJePaLQr3QEAeVjhzBdSzOe8sOxUhP5Hg4LKFkKtMcOu', -- senha: admin123
    'ADMIN',
    true,
    pf.id
FROM cadastro.pessoa_fisica pf 
WHERE pf.cpf = '00000000000'
ON CONFLICT (username) DO NOTHING;

-- =====================================================================================
-- PASSO 11: COMENTÁRIOS DE DOCUMENTAÇÃO
-- =====================================================================================

COMMENT ON VIEW usuarios.v_usuario_sistema_completo IS 'View completa de usuários com junção dinâmica entre pessoa física e jurídica. Inclui todos os campos das tabelas relacionadas e campos unificados para facilitar consultas.';

COMMENT ON VIEW usuarios.v_usuario_sistema_basico IS 'View simplificada de usuários com campos essenciais e status consolidado. Ideal para listagens e consultas rápidas.';

COMMENT ON VIEW sigata.v_documentos_basico IS 'View básica de documentos para listagens e consultas simples.';

COMMENT ON VIEW sigata.v_stats_basico IS 'View de estatísticas básicas do sistema para dashboards.';

-- =====================================================================================
-- PASSO 12: VALIDAÇÃO FINAL
-- =====================================================================================

-- Verificar estrutura criada
SELECT 'Verificando estrutura...' as status;

-- Contar tabelas por schema
SELECT 
    schemaname as schema,
    COUNT(*) as total_tabelas
FROM pg_tables 
WHERE schemaname IN ('cadastro', 'usuarios', 'sigata')
GROUP BY schemaname
ORDER BY schemaname;

-- Verificar usuário admin
SELECT 'Usuário admin:' as info, username, email, tipo_usuario, ativo 
FROM usuarios.usuario_sistema 
WHERE username = 'admin';

-- Testar views principais
SELECT 'Views funcionando:' as info;
SELECT 'Usuários básico:' as view_name, COUNT(*) as registros FROM usuarios.v_usuario_sistema_basico
UNION ALL
SELECT 'Usuários completo:' as view_name, COUNT(*) as registros FROM usuarios.v_usuario_sistema_completo
UNION ALL
SELECT 'Documentos básico:' as view_name, COUNT(*) as registros FROM sigata.v_documentos_basico
UNION ALL
SELECT 'Stats básico:' as view_name, usuarios_ativos as registros FROM sigata.v_stats_basico;

-- =====================================================================================
-- FINALIZAÇÃO
-- =====================================================================================

SELECT '========================================================================================' as linha;
SELECT 'SIGMA PLI - INSTALAÇÃO COMPLETA FINALIZADA COM SUCESSO!' as status_final;
SELECT 'Data/Hora: ' || CURRENT_TIMESTAMP as timestamp_instalacao;
SELECT '========================================================================================' as linha;
SELECT '' as espaco;
SELECT 'ESTRUTURA CRIADA:' as titulo;
SELECT '- 3 Schemas: cadastro, usuarios, sigata' as item;
SELECT '- 14 Tabelas principais' as item;
SELECT '- Sistema completo de auditoria e transparência' as item;
SELECT '- Views dinâmicas com junção automática' as item;
SELECT '- Triggers automáticos para timestamps' as item;
SELECT '- Funções auxiliares para integridade' as item;
SELECT '- Usuário admin criado (login: admin / senha: admin123)' as item;
SELECT '' as espaco;
SELECT 'CREDENCIAIS DE ACESSO:' as titulo;
SELECT 'Host: pli-db.c6j00cu4izbw.us-east-1.rds.amazonaws.com:5432' as credential;
SELECT 'Database: pli_db' as credential;
SELECT 'Login Admin: admin / admin123' as credential;
SELECT '' as espaco;
SELECT 'Sistema pronto para uso!' as conclusao;
