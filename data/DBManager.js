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
        `);
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