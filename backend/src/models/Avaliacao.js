import mongoose from "mongoose";

const avaliacaoSchema = new mongoose.Schema({
  nota: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comentario: {
    type: String,
    required: true
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: true
  },
  restaurante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurante",
    required: true
  },
  data: {
    type: Date,
    default: Date.now
  }
});

const Avaliacao = mongoose.model("Avaliacao", avaliacaoSchema);

export default Avaliacao;