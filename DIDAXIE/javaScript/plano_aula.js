const buscarPlano = document.getElementById("buscarPlano");
const planosRecentes = document.getElementById("planosRecentes");
const todosPlanos = document.getElementById("todosPlanos");
const menuPlano = document.getElementById("menuPlano");
const menuNomePlano = document.getElementById("menuNomePlano");
const menuTurmaPlano = document.getElementById("menuTurmaPlano");
const barraSelecao = document.getElementById("barraSelecao");
const quantidadeSelecionada = document.getElementById("quantidadeSelecionada");
const limparSelecao = document.getElementById("limparSelecao");
const toastPlano = document.getElementById("toastPlano");
const toastTexto = document.getElementById("toastTexto");

let planos = [];
let planoSelecionado = null;
let toastTimeout = null;
const planosSelecionados = new Set();

/* CARD CINZA DE TESTE */

const planoExemplo = {
    id: "placeholder",
    titulo: "Título do plano",
    turma: "Turma",
    exemplo: true
};

/* CRIAR CARD */

function criarCardPlano(plano) {
    const card = document.createElement("article");
    card.className = "plano-card";
    card.dataset.planoId = plano.id;

    if (plano.exemplo) {
        card.classList.add("placeholder");
    }

    if (planosSelecionados.has(plano.id)) {
        card.classList.add("selecionado");
    }

    card.innerHTML = `
        <div class="plano-card-topo">
            <button type="button" class="plano-menu-botao" aria-label="Opções do plano">
                <i class="fi fi-rr-menu-dots"></i>
            </button>

            <input
                type="checkbox"
                class="plano-check"
                aria-label="Selecionar ${escaparAtributo(plano.titulo || "plano")}"
                ${planosSelecionados.has(plano.id) ? "checked" : ""}
            >
        </div>

        <div class="plano-info">
            <span></span>
            <strong></strong>
        </div>
    `;

    const turma = card.querySelector(".plano-info span");
    const titulo = card.querySelector(".plano-info strong");
    const botaoMenu = card.querySelector(".plano-menu-botao");
    const checkbox = card.querySelector(".plano-check");

    turma.textContent = plano.turma || "Sem turma";
    titulo.textContent = plano.titulo || "Sem título";
    titulo.title = plano.titulo || "Sem título";

    checkbox.addEventListener("change", () => {
        alterarSelecaoPlano(plano, checkbox.checked);
    });

    botaoMenu.addEventListener("click", event => {
        event.stopPropagation();
        abrirMenuPlano(plano, botaoMenu);
    });

    return card;
}

/* SELEÇÃO */

function alterarSelecaoPlano(plano, selecionado) {
    if (selecionado) {
        planosSelecionados.add(plano.id);
    } else {
        planosSelecionados.delete(plano.id);
    }

    atualizarSelecaoVisual();
}

function atualizarSelecaoVisual() {
    document.querySelectorAll(".plano-card").forEach(card => {
        const id = card.dataset.planoId;
        const selecionado = planosSelecionados.has(id);
        const checkbox = card.querySelector(".plano-check");

        card.classList.toggle("selecionado", selecionado);

        if (checkbox) {
            checkbox.checked = selecionado;
        }
    });

    const quantidade = planosSelecionados.size;

    if (quantidade === 0) {
        barraSelecao.classList.remove("ativa");
        quantidadeSelecionada.textContent = "0 planos selecionados";
        return;
    }

    barraSelecao.classList.add("ativa");

    quantidadeSelecionada.textContent =
        quantidade === 1
            ? "1 plano selecionado"
            : `${quantidade} planos selecionados`;
}

limparSelecao.addEventListener("click", () => {
    planosSelecionados.clear();
    atualizarSelecaoVisual();
});

/* PLANOS RECENTES */

function renderizarRecentes() {
    planosRecentes.innerHTML = "";

    if (planos.length === 0) {
        planosRecentes.appendChild(
            criarCardPlano(planoExemplo)
        );

        atualizarSelecaoVisual();
        return;
    }

    const recentes = [...planos]
        .sort(
            (a, b) =>
                new Date(b.dataCriacao || 0) -
                new Date(a.dataCriacao || 0)
        )
        .slice(0, 2);

    recentes.forEach(plano => {
        planosRecentes.appendChild(
            criarCardPlano(plano)
        );
    });

    atualizarSelecaoVisual();
}

/* ESTADO VAZIO */

