// Endpoint para servir imagem direto do banco
export const getRestauranteImagem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT restaurante_img FROM restaurante WHERE id = $1", [id]);
    if (result.rows.length === 0 || !result.rows[0].restaurante_img) {
      return res.status(404).send("Imagem não encontrada");
    }
    const imgData = result.rows[0].restaurante_img;
    // Se estiver em base64, envie como image/jpeg
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(imgData);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar imagem do restaurante", error });
  }
};
import pool from "../database.js";
import fs from "fs";
import path from "path";

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
    console.log('DEBUG getRestaurantes result.rows:', JSON.stringify(result.rows, null, 2));
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurants", error });
  }
};

export const getRestauranteById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM restaurante WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const restaurante = result.rows[0];
    // Se existir horarios_disponiveis no banco, usa ele. Senão, gera dinamicamente.
    let times = [];
    // Se o campo existe e é array, mas está vazio, gera horários padrão
    if (Array.isArray(restaurante.horarios_disponiveis) && restaurante.horarios_disponiveis.length > 0) {
      times = restaurante.horarios_disponiveis;
    } else {
      // Gera horários com base no horario_funcionamento ou usa padrão se não existir
      let inicio = "11:00", fim = "22:00";
      if (restaurante.horario_abertura && restaurante.horario_fechamento) {
        inicio = restaurante.horario_abertura;
        fim = restaurante.horario_fechamento;
      }
      // Converte para minutos
      const [hIni, mIni] = inicio.split(":").map(Number);
      const [hFim, mFim] = fim.split(":").map(Number);
      let totalIni = hIni * 60 + mIni;
      let totalFim = hFim * 60 + mFim - 30; // 30 minutos antes de fechar
      for (let min = totalIni; min <= totalFim; min += 30) {
        const h = Math.floor(min / 60);
        const m = min % 60;
        times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    restaurante.times = times;
    res.status(200).json(restaurante);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurant", error });
  }
};
// Endpoint para atualizar/adicionar horários disponíveis
export const updateHorariosRestaurante = async (req, res) => {
  try {
    const { id } = req.params;
    const { horarios } = req.body; // deve ser array de strings
    if (!Array.isArray(horarios)) {
      return res.status(400).json({ message: "Horários devem ser um array." });
    }
    const result = await pool.query(
      "UPDATE restaurante SET horarios_disponiveis = $1 WHERE id = $2 RETURNING *",
      [horarios, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Restaurante não encontrado" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar horários", error });
  }
};

export const updateRestaurante = async (req, res) => {
  try {
    const { id } = req.params;
  const { nome, cnpj, endereco, telefone, tipo_cozinha, status } = req.body;
    let imagemPath = null;
    if (req.file) {
      // Lê o arquivo como binário
      const imgBuffer = fs.readFileSync(req.file.path);
      imagemPath = imgBuffer;
      // Remove arquivo temporário
      fs.unlinkSync(req.file.path);
    }
    let query = "UPDATE restaurante SET nome = $1, cnpj = $2, endereco = $3, telefone = $4, tipo_cozinha = $5, status = $6";
    let params = [nome, cnpj, endereco, telefone, tipo_cozinha, status];
    if (imagemPath) {
      query += ", restaurante_img = $7 WHERE id = $8 RETURNING *";
      params.push(imagemPath, id);
    } else {
      query += " WHERE id = $7 RETURNING *";
      params.push(id);
    }
    const result = await pool.query(query, params);
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
