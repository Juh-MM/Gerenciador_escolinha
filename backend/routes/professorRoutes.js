const express = require('express');
const router = express.Router();
const { createProfessor, getProfessores, login, updateProfessor, deleteProfessor, getProfessorById } = require('../controllers/professorController');

router.post('/', createProfessor);
router.get('/', getProfessores);
router.get('/:id', getProfessorById);
router.post('/login', login);
router.put('/:id', updateProfessor); 
router.delete('/:id', deleteProfessor); 

module.exports = router;
