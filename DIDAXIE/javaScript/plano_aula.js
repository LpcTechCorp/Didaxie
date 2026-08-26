const buscarPlano = document.getElementById("buscarPlano");
const planosRecentes = document.getElementById("planosRecentes");
const todosPlanos = document.getElementById("todosPlanos");
const adicionarPlano = document.getElementById("adicionarPlano");

const menuPlano = document.getElementById("menuPlano");
const menuNomePlano = document.getElementById("menuNomePlano");
const menuTurmaPlano = document.getElementById("menuTurmaPlano");

let planos = [];
let planoSelecionado = null;

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

    if (plano.exemplo) {
        card.classList.add("placeholder");
    }

    card.innerHTML = `
        <div class="plano-card-topo">

            <button
                type="button"
                class="plano-menu-botao"
                aria-label="Opções do plano"
            >
                <i class="fi fi-rr-menu-dots"></i>
            </button>

            <input
                type="checkbox"
                class="plano-check"
                aria-label="Selecionar plano"
            >

        </div>

        <div class="plano-info">
            <span></span>
            <strong></strong>
        </div>
    `;

    const turma =
        card.querySelector(".plano-info span");

    const titulo =
        card.querySelector(".plano-info strong");

    const botaoMenu =
        card.querySelector(".plano-menu-botao");

    turma.textContent =
        plano.turma || "Sem turma";

    titulo.textContent =
        plano.titulo || "Sem título";

    titulo.title =
        plano.titulo || "Sem título";

    botaoMenu.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            abrirMenuPlano(
                plano,
                botaoMenu
            );

        }
    );

    return card;
}

/* PLANOS RECENTES */

function renderizarRecentes() {

    planosRecentes.innerHTML = "";

    if (planos.length === 0) {

        planosRecentes.appendChild(
            criarCardPlano(planoExemplo)
        );

        return;
    }

    const recentes =
        [...planos]
            .sort(
                (a, b) =>
                    new Date(b.dataCriacao || 0) -
                    new Date(a.dataCriacao || 0)
            )
            .slice(0, 2);

    recentes.forEach(
        plano => {

            planosRecentes.appendChild(
                criarCardPlano(plano)
            );

        }
    );
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

                <div
                    class="acoes-exemplo"
                    aria-hidden="true"
                >

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

    if (
        !Array.isArray(lista) ||
        lista.length === 0
    ) {

        mostrarEstadoVazio();
        return;
    }

    lista.forEach(
        plano => {

            todosPlanos.appendChild(
                criarCardPlano(plano)
            );

        }
    );
}

/* BUSCA */

function filtrarPlanos() {

    const texto =
        buscarPlano.value
            .trim()
            .toLowerCase();

    if (!texto) {

        renderizarTodos(planos);

        return;
    }

    const filtrados =
        planos.filter(
            plano => {

                const titulo =
                    (plano.titulo || "")
                        .toLowerCase();

                const turma =
                    (plano.turma || "")
                        .toLowerCase();

                return (
                    titulo.includes(texto) ||
                    turma.includes(texto)
                );

            }
        );

    renderizarTodos(filtrados);
}

buscarPlano.addEventListener(
    "input",
    filtrarPlanos
);

/* MENU */

function abrirMenuPlano(
    plano,
    botao
) {

    planoSelecionado = plano;

    menuNomePlano.textContent =
        plano.exemplo
            ? "Plano de exemplo"
            : plano.titulo;

    menuTurmaPlano.textContent =
        plano.exemplo
            ? "Sem dados cadastrados"
            : plano.turma || "Sem turma";

    menuPlano.classList.add("aberto");

    requestAnimationFrame(
        () => posicionarMenu(botao)
    );
}

function posicionarMenu(botao) {

    const rect =
        botao.getBoundingClientRect();

    const menuRect =
        menuPlano.getBoundingClientRect();

    const margem = 10;

    let left =
        rect.left;

    let top =
        rect.bottom + 6;

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

    menuPlano.style.left =
        `${left}px`;

    menuPlano.style.top =
        `${top}px`;
}

function fecharMenu() {

    menuPlano.classList.remove(
        "aberto"
    );

    planoSelecionado = null;
}

document.addEventListener(
    "click",
    event => {

        if (
            !menuPlano.contains(event.target) &&
            !event.target.closest(".plano-menu-botao")
        ) {

            fecharMenu();

        }

    }
);

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {
            fecharMenu();
        }

    }
);

/* AÇÕES */

menuPlano
    .querySelectorAll(".menu-opcao")
    .forEach(
        botao => {

            botao.addEventListener(
                "click",
                () => {

                    if (!planoSelecionado) {
                        return;
                    }

                    const acao =
                        botao.dataset.acao;

                    executarAcao(
                        acao,
                        planoSelecionado
                    );

                    fecharMenu();

                }
            );

        }
    );

function executarAcao(
    acao,
    plano
) {

    if (plano.exemplo) {

        console.log(
            `Teste da ação "${acao}"`,
            plano
        );

        return;
    }

    switch (acao) {

        case "editar":
            console.log(
                "Editar plano:",
                plano
            );
            break;

        case "visualizar":
            console.log(
                "Visualizar plano:",
                plano
            );
            break;

        case "copiar":
            console.log(
                "Copiar plano:",
                plano
            );
            break;

        case "compartilhar":
            console.log(
                "Compartilhar plano:",
                plano
            );
            break;

        case "arquivar":
            console.log(
                "Arquivar plano:",
                plano
            );
            break;

        case "excluir":
            console.log(
                "Excluir plano:",
                plano
            );
            break;

    }
}

/* ADICIONAR */

adicionarPlano.addEventListener(
    "click",
    () => {

        /*
            Futuramente pode levar para:

            window.location.href =
                "criar_plano_aula.html";
        */

        console.log(
            "Adicionar plano de aula"
        );

    }
);

/* BANCO */

function carregarPlanos(dados) {

    planos =
        Array.isArray(dados)
            ? dados
            : [];

    renderizarRecentes();
    renderizarTodos();
}

/*
    SEM BANCO:

    Planos recentes:
    → 1 card cinza funcional.

    Todos os planos:
    → estado vazio.

    Futuramente:

    carregarPlanos(dadosDoBanco);
*/

carregarPlanos(null);