const etapas = document.querySelectorAll(".etapa");
const etapasNav = document.querySelectorAll(".etapa-nav");

const tituloPagina = document.getElementById("tituloPagina");
const voltarEtapa = document.getElementById("voltarEtapa");
const continuarEtapa = document.getElementById("continuarEtapa");

const nomeAtividade = document.getElementById("nomeAtividade");
const disciplina = document.getElementById("disciplina");
const turma = document.getElementById("turma");
const descricao = document.getElementById("descricao");
const objetivo = document.getElementById("objetivo");

const quantidade = document.getElementById("quantidade");
const dificuldade = document.getElementById("dificuldade");
const formato = document.getElementById("formato");

const incluirGabarito = document.getElementById("incluirGabarito");
const incluirExplicacoes = document.getElementById("incluirExplicacoes");
const contextualizacao = document.getElementById("contextualizacao");

const configQuestoes = document.getElementById("configQuestoes");
const preferenciasQuestoes = document.getElementById("preferenciasQuestoes");
const campoFormato = document.getElementById("campoFormato");

const erroNomeAtividade = document.getElementById("erroNomeAtividade");
const erroDescricao = document.getElementById("erroDescricao");
const erroObjetivo = document.getElementById("erroObjetivo");

const contadorDescricao = document.getElementById("contadorDescricao");
const contadorObjetivo = document.getElementById("contadorObjetivo");

const tipoAtualTexto = document.getElementById("tipoAtualTexto");
const tituloConteudo = document.getElementById("tituloConteudo");
const descricaoConteudo = document.getElementById("descricaoConteudo");

const modoTabs = document.querySelectorAll(".modo-tab");

const tempoQuiz = document.getElementById("tempoQuiz");
const quizEmbaralhar = document.getElementById("quizEmbaralhar");
const quizFeedback = document.getElementById("quizFeedback");

const orientacoesProjeto = document.getElementById("orientacoesProjeto");
const resultadoProjeto = document.getElementById("resultadoProjeto");
const etapasProjeto = document.getElementById("etapasProjeto");
const criteriosProjeto = document.getElementById("criteriosProjeto");

const revisaoNome = document.getElementById("revisaoNome");
const revisaoDisciplina = document.getElementById("revisaoDisciplina");
const revisaoTurma = document.getElementById("revisaoTurma");
const revisaoTipo = document.getElementById("revisaoTipo");
const revisaoDificuldade = document.getElementById("revisaoDificuldade");
const revisaoQuantidade = document.getElementById("revisaoQuantidade");
const labelQuantidadeRevisao = document.getElementById("labelQuantidadeRevisao");

const revisaoQuestoes = document.getElementById("revisaoQuestoes");
const revisaoProjeto = document.getElementById("revisaoProjeto");
const questoesRevisao = document.getElementById("questoesRevisao");
const avisosRevisao = document.getElementById("avisosRevisao");
const projetoRevisao = document.getElementById("projetoRevisao");

const toast = document.getElementById("toast");
const toastTexto = document.getElementById("toastTexto");

let etapaAtual = 1;
let maiorEtapaLiberada = 1;
let tipoAtividade = "lista";
let modoCriacao = "manual";

let proximoIdQuestao = 1;
let proximoIdProjeto = 1;

let itemArrastado = null;

const etapasConcluidas = {
    1: false,
    2: false,
    3: false
};

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

const configuracoesTipo = {
    lista: {
        nome: "Lista de exercícios",
        titulo: "Monte sua lista de exercícios",
        descricao: "Crie uma sequência de questões para prática e fixação."
    },

    quiz: {
        nome: "Quiz",
        titulo: "Monte seu quiz",
        descricao: "Crie perguntas objetivas para uma atividade rápida e dinâmica."
    },

    diagnostica: {
        nome: "Diagnóstica",
        titulo: "Monte sua atividade diagnóstica",
        descricao: "Avalie habilidades específicas e identifique conhecimentos prévios."
    },

    projeto: {
        nome: "Projeto",
        titulo: "Estruture seu projeto",
        descricao: "Defina orientações, etapas, entregas e critérios de avaliação."
    }
};

/* ==============================
ETAPAS
============================== */

