// Login de cliente
export const loginCliente = async (req, res) => {
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
    // Busca cliente vinculado
    const clienteResult = await pool.query(
      "SELECT * FROM cliente WHERE usuario_id = $1",
      [usuario.id]
    );
    if (clienteResult.rows.length === 0) {
      return res.status(401).json({ message: "Cliente não encontrado" });
    }
    const cliente = clienteResult.rows[0];
    res.status(200).json({ message: "Login realizado com sucesso", usuario, cliente });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: "Erro ao realizar login", error: error.message });
  }
};
import pool from "../database.js";

// Cria usuário e cliente juntos
export const createCliente = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    let {
      nome,
      email,
      senha,
      telefone,
      cpf,
      data_nascimento,
      preferencias,
      status_conta,
    } = req.body;
    // Sempre define status_conta como 'ativo' se não vier do frontend
    if (!status_conta) status_conta = 'ativo';

    // 1. Cria o usuário
    const usuarioResult = await client.query(
      "INSERT INTO usuario (nome, email, senha, telefone) VALUES ($1, $2, $3, $4) RETURNING id",
      [nome, email, senha, telefone]
    );
    const usuario_id = usuarioResult.rows[0].id;

    // 2. Cria o cliente usando o usuario_id
    const clienteResult = await client.query(
      "INSERT INTO cliente (usuario_id, cpf, data_nascimento, preferencias, status_conta) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [usuario_id, cpf, data_nascimento, preferencias, status_conta]
    );

    await client.query("COMMIT");
    res.status(201).json(clienteResult.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(400).json({ message: error.message });
  } finally {
    client.release();
  }
};

// Lista todos os clientes
export const getClientes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, u.nome as usuario_nome, u.email, u.telefone, u.data_cadastro
       FROM cliente c
       JOIN usuario u ON c.usuario_id = u.id`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Busca cliente por ID
export const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT c.*, u.nome as usuario_nome, u.email, u.telefone, u.data_cadastro
       FROM cliente c
       JOIN usuario u ON c.usuario_id = u.id
       WHERE c.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cliente not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Atualiza cliente e usuário
export const updateCliente = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { id } = req.params;
    const {
      nome,
      email,
      senha,
      telefone,
      cpf,
      data_nascimento,
      preferencias,
      status_conta,
    } = req.body;

    // Busca usuario_id do cliente
    const clienteResult = await client.query(
      "SELECT usuario_id FROM cliente WHERE id = $1",
      [id]
    );
    if (clienteResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Cliente not found" });
    }
    const usuario_id = clienteResult.rows[0].usuario_id;

    // Atualiza usuário
    await client.query(
      "UPDATE usuario SET nome = $1, email = $2, senha = $3, telefone = $4 WHERE id = $5",
      [nome, email, senha, telefone, usuario_id]
    );

    // Atualiza cliente
    const result = await client.query(
      "UPDATE cliente SET cpf = $1, data_nascimento = $2, preferencias = $3, status_conta = $4 WHERE id = $5 RETURNING *",
      [cpf, data_nascimento, preferencias, status_conta, id]
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

// Remove cliente e usuário
export const deleteCliente = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { id } = req.params;

    // Busca usuario_id do cliente
    const clienteResult = await client.query(
      "SELECT usuario_id FROM cliente WHERE id = $1",
      [id]
    );
    if (clienteResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Cliente not found" });
    }
    const usuario_id = clienteResult.rows[0].usuario_id;

    // Remove cliente
    await client.query("DELETE FROM cliente WHERE id = $1", [id]);
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
