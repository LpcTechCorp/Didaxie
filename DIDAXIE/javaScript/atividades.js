const buscarAtividade = document.getElementById("buscarAtividade");
const atividadesRecentes = document.getElementById("atividadesRecentes");
const todasAtividades = document.getElementById("todasAtividades");

const menuAtividade = document.getElementById("menuAtividade");
const menuNomeAtividade = document.getElementById("menuNomeAtividade");
const menuTurmaAtividade = document.getElementById("menuTurmaAtividade");

const barraSelecao = document.getElementById("barraSelecao");
const quantidadeSelecionada = document.getElementById("quantidadeSelecionada");
const limparSelecao = document.getElementById("limparSelecao");

const toastAtividade = document.getElementById("toastAtividade");
const toastTexto = document.getElementById("toastTexto");

let atividades = [];
let atividadeSelecionada = null;
let toastTimeout = null;

const atividadesSelecionadas = new Set();

/* CARD CINZA DE TESTE */

const atividadeExemplo = {
    id: "placeholder",
    nome: "Nome da atividade",
    turma: "Turma",
    exemplo: true
};

/* CRIAR CARD */

function criarCardAtividade(atividade) {
    const card = document.createElement("article");

    card.className = "atividade-card";
    card.dataset.atividadeId = atividade.id;

    if (atividade.exemplo) {
        card.classList.add("placeholder");
    }

    if (atividadesSelecionadas.has(atividade.id)) {
        card.classList.add("selecionado");
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
                ${atividadesSelecionadas.has(atividade.id) ? "checked" : ""}
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

    const checkbox =
        card.querySelector(
            ".atividade-check"
        );

    turma.textContent =
        atividade.turma || "Sem turma";

    nome.textContent =
        atividade.nome || "Sem nome";

    nome.title =
        atividade.nome || "Sem nome";

    checkbox.addEventListener(
        "change",
        () => {
            alterarSelecaoAtividade(
                atividade,
                checkbox.checked
            );
        }
    );

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

/* SELEÇÃO */

function alterarSelecaoAtividade(
    atividade,
    selecionada
) {
    if (selecionada) {
        atividadesSelecionadas.add(
            atividade.id
        );
    } else {
        atividadesSelecionadas.delete(
            atividade.id
        );
    }

    atualizarSelecaoVisual();
}

function atualizarSelecaoVisual() {
    document
        .querySelectorAll(".atividade-card")
        .forEach(card => {
            const id =
                card.dataset.atividadeId;

            const selecionada =
                atividadesSelecionadas.has(id);

            const checkbox =
                card.querySelector(
                    ".atividade-check"
                );

            card.classList.toggle(
                "selecionado",
                selecionada
            );

            if (checkbox) {
                checkbox.checked =
                    selecionada;
            }
        });

    const quantidade =
        atividadesSelecionadas.size;

    if (quantidade === 0) {
        barraSelecao.classList.remove(
            "ativa"
        );

        quantidadeSelecionada.textContent =
            "0 atividades selecionadas";

        return;
    }

    barraSelecao.classList.add(
        "ativa"
    );

    quantidadeSelecionada.textContent =
        quantidade === 1
            ? "1 atividade selecionada"
            : `${quantidade} atividades selecionadas`;
}

limparSelecao.addEventListener(
    "click",
    () => {
        atividadesSelecionadas.clear();
        atualizarSelecaoVisual();
    }
);

/* RECENTES */

function renderizarRecentes() {
    atividadesRecentes.innerHTML = "";

    if (atividades.length === 0) {
        atividadesRecentes.appendChild(
            criarCardAtividade(
                atividadeExemplo
            )
        );

        atualizarSelecaoVisual();

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

    atualizarSelecaoVisual();
}

/* ESTADO VAZIO */

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

function renderizarTodas(
    lista = atividades
) {
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

    atualizarSelecaoVisual();
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
            : atividade.nome ||
              "Sem nome";

    menuTurmaAtividade.textContent =
        atividade.exemplo
            ? "Card de demonstração"
            : atividade.turma ||
              "Sem turma";

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
        window.innerWidth -
        margem
    ) {
        left =
            window.innerWidth -
            menuRect.width -
            margem;
    }

    if (
        top +
        menuRect.height >
        window.innerHeight -
        margem
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
        if (
            event.key ===
            "Escape"
        ) {
            fecharMenu();
        }
    }
);

/* AÇÕES DO MENU */

menuAtividade
    .querySelectorAll(
        ".menu-opcao"
    )
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
    if (atividade.exemplo) {
        mostrarToast(
            "Esta é apenas a atividade de demonstração. As ações completas ficarão disponíveis em atividades salvas."
        );

        return;
    }

    switch (acao) {
        case "editar":
            mostrarToast(
                "A edição dependerá do carregamento da atividade salva."
            );
            break;

        case "visualizar":
            mostrarToast(
                "A visualização completa dependerá dos dados da atividade salva."
            );
            break;

        case "correcao":
            /*
                Quando houver uma atividade
                real, o ID poderá ser enviado
                para a página de correção.
            */

            mostrarToast(
                "A correção será vinculada à atividade salva."
            );
            break;

        case "copiar":
            mostrarToast(
                "Fazer uma cópia dependerá do salvamento no banco."
            );
            break;

        case "compartilhar":
            mostrarToast(
                "O compartilhamento dependerá das turmas cadastradas."
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
    toastTexto.textContent =
        mensagem;

    toastAtividade.classList.add(
        "ativo"
    );

    clearTimeout(
        toastTimeout
    );

    toastTimeout =
        setTimeout(
            () => {
                toastAtividade.classList.remove(
                    "ativo"
                );
            },
            3500
        );
}

/* BANCO */

function carregarAtividades(
    dados
) {
    atividades =
        Array.isArray(dados)
            ? dados
            : [];

    atividadesSelecionadas.clear();

    renderizarRecentes();
    renderizarTodas();
    atualizarSelecaoVisual();
}

/*
    SEM BANCO:

    Atividades recentes:
    -> card cinza de teste.

    Todas:
    -> estado vazio.

    A seleção funciona apenas
    na interface atual.

    As operações de editar,
    excluir, copiar, compartilhar,
    arquivar e correção real
    dependerão dos dados salvos.

    Futuramente:

    carregarAtividades(
        dadosDoBanco
    );
*/

carregarAtividades(null);