# Hierarquização de Usuários - SIGMA PLI

## Estrutura de Papéis (Roles)

- **admin**: Administrador do sistema, acesso total.
- **manager**: Gestor, acesso amplo a módulos sob sua responsabilidade.
- **user**: Usuário operacional, acesso às funções do dia a dia.
- **viewer**: Visualizador, acesso somente leitura.
- **guest**: Convidado, acesso restrito.

## Tabela: `usuarios_sistema`

| Coluna            | Tipo           | Descrição                                             |
|-------------------|----------------|-------------------------------------------------------|
| id                | SERIAL (PK)    | Identificador único do usuário                        |
| nome              | VARCHAR(100)   | Nome de exibição do usuário                           |
| email             | VARCHAR(100)   | E-mail único do usuário                               |
| senha_hash        | VARCHAR(255)   | Hash da senha                                         |
| papel             | VARCHAR(20)    | Papel do usuário (admin, manager, user, viewer, guest)|
| status            | VARCHAR(20)    | Status do usuário (ativo, inativo, bloqueado, etc)    |
| pessoa_fisica_id  | INTEGER (FK)   | Chave estrangeira para pessoa física                  |
| criado_em         | TIMESTAMP      | Data/hora de criação                                  |

## Tabela: `pessoas_fisicas`

| Coluna           | Tipo         | Descrição                        |
|------------------|--------------|----------------------------------|
| id               | SERIAL (PK)  | Identificador único              |
| nome_completo    | VARCHAR(150) | Nome completo                    |
| cpf              | VARCHAR(14)  | CPF único                        |
| data_nascimento  | DATE         | Data de nascimento               |
| endereco         | TEXT         | Endereço completo                |
| criado_em        | TIMESTAMP    | Data/hora de criação             |

## Exemplo de SQL (PostgreSQL)

```sql
CREATE TABLE pessoas_fisicas (
    id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    data_nascimento DATE,
    endereco TEXT,
    criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE usuarios_sistema (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    papel VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ativo',
    pessoa_fisica_id INTEGER NOT NULL REFERENCES pessoas_fisicas(id),
    criado_em TIMESTAMP DEFAULT NOW()
);
```

## Observações
- Todo usuário deve estar vinculado a uma pessoa física.
- Permissões e acessos são definidos pelo campo `papel`.
- A tabela de pessoas físicas pode ser expandida para incluir mais dados pessoais e de contato.
