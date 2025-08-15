// Buscar reservas por restaurante
export const getReservasByRestaurante = async (req, res) => {
  try {
    const { restaurante_id } = req.params;
    // Permite filtrar por data via query param (?dia=yyyy-mm-dd), senão usa o dia atual
    let { dia } = req.query;
    if (!dia) {
      const today = new Date();
      dia = today.toISOString().slice(0, 10); // yyyy-mm-dd
    }
    const result = await pool.query(
      `SELECT r.id, r.cliente_id, r.mesa_id, r.hora, to_char(r.dia, 'YYYY-MM-DD') as dia, r.status, r.observacao,
              m.numero,
              r.qtd_pessoas,
              u.nome as nome_cliente
        FROM reserva r
        JOIN mesas m ON r.mesa_id = m.id
        JOIN cliente c ON r.cliente_id = c.id
        JOIN usuario u ON c.usuario_id = u.id
        WHERE m.restaurante_id = $1 AND r.dia = $2`,
      [restaurante_id, dia]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Buscar reservas por cliente
export const getReservasByCliente = async (req, res) => {
  try {
    const { cliente_id } = req.params;
  // Traz dados da reserva, mesa e restaurante
  const result = await pool.query(`
    SELECT r.id, r.cliente_id, r.mesa_id, r.hora, to_char(r.dia, 'YYYY-MM-DD') as dia, r.status, r.observacao,
         m.numero as mesa_numero, m.restaurante_id
    FROM reserva r
    JOIN mesas m ON r.mesa_id = m.id
    WHERE r.cliente_id = $1
  `, [cliente_id]);
  res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import pool from "../database.js";

export const createReserva = async (req, res) => {
  try {
    const { cliente_id, mesa_id, hora, dia, status, observacao, qtd_pessoas } = req.body;
    // Verificação robusta no banco: impede reserva duplicada para mesa, horário e dia
    const reservaExistente = await pool.query(
      `SELECT * FROM reserva WHERE mesa_id = $1 AND hora = $2 AND dia = $3 AND (LOWER(status) IN ('pendente', 'confirmada'))`,
      [mesa_id, hora, dia]
    );
    if (reservaExistente.rows.length > 0) {
      return res.status(409).json({ message: 'Mesa ocupada, escolha outra mesa.' });
    }
    const result = await pool.query(
      "INSERT INTO reserva (cliente_id, mesa_id, hora, dia, status, observacao, qtd_pessoas) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [cliente_id, mesa_id, hora, dia, status, observacao, qtd_pessoas]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getReservas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, 
             u.nome as cliente_nome,
             rest.nome as restaurante_nome
      FROM reserva r
      JOIN cliente c ON r.cliente_id = c.id
      JOIN usuario u ON c.usuario_id = u.id
      JOIN mesas m ON r.mesa_id = m.id
      JOIN restaurante rest ON m.restaurante_id = rest.id
    `);
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
