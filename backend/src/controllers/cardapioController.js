import pool from "../database.js";

export const createCardapio = async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const result = await pool.query(
      "INSERT INTO cardapios (nome, descricao) VALUES ($1, $2) RETURNING *",
      [nome, descricao]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCardapios = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cardapios");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCardapioById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM cardapios WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cardápio not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCardapio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    const result = await pool.query(
      "UPDATE cardapios SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *",
      [nome, descricao, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cardápio not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCardapio = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM cardapios WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cardápio not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Busca cardápio com itens
export const getCardapioComItens = async (req, res) => {
  try {
    const { id } = req.params;
    const cardapioResult = await pool.query(
      "SELECT * FROM cardapios WHERE id = $1",
      [id]
    );
    if (cardapioResult.rows.length === 0) {
      return res.status(404).json({ message: "Cardápio not found" });
    }
    const itensResult = await pool.query(
      "SELECT * FROM item_cardapio WHERE cardapio_id = $1",
      [id]
    );
    res.status(200).json({
      ...cardapioResult.rows[0],
      itens: itensResult.rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
