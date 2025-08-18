console.log('clienteController carregado e pronto para receber requisições');
// Buscar cliente pelo id do usuário
export const getClienteByUsuarioId = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const result = await pool.query(
      "SELECT * FROM cliente WHERE usuario_id = $1",
      [usuario_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar cliente", error: error.message });
  }
};
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
      preferencias = null,
      status_conta = 'ativo',
    } = req.body;

    // 1. Cria o usuário
    const usuarioResult = await client.query(
      "INSERT INTO usuario (nome, email, senha, telefone) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, telefone",
      [nome, email, senha, telefone]
    );
    const usuario = usuarioResult.rows[0];
    const usuario_id = usuario.id;

    // 2. Cria o cliente usando o usuario_id
    const clienteResult = await client.query(
      "INSERT INTO cliente (usuario_id, preferencias, status_conta) VALUES ($1, $2, $3) RETURNING *",
      [usuario_id, preferencias, status_conta]
    );
    const cliente = clienteResult.rows[0];

    await client.query("COMMIT");
    res.status(201).json({ usuario, cliente });
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
      `SELECT c.*, u.nome as usuario_nome, u.email, u.telefone, u.data_cadastro, u.senha
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
  let { id } = req.params;
  id = parseInt(id, 10);
  console.log('ID recebido no updateCliente:', id);
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
      preferencias = null,
      status_conta = null,
    } = req.body;

    // LOG: payload recebido
    console.log('--- updateCliente ---');
    console.log('ID param:', id);
    console.log('Payload recebido:', req.body);

    // Busca usuario_id do cliente
    const clienteResult = await client.query(
      "SELECT usuario_id FROM cliente WHERE id = $1",
      [id]
    );
    console.log('Resultado da query cliente:', clienteResult.rows);
    if (clienteResult.rows.length === 0) {
      console.log('Nenhum cliente encontrado para id:', id);
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Cliente not found" });
    }
    const usuario_id = clienteResult.rows[0].usuario_id;

    // LOG: valores usados na query de update
    console.log('Valores para update usuario:', [nome, email, senha, telefone, usuario_id]);

    // Atualiza usuário
    const result = await client.query(
      "UPDATE usuario SET nome = $1, email = $2, senha = $3, telefone = $4 WHERE id = $5 RETURNING *",
      [nome, email, senha, telefone, usuario_id]
    );

    // Atualiza status_conta do cliente, se enviado
    if (status_conta !== null && status_conta !== undefined) {
      console.log('Atualizando status_conta do cliente:', status_conta);
      await client.query(
        "UPDATE cliente SET status_conta = $1 WHERE id = $2",
        [status_conta, id]
      );
    }

    await client.query("COMMIT");
    res.status(200).json(result.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error('Erro no updateCliente:', error);
    res.status(400).json({ message: error.message, details: error });
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
