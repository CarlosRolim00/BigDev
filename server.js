import express from "express";
import masterUsuarioRoutes from "./backend/src/routes/masterUsuarioRoutes.js";

const app = express();
app.use(express.json());

app.use("/master-usuario", masterUsuarioRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
