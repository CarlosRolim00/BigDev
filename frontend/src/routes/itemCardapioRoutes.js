import express from "express";
import * as itemCardapioController from "../controllers/itemCardapioController.js";

const router = express.Router();

router.post("/", itemCardapioController.createItemCardapio);
router.get("/", itemCardapioController.getItemCardapio);
// Se quiser buscar por ID, crie uma função getItemCardapioById no controller
router.put("/:id", itemCardapioController.updateItemCardapio);
router.delete("/:id", itemCardapioController.deleteItemCardapio);

export default router;
