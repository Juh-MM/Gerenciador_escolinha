const express = require('express');
const router = express.Router();
const { createAluno, getAlunos, updateAluno, getAlunoById, deleteAluno } = require('../controllers/alunoController');

router.post('/', createAluno);
router.get('/', getAlunos);
router.get('/:id', getAlunoById);
router.put('/:id', updateAluno); 
router.delete('/:id', deleteAluno); 

module.exports = router;
