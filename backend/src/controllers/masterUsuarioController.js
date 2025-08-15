// Login do usuário master
export const loginMasterUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await getMasterUsuarioByEmail(email);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário master não encontrado' });
    }
    if (usuario.senha !== senha) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import { insertMasterUsuario, getMasterUsuarioByEmail } from '../models/MasterUsuario.js';

// Cria usuário master
export const createMasterUsuario = async (req, res) => {
  try {
    const { nome, email, senha, telefone } = req.body;
    const usuario = await insertMasterUsuario({ nome, email, senha, telefone });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Busca usuário master por email
export const getMasterUsuario = async (req, res) => {
  try {
    const { email } = req.params;
    const usuario = await getMasterUsuarioByEmail(email);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário master não encontrado' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
