
import express from "express";
import * as cardapioController from "../controllers/cardapioController.js";
import multer from "multer";

// Multer para armazenar arquivo em memória temporária
const upload = multer({ dest: 'tmp/' });

const router = express.Router();

// Novo endpoint: criar cardápio com PDF (upload)
router.post("/", upload.single("file"), cardapioController.createCardapio);

// (Removido, pois agora o upload é obrigatório)
// Endpoint para servir PDF do banco
router.get("/:id/pdf", cardapioController.getCardapioPdf);
router.get("/", cardapioController.getCardapios);
router.get("/:id", cardapioController.getCardapioById);
router.put("/:id", upload.single("file"), cardapioController.updateCardapio);
router.delete("/:id", cardapioController.deleteCardapio);

export default router;
