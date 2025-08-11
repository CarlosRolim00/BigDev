import mongoose from "mongoose";

const mesaSchema = new mongoose.Schema({
  numero: {
    type: Number,
    required: true,
    unique: true
  },
  capacidade: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['disponível', 'reservada', 'ocupada'],
    default: 'disponível'
  }
});

const Mesa = mongoose.model("Mesa", mesaSchema);

export default Mesa;