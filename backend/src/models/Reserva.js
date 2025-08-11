import mongoose from "mongoose";

const reservaSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: true
  },
  mesa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mesa",
    required: true
  },
  data: {
    type: Date,
    required: true
  },
  hora: {
    type: String,
    required: true
  },
  numeroPessoas: {
    type: Number,
    required: true
  }
});

const Reserva = mongoose.model("Reserva", reservaSchema);

export default Reserva;