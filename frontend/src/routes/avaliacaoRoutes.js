import express from "express";
import * as avaliacaoController from "../controllers/avaliacaoController.js";

const router = express.Router();

router.post("/", avaliacaoController.createAvaliacao);
router.get("/", avaliacaoController.getAvaliacoes);
router.get("/:id", avaliacaoController.getAvaliacaoById);
router.put("/:id", avaliacaoController.updateAvaliacao);
router.delete("/:id", avaliacaoController.deleteAvaliacao);

export default router;
