// encontrar o botão adicionar tarefa

const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textarea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const btnCancelar = document.querySelector('.app__form-footer__button--cancel');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTodas = document.querySelector('#btn-remover-todas');

// JSON.parse faz transformar uma String no LocalStorage em Object de forma correta
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

// Crie uma função para limpar o conteúdo do textarea e esconder o formulário
const limparFormulario = () => {
    textarea.value = ''; // Limpar o conteúdo do textarea
}

function atualizarTarefas () {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
                fill="#01080E"></path>
        </svg>
    `

    const paragrafo = document.createElement('p');
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description');

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');

    botao.onclick = () => {
        // debugger
        const novaDescricao = prompt("Qual é o novo nome da tarefa?");
        // console.log('Nova descrição da tarefa: ', novaDescricao);
        if (novaDescricao) {
            paragrafo.textContent = novaDescricao;
            tarefa.descricao = novaDescricao;
            atualizarTarefas();
        }
    }

    const imagemBotao = document.createElement('img');
    imagemBotao.setAttribute('src', './imagens/edit.png');
    botao.append(imagemBotao);

    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', 'disabled');
    } else {
        li.onclick = () => {
            // Remove a Seleção do Click em mais de um botão
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active')
                })
    
            // Remove a Seleção do Click no mesmo botão
            if (tarefaSelecionada == tarefa) {
                paragrafoDescricaoTarefa.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return;
            }
            
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;
            paragrafoDescricaoTarefa.textContent = tarefa.descricao;
            
            // Faz a Borda de Seleção do botão
            li.classList.add('app__section-task-list-item-active');
        }
    }


    return li;
}

// capturar evento de click do botão
// 1º parâmetro: O que quero ouvir?
// 2º parâmetro: O que quero executar?
btnAdicionarTarefa.addEventListener('click', () => {
    // toggle = alternância (tira/põe)
    // no CSS, o hidden está como display: none, com toggle, alterna isso
    formAdicionarTarefa.classList.toggle('hidden');
})

formAdicionarTarefa.addEventListener('submit', (evento) => {
    // preventDefault = Prevenir um comportamento padrão
    evento.preventDefault();
    // value = valor de uma área digitada
    const tarefa = {
        descricao: textarea.value
    }
    // push = colocar algo dentro
    tarefas.push(tarefa);
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    // localStorage = armazenamento local
    // setItem = colocar um item dentro
    // JSON.stringify faz transformar um Objeto no LocalStorage em String de forma correta
    atualizarTarefas();
    textarea.value = '';
    formAdicionarTarefa.classList.add('hidden');
})

tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
})

// Associe a função limparFormulario ao evento de clique do botão Cancelar
btnCancelar.addEventListener('click', limparFormulario);

// Finalizando Tarefa
document.addEventListener('FocoFinalizado', () => {
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
        tarefaSelecionada.completa = true;
        atualizarTarefas();
    }
})

const removerTarefas = (somenteCompletas) => {
    const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item"; // IF Ternário
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove();
    })
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [];
    atualizarTarefas();
};

btnRemoverConcluidas.onclick = () => removerTarefas(true);
btnRemoverTodas.onclick = () => removerTarefas(false);