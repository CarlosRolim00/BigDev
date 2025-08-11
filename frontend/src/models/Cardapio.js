import mongoose from "mongoose";

const cardapioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  preco: {
    type: Number,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  disponibilidade: {
    type: Boolean,
    default: true,
  },
});

const Cardapio = mongoose.model("Cardapio", cardapioSchema);

export default Cardapio;