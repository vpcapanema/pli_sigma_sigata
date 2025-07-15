# GUIA DE USO - NOVA IDENTIDADE VISUAL SIGMA-PLI

## Como Aplicar a Nova Identidade Visual

### 1. Importação dos Arquivos CSS

Para usar a nova identidade visual, importe os arquivos CSS na seguinte ordem:

```html
<!-- Fontes -->
<link href="/src/shared/css/fonts.css" rel="stylesheet">

<!-- Esquema de Cores e Componentes -->
<link href="/src/shared/css/color-scheme.css" rel="stylesheet">

<!-- Estilos Globais e Utilitários -->
<link href="/src/shared/css/global.css" rel="stylesheet">
```

### 2. Estrutura HTML Recomendada

Use a estrutura base para layouts consistentes:

```html
<body class="sigma-layout">
    <div class="sigma-container">
        <nav class="sigma-sidebar">
            <!-- Navegação -->
        </nav>
        
        <main class="sigma-main-content">
            <header class="sigma-header">
                <!-- Cabeçalho -->
            </header>
            
            <div class="sigma-content">
                <!-- Conteúdo principal -->
            </div>
        </main>
    </div>
</body>
```

### 3. Classes de Cores Disponíveis

#### Cores de Texto
- `.text-primary` - Texto principal (cinza escuro)
- `.text-secondary` - Texto secundário (cinza médio)
- `.text-muted` - Texto esmaecido (cinza claro)
- `.text-brand` - Texto na cor da marca (dourado)
- `.text-brand-dark` - Texto dourado escuro
- `.text-inverse` - Texto branco

#### Cores de Fundo
- `.bg-primary` - Fundo principal (branco/cinza muito claro)
- `.bg-secondary` - Fundo secundário (cinza claro)
- `.bg-content` - Fundo de conteúdo (branco)
- `.bg-brand` - Fundo na cor da marca (dourado)

#### Cores de Estado
- `.text-success` / `.bg-success` - Verde para sucesso
- `.text-warning` / `.bg-warning` - Amarelo para avisos
- `.text-danger` / `.bg-danger` - Vermelho para erros
- `.text-info` / `.bg-info` - Dourado para informações

### 4. Componentes Principais

#### Cards
```html
<div class="sigma-card">
    <div class="sigma-card-header">
        <i class="fas fa-icon"></i> Título do Card
    </div>
    <div class="card-body">
        Conteúdo do card
    </div>
</div>
```

#### Botões
```html
<button class="sigma-btn sigma-btn-primary">Primário</button>
<button class="sigma-btn sigma-btn-secondary">Secundário</button>
<button class="sigma-btn sigma-btn-outline">Outline</button>
```

#### Formulários
```html
<div class="form-group">
    <label class="form-label">Nome do Campo</label>
    <input type="text" class="sigma-form-control" placeholder="Placeholder">
</div>
```

#### Navegação
```html
<nav class="sigma-sidebar">
    <div class="sigma-nav">
        <a href="#" class="sigma-nav-link active">
            <i class="fas fa-home"></i>
            <span>Dashboard</span>
        </a>
        <a href="#" class="sigma-nav-link">
            <i class="fas fa-users"></i>
            <span>Usuários</span>
        </a>
    </div>
</nav>
```

### 5. Tipografia

#### Famílias de Fonte
- **Inter**: Fonte principal para interface (variável: `--font-family-primary`)
- **Roboto**: Fonte secundária para conteúdo (variável: `--font-family-secondary`)
- **JetBrains Mono**: Fonte monoespaçada para código (variável: `--font-family-mono`)

