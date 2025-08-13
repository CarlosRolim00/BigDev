// Buscar mesas por restaurante
export const getTablesByRestaurante = async (req, res) => {
  try {
    const { restaurante_id } = req.params;
    const result = await pool.query(
      "SELECT * FROM mesas WHERE restaurante_id = $1",
      [restaurante_id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import pool from "../database.js";

export const createTable = async (req, res) => {
  try {
    const { numero, capacidade, restaurante_id, status, localizacao } = req.body;
    const statusMesa = status || 'disponivel';
    const result = await pool.query(
      "INSERT INTO mesas (numero, capacidade, restaurante_id, status, localizacao) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [numero, capacidade, restaurante_id, statusMesa, localizacao]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTables = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM mesas");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTableById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM mesas WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Mesa not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { numero, capacidade } = req.body;
    const result = await pool.query(
      "UPDATE mesas SET numero = $1, capacidade = $2 WHERE id = $3 RETURNING *",
      [numero, capacidade, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Mesa not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM mesas WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Mesa not found" });
    }
    res.status(200).json({ message: "Mesa removida com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
