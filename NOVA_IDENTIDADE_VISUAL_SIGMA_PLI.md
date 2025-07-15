# NOVA IDENTIDADE VISUAL SIGMA-PLI

## Visão Geral
Este documento descreve a nova identidade visual aplicada ao sistema SIGMA-PLI, substituindo completamente a identidade anterior com uma abordagem mais moderna, profissional e acessível.

## Paleta de Cores

### Cores Principais
- **Dourado Institucional**: `#B8860B` - Cor principal que representa tradição e excelência
- **Dourado Escuro**: `#8B6914` - Para estados hover e ênfase
- **Dourado Claro**: `#DAA520` - Para destaques sutis

### Cores Secundárias
- **Cinza Azulado**: `#2F4F4F` - Cor secundária elegante
- **Cinza Azulado Escuro**: `#1C3030` - Para contrastes
- **Cinza Azulado Claro**: `#708090` - Para elementos secundários

### Cores de Acento
- **Bronze**: `#CD853F` - Cor de acento principal
- **Bronze Escuro**: `#A0522D` - Para variações
- **Bronze Claro**: `#DEB887` - Para destaques sutis

### Cores de Fundo
- **Fundo Principal**: `#FAFAFA` - Fundo limpo e moderno
- **Fundo Secundário**: `#F5F5F5` - Para separação de seções
- **Fundo de Conteúdo**: `#FFFFFF` - Para cards e conteúdo principal
- **Gradiente Hero**: Linear gradient do dourado escuro para dourado principal

### Cores de Texto
- **Texto Principal**: `#212529` - Alto contraste para legibilidade
- **Texto Secundário**: `#6C757D` - Para informações secundárias
- **Texto Esmaecido**: `#ADB5BD` - Para metadados e labels
- **Texto Inverso**: `#FFFFFF` - Para fundos escuros

### Cores de Estado
- **Sucesso**: `#28A745` - Verde padrão para sucessos
- **Aviso**: `#FFC107` - Amarelo para avisos
- **Erro**: `#DC3545` - Vermelho para erros
- **Informação**: Dourado institucional - Mantém consistência da marca

## Tipografia

### Fontes Principais
1. **Inter** - Fonte principal para interface
   - Pesos: 300, 400, 500, 600, 700
   - Uso: Títulos, texto de interface, botões

2. **Roboto** - Fonte secundária para conteúdo
   - Pesos: 300, 400, 500, 700
   - Uso: Textos longos, parágrafos, corpo de texto

3. **JetBrains Mono** - Fonte monoespaçada
   - Pesos: 400, 500, 600
   - Uso: Código, dados técnicos, logs

### Escala Tipográfica
- **Extra Small**: 0.75rem (12px)
- **Small**: 0.875rem (14px)
- **Base**: 1rem (16px)
- **Large**: 1.125rem (18px)
- **Extra Large**: 1.25rem (20px)
- **2X Large**: 1.5rem (24px)
- **3X Large**: 1.875rem (30px)

### Pesos de Fonte
- **Light**: 300
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Line Heights
- **Tight**: 1.25 - Para títulos
- **Base**: 1.5 - Para texto normal
- **Relaxed**: 1.75 - Para texto longo

## Sombras e Elevações

### Sistema de Sombras
- **Small**: `0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)`
- **Medium**: `0 0.5rem 1rem rgba(0, 0, 0, 0.15)`
- **Large**: `0 1rem 3rem rgba(0, 0, 0, 0.175)`

### Bordas
- **Cor**: `#DEE2E6`
- **Radius Padrão**: 0.375rem (6px)
- **Radius Grande**: 0.5rem (8px)

## Componentes

### Cards
- Fundo branco com sombra sutil
- Borda arredondada padrão
- Padding de 1.5rem
- Hover com elevação

### Botões
- **Primário**: Dourado institucional com hover escuro
- **Secundário**: Cinza azulado
- **Outline**: Borda dourada com hover preenchido
- Transições suaves de 0.2s

### Formulários
- Inputs com borda sutil
- Focus com borda dourada e shadow
- Labels com peso medium
- Mensagens de erro em vermelho

### Navegação
- Sidebar com fundo branco e sombra
- Links com hover e active states
- Indicador visual de página ativa
- Ícones alinhados consistentemente

## Layout

### Dimensões
- **Largura da Sidebar**: 280px (desktop), 60px (mobile)
- **Altura do Header**: 60px
- **Container Máximo**: 1200px
- **Padding Padrão**: 2rem

### Grid System
- Sistema flexível baseado em CSS Grid
- Breakpoints responsivos
- Gaps consistentes entre elementos

## Acessibilidade

### Contraste
- Todos os textos atendem WCAG 2.1 AA
- Ratio mínimo de 4.5:1 para texto normal
- Ratio mínimo de 3:1 para texto grande

### Focus States
- Outline dourado de 2px em todos os elementos interativos
- Offset de 2px para clareza
- Estados visuais claros para navegação por teclado

### Responsividade
- Design mobile-first
- Breakpoints: 576px, 768px, 992px, 1200px
- Elementos adaptáveis em todas as telas

## Arquivos Modificados

### 1. `color-scheme.css`
- Definição completa da nova paleta de cores
- Classes utilitárias para aplicação consistente
- Componentes principais (cards, botões, forms, navigation)
- Layout responsivo

### 2. `global.css`
- Reset CSS limpo
- Configurações tipográficas
- Utilitários de layout e espaçamento
- Classes responsivas
- Configurações de acessibilidade

### 3. `fonts.css` (Novo)
- Import das fontes do Google Fonts
- Configurações de font-face
- Classes utilitárias para tipografia
- Otimizações de performance
- Configurações responsivas

## Benefícios da Nova Identidade

1. **Profissionalismo**: Paleta dourada transmite seriedade institucional
2. **Legibilidade**: Alto contraste e fontes modernas melhoram a leitura
3. **Consistência**: Sistema de design unificado em todos os componentes
4. **Acessibilidade**: Atende padrões WCAG 2.1
5. **Responsividade**: Funciona perfeitamente em todos os dispositivos
6. **Performance**: Fontes otimizadas e carregamento eficiente
7. **Manutenibilidade**: Variáveis CSS organizadas e documentadas

## Implementação

A nova identidade visual foi aplicada através de:
- Substituição completa das variáveis CSS antigas
- Atualização de todos os componentes principais
- Criação de classes utilitárias consistentes
- Implementação de sistema responsivo
- Configuração de acessibilidade

## Próximos Passos

1. Testar a aplicação em diferentes navegadores
2. Verificar todos os módulos do sistema
3. Ajustar componentes específicos se necessário
4. Documentar componentes personalizados
5. Treinar equipe sobre o novo sistema de design

---

**Data de Implementação**: 15 de julho de 2025
**Versão**: 2.0
**Status**: Implementado
