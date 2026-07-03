# Backend — YouTube Music Clone

API REST desenvolvida com **Java 21**, **Spring Boot 3.3** e **Maven**.

## Requisitos

- Java 21
- PostgreSQL em execução
- Porta `8080` livre

## Configuração do banco

Crie o banco e o usuário no PostgreSQL:

```sql
CREATE DATABASE youtube_music;
CREATE USER music_user WITH PASSWORD 'devs';
GRANT ALL PRIVILEGES ON DATABASE youtube_music TO music_user;
```

## Executando localmente

```bash
./mvnw spring-boot:run
```

A API ficará disponível em `http://localhost:8080`.

> No Windows use `mvnw.cmd` no lugar de `./mvnw`.

## Usuário admin padrão

Na primeira execução, a aplicação cria automaticamente um usuário administrador com as credenciais abaixo (seed automático):

| Campo | Valor padrão |
|-------|-------------|
| Nome  | `Exemplo` |
| E-mail | `admin@exemplo.local` |
| Senha | `exemplo` |

## Variáveis de ambiente

Todas as configurações possuem valores padrão e só precisam ser definidas se você quiser sobrescrever algo.

| Variável | Padrão |
|----------|--------|
| `SERVER_PORT` | `8080` |
| `JWT_SECRET` | `dev-only-secret-key-change-me-with-at-least-32-characters` |
| `JWT_EXPIRATION_MS` | `86400000` (24 h) |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000`, `http://localhost:5173` e variantes `127.0.0.1` |
| `SEED_ENABLED` | `true` |
| `ADMIN_NAME` | `Exemplo` |
| `ADMIN_EMAIL` | `admin@exemplo.local` |
| `ADMIN_PASSWORD` | `exemplo` |
| `JPA_DDL_AUTO` | `update` |
| `JPA_SHOW_SQL` | `false` |

## Comandos úteis

```bash
# Build
./mvnw clean package

# Testes
./mvnw test
```

## Documentação da API

Com a aplicação rodando, acesse o Swagger UI em:

```
http://localhost:8080/swagger-ui.html
```

## Observações

- Se aparecer `password authentication failed for user "music_user"`, recrie o usuário com a senha `devs` ou defina `DATABASE_PASSWORD` com a senha correta.
- Para desabilitar o seed do admin em produção, defina `SEED_ENABLED=false`.
- Em produção, substitua `JWT_SECRET` por uma chave forte com pelo menos 32 caracteres.