#### Classes de Tipografia
```html
<!-- Famílias -->
<p class="font-inter">Texto com Inter</p>
<p class="font-roboto">Texto com Roboto</p>
<p class="font-mono">Texto monoespaçado</p>

<!-- Pesos -->
<p class="font-light">Texto leve (300)</p>
<p class="font-regular">Texto normal (400)</p>
<p class="font-medium">Texto médio (500)</p>
<p class="font-semibold">Texto semi-negrito (600)</p>
<p class="font-bold">Texto negrito (700)</p>

<!-- Tamanhos -->
<p class="font-size-xs">Extra pequeno</p>
<p class="font-size-sm">Pequeno</p>
<p class="font-size-base">Base</p>
<p class="font-size-lg">Grande</p>
<p class="font-size-xl">Extra grande</p>
```

### 6. Sistema de Espaçamento

Use as classes utilitárias para espaçamento consistente:

```html
<!-- Margens -->
<div class="m-0">Sem margem</div>
<div class="m-1">Margem pequena (0.25rem)</div>
<div class="m-2">Margem normal (0.5rem)</div>
<div class="m-3">Margem média (1rem)</div>
<div class="m-4">Margem grande (1.5rem)</div>
<div class="m-5">Margem extra grande (3rem)</div>

<!-- Margens específicas -->
<div class="mt-3">Margem superior</div>
<div class="mb-3">Margem inferior</div>
<div class="ml-3">Margem esquerda</div>
<div class="mr-3">Margem direita</div>

<!-- Padding -->
<div class="p-3">Padding médio</div>
<div class="pt-2">Padding superior</div>
<div class="pb-2">Padding inferior</div>
```

### 7. Responsividade

O sistema é mobile-first. Use as classes responsivas:

```html
<!-- Display responsivo -->
<div class="d-none d-md-block">Visível apenas em desktop</div>
<div class="d-block d-md-none">Visível apenas em mobile</div>

<!-- Flex responsivo -->
<div class="d-flex d-md-inline-flex">Flex em mobile, inline-flex em desktop</div>
```

### 8. Variáveis CSS Disponíveis

Use as variáveis CSS para manter consistência:

```css
/* Cores principais */
var(--primary-color)        /* #B8860B - Dourado */
var(--primary-dark)         /* #8B6914 - Dourado escuro */
var(--primary-light)        /* #DAA520 - Dourado claro */

/* Cores secundárias */
var(--secondary-color)      /* #2F4F4F - Cinza azulado */
var(--accent-color)         /* #CD853F - Bronze */

/* Cores de fundo */
var(--bg-primary)           /* #FAFAFA - Fundo principal */
var(--bg-secondary)         /* #F5F5F5 - Fundo secundário */
var(--bg-content)           /* #FFFFFF - Fundo de conteúdo */

/* Cores de texto */
var(--text-primary)         /* #212529 - Texto principal */
var(--text-secondary)       /* #6C757D - Texto secundário */
var(--text-muted)           /* #ADB5BD - Texto esmaecido */

/* Sombras */
var(--shadow-sm)            /* Sombra pequena */
var(--shadow)               /* Sombra média */
var(--shadow-lg)            /* Sombra grande */

/* Bordas */
var(--border-color)         /* Cor da borda */
var(--border-radius)        /* Raio de borda padrão */
var(--border-radius-lg)     /* Raio de borda grande */
```

### 9. Boas Práticas

1. **Sempre use as variáveis CSS** em vez de valores fixos
2. **Mantenha a hierarquia de cores** (primária > secundária > acento)
3. **Use as classes utilitárias** em vez de CSS customizado quando possível
4. **Teste em diferentes dispositivos** para garantir responsividade
5. **Mantenha acessibilidade** usando contrastes adequados

### 10. Migração de Código Existente

Para migrar código existente:

1. Substitua cores antigas pelas novas variáveis
2. Atualize classes de componentes (`btn` → `sigma-btn`)
3. Use a nova estrutura de layout
4. Teste funcionalidade em diferentes telas

### 11. Arquivo de Exemplo

Consulte `exemplo_nova_identidade_visual.html` para ver todos os componentes em ação.

---

**Documentação criada em**: 15 de julho de 2025  
**Versão**: 1.0  
**Equipe**: Desenvolvimento SIGMA-PLI
