import pool from "../database.js";

export const createRestaurante = async (req, res) => {
  try {
    const { nome, cnpj, endereco, telefone, tipo_cozinha } = req.body;
    const result = await pool.query(
      "INSERT INTO restaurante (nome, cnpj, endereco, telefone, tipo_cozinha) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nome, cnpj, endereco, telefone, tipo_cozinha]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error creating restaurant", error });
  }
};

export const getRestaurantes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM restaurante");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurants", error });
  }
};

export const getRestauranteById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM restaurante WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurant", error });
  }
};

export const updateRestaurante = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cnpj, endereco, telefone, tipo_cozinha } = req.body;
    const result = await pool.query(
      "UPDATE restaurante SET nome = $1, cnpj = $2, endereco = $3, telefone = $4, tipo_cozinha = $5 WHERE id = $6 RETURNING *",
      [nome, cnpj, endereco, telefone, tipo_cozinha, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating restaurant", error });
  }
};

export const deleteRestaurante = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM restaurante WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting restaurant", error });
  }
};