function atualizarEtapas() {
    etapas.forEach(etapa => {
        etapa.classList.toggle(
            "ativa",
            Number(etapa.dataset.etapa) === etapaAtual
        );
    });

    etapasNav.forEach(botao => {
        const numero = Number(botao.dataset.irEtapa);

        botao.classList.toggle(
            "ativa",
            numero === etapaAtual
        );

        botao.classList.toggle(
            "concluida",
            Boolean(etapasConcluidas[numero])
        );

        botao.classList.toggle(
            "liberada",
            numero <= maiorEtapaLiberada
        );

        botao.disabled =
            numero > maiorEtapaLiberada;
    });

    tituloPagina.textContent =
        etapaAtual === 1
            ? "Criar atividades"
            : etapaAtual === 2
                ? "Conteúdo"
                : "Revisão";

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

etapasNav.forEach(botao => {
    botao.addEventListener("click", () => {
        const destino =
            Number(botao.dataset.irEtapa);

        if (destino > maiorEtapaLiberada) {
            return;
        }

        etapaAtual = destino;

        if (destino === 2) {
            prepararEtapa2();
        }

        if (destino === 3) {
            renderizarRevisao();
        }

        atualizarEtapas();
    });
});

voltarEtapa.addEventListener("click", () => {
    if (etapaAtual <= 1) {
        return;
    }

    etapaAtual--;

    if (etapaAtual === 2) {
        prepararEtapa2();
    }

    atualizarEtapas();
});

continuarEtapa.addEventListener("click", () => {
    if (etapaAtual === 1) {
        if (!validarEtapa1()) {
            mostrarToast(
                "Complete os campos obrigatórios para continuar."
            );

            return;
        }

        salvarConfiguracao();

        etapasConcluidas[1] = true;

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

    if (etapaAtual === 2) {
        salvarConteudoAtual();

        if (!validarEtapa2()) {
            return;
        }

        etapasConcluidas[2] = true;

        maiorEtapaLiberada = 3;

        etapaAtual = 3;

        renderizarRevisao();
        atualizarEtapas();

        return;
    }

    finalizarAtividade();
});

/* ==============================
VALIDAÇÃO ETAPA 1
============================== */

function validarEtapa1() {
    let valido = true;

    limparErrosEtapa1();

    if (!nomeAtividade.value.trim()) {
        erroNomeAtividade.textContent =
            "Digite um nome para a atividade.";

        nomeAtividade
            .closest(".campo")
            .classList.add("erro");

        valido = false;
    }

    if (!descricao.value.trim()) {
        erroDescricao.textContent =
            "Informe o tópico ou a descrição da atividade.";

        descricao
            .closest(".campo")
            .classList.add("erro");

        valido = false;
    }

    if (!objetivo.value.trim()) {
        erroObjetivo.textContent =
            "Informe o objetivo de aprendizagem.";

        objetivo
            .closest(".campo")
            .classList.add("erro");

        valido = false;
    }

    if (!valido) {
        const primeiroErro =
            document.querySelector(
                ".etapa[data-etapa='1'] .campo.erro"
            );

        primeiroErro?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    return valido;
}

function limparErrosEtapa1() {
    erroNomeAtividade.textContent = "";
    erroDescricao.textContent = "";
    erroObjetivo.textContent = "";

    document
        .querySelectorAll(
            ".etapa[data-etapa='1'] .campo.erro"
        )
        .forEach(campo => {
            campo.classList.remove("erro");
        });
}

nomeAtividade.addEventListener("input", () => {
    erroNomeAtividade.textContent = "";

    nomeAtividade
        .closest(".campo")
        .classList.remove("erro");
});

descricao.addEventListener("input", () => {
    contadorDescricao.textContent =
        descricao.value.length;

    erroDescricao.textContent = "";

    descricao
        .closest(".campo")
        .classList.remove("erro");
});

objetivo.addEventListener("input", () => {
    contadorObjetivo.textContent =
        objetivo.value.length;

    erroObjetivo.textContent = "";

    objetivo
        .closest(".campo")
        .classList.remove("erro");
});

/* ==============================
TIPO DA ATIVIDADE
============================== */

document
    .querySelectorAll(".tipo-card")
    .forEach(card => {
        card.addEventListener("click", () => {
            document
                .querySelectorAll(".tipo-card")
                .forEach(item => {
                    item.classList.remove(
                        "selecionado"
                    );
                });

            card.classList.add(
                "selecionado"
            );

            tipoAtividade =
                card.dataset.tipo;

            atualizarConfiguracaoPorTipo();
        });
    });

function atualizarConfiguracaoPorTipo() {
    const projeto =
        tipoAtividade === "projeto";

    const quiz =
        tipoAtividade === "quiz";

    configQuestoes.classList.toggle(
        "escondido",
        projeto
    );

    campoFormato.classList.toggle(
        "escondido",
        quiz
    );

    preferenciasQuestoes.classList.toggle(
        "escondido",
        projeto
    );
}

/* ==============================
SALVAR CONFIGURAÇÃO LOCAL
============================== */

function salvarConfiguracao() {
    atividade.configuracao = {
        nome:
            nomeAtividade.value.trim(),

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
            descricao.value.trim(),

        objetivo:
            objetivo.value.trim(),

        quantidadeSugerida:
            tipoAtividade === "projeto"
                ? null
                : quantidade.value
                    ? Number(quantidade.value)
                    : null,

        dificuldade:
            tipoAtividade === "projeto"
                ? null
                : dificuldade.value || null,

        formato:
            tipoAtividade === "projeto"
                ? null
                : formato.value || null,

        gabarito:
            tipoAtividade !== "projeto"
            && incluirGabarito.checked,

        explicacoes:
            tipoAtividade !== "projeto"
            && incluirExplicacoes.checked,

        contextualizacao:
            tipoAtividade !== "projeto"
            && contextualizacao.checked
    };
}

/* ==============================
ETAPA 2
============================== */

function prepararEtapa2() {
    salvarConfiguracao();

    const config =
        configuracoesTipo[
            tipoAtividade
        ];

    tipoAtualTexto.textContent =
        config.nome;

    tituloConteudo.textContent =
        config.titulo;

    descricaoConteudo.textContent =
        config.descricao;

    document
        .querySelectorAll(
            ".conteudo-tipo"
        )
        .forEach(bloco => {
            bloco.classList.toggle(
                "escondido",
                bloco.dataset.conteudoTipo !==
                    tipoAtividade
            );
        });

    selecionarModo(
        modoCriacao
    );

    atualizarResumoIA();

    if (
        modoCriacao === "manual"
        && tipoAtividade !== "projeto"
        && obterQuestoesAtuais().length === 0
    ) {
        adicionarQuestaoPorTipo(
            tipoAtividade
        );
    }

    if (
        tipoAtividade === "projeto"
        && atividade
            .conteudo
            .projeto
            .etapas
            .length === 0
    ) {
        adicionarEtapaProjeto();
    }

    renderizarConteudo();
}

/* ==============================
MANUAL / IA
============================== */

modoTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        selecionarModo(
            tab.dataset.modo
        );
    });
});

