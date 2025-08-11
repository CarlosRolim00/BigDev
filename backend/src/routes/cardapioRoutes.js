import express from "express";
import * as cardapioController from "../controllers/cardapioController.js";

const router = express.Router();

router.post("/", cardapioController.createCardapio);
router.get("/", cardapioController.getCardapios);
router.get("/:id", cardapioController.getCardapioById);
router.put("/:id", cardapioController.updateCardapio);
router.delete("/:id", cardapioController.deleteCardapio);

export default router;
