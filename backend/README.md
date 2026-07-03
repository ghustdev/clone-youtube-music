# Backend do YouTube Music Clone

Este diretório contém a API backend do projeto, desenvolvida com **Java 21**, **Spring Boot 3.3** e **Maven**.

## Requisitos

- Java 21 instalado
- Docker e Docker Compose instalados para subir o PostgreSQL
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
2. Suba o PostgreSQL com Docker Compose:

```bash
docker compose up -d postgres
```

3. Se quiser acompanhar a inicialização do banco, use:

```bash
docker compose ps
docker compose logs -f postgres
```

4. Inicie a aplicação apontando para o banco do Docker:

```bash
DATABASE_URL=jdbc:postgresql://localhost:5433/youtube_music ./mvnw spring-boot:run
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
- O container usa o volume nomeado `youtube_music_postgres_data`, então os dados persistem mesmo se você remover o container.
- Depois de reiniciar a máquina, basta rodar `docker compose up -d postgres` de novo; não é preciso recriar banco nem usuário.
- Esse compose usa a porta `5433` porque já existe outro PostgreSQL ocupando `5432` neste ambiente.
- Se você estiver no Windows, use `mvnw.cmd` no lugar de `./mvnw`.
