import mongoose from "mongoose";

const FuncionarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  cargo: {
    type: String,
    required: true,
  },
  salario: {
    type: Number,
    required: true,
  },
  dataContratacao: {
    type: Date,
    default: Date.now,
  },
});

const Funcionario = mongoose.model("Funcionario", FuncionarioSchema);

export default Funcionario;