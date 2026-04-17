# 📚 Projeto Final - API RESTful de Livros

Este é o projeto final desenvolvido para a disciplina de backend (2º ano). Trata-se de uma API RESTful completa para gerenciamento de um catálogo de livros, utilizando **Node.js, Express e SQLite**.

## 🎯 Requisitos do Projeto (Checklist do Professor)

Abaixo estão em destaque todos os requisitos exigidos para a entrega (16/04) e como foram implementados:

- [x] **Tema livre:** Escolhido o tema de **Livros** e Categorias.
- [x] **CRUD 100% com SQLite:** Operações de Create, Read, Update e Delete totalmente funcionais nas rotas de livros.
- [x] **Filtros, ordenação e paginação:** Implementados na rota `GET /api/livros` (ex: `?nome=Livro&pagina=1&limite=5&ordem=DESC`).
- [x] **Validações robustas:** Utilização da biblioteca **Joi** para garantir que os dados enviados (body) e IDs (parâmetros da URL) sejam válidos.
- [x] **Status codes corretos:** Retornos precisos como `201 Created`, `204 No Content`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found` e `409 Conflict`.
- [x] **Mínimo 20 registros no banco:** O arquivo `DBManager.js` popula automaticamente o banco de dados com 4 categorias e 20 livros na primeira execução.
- [x] **README.md completo:** Este próprio arquivo.
- [x] **Collection Postman:** Exportada e disponível na raiz do projeto (`APIREST.postman_collection.json`).
- [x] **Exemplos de todas as rotas:** Documentados abaixo neste README.
- [x] **Instruções de instalação:** Passo a passo detalhado abaixo.
- [x] **Autenticação JWT:** Sistema de login e registro gerando tokens JWT válidos por 1 hora. Rotas de livros protegidas por middleware.
- [x] **Relacionamentos (JOINs):** Busca de livros realiza um `INNER JOIN` com a tabela de categorias para trazer o nome real da categoria.
- [ ] **Testes automatizados:** *(Atenção: Adicione aqui o comando dos testes caso tenha implementado, ex: `npm test`)*
- [ ] **Deploy:** O projeto está no ar! Acesse: **[COLOQUE_SEU_LINK_DO_RENDER_OU_RAILWAY_AQUI]**

---

## 📂 Arquitetura de Pastas

O projeto adota uma arquitetura em camadas (Controllers, Services, Data, Schemas) para facilitar a manutenção e separar responsabilidades.

```text
📦 APIEXPRESSCOMPLETA
 ┣ 📂 API
 ┃ ┣ 📂 controllers       # Controladores (recebem as requisições e enviam respostas)
 ┃ ┃ ┣ 📜 auth-controller.js
 ┃ ┃ ┗ 📜 livro-controller.js
 ┃ ┣ 📂 core              # Middlewares e configuração de Rotas principais
 ┃ ┃ ┣ 📜 auth-middleware.js
 ┃ ┃ ┗ 📜 rotas.js
 ┃ ┣ 📂 schemas           # Validações Joi para os dados de entrada
 ┃ ┃ ┣ 📜 auth-schema.js
 ┃ ┃ ┗ 📜 livro-schemas.js
 ┃ ┣ 📂 services          # Regras de negócio da aplicação
 ┃ ┃ ┣ 📜 auth-service.js
 ┃ ┃ ┗ 📜 livro-service.js
 ┃ ┗ 📂 data              # Gerenciamento e persistência do Banco de Dados
 ┃   ┣ 📜 DB.sqlite       # Banco de dados (gerado automaticamente)
 ┃   ┗ 📜 DBManager.js    # Conexão, criação de tabelas e auto-população
 ┣ 📜 index.js            # Ponto de entrada da aplicação Express
 ┣ 📜 package.json        # Dependências do projeto
 ┗ 📜 APIREST.postman_collection.json # Collection para importar no Postman

🚀 Instruções de Instalação e Execução
Siga os passos abaixo para rodar a API localmente na sua máquina:

Clone o repositório (ou extraia os arquivos zipados).

Abra o terminal na pasta raiz do projeto.

Instale as dependências executando o comando:

npm install

Inicie o servidor rodando:
npm start
# ou
node index.js

Pronto! O console exibirá: Servidor on: http://localhost:3000/api/livros. Na primeira execução, o arquivo DB.sqlite será criado automaticamente e populado com 20 registros.

🛣️ Rotas da API e Exemplos
🔐 1. Autenticação (Rotas Públicas)
Registrar Novo Usuário

Rota: POST /api/registrar

Body JSON:

JSON
{
  "username": "aluno2ano",
  "password": "minhasenha123"
}
Fazer Login (Gera o Token JWT)

Rota: POST /api/login

Body JSON:

JSON
{
  "username": "aluno2ano",
  "password": "minhasenha123"
}
Retorno: { "token": "eyJhbGciOiJIUzI1NiIs..." }

📖 2. Gerenciamento de Livros (Rotas Protegidas)
Atenção: Todas as rotas abaixo exigem o Header Authorization: Bearer <seu_token> gerado no login.

Listar Livros (Com Paginação, Filtros e JOIN)

Rota: GET /api/livros

Query Params Suportados:

?nome=Harry (Filtra pelo nome)

?pagina=1&limite=10 (Paginação)

?ordem=DESC (Ordenação por ID, aceita ASC ou DESC)

Exemplo de URL completa: GET /api/livros?limite=5&pagina=1&ordem=DESC

Buscar Livro por ID

Rota: GET /api/livros/:id

Exemplo: GET /api/livros/5

Criar Novo Livro

Rota: POST /api/livros

Body JSON:

JSON
{
  "nome": "O Senhor dos Anéis",
  "preco": 120.50,
  "categoria_id": 1
}
(Categorias válidas: 1: Ficção científica, 2: Romance, 3: Acadêmico, 4: Futebol)

Atualizar um Livro Existente

Rota: PUT /api/livros/:id

Body JSON: (Permite enviar apenas os campos que deseja alterar)

JSON
{
  "preco": 99.90
}
Deletar um Livro

Rota: DELETE /api/livros/:id

Retorna: 204 No Content em caso de sucesso.

🛠️ Tecnologias Utilizadas
Node.js com Express (Roteamento e Servidor Web)

SQLite3 (Banco de Dados relacional, rápido e local)

JsonWebToken (JWT) (Segurança e controle de sessão)

Bcrypt.js (Criptografia avançada de senhas)

Joi (Validações restritas dos dados da requisição)
