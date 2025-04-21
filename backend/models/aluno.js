const mongoose = require('mongoose');

const alunoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    entrada: { type: Date, default: Date.now, required: true },
    telefone: { type: Number, required: true },
    responsavel: { type: String, required: true },
    professor: { type: mongoose.Schema.Types.ObjectId, ref: 'Professor', required: true }
});

const Aluno = mongoose.model('Aluno', alunoSchema);

module.exports = Aluno;
