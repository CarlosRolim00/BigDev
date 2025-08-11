import express from "express";
import * as restauranteController from "../controllers/restauranteController.js";

const router = express.Router();

router.post("/", restauranteController.createRestaurante);
router.get("/", restauranteController.getRestaurantes);
router.get("/:id", restauranteController.getRestauranteById);
router.put("/:id", restauranteController.updateRestaurante);
router.delete("/:id", restauranteController.deleteRestaurante);

export default router;
