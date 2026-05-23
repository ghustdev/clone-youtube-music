# Clone Youtube Music
Implementação do clone do Youtube Music com Java

---

# 🎵 YouTube Music Clone

> Sistema de streaming musical desenvolvido em Java — Projeto de POO 2026

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Requisitos](#requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Como Usar](#como-usar)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Endpoints da API](#endpoints-da-api)
- [Banco de Dados](#banco-de-dados)
- [Atores e Permissões](#atores-e-permissões)
- [Casos de Uso Implementados](#casos-de-uso-implementados)
- [Requisitos Funcionais](#requisitos-funcionais)
- [Requisitos Não Funcionais](#requisitos-não-funcionais)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## Sobre o Projeto

O **YouTube Music Clone** é um sistema de streaming musical desenvolvido como projeto acadêmico da disciplina de Engenharia de Software. O sistema replica as principais funcionalidades da plataforma YouTube Music, permitindo que usuários ouçam músicas via links do YouTube, gerenciem playlists, realizem buscas e recebam recomendações baseadas no histórico de reprodução.

O backend é construído em **Java** com **Spring Boot**, expondo uma API REST consumida por um frontend web simples. As músicas são reproduzidas por meio de links do YouTube, sem necessidade de armazenamento de arquivos de áudio próprios.

---

## Funcionalidades

### Usuário
- ✅ Cadastro e login com e-mail e senha
- ✅ Reprodução de músicas via links do YouTube
- ✅ Controles de player: play, pause, avançar, retroceder, shuffle
- ✅ Barra de progresso com controle de tempo e volume
- ✅ Busca de músicas, artistas, álbuns e playlists
- ✅ Filtros de busca por categoria
- ✅ Criação, edição e exclusão de playlists
- ✅ Adição e remoção de músicas em playlists
- ✅ Fila de reprodução automática baseada no histórico
- ✅ Recomendações baseadas na música atual
- ✅ Histórico de músicas ouvidas

### Administrador
- ✅ CRUD completo de músicas (via links do YouTube)
- ✅ Listagem, criação, atualização e exclusão de músicas
- ✅ Painel administrativo dedicado

---

## Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-----------|
| Backend | Java 21 + Spring Boot 3.x |
| Segurança | Spring Security + JWT |
| Banco de Dados | PostgreSQL (ou MySQL) |
| ORM | Spring Data JPA / Hibernate |
| Build | Maven |
| Frontend | HTML + CSS + JavaScript (Vanilla) |
| Player | YouTube IFrame API |
| Documentação | Swagger / OpenAPI 3 |
| Testes | JUnit 5 + Mockito |
| Versionamento | Git + GitHub |

---

## Arquitetura do Sistema

O projeto segue o padrão **MVC em camadas** com separação clara de responsabilidades:

```
┌─────────────────────────────────────────────┐
│               Frontend (HTML/JS)            │
│          YouTube IFrame API Player          │
└─────────────────┬───────────────────────────┘
                  │ HTTP / REST
┌─────────────────▼───────────────────────────┐
│            Spring Boot (API REST)           │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐ │
│  │Controller│ │ Service  │ │ Repository  │ │
│  └──────────┘ └──────────┘ └──────┬──────┘ │
│         Spring Security + JWT     │        │
└───────────────────────────────────┼────────┘
                                    │ JPA
┌───────────────────────────────────▼────────┐
│              PostgreSQL / MySQL            │
└────────────────────────────────────────────┘
```

---

## Requisitos

### Pré-requisitos de ambiente

- **Java 21** ou superior — [Instalar](https://adoptium.net/)
- **Maven 3.9+** — [Instalar](https://maven.apache.org/)
- **PostgreSQL 15+** (ou MySQL 8+) — [Instalar](https://www.postgresql.org/)
- **Git** — [Instalar](https://git-scm.com/)
- Navegador moderno (Chrome, Firefox, Safari ou Edge)

---

## Instalação e Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/youtube-music-clone.git
cd youtube-music-clone
```

### 2. Configurar o banco de dados

Crie um banco de dados no PostgreSQL:

```sql
CREATE DATABASE youtube_music;
CREATE USER music_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE youtube_music TO music_user;
```

### 3. Configurar as variáveis de ambiente

Edite o arquivo `src/main/resources/application.properties` (ou crie um `.env`):

```properties
# Banco de Dados
spring.datasource.url=jdbc:postgresql://localhost:5432/youtube_music
spring.datasource.username=music_user
spring.datasource.password=sua_senha

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT
jwt.secret=sua_chave_secreta_aqui_minimo_256_bits
jwt.expiration=86400000

# Servidor
server.port=8080
```

### 4. Compilar e executar o backend

```bash
# Compilar
mvn clean install

# Executar
mvn spring-boot:run
```

O servidor estará disponível em: `http://localhost:8080`

### 5. Acessar o frontend

Abra o arquivo `frontend/index.html` diretamente no navegador, ou sirva com qualquer servidor HTTP simples:

```bash
# Usando Python (opcional)
cd frontend
python -m http.server 3000
```

Acesse: `http://localhost:3000`

### 6. Acessar a documentação da API (Swagger)

```
http://localhost:8080/swagger-ui.html
```

---

## Como Usar

### Cadastro e Login

1. Acesse a aplicação no navegador
2. Clique em **"Criar conta"** e preencha nome, e-mail e senha
3. Faça login com suas credenciais
4. Você será redirecionado ao dashboard principal

### Ouvindo Músicas

1. Use a **barra de busca** para encontrar músicas por nome, artista ou álbum
2. Clique em uma música para iniciar a reprodução
3. Use os controles do player (play/pause, avançar, retroceder, shuffle)
4. Ajuste o volume e acompanhe o progresso da faixa

### Gerenciando Playlists

1. Acesse **"Minhas Playlists"** no menu lateral
2. Clique em **"Nova Playlist"**, defina um nome
3. Em qualquer música, clique em **"Adicionar à playlist"**
4. Para editar ou excluir, acesse a playlist e use os botões de ação

### Painel do Administrador

1. Faça login com uma conta de administrador
2. Acesse `/admin` no menu
3. Visualize todas as músicas cadastradas
4. Use os botões **Criar**, **Atualizar** e **Deletar** para gerenciar o catálogo

---

## Estrutura de Pastas

```
youtube-music-clone/
│
├── src/
│   └── main/
│       ├── java/com/youtubemusic/
│       │   ├── config/              # Configurações (Security, JWT, Swagger)
│       │   ├── controller/          # Controladores REST
│       │   │   ├── AuthController.java
│       │   │   ├── MusicController.java
│       │   │   ├── PlaylistController.java
│       │   │   ├── SearchController.java
│       │   │   └── AdminController.java
│       │   ├── dto/                 # Data Transfer Objects
│       │   ├── model/               # Entidades JPA
│       │   │   ├── User.java
│       │   │   ├── Music.java
│       │   │   ├── Playlist.java
│       │   │   └── PlayHistory.java
│       │   ├── repository/          # Interfaces JPA Repository
│       │   ├── service/             # Regras de negócio
│       │   │   ├── AuthService.java
│       │   │   ├── MusicService.java
│       │   │   ├── PlaylistService.java
│       │   │   └── RecommendationService.java
│       │   └── security/            # JWT Filter, UserDetails
│       └── resources/
│           ├── application.properties
│           └── static/              # Assets estáticos (opcional)
│
├── frontend/
│   ├── index.html                   # Página principal
│   ├── login.html                   # Tela de login/cadastro
│   ├── admin.html                   # Painel administrativo
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── api.js                   # Chamadas à API
│       ├── player.js                # YouTube IFrame API
│       ├── auth.js                  # Login/cadastro
│       └── playlist.js              # Gerenciamento de playlists
│
├── src/test/                        # Testes unitários e de integração
├── pom.xml                          # Dependências Maven
└── README.md
```

---

## Endpoints da API

### Autenticação

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|:---:|
| `POST` | `/api/auth/register` | Cadastrar novo usuário | ❌ |
| `POST` | `/api/auth/login` | Realizar login, retorna JWT | ❌ |

### Músicas

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|:---:|
| `GET` | `/api/musics` | Listar todas as músicas | ✅ |
| `GET` | `/api/musics/{id}` | Buscar música por ID | ✅ |
| `GET` | `/api/musics/search?q={termo}` | Buscar músicas por termo | ✅ |
| `POST` | `/api/admin/musics` | Criar nova música (Admin) | ✅ Admin |
| `PUT` | `/api/admin/musics/{id}` | Atualizar música (Admin) | ✅ Admin |
| `DELETE` | `/api/admin/musics/{id}` | Deletar música (Admin) | ✅ Admin |

### Playlists

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|:---:|
| `GET` | `/api/playlists` | Listar playlists do usuário | ✅ |
| `POST` | `/api/playlists` | Criar nova playlist | ✅ |
| `PUT` | `/api/playlists/{id}` | Atualizar playlist | ✅ |
| `DELETE` | `/api/playlists/{id}` | Deletar playlist | ✅ |
| `POST` | `/api/playlists/{id}/musics/{musicId}` | Adicionar música à playlist | ✅ |
| `DELETE` | `/api/playlists/{id}/musics/{musicId}` | Remover música da playlist | ✅ |

### Histórico e Recomendações

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|:---:|
| `GET` | `/api/history` | Histórico de reprodução | ✅ |
| `POST` | `/api/history` | Registrar música ouvida | ✅ |
| `GET` | `/api/recommendations?musicId={id}` | Recomendações pela música atual | ✅ |

### Exemplos de Requisição

**Login:**
```json
POST /api/auth/login
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Criar Música (Admin):**
```json
POST /api/admin/musics
Authorization: Bearer <token>

{
  "title": "Bohemian Rhapsody",
  "artist": "Queen",
  "album": "A Night at the Opera",
  "youtubeUrl": "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
  "duration": 354
}
```

---

## Banco de Dados

### Modelo de Entidades

```
users
├── id (PK)
├── name
├── email (UNIQUE)
├── password_hash
├── role (USER | ADMIN)
└── created_at

musics
├── id (PK)
├── title
├── artist
├── album
├── youtube_url
├── duration_seconds
└── created_at

playlists
├── id (PK)
├── name
├── user_id (FK → users)
└── created_at

playlist_musics
├── playlist_id (FK → playlists)
└── music_id (FK → musics)

play_history
├── id (PK)
├── user_id (FK → users)
├── music_id (FK → musics)
└── played_at
```

---

## Atores e Permissões

| Ator | Descrição | Permissões |
|------|-----------|-----------|
| **Usuário** | Usuário autenticado com conta gratuita | Reproduzir, buscar, gerenciar playlists, ver histórico |
| **Administrador** | Gestor do catálogo musical | Tudo do Usuário + CRUD completo de músicas |

---

## Casos de Uso Implementados

| ID | Nome | Ator | Requisitos |
|----|------|------|------------|
| UC01 | Cadastrar Usuário | Usuário (novo) | RF01 |
| UC02 | Realizar Login | Usuário | RF01 |
| UC03 | Reproduzir Música | Usuário | RF02, RF03, RF04 |
| UC04 | Buscar Música ou Artista | Usuário | RF05, RF06 |
| UC05 | Gerenciar Playlist | Usuário | RF07, RF08 |
| UC06 | CRUD de Músicas | Administrador | RF09 |

---

## Requisitos Funcionais

| ID | Descrição | Prioridade |
|----|-----------|:----------:|
| RF01 | Permitir login e logout da conta do usuário | Média |
| RF02 | Reproduzir faixas musicais em formato de áudio e vídeo | Alta |
| RF03 | Controlar reprodução: play, pause, avançar, retroceder e shuffle | Alta |
| RF04 | Exibir progresso da reprodução com controle de tempo | Alta |
| RF05 | Permitir busca de músicas, artistas, álbuns e playlists | Alta |
| RF06 | Exibir resultados de busca com filtros por categoria | Média |
| RF07 | Criar, editar e excluir playlists personalizadas | Alta |
| RF08 | Adicionar e remover músicas de playlists | Alta |
| RF09 | Criar, editar e excluir músicas por links do YouTube (Admin) | Alta |
| RF10 | Gerar filas de reprodução automáticas baseadas no histórico | Média |
| RF11 | Recomendar músicas com base na música atual | Média |
| RF12 | Controlar volume e qualidade de áudio da reprodução | Média |
| RF13 | Exibir histórico de músicas ouvidas pelo usuário | Média |

---

## Requisitos Não Funcionais

| ID | Categoria | Descrição |
|----|-----------|-----------|
| RNF01 | Desempenho | O sistema deve iniciar a reprodução em no máximo 3 segundos em banda larga |
| RNF02 | Segurança | Senhas armazenadas com hash BCrypt; dados com criptografia AES-256 |
| RNF03 | Usabilidade | Interface responsiva para dispositivos móveis e desktop |
| RNF04 | Escalabilidade | Suporte a até 10 usuários simultâneos |
| RNF05 | Compatibilidade | Funciona nos navegadores Chrome, Firefox, Safari e Edge |

---

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature:
   ```bash
   git checkout -b feature/minha-feature
   ```
3. Commit suas alterações:
   ```bash
   git commit -m "feat: adiciona minha feature"
   ```
4. Push para a branch:
   ```bash
   git push origin feature/minha-feature
   ```
5. Abra um Pull Request

---

## Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

> Projeto acadêmico — Sistemas de Informação 2026
