const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'DB.sqlite');

class DBManager {
    
    constructor() {
        this.db = new sqlite3.Database(dbPath, (err) => {
            this.montaTabelas();
        });
    }

    montaTabelas() {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS livros (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL UNIQUE,
                preco REAL NOT NULL,
                categoria TEXT NOT NULL
            )
        `, (err) => {
            if (!err) {
                this._popularBancoSeVazio();
            }
        });
    }

    _popularBancoSeVazio() {
        this.db.get("SELECT COUNT(*) as total FROM livros", [], (err, row) => {
            if (row && row.total === 0) {
                
                const livrosIniciais = [
                    ['Livro1', 89.90, 'Fantasia'],
                    ['Livro2', 35.00, 'Distopia'],
                    ['Livro3', 25.50, 'Clássico'],
                    ['Livro4', 19.90, 'Infantil'],
                    ['Livro5', 120.00, 'Tecnologia'],
                    ['Livro6', 75.00, 'Tecnologia'],
                    ['Livro7', 45.00, 'Fantasia'],
                    ['Livro8', 55.00, 'Fantasia'],
                    ['Livro9', 60.00, 'Clássico'],
                    ['Livro10', 29.90, 'Distopia'],
                    ['Livro11', 34.00, 'Autoajuda'],
                    ['Livro12', 65.00, 'História'],
                    ['Livro13', 49.90, 'Autoajuda'],
                    ['Livro14', 70.00, 'Ficção Científica'],
                    ['Livro15', 58.00, 'Ficção Científica'],
                    ['Livro16', 42.00, 'Mistério'],
                    ['Livro17', 39.90, 'Suspense'],
                    ['Livro18', 47.00, 'Terror'],
                    ['Livro19', 52.00, 'Terror'],
                    ['Livro20', 38.00, 'Drama']
                ];

                const stringInsert = this.db.prepare(`INSERT INTO livros (nome, preco, categoria) VALUES (?, ?, ?)`);
                
                livrosIniciais.forEach(livro => {
                    stringInsert.run(livro);
                });

                stringInsert.finalize();
            }
        });
    }

    buscarTodos() {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM livros`, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    buscarPorId(id) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM livros WHERE id = ?`, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    buscarPorNome(nome) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM livros WHERE LOWER(nome) = LOWER(?)`, [nome], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    inserir(nome, preco, categoria) {
        return new Promise((resolve, reject) => {
            this.db.run(
                `INSERT INTO livros (nome, preco, categoria) VALUES (?, ?, ?)`,
                [nome, preco, categoria],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, nome, preco, categoria });
                }
            );
        });
    }

    atualizar(id, nome, preco, categoria) {
        return new Promise((resolve, reject) => {
            this.db.run(
                `UPDATE livros SET nome = ?, preco = ?, categoria = ? WHERE id = ?`,
                [nome, preco, categoria, id],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.changes > 0 ? { id, nome, preco, categoria } : null);
                }
            );
        });
    }

    deletar(id) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM livros WHERE id = ?`, [id], function (err) {
                if (err) reject(err);
                else resolve(this.changes > 0);
            });
        });
    }
}

module.exports = new DBManager();