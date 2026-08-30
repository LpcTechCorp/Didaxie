const $ = id => document.getElementById(id);

const nomeAtividade = $("nomeAtividade");
const disciplina = $("disciplina");
const turma = $("turma");
const descricao = $("descricao");
const objetivo = $("objetivo");
const quantidade = $("quantidade");
const dificuldade = $("dificuldade");
const formato = $("formato");
const incluirGabarito = $("incluirGabarito");
const incluirExplicacoes = $("incluirExplicacoes");
const contextualizacao = $("contextualizacao");
const continuarEtapa = $("continuarEtapa");
const voltarEtapa = $("voltarEtapa");
const statusEtapa = $("statusEtapa");
const toast = $("toast");
const toastTexto = $("toastTexto");

let etapaAtual = 1;
let maiorEtapaLiberada = 1;
let tipoAtividade = "lista";
let modoCriacao = "manual";
let proximoIdQuestao = 1;
let proximoIdProjeto = 1;
let itemArrastado = null;
let toastTimer = null;

const atividade = {
    configuracao: {},
    conteudo: {
        lista: {
            questoes: []
        },

        quiz: {
            questoes: [],
            tempo: 0,
            embaralhar: false,
            feedbackImediato: false
        },

        diagnostica: {
            questoes: []
        },

        projeto: {
            orientacoes: "",
            resultado: "",
            etapas: [],
            criterios: []
        }
    }
};

const nomesTipo = {
    lista: "Lista de exercícios",
    quiz: "Quiz",
    diagnostica: "Diagnóstica",
    projeto: "Projeto"
};

const titulosTipo = {
    lista: "Monte sua lista de exercícios",
    quiz: "Monte seu quiz",
    diagnostica: "Monte sua atividade diagnóstica",
    projeto: "Estruture seu projeto"
};

/* =========================
TOAST
========================= */

function mostrarToast(mensagem) {
    toastTexto.textContent = mensagem;

    toast.classList.add(
        "show"
    );

    clearTimeout(
        toastTimer
    );

    toastTimer = setTimeout(
        () => {
            toast.classList.remove(
                "show"
            );
        },
        3200
    );
}

/* =========================
ETAPAS
========================= */