function selecionarModo(modo) {
    modoCriacao = modo;

    modoTabs.forEach(tab => {
        tab.classList.toggle(
            "ativo",
            tab.dataset.modo === modo
        );
    });

    document
        .querySelectorAll(".modo-manual")
        .forEach(bloco => {
            bloco.classList.add(
                "escondido"
            );
        });

    document
        .querySelectorAll(
            "[data-ia-tipo]"
        )
        .forEach(bloco => {
            bloco.classList.add(
                "escondido"
            );
        });

    if (modo === "manual") {
        const manual =
            document.querySelector(
                `[data-manual-tipo="${tipoAtividade}"]`
            );

        manual?.classList.remove(
            "escondido"
        );
    } else {
        const ia =
            document.querySelector(
                `[data-ia-tipo="${tipoAtividade}"]`
            );

        ia?.classList.remove(
            "escondido"
        );
    }
}

/* ==============================
QUESTÕES
============================== */

document
    .querySelectorAll(
        ".adicionar-questao"
    )
    .forEach(botao => {
        botao.addEventListener(
            "click",
            () => {
                adicionarQuestaoPorTipo(
                    botao.dataset.destino
                );
            }
        );
    });

function adicionarQuestaoPorTipo(tipo) {
    const questao = {
        id:
            proximoIdQuestao++,

        enunciado: "",

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

        habilidade: "",

        nivel: ""
    };

    atividade
        .conteudo[tipo]
        .questoes
        .push(questao);

    renderizarQuestoes(
        tipo
    );
}

function obterQuestoesAtuais() {
    if (
        tipoAtividade === "projeto"
    ) {
        return [];
    }

    return atividade
        .conteudo[tipoAtividade]
        .questoes;
}

function renderizarConteudo() {
    if (
        tipoAtividade === "lista"
    ) {
        renderizarQuestoes(
            "lista"
        );
    }

    if (
        tipoAtividade === "quiz"
    ) {
        renderizarQuestoes(
            "quiz"
        );
    }

    if (
        tipoAtividade === "diagnostica"
    ) {
        renderizarQuestoes(
            "diagnostica"
        );
    }

    if (
        tipoAtividade === "projeto"
    ) {
        renderizarProjeto();
    }
}

function obterContainerQuestoes(
    tipo
) {
    const containers = {
        lista:
            document.getElementById(
                "questoesLista"
            ),

        quiz:
            document.getElementById(
                "questoesQuiz"
            ),

        diagnostica:
            document.getElementById(
                "questoesDiagnostica"
            )
    };

    return containers[tipo];
}

