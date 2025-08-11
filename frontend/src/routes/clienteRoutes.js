import express from "express";
import * as clienteController from "../controllers/clienteController.js";

const router = express.Router();

router.post("/", clienteController.createCliente);
router.get("/", clienteController.getClientes);
router.get("/:id", clienteController.getClienteById);
router.put("/:id", clienteController.updateCliente);
router.delete("/:id", clienteController.deleteCliente);

export default router;
