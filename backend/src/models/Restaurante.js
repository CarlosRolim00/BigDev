import mongoose from "mongoose";

const RestauranteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  endereco: {
    type: String,
    required: true,
  },
  telefone: {
    type: String,
    required: true,
  },
  tipoCozinha: {
    type: String,
    required: true,
  },
  avaliacao: {
    type: Number,
    min: 0,
    max: 5,
  },
  cardapio: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cardapio",
  }],
});

const Restaurante = mongoose.model("Restaurante", RestauranteSchema);

export default Restaurante;