function mostrarEstadoVazio() {
    todosPlanos.innerHTML = `
        <div class="estado-vazio-planos">
            <div class="estado-vazio-conteudo">
                <div class="estado-vazio-icone">
                    <i class="fi fi-rr-book-open-cover"></i>
                </div>

                <h3>Nenhum plano de aula criado</h3>

                <p>
                    Seus planos de aula aparecerão aqui
                    depois que forem criados.
                </p>

                <div class="acoes-exemplo" aria-hidden="true">
                    <div class="acao-exemplo">
                        <i class="fi fi-rr-edit"></i>
                    </div>

                    <div class="acao-exemplo">
                        <i class="fi fi-rr-eye"></i>
                    </div>

                    <div class="acao-exemplo">
                        <i class="fi fi-rr-copy"></i>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/* TODOS */

function renderizarTodos(lista = planos) {
    todosPlanos.innerHTML = "";

    if (!Array.isArray(lista) || lista.length === 0) {
        mostrarEstadoVazio();
        return;
    }

    lista.forEach(plano => {
        todosPlanos.appendChild(
            criarCardPlano(plano)
        );
    });

    atualizarSelecaoVisual();
}

/* BUSCA */

function filtrarPlanos() {
    const texto = buscarPlano.value
        .trim()
        .toLowerCase();

    if (!texto) {
        renderizarTodos(planos);
        return;
    }

    const filtrados = planos.filter(plano => {
        const titulo = (plano.titulo || "").toLowerCase();
        const turma = (plano.turma || "").toLowerCase();

        return (
            titulo.includes(texto) ||
            turma.includes(texto)
        );
    });

    renderizarTodos(filtrados);
}

buscarPlano.addEventListener("input", filtrarPlanos);

/* MENU */

function abrirMenuPlano(plano, botao) {
    planoSelecionado = plano;

    menuNomePlano.textContent =
        plano.exemplo
            ? "Plano de exemplo"
            : plano.titulo || "Sem título";

    menuTurmaPlano.textContent =
        plano.exemplo
            ? "Card de demonstração"
            : plano.turma || "Sem turma";

    menuPlano.classList.add("aberto");

    requestAnimationFrame(() => {
        posicionarMenu(botao);
    });
}

function posicionarMenu(botao) {
    const rect = botao.getBoundingClientRect();
    const menuRect = menuPlano.getBoundingClientRect();
    const margem = 10;

    let left = rect.left;
    let top = rect.bottom + 6;

    if (
        left + menuRect.width >
        window.innerWidth - margem
    ) {
        left =
            window.innerWidth -
            menuRect.width -
            margem;
    }

    if (
        top + menuRect.height >
        window.innerHeight - margem
    ) {
        top =
            rect.top -
            menuRect.height -
            6;
    }

    if (left < margem) {
        left = margem;
    }

    if (top < margem) {
        top = margem;
    }

    menuPlano.style.left = `${left}px`;
    menuPlano.style.top = `${top}px`;
}

function fecharMenu() {
    menuPlano.classList.remove("aberto");
    planoSelecionado = null;
}

document.addEventListener("click", event => {
    if (
        !menuPlano.contains(event.target) &&
        !event.target.closest(".plano-menu-botao")
    ) {
        fecharMenu();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        fecharMenu();
    }
});

/* AÇÕES DO MENU */

menuPlano
    .querySelectorAll(".menu-opcao")
    .forEach(botao => {
        botao.addEventListener("click", () => {
            if (!planoSelecionado) {
                return;
            }

            const acao = botao.dataset.acao;
            executarAcao(acao, planoSelecionado);
            fecharMenu();
        });
    });

function executarAcao(acao, plano) {
    if (plano.exemplo) {
        mostrarToast(
            "Este é apenas o card de demonstração. As ações ficarão disponíveis em planos salvos."
        );
        return;
    }

    switch (acao) {
        case "editar":
            /*
                Quando o backend estiver conectado,
                o ID poderá ser usado para carregar
                o plano na tela de criação/edição.
            */
            mostrarToast(
                "A edição dependerá do carregamento do plano salvo."
            );
            break;

        case "visualizar":
            /*
                A visualização necessita dos dados
                completos do plano salvo.
            */
            mostrarToast(
                "A visualização completa dependerá dos dados do plano salvo."
            );
            break;

        case "copiar":
            /*
                Não duplicamos apenas no array local,
                porque isso fingiria uma persistência
                que ainda não existe.
            */
            mostrarToast(
                "Fazer uma cópia dependerá do salvamento no banco."
            );
            break;

        case "compartilhar":
            mostrarToast(
                "O compartilhamento dependerá das turmas e dos usuários cadastrados."
            );
            break;

        case "arquivar":
            mostrarToast(
                "O arquivamento dependerá do banco de dados."
            );
            break;

        case "excluir":
            mostrarToast(
                "A exclusão definitiva dependerá do banco de dados."
            );
            break;
    }
}

/* TOAST */

function mostrarToast(mensagem) {
    toastTexto.textContent = mensagem;
    toastPlano.classList.add("ativo");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        toastPlano.classList.remove("ativo");
    }, 3500);
}

/* BANCO */

function carregarPlanos(dados) {
    planos = Array.isArray(dados)
        ? dados
        : [];

    planosSelecionados.clear();

    renderizarRecentes();
    renderizarTodos();
    atualizarSelecaoVisual();
}

/*
    SEM BANCO:

    Planos recentes:
    -> 1 card cinza funcional para testar
       seleção e abertura do menu.

    Todos os planos:
    -> estado vazio.

    Não criamos, apagamos, copiamos,
    compartilhamos ou arquivamos registros
    falsos no JavaScript.

    Futuramente:

    carregarPlanos(dadosDoBanco);
*/

carregarPlanos(null);

/* UTILIDADES */

function escaparAtributo(valor) {
    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}