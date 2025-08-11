import pool from "../database.js";

// Cria uma avaliação
export const createAvaliacao = async (req, res) => {
  try {
    const { nota, comentario, data, cliente_id, restaurante_id } = req.body;
    const result = await pool.query(
      "INSERT INTO avaliacao (nota, comentario, data, cliente_id, restaurante_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nota, comentario, data, cliente_id, restaurante_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lista todas as avaliações
export const getAvaliacoes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM avaliacao");
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
    const { nota, comentario, data, cliente_id, restaurante_id } = req.body;
    const result = await pool.query(
      "UPDATE avaliacao SET nota = $1, comentario = $2, data = $3, cliente_id = $4, restaurante_id = $5 WHERE id = $6 RETURNING *",
      [nota, comentario, data, cliente_id, restaurante_id, id]
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
