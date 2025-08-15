import express from 'express';
import { createMasterUsuario, getMasterUsuario, loginMasterUsuario } from '../controllers/masterUsuarioController.js';

const router = express.Router();
// Rota de login do master
router.post('/login', loginMasterUsuario);
// Rota para criar usuário master
router.post('/', createMasterUsuario);
// Rota para buscar usuário master por email
router.get('/:email', getMasterUsuario);

export default router;
