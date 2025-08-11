import express from "express";
import * as mesaController from "../controllers/mesaController.js";

const router = express.Router();


router.post("/", mesaController.createTable);
router.get("/", mesaController.getTables);
router.get("/restaurante/:restaurante_id", mesaController.getTablesByRestaurante);
router.get("/:id", mesaController.getTableById);
router.put("/:id", mesaController.updateTable);
router.delete("/:id", mesaController.deleteTable);

export default router;
