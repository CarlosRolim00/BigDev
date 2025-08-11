import express from "express";
import * as reservaController from "../controllers/reservaController.js";

const router = express.Router();

router.post("/", reservaController.createReserva);
router.get("/", reservaController.getReservas);
router.get("/:id", reservaController.getReservaById);
router.get("/cliente/:cliente_id", reservaController.getReservasByCliente);
router.get("/restaurante/:restaurante_id", reservaController.getReservasByRestaurante);
router.put("/:id", reservaController.updateReserva);
router.delete("/:id", reservaController.deleteReserva);

export default router;