function renderizarQuestoes(tipo) {
    const container =
        obterContainerQuestoes(
            tipo
        );

    const questoes =
        atividade
            .conteudo[tipo]
            .questoes;

    container.innerHTML = "";

    questoes.forEach(
        (questao, index) => {
            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "questao-editor";

            card.dataset.id =
                questao.id;

            const selectTipo =
                tipo === "quiz"
                    ? `
                        <select class="tipo-questao">
                            <option value="multipla">Múltipla escolha</option>
                            <option value="multiplas">Múltiplas respostas</option>
                            <option value="verdadeiro-falso">Verdadeiro ou falso</option>
                        </select>
                    `
                    : `
                        <select class="tipo-questao">
                            <option value="multipla">Múltipla escolha</option>
                            <option value="multiplas">Múltiplas respostas</option>
                            <option value="verdadeiro-falso">Verdadeiro ou falso</option>
                            <option value="resposta-curta">Resposta curta</option>
                            <option value="dissertativa">Dissertativa</option>
                        </select>
                    `;

            card.innerHTML = `
                <div class="questao-editor-topo">

                    <strong>
                        Questão ${index + 1}
                    </strong>

                    ${selectTipo}

                    <button
                        type="button"
                        class="questao-toggle"
                    >
                        <i class="fi fi-rr-angle-small-up"></i>
                    </button>

                    <button
                        type="button"
                        class="questao-excluir"
                    >
                        <i class="fi fi-rr-trash"></i>
                    </button>

                </div>

                <div class="questao-corpo">

                    ${
                        tipo === "diagnostica"
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
                                            value="${escapeHTML(questao.habilidade)}"
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
                        >${escapeHTML(questao.enunciado)}</textarea>

                    </div>

                    <div class="area-respostas"></div>

                </div>
            `;

            const tipoSelect =
                card.querySelector(
                    ".tipo-questao"
                );

            tipoSelect.value =
                questao.tipo;

            tipoSelect.addEventListener(
                "change",
                () => {
                    questao.tipo =
                        tipoSelect.value;

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
                            event.target.value;
                    }
                );

            if (
                tipo === "diagnostica"
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

                habilidade.addEventListener(
                    "input",
                    () => {
                        questao.habilidade =
                            habilidade.value;
                    }
                );

                nivel.addEventListener(
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

                        const icone =
                            card.querySelector(
                                ".questao-toggle i"
                            );

                        icone.className =
                            card.classList.contains(
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
                            .conteudo[tipo]
                            .questoes =
                            atividade
                                .conteudo[tipo]
                                .questoes
                                .filter(
                                    item =>
                                        item.id !==
                                        questao.id
                                );

                        renderizarQuestoes(
                            tipo
                        );
                    }
                );

            container.appendChild(
                card
            );

            renderizarRespostas(
                card,
                questao
            );
        }
    );
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
        && questao
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
        questao.tipo ===
            "resposta-curta"
        || questao.tipo ===
            "dissertativa"
    ) {
        area.innerHTML = `
            <div class="campo">

                <label>
                    Resposta do aluno
                </label>

                <input
                    type="text"
                    disabled
                    value="${
                        questao.tipo ===
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

    const alternativas =
        document.createElement(
            "div"
        );

    alternativas.className =
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

                alternativas.appendChild(
                    linha
                );
            }
        );

    area.appendChild(
        alternativas
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
}

/* ==============================
VALIDAÇÃO ETAPA 2
============================== */

function validarEtapa2() {
    if (
        modoCriacao === "ia"
    ) {
        mostrarToast(
            "A criação com IA dependerá do backend."
        );

        return false;
    }

    if (
        tipoAtividade === "projeto"
    ) {
        return validarProjeto();
    }

    return validarQuestoesEtapa2();
}

function validarQuestoesEtapa2() {
    const questoes =
        obterQuestoesAtuais();

    if (
        !questoes.length
    ) {
        mostrarToast(
            "Adicione pelo menos uma questão para continuar."
        );

        return false;
    }

    for (
        let i = 0;
        i < questoes.length;
        i++
    ) {
        const questao =
            questoes[i];

        if (
            !questao
                .enunciado
                .trim()
        ) {
            mostrarToast(
                `Preencha o enunciado da questão ${i + 1}.`
            );

            focarQuestao(
                questao.id
            );

            return false;
        }

        if (
            tipoAtividade ===
                "diagnostica"
            && !questao
                .habilidade
                .trim()
        ) {
            mostrarToast(
                `Informe a habilidade avaliada na questão ${i + 1}.`
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
            const vazia =
                questao
                    .alternativas
                    .some(
                        alternativa =>
                            !alternativa
                                .texto
                                .trim()
                    );

            if (
                vazia
            ) {
                mostrarToast(
                    `Preencha todas as alternativas da questão ${i + 1}.`
                );

                focarQuestao(
                    questao.id
                );

                return false;
            }

            if (
                incluirGabarito.checked
                && !questao
                    .alternativas
                    .some(
                        alternativa =>
                            alternativa
                                .correta
                    )
            ) {
                mostrarToast(
                    `Marque a resposta correta da questão ${i + 1}.`
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

function focarQuestao(id) {
    selecionarModo(
        "manual"
    );

    const editor =
        document.querySelector(
            `.questao-editor[data-id="${id}"]`
        );

    if (
        !editor
    ) {
        return;
    }

    editor.classList.remove(
        "fechada"
    );

    editor.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

/* ==============================
QUIZ
============================== */

function salvarQuiz() {
    atividade
        .conteudo
        .quiz
        .tempo =
        Number(
            tempoQuiz.value
        );

    atividade
        .conteudo
        .quiz
        .embaralhar =
        quizEmbaralhar.checked;

    atividade
        .conteudo
        .quiz
        .feedbackImediato =
        quizFeedback.checked;
}

/* ==============================
PROJETO
============================== */

document
    .getElementById(
        "adicionarEtapaProjeto"
    )
    .addEventListener(
        "click",
        adicionarEtapaProjeto
    );

document
    .getElementById(
        "adicionarCriterio"
    )
    .addEventListener(
        "click",
        adicionarCriterio
    );

function adicionarEtapaProjeto() {
    atividade
        .conteudo
        .projeto
        .etapas
        .push({
            id:
                proximoIdProjeto++,

            titulo:
                "",

            prazo:
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

            nome:
                "",

            peso:
                ""
        });

    renderizarProjeto();
}

function renderizarProjeto() {
    etapasProjeto.innerHTML =
        "";

    criteriosProjeto.innerHTML =
        "";

    atividade
        .conteudo
        .projeto
        .etapas
        .forEach(
            (
                etapa,
                index
            ) => {
                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "projeto-item";

                item.innerHTML = `
                    <span>
                        ${index + 1}
                    </span>

                    <input
                        type="text"
                        class="etapa-titulo-input"
                        placeholder="Ex: Pesquisa inicial"
                    >

                    <input
                        type="text"
                        class="etapa-prazo-input"
                        placeholder="Prazo opcional"
                    >

                    <button
                        type="button"
                        class="projeto-remover"
                    >
                        <i class="fi fi-rr-trash"></i>
                    </button>
                `;

                const titulo =
                    item.querySelector(
                        ".etapa-titulo-input"
                    );

                const prazo =
                    item.querySelector(
                        ".etapa-prazo-input"
                    );

                titulo.value =
                    etapa.titulo;

                prazo.value =
                    etapa.prazo;

                titulo.addEventListener(
                    "input",
                    () => {
                        etapa.titulo =
                            titulo.value;
                    }
                );

                prazo.addEventListener(
                    "input",
                    () => {
                        etapa.prazo =
                            prazo.value;
                    }
                );

                item
                    .querySelector(
                        ".projeto-remover"
                    )
                    .addEventListener(
                        "click",
                        () => {
                            atividade
                                .conteudo
                                .projeto
                                .etapas =
                                atividade
                                    .conteudo
                                    .projeto
                                    .etapas
                                    .filter(
                                        atual =>
                                            atual.id !==
                                            etapa.id
                                    );

                            renderizarProjeto();
                        }
                    );

                etapasProjeto.appendChild(
                    item
                );
            }
        );

    atividade
        .conteudo
        .projeto
        .criterios
        .forEach(
            (
                criterio,
                index
            ) => {
                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "projeto-item criterio";

                item.innerHTML = `
                    <span>
                        ${index + 1}
                    </span>

                    <input
                        type="text"
                        class="criterio-nome"
                        placeholder="Ex: Clareza da apresentação"
                    >

                    <input
                        type="number"
                        min="0"
                        max="100"
                        class="criterio-peso"
                        placeholder="Peso %"
                    >

                    <button
                        type="button"
                        class="projeto-remover"
                    >
                        <i class="fi fi-rr-trash"></i>
                    </button>
                `;

                const nome =
                    item.querySelector(
                        ".criterio-nome"
                    );

                const peso =
                    item.querySelector(
                        ".criterio-peso"
                    );

                nome.value =
                    criterio.nome;

                peso.value =
                    criterio.peso;

                nome.addEventListener(
                    "input",
                    () => {
                        criterio.nome =
                            nome.value;
                    }
                );

                peso.addEventListener(
                    "input",
                    () => {
                        criterio.peso =
                            peso.value;
                    }
                );

                item
                    .querySelector(
                        ".projeto-remover"
                    )
                    .addEventListener(
                        "click",
                        () => {
                            atividade
                                .conteudo
                                .projeto
                                .criterios =
                                atividade
                                    .conteudo
                                    .projeto
                                    .criterios
                                    .filter(
                                        atual =>
                                            atual.id !==
                                            criterio.id
                                    );

                            renderizarProjeto();
                        }
                    );

                criteriosProjeto.appendChild(
                    item
                );
            }
        );
}

function salvarProjeto() {
    atividade
        .conteudo
        .projeto
        .orientacoes =
        orientacoesProjeto
            .value
            .trim();

    atividade
        .conteudo
        .projeto
        .resultado =
        resultadoProjeto
            .value
            .trim();
}

function validarProjeto() {
    salvarProjeto();

    const projeto =
        atividade
            .conteudo
            .projeto;

    if (
        !projeto
            .orientacoes
            .trim()
    ) {
        mostrarToast(
            "Preencha as orientações do projeto."
        );

        orientacoesProjeto.focus();

        return false;
    }

    if (
        !projeto
            .resultado
            .trim()
    ) {
        mostrarToast(
            "Informe a entrega esperada do projeto."
        );

        resultadoProjeto.focus();

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

    const incompleta =
        projeto
            .etapas
            .some(
                etapa =>
                    !etapa
                        .titulo
                        .trim()
            );

    if (
        incompleta
    ) {
        mostrarToast(
            "Preencha o nome de todas as etapas do projeto."
        );

        return false;
    }

    return true;
}

/* ==============================
IA
============================== */

function atualizarResumoIA() {
    document
        .querySelectorAll(
            "[data-resumo-ia]"
        )
        .forEach(
            elemento => {
                elemento.innerHTML = `
                    <strong>
                        ${
                            escapeHTML(
                                atividade
                                    .configuracao
                                    .nome
                                || "Atividade sem nome"
                            )
                        }
                    </strong>

                    <br>

                    ${
                        escapeHTML(
                            atividade
                                .configuracao
                                .disciplinaNome
                        )
                    }

                    •

                    ${
                        escapeHTML(
                            atividade
                                .configuracao
                                .turmaNome
                        )
                    }

                    •

                    ${
                        escapeHTML(
                            formatarTipo(
                                tipoAtividade
                            )
                        )
                    }
                `;
            }
        );
}

document
    .querySelectorAll(
        ".gerar-ia"
    )
    .forEach(
        botao => {
            botao.addEventListener(
                "click",
                () => {
                    mostrarToast(
                        "A geração por IA dependerá do backend."
                    );
                }
            );
        }
    );

/* ==============================
SALVAR CONTEÚDO LOCAL
============================== */

function salvarConteudoAtual() {
    if (
        tipoAtividade ===
        "quiz"
    ) {
        salvarQuiz();
    }

    if (
        tipoAtividade ===
        "projeto"
    ) {
        salvarProjeto();
    }
}

/* ==============================
REVISÃO
============================== */

function renderizarRevisao() {
    salvarConfiguracao();
    salvarConteudoAtual();

    revisaoNome.textContent =
        atividade
            .configuracao
            .nome
        || "Sem nome";

    revisaoDisciplina.textContent =
        atividade
            .configuracao
            .disciplinaNome;

    revisaoTurma.textContent =
        atividade
            .configuracao
            .turmaNome;

    revisaoTipo.textContent =
        formatarTipo(
            tipoAtividade
        );

    revisaoDificuldade.textContent =
        tipoAtividade ===
        "projeto"
            ? "—"
            : formatarDificuldade(
                atividade
                    .configuracao
                    .dificuldade
            );

    if (
        tipoAtividade ===
        "projeto"
    ) {
        revisaoQuestoes.classList.add(
            "escondido"
        );

        revisaoProjeto.classList.remove(
            "escondido"
        );

        labelQuantidadeRevisao.textContent =
            "Etapas";

        revisaoQuantidade.textContent =
            atividade
                .conteudo
                .projeto
                .etapas
                .length;

        renderizarRevisaoProjeto();

        return;
    }

    revisaoProjeto.classList.add(
        "escondido"
    );

    revisaoQuestoes.classList.remove(
        "escondido"
    );

    labelQuantidadeRevisao.textContent =
        "Questões";

    revisaoQuantidade.textContent =
        obterQuestoesAtuais()
            .length;

    renderizarQuestoesRevisao();

    validarQuestoesRevisao();
}

function renderizarQuestoesRevisao() {
    questoesRevisao.innerHTML =
        "";

    obterQuestoesAtuais()
        .forEach(
            (
                questao,
                index
            ) => {
                const item =
                    document.createElement(
                        "article"
                    );

                item.className =
                    "revisao-item";

                item.draggable =
                    true;

                item.dataset.id =
                    questao.id;

                item.innerHTML = `
                    <i class="fi fi-rr-menu-burger drag-handle"></i>

                    <div>

                        <strong>
                            ${index + 1}.
                            ${
                                escapeHTML(
                                    questao.enunciado
                                    || "Questão sem enunciado"
                                )
                            }
                        </strong>

                        ${
                            tipoAtividade ===
                            "diagnostica"
                                ? `
                                    <small>
                                        ${
                                            escapeHTML(
                                                questao.habilidade
                                                || "Sem habilidade definida"
                                            )
                                        }
                                    </small>
                                `
                                : ""
                        }

                    </div>

                    <button
                        type="button"
                        class="revisao-acao editar"
                    >
                        <i class="fi fi-rr-edit"></i>
                    </button>

                    <button
                        type="button"
                        class="revisao-acao excluir"
                    >
                        <i class="fi fi-rr-trash"></i>
                    </button>
                `;

                item
                    .querySelector(
                        ".editar"
                    )
                    .addEventListener(
                        "click",
                        () => {
                            etapaAtual = 2;

                            modoCriacao =
                                "manual";

                            prepararEtapa2();

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

                item
                    .querySelector(
                        ".excluir"
                    )
                    .addEventListener(
                        "click",
                        () => {
                            atividade
                                .conteudo[
                                    tipoAtividade
                                ]
                                .questoes =
                                atividade
                                    .conteudo[
                                        tipoAtividade
                                    ]
                                    .questoes
                                    .filter(
                                        atual =>
                                            atual.id !==
                                            questao.id
                                    );

                            renderizarConteudo();

                            renderizarRevisao();
                        }
                    );

                configurarDrag(
                    item
                );

                questoesRevisao.appendChild(
                    item
                );
            }
        );
}

function configurarDrag(item) {
    item.addEventListener(
        "dragstart",
        () => {
            itemArrastado =
                item;

            item.style.opacity =
                ".5";
        }
    );

    item.addEventListener(
        "dragend",
        () => {
            item.style.opacity =
                "1";

            itemArrastado =
                null;
        }
    );

    item.addEventListener(
        "dragover",
        event => {
            event.preventDefault();
        }
    );

    item.addEventListener(
        "drop",
        event => {
            event.preventDefault();

            if (
                !itemArrastado
                || itemArrastado ===
                    item
            ) {
                return;
            }

            const questoes =
                obterQuestoesAtuais();

            const origem =
                questoes.findIndex(
                    questao =>
                        questao.id ===
                        Number(
                            itemArrastado
                                .dataset
                                .id
                        )
                );

            const destino =
                questoes.findIndex(
                    questao =>
                        questao.id ===
                        Number(
                            item
                                .dataset
                                .id
                        )
                );

            const [movido] =
                questoes.splice(
                    origem,
                    1
                );

            questoes.splice(
                destino,
                0,
                movido
            );

            renderizarRevisao();
        }
    );
}

document
    .getElementById(
        "embaralharQuestoes"
    )
    .addEventListener(
        "click",
        () => {
            const questoes =
                obterQuestoesAtuais();

            for (
                let i =
                    questoes.length - 1;
                i > 0;
                i--
            ) {
                const j =
                    Math.floor(
                        Math.random()
                        * (i + 1)
                    );

                [
                    questoes[i],
                    questoes[j]
                ] = [
                    questoes[j],
                    questoes[i]
                ];
            }

            renderizarRevisao();
        }
    );

function validarQuestoesRevisao() {
    avisosRevisao.innerHTML =
        "";

    const questoes =
        obterQuestoesAtuais();

    questoes.forEach(
        (
            questao,
            index
        ) => {
            if (
                !questao
                    .enunciado
                    .trim()
            ) {
                adicionarAviso(
                    `Questão ${index + 1}: enunciado vazio.`
                );
            }
        }
    );
}

function adicionarAviso(
    texto
) {
    const aviso =
        document.createElement(
            "div"
        );

    aviso.className =
        "aviso";

    aviso.textContent =
        texto;

    avisosRevisao.appendChild(
        aviso
    );
}

function renderizarRevisaoProjeto() {
    const projeto =
        atividade
            .conteudo
            .projeto;

    projetoRevisao.innerHTML = `
        <section class="projeto-revisao-bloco">

            <h4>
                Orientações
            </h4>

            <p>
                ${
                    escapeHTML(
                        projeto.orientacoes
                        || "Nenhuma orientação."
                    )
                }
            </p>

        </section>

        <section class="projeto-revisao-bloco">

            <h4>
                Entrega esperada
            </h4>

            <p>
                ${
                    escapeHTML(
                        projeto.resultado
                        || "Nenhuma entrega definida."
                    )
                }
            </p>

        </section>

        <section class="projeto-revisao-bloco">

            <h4>
                Etapas
            </h4>

            ${
                projeto.etapas.length
                    ? `
                        <ol class="projeto-revisao-lista">

                            ${
                                projeto
                                    .etapas
                                    .map(
                                        etapa => `
                                            <li>
                                                ${
                                                    escapeHTML(
                                                        etapa.titulo
                                                    )
                                                }

                                                ${
                                                    etapa.prazo
                                                        ? ` — ${escapeHTML(etapa.prazo)}`
                                                        : ""
                                                }
                                            </li>
                                        `
                                    )
                                    .join("")
                            }

                        </ol>
                    `
                    : "<p>Nenhuma etapa definida.</p>"
            }

        </section>

        <section class="projeto-revisao-bloco">

            <h4>
                Critérios de avaliação
            </h4>

            ${
                projeto
                    .criterios
                    .length
                    ? `
                        <ul class="projeto-revisao-lista">

                            ${
                                projeto
                                    .criterios
                                    .map(
                                        criterio => `
                                            <li>
                                                ${
                                                    escapeHTML(
                                                        criterio.nome
                                                        || "Critério sem nome"
                                                    )
                                                }

                                                ${
                                                    criterio.peso
                                                        ? ` — ${escapeHTML(criterio.peso)}%`
                                                        : ""
                                                }
                                            </li>
                                        `
                                    )
                                    .join("")
                            }

                        </ul>
                    `
                    : "<p>Nenhum critério definido.</p>"
            }

        </section>
    `;
}

document
    .getElementById(
        "editarProjeto"
    )
    .addEventListener(
        "click",
        () => {
            etapaAtual =
                2;

            modoCriacao =
                "manual";

            prepararEtapa2();

            atualizarEtapas();
        }
    );

/* ==============================
FINALIZAÇÃO
============================== */

function finalizarAtividade() {
    salvarConfiguracao();
    salvarConteudoAtual();

    console.log(
        "Atividade pronta:",
        atividade
    );

    /*
        FUTURAMENTE:
        enviar atividade para o backend.

        Disciplina e turma podem ser null.
    */

    mostrarToast(
        "Atividade pronta. O salvamento dependerá do backend."
    );
}

/* ==============================
BANCO FUTURO
============================== */

function carregarDisciplinas(
    disciplinas
) {
    disciplina.innerHTML =
        '<option value="">Nenhuma</option>';

    if (
        !Array.isArray(
            disciplinas
        )
    ) {
        return;
    }

    disciplinas.forEach(
        item => {
            const option =
                document.createElement(
                    "option"
                );

            option.value =
                item.id;

            option.textContent =
                item.nome;

            disciplina.appendChild(
                option
            );
        }
    );
}

function carregarTurmas(
    turmas
) {
    turma.innerHTML =
        '<option value="">Nenhuma</option>';

    if (
        !Array.isArray(
            turmas
        )
    ) {
        return;
    }

    turmas.forEach(
        item => {
            const option =
                document.createElement(
                    "option"
                );

            option.value =
                item.id;

            option.textContent =
                item.nome;

            turma.appendChild(
                option
            );
        }
    );
}

carregarDisciplinas(
    null
);

carregarTurmas(
    null
);

/* ==============================
UTILIDADES
============================== */

function formatarTipo(
    tipo
) {
    const tipos = {
        lista:
            "Lista de exercícios",

        quiz:
            "Quiz",

        diagnostica:
            "Diagnóstica",

        projeto:
            "Projeto"
    };

    return tipos[tipo]
        || "Não definido";
}

function formatarDificuldade(
    valor
) {
    const dificuldades = {
        facil:
            "Fácil",

        media:
            "Média",

        dificil:
            "Difícil"
    };

    return dificuldades[
        valor
    ] || "Não definida";
}

function escapeHTML(
    texto
) {
    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        texto ?? "";

    return div.innerHTML;
}

function mostrarToast(
    texto
) {
    toastTexto.textContent =
        texto;

    toast.classList.add(
        "show"
    );

    clearTimeout(
        mostrarToast.timeout
    );

    mostrarToast.timeout =
        setTimeout(
            () => {
                toast.classList.remove(
                    "show"
                );
            },
            2600
        );
}

/* INICIALIZAÇÃO */

atualizarConfiguracaoPorTipo();
atualizarEtapas();