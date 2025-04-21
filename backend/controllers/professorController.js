const Professor = require('../models/professor');
const bcrypt = require('bcryptjs');

// Criar novo responsável
exports.createProfessor = async (req, res) => {
    try {
        const { nome, senha, perfil, salario } = req.body;
        const professor = new Professor({ nome, senha, perfil, salario });
        await professor.save();
        res.status(201).json(professor);
    } catch (err) {
        res.status(400).json({ error: err.message });}
    }


// Listar todos os usuários
exports.getProfessores = async (req, res) => {
    try {
        const professores = await Professor.find();
        res.status(200).json(professores);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// Buscar um usuário específico por ID
exports.getProfessorById = async (req, res) => {
    try {
        const professor = await Professor.findById(req.params.id);
        if (!professor) {
            return res.status(404).json({ message: 'Professor não encontrado' });
        }
        res.status(200).json(professor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Fazer login
exports.login = async (req, res) => {
    const { nome, senha, perfil } = req.body;
    try {
        const professor = await Professor.findOne({ nome });
        if (!professor) return res.status(400).json({ message: 'Professor não encontrado' });

        const isMatch = await bcrypt.compare(senha, professor.senha);
        if (!isMatch) return res.status(400).json({ message: 'Senha incorreta' });

        res.status(200).json({ message: 'Login bem-sucedido', professor });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Atualizar usuário
exports.updateProfessor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, senha, perfil, salario } = req.body;

        const updatedProfessor = await Professor.findByIdAndUpdate(id, { nome, senha, perfil, salario }, { new: true });
        if (!updatedProfessor) return res.status(404).json({ message: 'Professor não encontrado' });

        res.status(200).json(updatedProfessor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Excluir usuário
exports.deleteProfessor = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteProfessor = await Professor.findByIdAndDelete(id);
        if (!deleteProfessor) return res.status(404).json({ message: 'Professor não encontrado' });

        res.status(200).json({ message: 'Professor excluído com sucesso' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
