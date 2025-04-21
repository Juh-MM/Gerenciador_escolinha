document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3001/api'; // Atualize para sua API
    const professorModal = document.getElementById('professorModal');
    const professorForm = document.getElementById('professorForm');
    const addProfessorBtn = document.getElementById('addProfessorBtn');
    const modalTitle = document.getElementById('modalTitle');
    let editProfessorId = null;

    // Função para carregar professores
    const loadProfessores = async () => {
        const response = await fetch(`${apiUrl}/professores`);
        const professores = await response.json();
        const tableBody = document.querySelector('#professoresTable tbody');
        tableBody.innerHTML = '';

        professores.forEach(professor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${professor.nome}</td>
                <td>${professor.perfil}</td>
                <td>
                    <button class="editProfessorBtn" data-id="${professor._id}">Editar</button>
                    <button class="deleteProfessorBtn" data-id="${professor._id}">Deletar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        document.querySelectorAll('.editProfessorBtn').forEach(button => {
            button.addEventListener('click', (e) => openEditProfessorModal(e.target.dataset.id));
        });

        document.querySelectorAll('.deleteProfessorBtn').forEach(button => {
            button.addEventListener('click', (e) => deleteProfessor(e.target.dataset.id));
        });
    };

    // Função para adicionar professor
    const addProfessor = async (professor) => {
        await fetch(`${apiUrl}/professores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(professor)
        });
        loadProfessores();
    };

    // Função para atualizar professor
    const updateProfessor = async (id, professor) => {
        await fetch(`${apiUrl}/professores/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(professor)
        });
        loadProfessores();
    };

    // Função para deletar professor
    const deleteProfessor = async (id) => {
        await fetch(`${apiUrl}/professores/${id}`, {
            method: 'DELETE'
        });
        loadProfessores();
    };

    // Abrir modal para editar professor
    const openEditProfessorModal = async (id) => {
        editProfessorId = id;
        modalTitle.innerText = 'Editar Professor';

        // Buscar os dados do professor para preencher o modal
        const response = await fetch(`${apiUrl}/professores/${id}`);
        const professor = await response.json();

        document.getElementById('nome').value = professor.nome;
        document.getElementById('perfil').value = professor.perfil;
        document.getElementById('salario').value = professor.salario;
        document.getElementById('senha').value = '';

        professorModal.style.display = 'block';
    };

    // Abrir modal para adicionar novo professor
    const openAddProfessorModal = () => {
        editProfessorId = null;
        modalTitle.innerText = 'Adicionar Professor';
        professorForm.reset();
        professorModal.style.display = 'block';
    };

    // Fechar modal ao clicar no "x"
    document.querySelector('.close').addEventListener('click', () => {
        professorModal.style.display = 'none';
    });

    // Fechar modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target === professorModal) {
            professorModal.style.display = 'none';
        }
    });

    // Submissão do formulário
    professorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const professorData = {
            nome: document.getElementById('nome').value,
            perfil: document.getElementById('perfil').value,
            senha: document.getElementById('senha').value,
            salario: document.getElementById('salario').value
        };

        if (editProfessorId) {
            await updateProfessor(editProfessorId, professorData);
        } else {
            await addProfessor(professorData);
        }

        professorModal.style.display = 'none';
        loadProfessores();
    });

    // Inicializando o carregamento de professores e eventos
    addProfessorBtn.addEventListener('click', openAddProfessorModal);
    loadProfessores();
});
