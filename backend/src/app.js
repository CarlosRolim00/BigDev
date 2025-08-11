import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import avaliacaoRoutes from "./routes/avaliacaoRoutes.js";
import cardapioRoutes from "./routes/cardapioRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";
import funcionarioRoutes from "./routes/funcionarioRoutes.js";
import itemCardapioRoutes from "./routes/itemCardapioRoutes.js";
import mesaRoutes from "./routes/mesaRoutes.js";
import reservaRoutes from "./routes/reservaRoutes.js";
import restauranteRoutes from "./routes/restauranteRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";

const app = express();

// Permitir requisições de qualquer origem (CORS)
app.use(cors());

app.use(bodyParser.json());

app.use("/avaliacao", avaliacaoRoutes);
app.use("/cardapio", cardapioRoutes);
app.use("/cliente", clienteRoutes);
app.use("/funcionario", funcionarioRoutes);
app.use("/itemCardapio", itemCardapioRoutes);
app.use("/mesa", mesaRoutes);
app.use("/reserva", reservaRoutes);
app.use("/restaurante", restauranteRoutes);
app.use("/usuario", usuarioRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});