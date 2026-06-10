# Backend do YouTube Music Clone

Este diretório contém a API backend do projeto, desenvolvida com **Java 21**, **Spring Boot 3.3** e **Maven**.

## Requisitos

- Java 21 instalado
- Banco PostgreSQL em execução
- Porta `8080` livre

## Configuração local

O backend lê a configuração principal por variáveis de ambiente, com estes valores padrão:

- `SERVER_PORT=8080`
- `DATABASE_URL=jdbc:postgresql://localhost:5432/youtube_music`
- `DATABASE_USERNAME=music_user`
- `DATABASE_PASSWORD=devs`
- `JWT_SECRET=dev-only-secret-key-change-me-with-at-least-32-characters`
- `JWT_EXPIRATION_MS=86400000`

Se quiser usar outro banco ou credenciais, defina essas variáveis antes de iniciar a aplicação.

## Como executar localmente

1. Abra um terminal na pasta `backend`.
2. Garanta que o PostgreSQL esteja rodando e que o banco `youtube_music` exista.
3. Se quiser usar os valores padrão do projeto, crie o usuário e o banco com as credenciais abaixo:

```sql
CREATE DATABASE youtube_music;
CREATE USER music_user WITH PASSWORD 'devs';
GRANT ALL PRIVILEGES ON DATABASE youtube_music TO music_user;
```

4. Instale as dependências e inicie a aplicação com o Maven Wrapper:

```bash
./mvnw spring-boot:run
```

5. A API ficará disponível em `http://localhost:8080`.

## Comandos úteis

Gerar o build do projeto:

```bash
./mvnw clean package
```

Executar os testes:

```bash
./mvnw test
```

## Documentação da API

Com a aplicação em execução, acesse o Swagger UI em:

```text
http://localhost:8080/swagger-ui.html
```

## Observações

- O backend já inclui CORS liberado para os endereços locais mais comuns do frontend.
- A aplicação cria ou atualiza a estrutura do banco conforme o valor de `spring.jpa.hibernate.ddl-auto`.
- Se aparecer `password authentication failed for user "music_user"`, o PostgreSQL local não está usando a senha `devs`; ajuste `DATABASE_PASSWORD` ou recrie o usuário com a senha acima.
- Se você estiver no Windows, use `mvnw.cmd` no lugar de `./mvnw`.
