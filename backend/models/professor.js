const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const professorSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    senha: { type: String, required: true },
    perfil: { type: String, enum: ['Professor', 'Estagiário'],    required: true },
    salario: { type: Number, required: true }
});

// Middleware para criptografar senha antes de salvar
professorSchema.pre('save', async function (next) {
    if (!this.isModified('senha')) return next();
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
});

const Professor = mongoose.model('Professor', professorSchema);

module.exports = Professor;
