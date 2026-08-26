const buscarAtividade = document.getElementById("buscarAtividade");
const atividadesRecentes = document.getElementById("atividadesRecentes");
const todasAtividades = document.getElementById("todasAtividades");
const adicionarAtividade = document.getElementById("adicionarAtividade");

const menuAtividade = document.getElementById("menuAtividade");
const menuNomeAtividade = document.getElementById("menuNomeAtividade");
const menuTurmaAtividade = document.getElementById("menuTurmaAtividade");

let atividades = [];
let atividadeSelecionada = null;

/* CARD CINZA DE TESTE */

const atividadeExemplo = {
    id: "placeholder",
    nome: "Nome da atividade",
    turma: "Turma",
    exemplo: true
};

function criarCardAtividade(atividade) {

    const card = document.createElement("article");

    card.className = "atividade-card";

    if (atividade.exemplo) {
        card.classList.add("placeholder");
    }

    card.innerHTML = `
        <div class="atividade-card-topo">

            <button
                type="button"
                class="atividade-menu-botao"
                aria-label="Opções da atividade"
            >
                <i class="fi fi-rr-menu-dots"></i>
            </button>

            <input
                type="checkbox"
                class="atividade-check"
                aria-label="Selecionar atividade"
            >

        </div>

        <div class="atividade-info">
            <span></span>
            <strong></strong>
        </div>
    `;

    const turma =
        card.querySelector(
            ".atividade-info span"
        );

    const nome =
        card.querySelector(
            ".atividade-info strong"
        );

    const botaoMenu =
        card.querySelector(
            ".atividade-menu-botao"
        );

    turma.textContent =
        atividade.turma || "Sem turma";

    nome.textContent =
        atividade.nome || "Sem nome";

    botaoMenu.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            abrirMenuAtividade(
                atividade,
                botaoMenu
            );

        }
    );

    return card;
}

/* RECENTES */

function renderizarRecentes() {

    atividadesRecentes.innerHTML = "";

    if (atividades.length === 0) {

        atividadesRecentes.appendChild(
            criarCardAtividade(
                atividadeExemplo
            )
        );

        return;
    }

    const recentes =
        [...atividades]
            .sort(
                (a, b) =>
                    new Date(
                        b.dataCriacao || 0
                    ) -
                    new Date(
                        a.dataCriacao || 0
                    )
            )
            .slice(0, 2);

    recentes.forEach(
        atividade => {

            atividadesRecentes.appendChild(
                criarCardAtividade(
                    atividade
                )
            );

        }
    );
}

/* ESTADO VAZIO DE TODAS */

function mostrarEstadoVazio() {

    todasAtividades.innerHTML = `
        <div class="estado-vazio-atividades">

            <div class="estado-vazio-conteudo">

                <div class="estado-vazio-icone">
                    <i class="fi fi-rr-document"></i>
                </div>

                <h3>Nenhuma atividade criada</h3>

                <p>
                    As atividades criadas por você
                    aparecerão aqui.
                </p>

                <div
                    class="acoes-exemplo"
                    aria-hidden="true"
                >

                    <div class="acao-exemplo">
                        <i class="fi fi-rr-edit"></i>
                    </div>

                    <div class="acao-exemplo">
                        <i class="fi fi-rr-check-circle"></i>
                    </div>

                    <div class="acao-exemplo">
                        <i class="fi fi-rr-copy"></i>
                    </div>

                </div>

            </div>

        </div>
    `;
}

/* TODAS */

function renderizarTodas(lista = atividades) {

    todasAtividades.innerHTML = "";

    if (
        !Array.isArray(lista) ||
        lista.length === 0
    ) {

        mostrarEstadoVazio();

        return;
    }

    lista.forEach(
        atividade => {

            todasAtividades.appendChild(
                criarCardAtividade(
                    atividade
                )
            );

        }
    );
}

/* BUSCA */

