import express from "express";
import * as funcionarioController from "../controllers/funcionarioController.js";

const router = express.Router();

router.post("/", funcionarioController.createFuncionario);
router.post("/login", funcionarioController.loginFuncionario);
router.get("/", funcionarioController.getFuncionarios);
router.get("/:id", funcionarioController.getFuncionarioById);
router.put("/:id", funcionarioController.updateFuncionario);
router.delete("/:id", funcionarioController.deleteFuncionario);

export default router;
