import express from "express";

import multer from "multer";
import * as restauranteController from "../controllers/restauranteController.js";

const upload = multer({ dest: 'tmp/' });

const router = express.Router();

router.post("/", restauranteController.createRestaurante);
router.get("/", restauranteController.getRestaurantes);
router.get("/:id", restauranteController.getRestauranteById);
router.put("/:id", upload.single("imagem"), restauranteController.updateRestaurante);
router.put("/:id/horarios", restauranteController.updateHorariosRestaurante);
router.get("/:id/imagem", restauranteController.getRestauranteImagem);
router.delete("/:id", restauranteController.deleteRestaurante);

export default router;
