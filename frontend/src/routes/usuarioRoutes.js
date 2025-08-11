import express from "express";
import * as usuarioController from "../controllers/usuarioController.js";

const router = express.Router();

router.post("/", usuarioController.createUser);
router.get("/", usuarioController.getUsers);
router.get("/:id", usuarioController.getUserById);
router.put("/:id", usuarioController.updateUser);
router.delete("/:id", usuarioController.deleteUser);

export default router;
