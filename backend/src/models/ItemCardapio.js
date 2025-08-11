import mongoose from "mongoose";

const itemCardapioSchema = new mongoose.Schema({
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

const ItemCardapio = mongoose.model("ItemCardapio", itemCardapioSchema);

export default ItemCardapio;
