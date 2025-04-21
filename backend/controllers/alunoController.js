const Aluno = require('../models/aluno');

// Criar um novo aluno
exports.createAluno = async (req, res) => {
    try {
        const { nome, idade, entrada, telefone, responsavel, professor } = req.body;
        const aluno = new Aluno({ nome, entrada, telefone, responsavel, professor });
        await aluno.save();
        res.status(201).json(aluno);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Listar todas as plantações
exports.getAlunos= async (req, res) => {
    try {
        const alunos = await Aluno.find().populate('professor', 'nome perfil');
        res.status(200).json(alunos);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAlunoById = async (req, res) => {
    try {
        const aluno = await Aluno.findById(req.params.id).populate('professor', 'nome perfil');
        if (!aluno) {
            return res.status(404).json({ message: 'Aluno não encontrado' });
        }
        res.status(200).json(aluno);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Atualizar aluno
exports.updateAluno = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, telefone, responsavel, professor } = req.body;

        const updatedAluno = await Aluno.findByIdAndUpdate(id, { nome, telefone, responsavel, professor }, { new: true });
        if (!updatedAluno) return res.status(404).json({ message: 'Aluno não encontrado' });

        res.status(200).json(updatedAluno);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Excluir aluno
exports.deleteAluno = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteAluno = await Aluno.findByIdAndDelete(id);
        if (!deleteAluno) return res.status(404).json({ message: 'Aluno não encontrado' });

        res.status(200).json({ message: 'Aluno desmatriculado com sucesso' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
