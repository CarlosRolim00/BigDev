// Login de funcionário
export const loginFuncionario = async (req, res) => {
  try {
    const { email, senha } = req.body;
    // Busca usuário pelo email
    const usuarioResult = await pool.query(
      "SELECT * FROM usuario WHERE email = $1",
      [email]
    );
    if (usuarioResult.rows.length === 0) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }
    const usuario = usuarioResult.rows[0];
    if (usuario.senha !== senha) {
      return res.status(401).json({ message: "Senha incorreta" });
    }
    // Busca funcionário vinculado
    const funcionarioResult = await pool.query(
      `SELECT f.*, r.nome as restaurante_nome, r.id as restaurante_id
       FROM funcionario f
       JOIN restaurante r ON f.restaurante_id = r.id
       WHERE f.usuario_id = $1`,
      [usuario.id]
    );
    if (funcionarioResult.rows.length === 0) {
      return res.status(401).json({ message: "Funcionário não encontrado" });
    }
    const funcionario = funcionarioResult.rows[0];
    res.status(200).json({ message: "Login realizado com sucesso", usuario, funcionario, tipo: "funcionario" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao realizar login", error: error.message });
  }
};
import pool from "../database.js";

// Cria usuário e funcionário juntos
export const createFuncionario = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { nome, email, senha, telefone, cpf, cargo, restaurante_id } =
      req.body;

    // 1. Cria o usuário
    const usuarioResult = await client.query(
      "INSERT INTO usuario (nome, email, senha, telefone) VALUES ($1, $2, $3, $4) RETURNING id",
      [nome, email, senha, telefone]
    );
    const usuario_id = usuarioResult.rows[0].id;

    // 2. Cria o funcionário usando o usuario_id
    const funcionarioResult = await client.query(
      "INSERT INTO funcionario (usuario_id, cpf, cargo, restaurante_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [usuario_id, cpf, cargo, restaurante_id]
    );

    await client.query("COMMIT");
    res.status(201).json(funcionarioResult.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(400).json({ message: error.message });
  } finally {
    client.release();
  }
};

// Atualiza funcionário e usuário
export const updateFuncionario = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { id } = req.params;
    const { nome, email, senha, telefone, cargo, salario, status_funcionario } =
      req.body;

    // Busca usuario_id do funcionário
    const funcionarioResult = await client.query(
      "SELECT usuario_id FROM funcionario WHERE id = $1",
      [id]
    );
    if (funcionarioResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Funcionario not found" });
    }
    const usuario_id = funcionarioResult.rows[0].usuario_id;

    // Atualiza usuário
    await client.query(
      "UPDATE usuario SET nome = $1, email = $2, senha = $3, telefone = $4 WHERE id = $5",
      [nome, email, senha, telefone, usuario_id]
    );

    // Atualiza funcionário
    const result = await client.query(
      "UPDATE funcionario SET cargo = $1, salario = $2, status_funcionario = $3 WHERE id = $4 RETURNING *",
      [cargo, salario, status_funcionario, id]
    );

    await client.query("COMMIT");
    res.status(200).json(result.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(400).json({ message: error.message });
  } finally {
    client.release();
  }
};

// Remove funcionário e usuário
export const deleteFuncionario = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { id } = req.params;

    // Busca usuario_id do funcionário
    const funcionarioResult = await client.query(
      "SELECT usuario_id FROM funcionario WHERE id = $1",
      [id]
    );
    if (funcionarioResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Funcionario not found" });
    }
    const usuario_id = funcionarioResult.rows[0].usuario_id;

    // Remove funcionário
    await client.query("DELETE FROM funcionario WHERE id = $1", [id]);
    // Remove usuário
    await client.query("DELETE FROM usuario WHERE id = $1", [usuario_id]);

    await client.query("COMMIT");
    res.status(204).send();
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

// Lista todos os funcionários
export const getFuncionarios = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT f.*, u.nome as usuario_nome, u.email, u.telefone
       FROM funcionario f
       JOIN usuario u ON f.usuario_id = u.id`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Busca funcionário por ID
export const getFuncionarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT f.*, u.nome as usuario_nome, u.email, u.telefone
       FROM funcionario f
       JOIN usuario u ON f.usuario_id = u.id
       WHERE f.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Funcionario not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
