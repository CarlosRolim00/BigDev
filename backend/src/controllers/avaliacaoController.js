import pool from "../database.js";

// Cria uma avaliação
export const createAvaliacao = async (req, res) => {
  try {
    const { nota, comentario, data, hora, cliente_id, restaurante_id } = req.body;
    const result = await pool.query(
      "INSERT INTO avaliacao (nota, comentario, data, hora, cliente_id, restaurante_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [nota, comentario, data, hora, cliente_id, restaurante_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lista todas as avaliações
export const getAvaliacoes = async (req, res) => {
  try {
    // Permite filtrar por cliente_id, restaurante_id, dia e hora
    const { cliente_id, restaurante_id, dia, hora } = req.query;
    let query = `SELECT a.*, u.nome as nome_cliente FROM avaliacao a
                 JOIN cliente c ON a.cliente_id = c.id
                 JOIN usuario u ON c.usuario_id = u.id
                 WHERE 1=1`;
    const params = [];
    if (cliente_id) {
      params.push(cliente_id);
      query += ` AND a.cliente_id = $${params.length}`;
    }
    if (restaurante_id) {
      params.push(restaurante_id);
      query += ` AND a.restaurante_id = $${params.length}`;
    }
    if (dia) {
      params.push(dia);
      query += ` AND a.data = $${params.length}`;
    }
    if (hora) {
      params.push(hora);
      query += ` AND a.hora = $${params.length}`;
    }
    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Busca avaliação por ID
export const getAvaliacaoById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM avaliacao WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Avaliacao not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Atualiza avaliação
export const updateAvaliacao = async (req, res) => {
  try {
    const { id } = req.params;
    const { nota, comentario, data, hora, cliente_id, restaurante_id } = req.body;
    const result = await pool.query(
      "UPDATE avaliacao SET nota = $1, comentario = $2, data = $3, hora = $4, cliente_id = $5, restaurante_id = $6 WHERE id = $7 RETURNING *",
      [nota, comentario, data, hora, cliente_id, restaurante_id, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Avaliacao not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove avaliação
export const deleteAvaliacao = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM avaliacao WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Avaliacao not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
