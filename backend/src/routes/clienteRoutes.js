import express from "express";
import * as clienteController from "../controllers/clienteController.js";

const router = express.Router();


router.post("/", clienteController.createCliente);
router.post("/login", clienteController.loginCliente);
router.get("/", clienteController.getClientes);
router.get("/usuario/:usuario_id", clienteController.getClienteByUsuarioId);
router.get("/:id", clienteController.getClienteById);
router.put("/:id", clienteController.updateCliente);
router.delete("/:id", clienteController.deleteCliente);

export default router;
