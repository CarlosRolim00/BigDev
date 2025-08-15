// Modelo para usuário master
import pool from '../database.js';


// Exemplo de função para inserir um usuário master
export async function insertMasterUsuario({ nome, email, senha, telefone }) {
  const result = await pool.query(
    'INSERT INTO master_usuario (nome, email, senha, telefone) VALUES ($1, $2, $3, $4) RETURNING *',
    [nome, email, senha, telefone]
  );
  return result.rows[0];
}

// Exemplo de função para buscar usuário master por email
export async function getMasterUsuarioByEmail(email) {
  const result = await pool.query(
    'SELECT * FROM master_usuario WHERE email = $1',
    [email]
  );
  return result.rows[0];
}