function filtrarAtividades() {

    const texto =
        buscarAtividade.value
            .trim()
            .toLowerCase();

    if (!texto) {

        renderizarTodas(
            atividades
        );

        return;
    }

    const filtradas =
        atividades.filter(
            atividade => {

                const nome =
                    (
                        atividade.nome ||
                        ""
                    ).toLowerCase();

                const turma =
                    (
                        atividade.turma ||
                        ""
                    ).toLowerCase();

                return (
                    nome.includes(texto) ||
                    turma.includes(texto)
                );

            }
        );

    renderizarTodas(
        filtradas
    );
}

buscarAtividade.addEventListener(
    "input",
    filtrarAtividades
);

/* MENU */

function abrirMenuAtividade(
    atividade,
    botao
) {

    atividadeSelecionada =
        atividade;

    menuNomeAtividade.textContent =
        atividade.exemplo
            ? "Atividade de exemplo"
            : atividade.nome;

    menuTurmaAtividade.textContent =
        atividade.exemplo
            ? "Sem dados cadastrados"
            : atividade.turma || "Sem turma";

    menuAtividade.classList.add(
        "aberto"
    );

    requestAnimationFrame(
        () => {

            posicionarMenu(
                botao
            );

        }
    );
}

function posicionarMenu(botao) {

    const rect =
        botao.getBoundingClientRect();

    const menuRect =
        menuAtividade.getBoundingClientRect();

    const margem = 10;

    let left =
        rect.left;

    let top =
        rect.bottom + 6;

    if (
        left +
        menuRect.width >
        window.innerWidth - margem
    ) {

        left =
            window.innerWidth -
            menuRect.width -
            margem;

    }

    if (
        top +
        menuRect.height >
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

    menuAtividade.style.left =
        `${left}px`;

    menuAtividade.style.top =
        `${top}px`;
}

function fecharMenu() {

    menuAtividade.classList.remove(
        "aberto"
    );

    atividadeSelecionada = null;
}

document.addEventListener(
    "click",
    event => {

        if (
            !menuAtividade.contains(
                event.target
            ) &&
            !event.target.closest(
                ".atividade-menu-botao"
            )
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

/* AÇÕES DO MENU */

menuAtividade
    .querySelectorAll(".menu-opcao")
    .forEach(
        botao => {

            botao.addEventListener(
                "click",
                () => {

                    if (
                        !atividadeSelecionada
                    ) {
                        return;
                    }

                    const acao =
                        botao.dataset.acao;

                    executarAcao(
                        acao,
                        atividadeSelecionada
                    );

                    fecharMenu();

                }
            );

        }
    );

function executarAcao(
    acao,
    atividade
) {

    /*
        O card cinza existe para testar
        a interface.

        Nenhum dado é salvo ou alterado.
    */

    if (atividade.exemplo) {

        console.log(
            `Teste da ação "${acao}"`,
            atividade
        );

        return;
    }

    switch (acao) {

        case "editar":
            console.log(
                "Editar:",
                atividade
            );
            break;

        case "visualizar":
            console.log(
                "Visualizar:",
                atividade
            );
            break;

        case "correcao":
            console.log(
                "Correção:",
                atividade
            );
            break;

        case "copiar":
            console.log(
                "Copiar:",
                atividade
            );
            break;

        case "compartilhar":
            console.log(
                "Compartilhar:",
                atividade
            );
            break;

        case "arquivar":
            console.log(
                "Arquivar:",
                atividade
            );
            break;

        case "excluir":
            console.log(
                "Excluir:",
                atividade
            );
            break;

    }
}

/* ADICIONAR */

adicionarAtividade.addEventListener(
    "click",
    () => {

        /*
            Futuramente:

            window.location.href =
                "criar_atividade.html";
        */

        console.log(
            "Adicionar atividade"
        );

    }
);

/* BANCO */

function carregarAtividades(dados) {

    atividades =
        Array.isArray(dados)
            ? dados
            : [];

    renderizarRecentes();
    renderizarTodas();
}

/*
    Sem banco:

    recentes -> card cinza de teste
    todas -> estado vazio

    Futuramente:

    carregarAtividades(dadosDoBanco);
*/

carregarAtividades(null);