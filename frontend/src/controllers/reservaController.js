import pool from "../database.js";

export const createReserva = async (req, res) => {
  try {
    const { cliente_id, mesa_id, hora, dia, status, observacao } = req.body;
    const result = await pool.query(
      "INSERT INTO reserva (cliente_id, mesa_id, hora, dia, status, observacao) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [cliente_id, mesa_id, hora, dia, status, observacao]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getReservas = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reserva");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReservaById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM reserva WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reserva not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { cliente_id, mesa_id, hora, dia, status, observacao } = req.body;
    const result = await pool.query(
      "UPDATE reserva SET cliente_id = $1, mesa_id = $2, hora = $3, dia = $4, status = $5, observacao = $6 WHERE id = $7 RETURNING *",
      [cliente_id, mesa_id, hora, dia, status, observacao, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reserva not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM reserva WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reserva not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
