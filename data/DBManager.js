const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'DB.sqlite');


/**
 * Classe responsável por gerenciar a conexão e as operações no banco de dados SQLite.
 * @class DBManager
 */
class DBManager {
    constructor() {
        const self = this;
        self.db = new sqlite3.Database(dbPath);
        
        self.db.serialize(function() {
            self.db.run("PRAGMA foreign_keys = ON");
            self.montaTabelas();
            self._PopularBancoCategoriaSeVazio();
            self._popularBancoLivrosSeVazio();
        });
    }

    /**
     * Inicializa a conexão com o banco de dados SQLite.
     * Ativa as chaves estrangeiras (Foreign Keys) e aciona a criação das tabelas 
     * e a inserção dos dados iniciais caso o banco esteja vazio.
     * @constructor
     */
    montaTabelas() {
        const self = this;
        self.db.run(`
            CREATE TABLE IF NOT EXISTS categorias(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL UNIQUE
            )
        `);

        self.db.run(`
            CREATE TABLE IF NOT EXISTS livros(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL UNIQUE,
                preco REAL NOT NULL,
                categoria_id INTEGER,
                FOREIGN KEY (categoria_id) REFERENCES categorias(id)
            )
        `);

        self.db.run(`
            CREATE TABLE IF NOT EXISTS usuarios(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        `);
    }

    _PopularBancoCategoriaSeVazio() {
        const self = this;
        const categoriasIniciais = [
            ['Ficção científica'],
            ['Romance'],
            ['Acadêmico'],
            ['Futebol']
        ];

        const stringInsert = self.db.prepare("INSERT OR IGNORE INTO categorias (nome) VALUES (?)");

        for (let i = 0; i < categoriasIniciais.length; i++) {
            stringInsert.run(categoriasIniciais[i]);
        }

        stringInsert.finalize();
    }

    _popularBancoLivrosSeVazio() {
        const self = this;
        const livrosIniciais = [
            ['Livro1', 89.90, 1], ['Livro2', 35.00, 1], ['Livro3', 25.50, 1],
            ['Livro4', 19.90, 2], ['Livro5', 120.00, 3], ['Livro6', 75.00, 2],
            ['Livro7', 45.00, 3], ['Livro8', 60.00, 1], ['Livro9', 60.00, 1],
            ['Livro10', 29.90, 2], ['Livro11', 34.00, 1], ['Livro12', 65.00, 1],
            ['Livro13', 49.90, 1], ['Livro14', 70.00, 2], ['Livro15', 58.00, 3],
            ['Livro16', 42.00, 4], ['Livro17', 39.90, 3], ['Livro18', 47.00, 1],
            ['Livro19', 52.00, 2], ['Livro20', 38.00, 3]
        ];

        const stringInsert = self.db.prepare("INSERT OR IGNORE INTO livros (nome, preco, categoria_id) VALUES (?, ?, ?)");
        
        for (let i = 0; i < livrosIniciais.length; i++) {
            stringInsert.run(livrosIniciais[i]);
        }
        
        stringInsert.finalize();
    }

    /**
     * Busca todos os livros cadastrados no banco de dados.
     * Realiza um INNER JOIN com a tabela de categorias para trazer o nome da categoria.
     * * @returns {Promise<Array>} Retorna uma Promise que resolve com um array contendo os livros.
     */
    buscarTodos(nome, limite, offset, ordem) {
        const self = this;
        return new Promise(function(resolve, reject) {
            let sql = "SELECT l.*, c.nome as categoria_nome FROM livros l INNER JOIN categorias c ON l.categoria_id = c.id";
            let params = [];

            if (nome && nome.trim() !== "") {
                sql += " WHERE l.nome LIKE ?";
                params.push(`%${nome}%`);
            }

            const direcao = (ordem && ordem.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';
            sql += ` ORDER BY l.id ${direcao}`; 

            
            sql += " LIMIT ? OFFSET ?";
            params.push(limite, offset);

            self.db.all(sql, params, function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    buscarPorId(id) {
        const self = this;
        return new Promise(function(resolve, reject) {
            const sql = "SELECT l.*, c.nome as categoria_nome FROM livros l INNER JOIN categorias c ON l.categoria_id = c.id WHERE l.id = ?";
            self.db.get(sql, [id], function(err, row) {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    /**
     * Busca um livro específico pelo seu nome.
     * Muito utilizado para validar duplicidade antes de um novo cadastro.
     * @param {string} nome - O nome do livro a ser buscado.
     * @returns {Promise<Object>} Retorna o livro se encontrar, ou undefined se não existir.
     */
    buscarPorNome(nome) {
        const self = this;
        return new Promise(function(resolve, reject) {
            self.db.get("SELECT * FROM livros WHERE nome = ?", [nome], function(err, row) {
                if (err) {
                    reject(err);
                } else {
                    resolve(row); 
                }
            });
        });
    }

    inserir(nome, preco, categoria_id) {
        const self = this;
        return new Promise(function(resolve, reject) {
            self.db.run(`INSERT INTO livros (nome, preco, categoria_id) VALUES (?, ?, ?)`,
                [nome, preco, categoria_id],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ id: this.lastID, nome: nome, preco: preco, categoria_id: categoria_id });
                    }
            });
        });
    }

    atualizar(id, nome, preco, categoria_id) {
        const self = this;
        return new Promise(function(resolve, reject) {
            self.db.run(`UPDATE livros SET nome = ?, preco = ?, categoria_id = ? WHERE id = ?`,
                [nome, preco, categoria_id, id],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        if (this.changes > 0) {
                            resolve({ id: id, nome: nome, preco: preco, categoria_id: categoria_id });
                        } else {
                            resolve(null);
                        }
                    }
            });
        });
    }

    deletar(id) {
        const self = this;
        return new Promise(function(resolve, reject) {
            self.db.run(`DELETE FROM livros WHERE id = ?`, [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        });
    }

    buscarUsuario(username) {
        return new Promise((resolve, reject) => {
            this.db.get("SELECT * FROM usuarios WHERE username = ?", [username], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    inserirUsuario(username, password) {
        return new Promise((resolve, reject) => {
            this.db.run("INSERT INTO usuarios (username, password) VALUES (?, ?)", [username, password], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, username });
            });
        });
    }
}


module.exports = new DBManager();