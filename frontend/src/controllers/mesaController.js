import pool from "../database.js";

export const createTable = async (req, res) => {
  try {
    const { numero, capacidade, restaurante_id } = req.body;
    const result = await pool.query(
      "INSERT INTO mesas (numero, capacidade, restaurante_id) VALUES ($1, $2, $3) RETURNING *",
      [numero, capacidade, restaurante_id]
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
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
