document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3001/api'; 

    const alunoModal = document.getElementById('alunoModal');
    const alunoForm = document.getElementById('alunoForm');
    const addAlunoBtn = document.getElementById('addAlunoBtn');
    const modalTitleAluno = document.getElementById('modalTitleAluno');
    let editAlunoId = null;

    const loadAlunos = async () => {
        const response = await fetch(`${apiUrl}/alunos`);
        const alunos = await response.json(); // Aqui você só precisa de um .json()

        const tableBody = document.querySelector('#alunosTable tbody');
        tableBody.innerHTML = '';

        alunos.forEach(aluno => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${aluno.nome}</td>
                <td>${aluno.telefone}</td>
                <td>${aluno.responsavel}</td>
                <td>${aluno.professor ? aluno.professor.nome : 'N/A'}</td>
                <td>${aluno.entrada}</td>

                <td>
                    <button class="editAlunoBtn" data-id="${aluno._id}">Editar</button>
                    <button class="deleteAlunoBtn" data-id="${aluno._id}">Deletar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        document.querySelectorAll('.editAlunoBtn').forEach(button => {
            button.addEventListener('click', (e) => openEditAlunoModal(e.target.dataset.id));
        });

        document.querySelectorAll('.deleteAlunoBtn').forEach(button => {
            button.addEventListener('click', (e) => deleteAluno(e.target.dataset.id));
        });
    };

    const addAluno = async (aluno) => {
        const response = await fetch(`${apiUrl}/alunos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aluno)
        });
        await response.json(); // Apenas uma chamada ao .json()
        loadAlunos(); // Corrigido para loadAlunos()
    };

    const updateAluno = async (id, aluno) => {
        const response = await fetch(`${apiUrl}/alunos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aluno)
        });

        await response.json(); // Apenas uma chamada ao .json()
        loadAlunos(); // Corrigido para loadAlunos()
    };

    const deleteAluno = async (id) => {
        const response = await fetch(`${apiUrl}/alunos/${id}`, {
            method: 'DELETE'
        });
        await response.json(); // Apenas uma chamada ao .json()
        loadAlunos(); // Corrigido para loadAlunos()
    };

    const openEditAlunoModal = async (id) => {
        editAlunoId = id;
        modalTitleAluno.innerText = 'Editar matrícula';

        const response = await fetch(`${apiUrl}/alunos/${id}`);
        const aluno = await response.json(); // Aqui apenas uma chamada ao .json()
        if (response.status === 404) {
            console.error('Aluno não encontrado');
            return;
        }

        document.getElementById('nomeAluno').value = aluno.nome;
        document.getElementById('telefoneAluno').value = aluno.telefone;
        document.getElementById('responsavelAluno').value = aluno.responsavel;
        document.getElementById('professor').value = aluno.professor;

        await loadProfessores(aluno.professor ? aluno.professor._id : null);

        alunoModal.style.display = 'block';
    };

    const openAddAlunoModal = async () => {
        editAlunoId = null;
        modalTitleAluno.innerText = 'Adicionar Aluno';
        alunoForm.reset();
        await loadProfessores(); 
        
        alunoModal.style.display = 'block';
    };

    const loadProfessores = async (selectedProfessorId = null) => {
        const response = await fetch(`${apiUrl}/professores`);
        const professores = await response.json(); // Aqui apenas uma chamada ao .json()
        const select = document.getElementById('professor');
        select.innerHTML = ''; // Limpa o select
    
        professores.forEach(professor => {
            const option = document.createElement('option');
            option.value = professor._id;
            option.text = professor.nome;
            if (professor._id === selectedProfessorId) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    };

    // Fechar modal ao clicar no "x"
    document.querySelector('.close').addEventListener('click', () => {
        alunoModal.style.display = 'none';
    });

    // Fechar modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target === alunoModal) {
            alunoModal.style.display = 'none';
        }
    });

    // Submissão do formulário
    alunoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const alunoData = {
            nome: document.getElementById('nomeAluno').value,
            entrada: document.getElementById('entradaAluno').value,
            telefone: document.getElementById('telefoneAluno').value,
            responsavel: document.getElementById('responsavelAluno').value,
            professor: document.getElementById('professor').value
        };

        if (editAlunoId) {
            await updateAluno(editAlunoId, alunoData);
        } else {
            await addAluno(alunoData);
        }

        alunoModal.style.display = 'none';
        loadAlunos();
    });

    addAlunoBtn.addEventListener('click', openAddAlunoModal);
    loadAlunos();
});