function atualizarEtapas() {
    document
        .querySelectorAll(".etapa")
        .forEach(etapa => {
            etapa.classList.toggle(
                "ativa",
                Number(
                    etapa.dataset.etapa
                ) === etapaAtual
            );
        });

    document
        .querySelectorAll(".etapa-nav")
        .forEach(botao => {
            const numero =
                Number(
                    botao.dataset.irEtapa
                );

            botao.classList.toggle(
                "ativa",
                numero === etapaAtual
            );

            botao.classList.toggle(
                "concluida",
                numero < etapaAtual
            );

            botao.classList.toggle(
                "liberada",
                numero <= maiorEtapaLiberada
            );

            botao.disabled =
                numero > maiorEtapaLiberada;
        });

    statusEtapa.textContent =
        `Etapa ${etapaAtual} de 3`;

    voltarEtapa.style.visibility =
        etapaAtual === 1
            ? "hidden"
            : "visible";

    continuarEtapa.innerHTML =
        etapaAtual === 3
            ? `
                Finalizar atividade
                <i class="fi fi-rr-check"></i>
            `
            : `
                Continuar
                <i class="fi fi-rr-angle-right"></i>
            `;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document
    .querySelectorAll(".etapa-nav")
    .forEach(botao => {
        botao.addEventListener(
            "click",
            () => {
                const destino =
                    Number(
                        botao.dataset.irEtapa
                    );

                if (
                    destino >
                    maiorEtapaLiberada
                ) {
                    return;
                }

                etapaAtual = destino;

                if (
                    etapaAtual === 3
                ) {
                    montarRevisao();
                }

                atualizarEtapas();
            }
        );
    });

voltarEtapa.addEventListener(
    "click",
    () => {
        if (
            etapaAtual > 1
        ) {
            etapaAtual--;

            atualizarEtapas();
        }
    }
);

continuarEtapa.addEventListener(
    "click",
    () => {
        if (
            etapaAtual === 1
        ) {
            if (
                !validarEtapa1()
            ) {
                return;
            }

            salvarConfiguracao();

            maiorEtapaLiberada =
                Math.max(
                    maiorEtapaLiberada,
                    2
                );

            etapaAtual = 2;

            prepararEtapa2();
            atualizarEtapas();

            return;
        }

        if (
            etapaAtual === 2
        ) {
            salvarConteudoAtual();

            if (
                !validarEtapa2()
            ) {
                return;
            }

            maiorEtapaLiberada =
                Math.max(
                    maiorEtapaLiberada,
                    3
                );

            etapaAtual = 3;

            montarRevisao();
            atualizarEtapas();

            return;
        }

        finalizarAtividade();
    }
);

/* =========================
ETAPA 1
========================= */

function validarEtapa1() {
    const erro =
        $("erroNomeAtividade");

    erro.textContent = "";

    nomeAtividade
        .closest(".campo")
        .classList.remove(
            "erro"
        );

    /*
        Somente o nome é obrigatório.

        Disciplina, turma, descrição,
        objetivo e preferências continuam
        opcionais.
    */

    if (
        nomeAtividade
            .value
            .trim()
    ) {
        return true;
    }

    erro.textContent =
        "Digite um nome para a atividade.";

    nomeAtividade
        .closest(".campo")
        .classList.add(
            "erro"
        );

    nomeAtividade.focus();

    return false;
}

function salvarConfiguracao() {
    atividade.configuracao = {
        nome:
            nomeAtividade
                .value
                .trim(),

        disciplina:
            disciplina.value || null,

        disciplinaNome:
            disciplina.value
                ? disciplina.options[
                    disciplina.selectedIndex
                ].text
                : "Nenhuma",

        turma:
            turma.value || null,

        turmaNome:
            turma.value
                ? turma.options[
                    turma.selectedIndex
                ].text
                : "Nenhuma",

        tipo:
            tipoAtividade,

        descricao:
            descricao
                .value
                .trim(),

        objetivo:
            objetivo
                .value
                .trim(),

        quantidadeSugerida:
            quantidade.value
                ? Number(
                    quantidade.value
                )
                : null,

        dificuldade:
            dificuldade.value || null,

        formato:
            formato.value || null,

        incluirGabarito:
            incluirGabarito.checked,

        incluirExplicacoes:
            incluirExplicacoes.checked,

        contextualizacao:
            contextualizacao.checked
    };
}

/* CONTADORES */

descricao.addEventListener(
    "input",
    () => {
        $("contadorDescricao")
            .textContent =
            descricao.value.length;
    }
);

objetivo.addEventListener(
    "input",
    () => {
        $("contadorObjetivo")
            .textContent =
            objetivo.value.length;
    }
);

/* TIPO DE ATIVIDADE */

document
    .querySelectorAll(".tipo-card")
    .forEach(botao => {
        botao.addEventListener(
            "click",
            () => {
                document
                    .querySelectorAll(
                        ".tipo-card"
                    )
                    .forEach(item => {
                        item.classList.remove(
                            "selecionado"
                        );
                    });

                botao.classList.add(
                    "selecionado"
                );

                tipoAtividade =
                    botao.dataset.tipo;

                $("configQuestoes")
                    .classList.toggle(
                        "escondido",
                        tipoAtividade ===
                        "projeto"
                    );

                $("campoFormato")
                    .classList.toggle(
                        "escondido",
                        tipoAtividade ===
                        "quiz"
                    );

                $("preferenciasQuestoes")
                    .classList.toggle(
                        "escondido",
                        tipoAtividade ===
                        "projeto"
                    );
            }
        );
    });

/* =========================
ETAPA 2
========================= */

function prepararEtapa2() {
    $("tipoAtualTexto")
        .textContent =
        nomesTipo[
        tipoAtividade
        ];

    $("tituloConteudo")
        .textContent =
        titulosTipo[
        tipoAtividade
        ];

    $("descricaoConteudo")
        .textContent =
        tipoAtividade === "projeto"
            ? "Organize as orientações, etapas e critérios do projeto."
            : "Adicione as questões e escolha o formato de cada uma.";

    $("conteudoQuestoes")
        .classList.toggle(
            "escondido",
            tipoAtividade ===
            "projeto"
        );

    $("conteudoProjeto")
        .classList.toggle(
            "escondido",
            tipoAtividade !==
            "projeto"
        );

    $("configQuiz")
        .classList.toggle(
            "escondido",
            tipoAtividade !==
            "quiz"
        );

    $("infoDiagnostica")
        .classList.toggle(
            "escondido",
            tipoAtividade !==
            "diagnostica"
        );

    $("tituloListaQuestoes")
        .textContent =
        tipoAtividade === "quiz"
            ? "Perguntas do quiz"
            : tipoAtividade ===
                "diagnostica"
                ? "Questões diagnósticas"
                : "Questões da lista";

    $("subtituloListaQuestoes")
        .textContent =
        tipoAtividade === "quiz"
            ? "Use questões objetivas com uma ou mais respostas corretas."
            : tipoAtividade ===
                "diagnostica"
                ? "Associe uma habilidade a cada questão."
                : "Combine diferentes formatos de questão livremente.";

    if (
        tipoAtividade !==
        "projeto"
        &&
        !obterQuestoes().length
    ) {
        adicionarQuestao();
    }

    if (
        tipoAtividade ===
        "projeto"
        &&
        !atividade
            .conteudo
            .projeto
            .etapas
            .length
    ) {
        adicionarEtapaProjeto();
    }

    renderizarQuestoes();
    renderizarProjeto();
    atualizarResumoIA();
}

/* MODO MANUAL / IA */

document
    .querySelectorAll(
        ".modo-tab"
    )
    .forEach(botao => {
        botao.addEventListener(
            "click",
            () => {
                selecionarModo(
                    botao.dataset.modo
                );
            }
        );
    });

function selecionarModo(modo) {
    modoCriacao = modo;

    document
        .querySelectorAll(
            ".modo-tab"
        )
        .forEach(botao => {
            botao.classList.toggle(
                "ativo",
                botao.dataset.modo ===
                modo
            );
        });

    $("modoManual")
        .classList.toggle(
            "escondido",
            modo !== "manual"
        );

    $("modoIA")
        .classList.toggle(
            "escondido",
            modo !== "ia"
        );

    atualizarResumoIA();
}

function atualizarResumoIA() {
    let texto =
        nomesTipo[
        tipoAtividade
        ];

    if (
        atividade
            .configuracao
            .disciplinaNome
        &&
        atividade
            .configuracao
            .disciplinaNome !==
        "Nenhuma"
    ) {
        texto +=
            ` • ${atividade.configuracao.disciplinaNome}`;
    }

    if (
        atividade
            .configuracao
            .dificuldade
    ) {
        texto +=
            ` • dificuldade ${atividade.configuracao.dificuldade}`;
    }

    texto +=
        ". A geração real será conectada ao backend.";

    $("resumoIA")
        .textContent =
        texto;
}

$("gerarIA").addEventListener(
    "click",
    () => {
        mostrarToast(
            "A geração por IA dependerá do backend."
        );
    }
);

/* =========================
QUESTÕES
========================= */

function obterQuestoes() {
    return atividade
        .conteudo[
        tipoAtividade
    ]
        ?.questoes || [];
}

function novaQuestao() {
    return {
        id:
            proximoIdQuestao++,

        enunciado:
            "",

        tipo:
            "multipla",

        alternativas: [
            {
                texto: "",
                correta: false
            },
            {
                texto: "",
                correta: false
            }
        ],

        habilidade:
            "",

        nivel:
            ""
    };
}

function adicionarQuestao() {
    if (
        tipoAtividade ===
        "projeto"
    ) {
        return;
    }

    obterQuestoes()
        .push(
            novaQuestao()
        );

    renderizarQuestoes();
}

$("adicionarQuestao")
    .addEventListener(
        "click",
        adicionarQuestao
    );

/* TIPOS PERMITIDOS */

function tiposPermitidos() {
    if (
        tipoAtividade ===
        "quiz"
    ) {
        return [
            "multipla",
            "multiplas",
            "verdadeiro-falso"
        ];
    }

    return [
        "multipla",
        "multiplas",
        "verdadeiro-falso",
        "resposta-curta",
        "dissertativa"
    ];
}

function opcoesTipo() {
    const nomes = {
        multipla:
            "Múltipla escolha (1 correta)",

        multiplas:
            "Múltiplas respostas (mais de 1)",

        "verdadeiro-falso":
            "Verdadeiro ou falso",

        "resposta-curta":
            "Resposta curta",

        dissertativa:
            "Dissertativa"
    };

    return tiposPermitidos()
        .map(
            tipo =>
                `<option value="${tipo}">${nomes[tipo]}</option>`
        )
        .join("");
}

function prepararAlternativasTipo(
    questao
) {
    if (
        questao.tipo ===
        "verdadeiro-falso"
    ) {
        questao.alternativas = [
            {
                texto:
                    "Verdadeiro",

                correta:
                    false
            },
            {
                texto:
                    "Falso",

                correta:
                    false
            }
        ];

        return;
    }

    if (
        [
            "multipla",
            "multiplas"
        ].includes(
            questao.tipo
        )
        &&
        questao
            .alternativas
            .length < 2
    ) {
        questao.alternativas = [
            {
                texto: "",
                correta: false
            },
            {
                texto: "",
                correta: false
            }
        ];
    }
}

/* RENDER DAS QUESTÕES */

function renderizarQuestoes() {
    const container =
        $("questoesEditor");

    container.innerHTML = "";

    if (
        tipoAtividade ===
        "projeto"
    ) {
        return;
    }

    obterQuestoes()
        .forEach(
            (
                questao,
                index
            ) => {
                const card =
                    document.createElement(
                        "article"
                    );

                card.className =
                    "questao-editor";

                card.dataset.id =
                    questao.id;

                card.innerHTML = `
                    <div class="questao-editor-topo">

                        <strong>
                            Questão ${index + 1}
                        </strong>

                        <select class="tipo-questao">
                            ${opcoesTipo()}
                        </select>

                        <button
                            type="button"
                            class="questao-toggle"
                            aria-label="Recolher questão"
                        >
                            <i class="fi fi-rr-angle-small-up"></i>
                        </button>

                        <button
                            type="button"
                            class="questao-excluir"
                            aria-label="Excluir questão"
                        >
                            <i class="fi fi-rr-trash"></i>
                        </button>

                    </div>

                    <div class="questao-corpo">

                        ${tipoAtividade ===
                        "diagnostica"
                        ? `
                                    <div class="diagnostica-meta">

                                        <div class="campo">
                                            <label>
                                                Habilidade / competência
                                            </label>

                                            <input
                                                type="text"
                                                class="habilidade-diagnostica"
                                                placeholder="Ex: Comparar frações"
                                                value="${esc(questao.habilidade)}"
                                            >
                                        </div>

                                        <div class="campo">
                                            <label>
                                                Nível
                                            </label>

                                            <select class="nivel-diagnostica">
                                                <option value="">Não definir</option>
                                                <option value="basico">Básico</option>
                                                <option value="intermediario">Intermediário</option>
                                                <option value="avancado">Avançado</option>
                                            </select>
                                        </div>

                                    </div>
                                `
                        : ""
                    }

                        <div class="campo">
                            <label>
                                Enunciado
                            </label>

                            <textarea
                                class="enunciado"
                                placeholder="Digite o enunciado da questão"
                            >${esc(questao.enunciado)}</textarea>
                        </div>

                        <div class="area-respostas"></div>

                    </div>
                `;

                container.appendChild(
                    card
                );

                const selectTipo =
                    card.querySelector(
                        ".tipo-questao"
                    );

                selectTipo.value =
                    questao.tipo;

                selectTipo.addEventListener(
                    "change",
                    () => {
                        questao.tipo =
                            selectTipo.value;

                        prepararAlternativasTipo(
                            questao
                        );

                        renderizarRespostas(
                            card,
                            questao
                        );
                    }
                );

                card
                    .querySelector(
                        ".enunciado"
                    )
                    .addEventListener(
                        "input",
                        event => {
                            questao.enunciado =
                                event
                                    .target
                                    .value;
                        }
                    );

                if (
                    tipoAtividade ===
                    "diagnostica"
                ) {
                    const habilidade =
                        card.querySelector(
                            ".habilidade-diagnostica"
                        );

                    const nivel =
                        card.querySelector(
                            ".nivel-diagnostica"
                        );

                    nivel.value =
                        questao.nivel;

                    habilidade
                        .addEventListener(
                            "input",
                            () => {
                                questao.habilidade =
                                    habilidade.value;
                            }
                        );

                    nivel
                        .addEventListener(
                            "change",
                            () => {
                                questao.nivel =
                                    nivel.value;
                            }
                        );
                }

                card
                    .querySelector(
                        ".questao-toggle"
                    )
                    .addEventListener(
                        "click",
                        () => {
                            card.classList.toggle(
                                "fechada"
                            );

                            card
                                .querySelector(
                                    ".questao-toggle i"
                                )
                                .className =
                                card
                                    .classList
                                    .contains(
                                        "fechada"
                                    )
                                    ? "fi fi-rr-angle-small-down"
                                    : "fi fi-rr-angle-small-up";
                        }
                    );

                card
                    .querySelector(
                        ".questao-excluir"
                    )
                    .addEventListener(
                        "click",
                        () => {
                            atividade
                                .conteudo[
                                tipoAtividade
                            ]
                                .questoes =
                                obterQuestoes()
                                    .filter(
                                        item =>
                                            item.id !==
                                            questao.id
                                    );

                            renderizarQuestoes();
                        }
                    );

                renderizarRespostas(
                    card,
                    questao
                );
            }
        );
}

/* =========================
ALTERNATIVAS REPETIDAS
========================= */

function normalizarAlternativa(
    texto
) {
    return String(
        texto || ""
    )
        .trim()
        .toLocaleLowerCase(
            "pt-BR"
        )
        .replace(
            /\s+/g,
            " "
        );
}

function duplicadasDaQuestao(
    questao
) {
    const mapa =
        new Map();

    questao
        .alternativas
        .forEach(
            alternativa => {
                const valor =
                    normalizarAlternativa(
                        alternativa.texto
                    );

                if (
                    !valor
                ) {
                    return;
                }

                mapa.set(
                    valor,
                    (
                        mapa.get(
                            valor
                        ) || 0
                    ) + 1
                );
            }
        );

    return new Set(
        [...mapa]
            .filter(
                (
                    [
                        ,
                        quantidade
                    ]
                ) =>
                    quantidade > 1
            )
            .map(
                ([valor]) =>
                    valor
            )
    );
}

function atualizarDuplicadas(
    card,
    questao
) {
    const duplicadas =
        duplicadasDaQuestao(
            questao
        );

    card
        .querySelectorAll(
            ".alternativa-item"
        )
        .forEach(
            (
                linha,
                indice
            ) => {
                const valor =
                    normalizarAlternativa(
                        questao
                            .alternativas[
                            indice
                        ]
                            ?.texto
                    );

                linha
                    .classList
                    .toggle(
                        "duplicada",
                        Boolean(
                            valor &&
                            duplicadas.has(
                                valor
                            )
                        )
                    );
            }
        );

    let aviso =
        card.querySelector(
            ".alternativas-aviso"
        );

    if (
        duplicadas.size
    ) {
        if (
            !aviso
        ) {
            aviso =
                document.createElement(
                    "small"
                );

            aviso.className =
                "alternativas-aviso";

            card
                .querySelector(
                    ".area-respostas"
                )
                .appendChild(
                    aviso
                );
        }

        aviso.textContent =
            "Não é permitido repetir a mesma alternativa.";
    } else {
        aviso?.remove();
    }
}

/* =========================
RESPOSTAS
========================= */

function renderizarRespostas(
    card,
    questao
) {
    const area =
        card.querySelector(
            ".area-respostas"
        );

    area.innerHTML = "";

    if (
        [
            "resposta-curta",
            "dissertativa"
        ].includes(
            questao.tipo
        )
    ) {
        area.innerHTML = `
            <div class="campo">

                <label>
                    Resposta do aluno
                </label>

                <input
                    type="text"
                    disabled
                    value="${questao.tipo ===
                "resposta-curta"
                ? "Campo de resposta curta"
                : "Campo de resposta dissertativa"
            }"
                >

            </div>
        `;

        return;
    }

    const label =
        document.createElement(
            "label"
        );

    label.textContent =
        "Alternativas";

    area.appendChild(
        label
    );

    /*
        Cabeçalho deixa claro onde a
        resposta correta deve ser marcada.
    */

    const cabecalho =
        document.createElement(
            "div"
        );

    cabecalho.className =
        "alternativas-cabecalho";

    cabecalho.innerHTML = `
        <span>Correta</span>
        <span>Alternativa</span>
        <span></span>
    `;

    area.appendChild(
        cabecalho
    );

    const lista =
        document.createElement(
            "div"
        );

    lista.className =
        "alternativas";

    questao
        .alternativas
        .forEach(
            (
                alternativa,
                indice
            ) => {
                const linha =
                    document.createElement(
                        "div"
                    );

                linha.className =
                    "alternativa-item";

                /*
                    Múltipla escolha:
                    radio = somente 1 correta.

                    Múltiplas respostas:
                    checkbox = várias corretas.
                */

                const correta =
                    document.createElement(
                        "input"
                    );

                correta.type =
                    questao.tipo ===
                        "multiplas"
                        ? "checkbox"
                        : "radio";

                if (
                    questao.tipo !==
                    "multiplas"
                ) {
                    correta.name =
                        `resposta-${questao.id}`;
                }

                correta.checked =
                    alternativa.correta;

                correta.title =
                    questao.tipo ===
                        "multiplas"
                        ? "Marcar como resposta correta"
                        : "Marcar como alternativa correta";

                correta.addEventListener(
                    "change",
                    () => {
                        if (
                            questao.tipo !==
                            "multiplas"
                        ) {
                            questao
                                .alternativas
                                .forEach(
                                    item => {
                                        item.correta =
                                            false;
                                    }
                                );
                        }

                        alternativa.correta =
                            correta.checked;

                        if (
                            questao.tipo !==
                            "multiplas"
                        ) {
                            renderizarRespostas(
                                card,
                                questao
                            );
                        }
                    }
                );

                const texto =
                    document.createElement(
                        "input"
                    );

                texto.type =
                    "text";

                texto.className =
                    "alternativa-texto";

                texto.value =
                    alternativa.texto;

                texto.placeholder =
                    `Alternativa ${indice + 1}`;

                if (
                    questao.tipo ===
                    "verdadeiro-falso"
                ) {
                    texto.disabled =
                        true;
                }

                texto.addEventListener(
                    "input",
                    () => {
                        alternativa.texto =
                            texto.value;

                        atualizarDuplicadas(
                            card,
                            questao
                        );
                    }
                );

                const remover =
                    document.createElement(
                        "button"
                    );

                remover.type =
                    "button";

                remover.className =
                    "remover-alternativa";

                remover.innerHTML =
                    '<i class="fi fi-rr-trash"></i>';

                if (
                    questao.tipo ===
                    "verdadeiro-falso"
                ) {
                    remover.style.visibility =
                        "hidden";
                }

                remover.addEventListener(
                    "click",
                    () => {
                        if (
                            questao
                                .alternativas
                                .length <= 2
                        ) {
                            mostrarToast(
                                "Mantenha pelo menos duas alternativas."
                            );

                            return;
                        }

                        questao
                            .alternativas
                            .splice(
                                indice,
                                1
                            );

                        renderizarRespostas(
                            card,
                            questao
                        );
                    }
                );

                linha.appendChild(
                    correta
                );

                linha.appendChild(
                    texto
                );

                linha.appendChild(
                    remover
                );

                lista.appendChild(
                    linha
                );
            }
        );

    area.appendChild(
        lista
    );

    if (
        questao.tipo !==
        "verdadeiro-falso"
    ) {
        const adicionar =
            document.createElement(
                "button"
            );

        adicionar.type =
            "button";

        adicionar.className =
            "btn-outline adicionar-alternativa";

        adicionar.innerHTML =
            '<i class="fi fi-rr-plus"></i> Adicionar alternativa';

        adicionar.addEventListener(
            "click",
            () => {
                questao
                    .alternativas
                    .push({
                        texto: "",
                        correta: false
                    });

                renderizarRespostas(
                    card,
                    questao
                );
            }
        );

        area.appendChild(
            adicionar
        );
    }

    atualizarDuplicadas(
        card,
        questao
    );
}

/* =========================
PROJETO
========================= */

function adicionarEtapaProjeto() {
    atividade
        .conteudo
        .projeto
        .etapas
        .push({
            id:
                proximoIdProjeto++,

            titulo:
                ""
        });

    renderizarProjeto();
}

function adicionarCriterio() {
    atividade
        .conteudo
        .projeto
        .criterios
        .push({
            id:
                proximoIdProjeto++,

            titulo:
                ""
        });

    renderizarProjeto();
}

$("adicionarEtapaProjeto")
    .addEventListener(
        "click",
        adicionarEtapaProjeto
    );

$("adicionarCriterio")
    .addEventListener(
        "click",
        adicionarCriterio
    );

function renderListaProjeto(
    containerId,
    itens,
    tipo
) {
    const container =
        $(containerId);

    container.innerHTML = "";

    itens.forEach(
        (
            item,
            indice
        ) => {
            const linha =
                document.createElement(
                    "div"
                );

            linha.className =
                "projeto-item";

            linha.innerHTML = `
                <span class="projeto-numero">
                    ${indice + 1}
                </span>

                <input
                    type="text"
                    value="${escAttr(item.titulo)}"
                    placeholder="${tipo ===
                    "etapa"
                    ? "Nome da etapa"
                    : "Critério de avaliação"
                }"
                >

                <button
                    type="button"
                    class="projeto-remover"
                >
                    <i class="fi fi-rr-trash"></i>
                </button>
            `;

            linha
                .querySelector(
                    "input"
                )
                .addEventListener(
                    "input",
                    event => {
                        item.titulo =
                            event
                                .target
                                .value;
                    }
                );

            linha
                .querySelector(
                    "button"
                )
                .addEventListener(
                    "click",
                    () => {
                        const alvo =
                            tipo ===
                                "etapa"
                                ? atividade
                                    .conteudo
                                    .projeto
                                    .etapas
                                : atividade
                                    .conteudo
                                    .projeto
                                    .criterios;

                        const indice =
                            alvo.findIndex(
                                elemento =>
                                    elemento.id ===
                                    item.id
                            );

                        if (
                            indice >= 0
                        ) {
                            alvo.splice(
                                indice,
                                1
                            );
                        }

                        renderizarProjeto();
                    }
                );

            container.appendChild(
                linha
            );
        }
    );
}

function renderizarProjeto() {
    renderListaProjeto(
        "etapasProjeto",
        atividade
            .conteudo
            .projeto
            .etapas,
        "etapa"
    );

    renderListaProjeto(
        "criteriosProjeto",
        atividade
            .conteudo
            .projeto
            .criterios,
        "criterio"
    );
}

/* =========================
SALVAR ETAPA 2
========================= */

function salvarConteudoAtual() {
    if (
        tipoAtividade ===
        "quiz"
    ) {
        atividade
            .conteudo
            .quiz
            .tempo =
            Number(
                $("tempoQuiz").value
            ) || 0;

        atividade
            .conteudo
            .quiz
            .embaralhar =
            $("quizEmbaralhar")
                .checked;

        atividade
            .conteudo
            .quiz
            .feedbackImediato =
            $("quizFeedback")
                .checked;
    }

    if (
        tipoAtividade ===
        "projeto"
    ) {
        atividade
            .conteudo
            .projeto
            .orientacoes =
            $("orientacoesProjeto")
                .value
                .trim();

        atividade
            .conteudo
            .projeto
            .resultado =
            $("resultadoProjeto")
                .value
                .trim();
    }
}

/* =========================
VALIDAÇÃO ETAPA 2
========================= */

function validarEtapa2() {
    if (
        modoCriacao ===
        "ia"
    ) {
        mostrarToast(
            "A criação com IA dependerá do backend."
        );

        return false;
    }

    return tipoAtividade ===
        "projeto"
        ? validarProjeto()
        : validarQuestoes();
}

function validarQuestoes() {
    const questoes =
        obterQuestoes();

    if (
        !questoes.length
    ) {
        mostrarToast(
            "Adicione pelo menos uma questão para continuar."
        );

        return false;
    }

    for (
        let indice = 0;
        indice < questoes.length;
        indice++
    ) {
        const questao =
            questoes[
            indice
            ];

        if (
            !questao
                .enunciado
                .trim()
        ) {
            mostrarToast(
                `Preencha o enunciado da questão ${indice + 1}.`
            );

            focarQuestao(
                questao.id
            );

            return false;
        }

        if (
            tipoAtividade ===
            "diagnostica"
            &&
            !questao
                .habilidade
                .trim()
        ) {
            mostrarToast(
                `Informe a habilidade avaliada na questão ${indice + 1}.`
            );

            focarQuestao(
                questao.id
            );

            return false;
        }

        if (
            [
                "multipla",
                "multiplas",
                "verdadeiro-falso"
            ].includes(
                questao.tipo
            )
        ) {
            const temVazia =
                questao
                    .alternativas
                    .some(
                        alternativa =>
                            !alternativa
                                .texto
                                .trim()
                    );

            if (
                temVazia
            ) {
                mostrarToast(
                    `Preencha todas as alternativas da questão ${indice + 1}.`
                );

                focarQuestao(
                    questao.id
                );

                return false;
            }

            /*
                Impede alternativas como:

                "Brasil"
                " brasil "
                "BRASIL"

                pois são consideradas iguais.
            */

            if (
                duplicadasDaQuestao(
                    questao
                ).size
            ) {
                mostrarToast(
                    `A questão ${indice + 1} possui alternativas repetidas.`
                );

                focarQuestao(
                    questao.id
                );

                return false;
            }

            if (
                incluirGabarito.checked
                &&
                !questao
                    .alternativas
                    .some(
                        alternativa =>
                            alternativa
                                .correta
                    )
            ) {
                mostrarToast(
                    `Marque a resposta correta da questão ${indice + 1}.`
                );

                focarQuestao(
                    questao.id
                );

                return false;
            }
        }
    }

    return true;
}

function validarProjeto() {
    const projeto =
        atividade
            .conteudo
            .projeto;

    if (
        !projeto.orientacoes
    ) {
        mostrarToast(
            "Preencha as orientações do projeto."
        );

        $("orientacoesProjeto")
            .focus();

        return false;
    }

    if (
        !projeto.resultado
    ) {
        mostrarToast(
            "Informe a entrega esperada do projeto."
        );

        $("resultadoProjeto")
            .focus();

        return false;
    }

    if (
        !projeto
            .etapas
            .length
    ) {
        mostrarToast(
            "Adicione pelo menos uma etapa ao projeto."
        );

        return false;
    }

    if (
        projeto
            .etapas
            .some(
                etapa =>
                    !etapa
                        .titulo
                        .trim()
            )
    ) {
        mostrarToast(
            "Preencha o nome de todas as etapas do projeto."
        );

        return false;
    }

    return true;
}

function focarQuestao(id) {
    selecionarModo(
        "manual"
    );

    const card =
        document.querySelector(
            `.questao-editor[data-id="${id}"]`
        );

    card?.classList.remove(
        "fechada"
    );

    card?.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

/* =========================
REVISÃO
========================= */

function montarRevisao() {
    salvarConfiguracao();
    salvarConteudoAtual();

    $("revisaoNome")
        .textContent =
        atividade
            .configuracao
            .nome;

    $("revisaoDisciplina")
        .textContent =
        atividade
            .configuracao
            .disciplinaNome;

    $("revisaoTurma")
        .textContent =
        atividade
            .configuracao
            .turmaNome;

    $("revisaoTipo")
        .textContent =
        nomesTipo[
        tipoAtividade
        ];

    $("revisaoDificuldade")
        .textContent =
        atividade
            .configuracao
            .dificuldade ||
        "Não definida";

    const projeto =
        tipoAtividade ===
        "projeto";

    $("revisaoQuestoes")
        .classList.toggle(
            "escondido",
            projeto
        );

    $("revisaoProjeto")
        .classList.toggle(
            "escondido",
            !projeto
        );

    $("labelQuantidadeRevisao")
        .textContent =
        projeto
            ? "Etapas"
            : "Questões";

    $("revisaoQuantidade")
        .textContent =
        projeto
            ? atividade
                .conteudo
                .projeto
                .etapas
                .length
            : obterQuestoes()
                .length;

    if (
        projeto
    ) {
        renderRevisaoProjeto();
    } else {
        renderRevisaoQuestoes();
    }
}

/* REORDENAR QUESTÕES */

function renderRevisaoQuestoes() {
    const container =
        $("questoesRevisao");

    container.innerHTML = "";

    obterQuestoes()
        .forEach(
            (
                questao,
                indice
            ) => {
                const card =
                    document.createElement(
                        "article"
                    );

                card.className =
                    "questao-revisao";

                card.draggable =
                    true;

                card.dataset.id =
                    questao.id;

                card.innerHTML = `
                    <i
                        class="fi fi-rr-grip-dots-vertical drag-handle"
                    ></i>

                    <div class="revisao-conteudo">

                        <strong>
                            Questão ${indice + 1}
                            •
                            ${nomeTipoQuestao(questao.tipo)}
                        </strong>

                        <p>
                            ${esc(questao.enunciado)}
                        </p>

                    </div>

                    <div class="revisao-acoes">

                        <button
                            type="button"
                            data-acao="editar"
                            title="Editar"
                        >
                            <i class="fi fi-rr-edit"></i>
                        </button>

                        <button
                            type="button"
                            data-acao="excluir"
                            title="Excluir"
                        >
                            <i class="fi fi-rr-trash"></i>
                        </button>

                    </div>
                `;

                card.addEventListener(
                    "dragstart",
                    () => {
                        itemArrastado =
                            questao.id;

                        card.classList.add(
                            "arrastando"
                        );
                    }
                );

                card.addEventListener(
                    "dragend",
                    () => {
                        itemArrastado =
                            null;

                        card.classList.remove(
                            "arrastando"
                        );
                    }
                );

                card.addEventListener(
                    "dragover",
                    event => {
                        event.preventDefault();
                    }
                );

                card.addEventListener(
                    "drop",
                    event => {
                        event.preventDefault();

                        if (
                            itemArrastado ===
                            questao.id
                        ) {
                            return;
                        }

                        const lista =
                            atividade
                                .conteudo[
                                tipoAtividade
                            ]
                                .questoes;

                        const origem =
                            lista.findIndex(
                                item =>
                                    item.id ===
                                    itemArrastado
                            );

                        const destino =
                            lista.findIndex(
                                item =>
                                    item.id ===
                                    questao.id
                            );

                        if (
                            origem < 0
                            ||
                            destino < 0
                        ) {
                            return;
                        }

                        const [
                            movido
                        ] =
                            lista.splice(
                                origem,
                                1
                            );

                        lista.splice(
                            destino,
                            0,
                            movido
                        );

                        renderRevisaoQuestoes();
                    }
                );

                card
                    .querySelector(
                        '[data-acao="editar"]'
                    )
                    .addEventListener(
                        "click",
                        () => {
                            etapaAtual = 2;

                            maiorEtapaLiberada =
                                Math.max(
                                    maiorEtapaLiberada,
                                    3
                                );

                            selecionarModo(
                                "manual"
                            );

                            atualizarEtapas();

                            setTimeout(
                                () => {
                                    focarQuestao(
                                        questao.id
                                    );
                                },
                                150
                            );
                        }
                    );

                card
                    .querySelector(
                        '[data-acao="excluir"]'
                    )
                    .addEventListener(
                        "click",
                        () => {
                            atividade
                                .conteudo[
                                tipoAtividade
                            ]
                                .questoes =
                                obterQuestoes()
                                    .filter(
                                        item =>
                                            item.id !==
                                            questao.id
                                    );

                            renderRevisaoQuestoes();

                            $("revisaoQuantidade")
                                .textContent =
                                obterQuestoes()
                                    .length;
                        }
                    );

                container.appendChild(
                    card
                );
            }
        );
}

/* EMBARALHAR */

$("embaralharQuestoes")
    .addEventListener(
        "click",
        () => {
            const lista =
                obterQuestoes();

            for (
                let indice =
                    lista.length - 1;
                indice > 0;
                indice--
            ) {
                const aleatorio =
                    Math.floor(
                        Math.random() *
                        (
                            indice + 1
                        )
                    );

                [
                    lista[indice],
                    lista[aleatorio]
                ] = [
                        lista[aleatorio],
                        lista[indice]
                    ];
            }

            renderRevisaoQuestoes();
        }
    );

/* REVISÃO PROJETO */

function renderRevisaoProjeto() {
    const projeto =
        atividade
            .conteudo
            .projeto;

    $("projetoRevisao")
        .innerHTML = `
            <h4>Orientações</h4>

            <p>
                ${esc(projeto.orientacoes)}
            </p>

            <h4>Entrega esperada</h4>

            <p>
                ${esc(projeto.resultado)}
            </p>

            <h4>Etapas</h4>

            <ol>
                ${projeto
            .etapas
            .map(
                etapa =>
                    `<li>${esc(etapa.titulo)}</li>`
            )
            .join("")
        }
            </ol>

            ${projeto
            .criterios
            .length
            ? `
                        <h4>Critérios</h4>

                        <ul>
                            ${projeto
                .criterios
                .map(
                    criterio =>
                        `<li>${esc(criterio.titulo)}</li>`
                )
                .join("")
            }
                        </ul>
                    `
            : ""
        }
        `;
}

$("editarProjeto")
    .addEventListener(
        "click",
        () => {
            etapaAtual = 2;

            selecionarModo(
                "manual"
            );

            atualizarEtapas();
        }
    );

function nomeTipoQuestao(tipo) {
    return {
        multipla:
            "Múltipla escolha",

        multiplas:
            "Múltiplas respostas",

        "verdadeiro-falso":
            "Verdadeiro ou falso",

        "resposta-curta":
            "Resposta curta",

        dissertativa:
            "Dissertativa"
    }[tipo] || tipo;
}

/* =========================
FINALIZAR
========================= */

function finalizarAtividade() {
    /*
        Não existe salvamento no banco
        ainda.

        O objeto fica pronto para ser
        enviado ao backend futuramente.
    */

    console.log(
        "Atividade pronta para backend:",
        atividade
    );

    mostrarToast(
        "Atividade pronta. O salvamento dependerá do backend."
    );
}

/* =========================
DADOS DO BANCO
========================= */

function carregarDisciplinas(
    dados
) {
    disciplina.innerHTML =
        '<option value="">Nenhuma</option>';

    if (
        !Array.isArray(
            dados
        )
    ) {
        return;
    }

    dados.forEach(
        item => {
            const option =
                document.createElement(
                    "option"
                );

            option.value =
                item.id ??
                item.nome;

            option.textContent =
                item.nome;

            disciplina.appendChild(
                option
            );
        }
    );
}

function carregarTurmas(
    dados
) {
    turma.innerHTML =
        '<option value="">Nenhuma</option>';

    if (
        !Array.isArray(
            dados
        )
    ) {
        return;
    }

    dados.forEach(
        item => {
            const option =
                document.createElement(
                    "option"
                );

            option.value =
                item.id ??
                item.nome;

            option.textContent =
                item.nome;

            turma.appendChild(
                option
            );
        }
    );
}

/* =========================
UTILIDADES
========================= */

function esc(valor) {
    return String(
        valor ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        );
}

function escAttr(valor) {
    return esc(
        valor
    )
        .replaceAll(
            '"',
            "&quot;"
        );
}

/* =========================
INICIALIZAÇÃO
========================= */

/*
    Sem banco:

    - nenhuma disciplina falsa;
    - nenhuma turma falsa;
    - nenhuma geração falsa de IA;
    - nenhuma persistência falsa.

    Futuramente:

    carregarDisciplinas(dadosDoBanco);
    carregarTurmas(dadosDoBanco);
*/

carregarDisciplinas(null);
carregarTurmas(null);
atualizarEtapas();