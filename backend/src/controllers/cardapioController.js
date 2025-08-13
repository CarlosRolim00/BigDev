import pool from "../database.js";
import fs from "fs";

export const createCardapio = async (req, res) => {
  try {
    const { nome, restaurante_id } = req.body;
    let pdfBuffer = null;
    if (req.file) {
      pdfBuffer = fs.readFileSync(req.file.path);
      // Remove arquivo temporário após ler
      fs.unlinkSync(req.file.path);
    }
    const result = await pool.query(
      "INSERT INTO cardapio (nome, restaurante_id, pdf_data) VALUES ($1, $2, $3) RETURNING *",
      [nome, restaurante_id, pdfBuffer]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Endpoint para servir o PDF do banco
export const getCardapioPdf = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT pdf_data FROM cardapio WHERE id = $1", [id]);
    if (result.rows.length === 0 || !result.rows[0].pdf_data) {
      return res.status(404).json({ message: "PDF não encontrado" });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.send(result.rows[0].pdf_data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCardapios = async (req, res) => {
  try {
  const result = await pool.query("SELECT * FROM cardapio");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCardapioById = async (req, res) => {
  try {
    const { id } = req.params;
  const result = await pool.query("SELECT * FROM cardapio WHERE id = $1", [id]);
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
    const { nome } = req.body;
    let pdfBuffer = null;
    if (req.file) {
      pdfBuffer = fs.readFileSync(req.file.path);
      fs.unlinkSync(req.file.path);
    }
    let result;
    if (pdfBuffer) {
      result = await pool.query(
        "UPDATE cardapio SET nome = $1, pdf_data = $2 WHERE id = $3 RETURNING *",
        [nome, pdfBuffer, id]
      );
    } else {
      result = await pool.query(
        "UPDATE cardapio SET nome = $1 WHERE id = $2 RETURNING *",
        [nome, id]
      );
    }
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
      "DELETE FROM cardapio WHERE id = $1 RETURNING *",
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
      "SELECT * FROM cardapio WHERE id = $1",
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
