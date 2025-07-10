# Dockerfile para SIGMA PLI
FROM node:22-alpine AS builder

# Configurar diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Imagem final
FROM node:22-alpine AS runtime

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S sigma -u 1001

# Configurar diretório de trabalho
WORKDIR /app

# Copiar dependências
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/config ./config

# Criar diretórios necessários
RUN mkdir -p logs uploads backups deployments
RUN chown -R sigma:nodejs /app

# Usar usuário não-root
USER sigma

# Expor porta
EXPOSE 3000

# Configurar variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node --version || exit 1

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"]
