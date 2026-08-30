const etapas = document.querySelectorAll(".etapa");
const conteudos = document.querySelectorAll(".etapa-conteudo");
const voltarEtapa = document.getElementById("voltarEtapa");
const continuarEtapa = document.getElementById("continuarEtapa");
const statusEtapa = document.getElementById("statusEtapa");

const nomePlano = document.getElementById("nomePlano");
const disciplina = document.getElementById("disciplina");
const cargaHoraria = document.getElementById("cargaHoraria");
const professor = document.getElementById("professor");
const temaAula = document.getElementById("temaAula");
const subtitulo = document.getElementById("subtitulo");
const erroNomePlano = document.getElementById("erroNomePlano");

const competenciaInput = document.getElementById("competenciaInput");
const adicionarCompetencia = document.getElementById("adicionarCompetencia");
const habilidadesLista = document.getElementById("habilidadesLista");

const palavraInput = document.getElementById("palavraInput");
const tagsLista = document.getElementById("tagsLista");

const arquivoApoio = document.getElementById("arquivoApoio");
const uploadArea = document.getElementById("uploadArea");
const uploadTexto = document.getElementById("uploadTexto");

const estruturaLista = document.getElementById("estruturaLista");
const adicionarSecao = document.getElementById("adicionarSecao");

const promptIA = document.getElementById("promptIA");
const contadorPrompt = document.getElementById("contadorPrompt");
const gerarSugestoes = document.getElementById("gerarSugestoes");
const resultadoIA = document.getElementById("resultadoIA");

const toast = document.getElementById("toast");
const toastTexto = document.getElementById("toastTexto");

let etapaAtual = 1;
let maiorEtapaLiberada = 1;
let tipoPlano = "estado";
let modoEstrutura = "manual";
let proximoIdSecao = 1;

const plano = {
    dadosGerais: {},
    estrutura: [],
    arquivo: null
};

let habilidades = [];
let palavrasChave = [];

const secoesPadrao = [
    {
        titulo: "Objetivos de aprendizagem",
        conteudo: ""
    },
    {
        titulo: "Conteúdo",
        conteudo: ""
    },
    {
        titulo: "Metodologia",
        conteudo: ""
    },
    {
        titulo: "Recursos",
        conteudo: ""
    },
    {
        titulo: "Atividades",
        conteudo: ""
    },
    {
        titulo: "Avaliação",
        conteudo: ""
    }
];

function atualizarEtapas() {

    etapas.forEach(botao => {

        const numero = Number(botao.dataset.etapa);

        botao.classList.toggle("ativa", numero === etapaAtual);
        botao.classList.toggle("concluida", numero < etapaAtual);
        botao.classList.toggle("liberada", numero <= maiorEtapaLiberada);

        botao.disabled = numero > maiorEtapaLiberada;

    });

    conteudos.forEach(conteudo => {

        conteudo.classList.toggle(
            "ativa",
            Number(conteudo.dataset.conteudo) === etapaAtual
        );

    });

    voltarEtapa.style.visibility =
        etapaAtual === 1
            ? "hidden"
            : "visible";

    if (etapaAtual === 1) {

        continuarEtapa.innerHTML =
            `Continuar <i class="fi fi-rr-angle-small-right"></i>`;

        statusEtapa.textContent =
            "Dados gerais";

    }

    if (etapaAtual === 2) {

        continuarEtapa.innerHTML =
            `Visualizar plano <i class="fi fi-rr-angle-small-right"></i>`;

        statusEtapa.textContent =
            modoEstrutura === "manual"
                ? `${plano.estrutura.length} seções`
                : "Modo IA";

    }

    if (etapaAtual === 3) {

        continuarEtapa.innerHTML =
            `<i class="fi fi-rr-check"></i> Finalizar plano`;

        statusEtapa.textContent =
            "Pronto para finalizar";

        montarVisualizacao();

    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

etapas.forEach(botao => {

    botao.addEventListener("click", () => {

        const destino =
            Number(botao.dataset.etapa);

        if (destino <= maiorEtapaLiberada) {

            etapaAtual = destino;
            atualizarEtapas();

        }

    });

});

function validarEtapa1() {

    erroNomePlano.textContent = "";
    nomePlano.closest(".campo").classList.remove("tem-erro");

    if (!nomePlano.value.trim()) {

        erroNomePlano.textContent =
            "Digite um nome para o plano.";

        nomePlano.closest(".campo").classList.add("tem-erro");

        nomePlano.focus();

        return false;

    }

    return true;

}

function salvarDadosGerais() {

    plano.dadosGerais = {
        nome: nomePlano.value.trim(),
        disciplina: disciplina.value,
        cargaHoraria: cargaHoraria.value,
        professor: professor.value.trim(),
        tema: temaAula.value.trim(),
        subtitulo: subtitulo.value.trim(),
        tipo: tipoPlano,
        habilidades: [...habilidades],
        palavrasChave: [...palavrasChave]
    };

}

continuarEtapa.addEventListener("click", () => {

    if (etapaAtual === 1) {

        if (!validarEtapa1()) {
            return;
        }

        salvarDadosGerais();

        maiorEtapaLiberada =
            Math.max(maiorEtapaLiberada, 2);

        etapaAtual = 2;
        atualizarEtapas();

        return;

    }

    if (etapaAtual === 2) {

        if (modoEstrutura === "ia") {

            mostrarToast(
                "A geração do plano com IA dependerá do backend."
            );

            return;

        }

        salvarEstrutura();

        if (!validarEstrutura()) {
            return;
        }

        maiorEtapaLiberada =
            Math.max(maiorEtapaLiberada, 3);

        etapaAtual = 3;
        atualizarEtapas();

        return;

    }

    if (etapaAtual === 3) {

        salvarDadosGerais();
        salvarEstrutura();

        console.log(
            "Plano pronto:",
            plano
        );

        /*
            FUTURAMENTE:
            enviar o plano ao backend.
        */

        mostrarToast(
            "Plano pronto. O salvamento dependerá do backend."
        );

    }

});

voltarEtapa.addEventListener("click", () => {

    if (etapaAtual > 1) {

        etapaAtual--;
        atualizarEtapas();

    }

});

/* MODELO DO PLANO */

document
    .querySelectorAll(".tipo-plano")
    .forEach(botao => {

        botao.addEventListener("click", () => {

            document
                .querySelectorAll(".tipo-plano")
                .forEach(item =>
                    item.classList.remove("ativo")
                );

            botao.classList.add("ativo");

            tipoPlano =
                botao.dataset.tipo;

        });

    });

/* HABILIDADES */

function renderizarHabilidades() {

    habilidadesLista.innerHTML = "";

    habilidades.forEach((habilidade, indice) => {

        const item =
            document.createElement("div");

        item.className = "habilidade";

        item.innerHTML = `
            <span>${escaparHTML(habilidade)}</span>
            <button type="button" aria-label="Remover">
                <i class="fi fi-rr-cross-small"></i>
            </button>
        `;

        item
            .querySelector("button")
            .addEventListener("click", () => {

                habilidades.splice(indice, 1);
                renderizarHabilidades();

            });

        habilidadesLista.appendChild(item);

    });

}

function adicionarHabilidade() {

    const valor =
        competenciaInput.value.trim();

    if (!valor) {
        return;
    }

    if (!habilidades.includes(valor)) {

        habilidades.push(valor);
        renderizarHabilidades();

    }

    competenciaInput.value = "";
    competenciaInput.focus();

}

adicionarCompetencia.addEventListener(
    "click",
    adicionarHabilidade
);

competenciaInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            event.preventDefault();
            adicionarHabilidade();

        }

    }
);

/* PALAVRAS CHAVE */

function renderizarTags() {

    tagsLista.innerHTML = "";

    palavrasChave.forEach((tag, indice) => {

        const item =
            document.createElement("div");

        item.className = "tag";

        item.innerHTML = `
            <span>${escaparHTML(tag)}</span>
            <button type="button" aria-label="Remover">
                <i class="fi fi-rr-cross-small"></i>
            </button>
        `;

        item
            .querySelector("button")
            .addEventListener("click", () => {

                palavrasChave.splice(indice, 1);
                renderizarTags();

            });

        tagsLista.appendChild(item);

    });

}

palavraInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Enter" &&
            event.key !== ","
        ) {
            return;
        }

        event.preventDefault();

        const valor =
            palavraInput.value
                .trim()
                .replace(/,$/, "");

        if (
            valor &&
            !palavrasChave.includes(valor)
        ) {

            palavrasChave.push(valor);
            renderizarTags();

        }

        palavraInput.value = "";

    }
);

/* UPLOAD */

arquivoApoio.addEventListener(
    "change",
    () => {

        const arquivo =
            arquivoApoio.files[0];

        if (!arquivo) {
            return;
        }

        plano.arquivo = arquivo;

        uploadTexto.textContent =
            arquivo.name;

    }
);

["dragenter", "dragover"].forEach(evento => {

    uploadArea.addEventListener(
        evento,
        event => {

            event.preventDefault();
            uploadArea.classList.add("arrastando");

        }
    );

});

["dragleave", "drop"].forEach(evento => {

    uploadArea.addEventListener(
        evento,
        event => {

            event.preventDefault();
            uploadArea.classList.remove("arrastando");

        }
    );

});

uploadArea.addEventListener(
    "drop",
    event => {

        const arquivo =
            event.dataTransfer.files[0];

        if (!arquivo) {
            return;
        }

        plano.arquivo = arquivo;

        uploadTexto.textContent =
            arquivo.name;

    }
);

/* MODO MANUAL / IA */

document
    .querySelectorAll("[data-modo]")
    .forEach(botao => {

        botao.addEventListener("click", () => {

            modoEstrutura =
                botao.dataset.modo;

            document
                .querySelectorAll("[data-modo]")
                .forEach(item =>
                    item.classList.toggle(
                        "ativo",
                        item === botao
                    )
                );

            document
                .querySelectorAll("[data-modo-conteudo]")
                .forEach(conteudo => {

                    conteudo.classList.toggle(
                        "ativo",
                        conteudo.dataset.modoConteudo === modoEstrutura
                    );

                });

            atualizarStatusEtapa2();

        });

    });

function atualizarStatusEtapa2() {

    if (etapaAtual !== 2) {
        return;
    }

    statusEtapa.textContent =
        modoEstrutura === "manual"
            ? `${plano.estrutura.length} seções`
            : "Modo IA";

}

/* ESTRUTURA */

function adicionarNovaSecao(
    titulo = "",
    conteudo = ""
) {

    const secao = {
        id: proximoIdSecao++,
        titulo,
        conteudo
    };

    plano.estrutura.push(secao);

    renderizarEstrutura();

}

function renderizarEstrutura() {

    estruturaLista.innerHTML = "";

    plano.estrutura.forEach(
        (secao, indice) => {

            const elemento =
                document.createElement("div");

            elemento.className =
                "secao-editor";

            elemento.innerHTML = `
                <div class="secao-editor-topo">

                    <i class="fi fi-rr-menu-burger"></i>

                    <input
                        type="text"
                        class="secao-titulo-input"
                        value="${escaparAtributo(secao.titulo)}"
                        placeholder="Título da seção"
                    >

                    <button
                        type="button"
                        class="secao-remover"
                        aria-label="Remover seção"
                    >
                        <i class="fi fi-rr-trash"></i>
                    </button>

                </div>

                <textarea
                    class="secao-conteudo-input"
                    placeholder="Descreva o conteúdo desta seção..."
                >${escaparHTML(secao.conteudo)}</textarea>
            `;

            const tituloInput =
                elemento.querySelector(
                    ".secao-titulo-input"
                );

            const conteudoInput =
                elemento.querySelector(
                    ".secao-conteudo-input"
                );

            tituloInput.addEventListener(
                "input",
                () => {

                    plano.estrutura[indice].titulo =
                        tituloInput.value;

                }
            );

            conteudoInput.addEventListener(
                "input",
                () => {

                    plano.estrutura[indice].conteudo =
                        conteudoInput.value;

                }
            );

            elemento
                .querySelector(".secao-remover")
                .addEventListener("click", () => {

                    plano.estrutura.splice(
                        indice,
                        1
                    );

                    renderizarEstrutura();

                });

            estruturaLista.appendChild(
                elemento
            );

        }
    );

    atualizarStatusEtapa2();

}

function salvarEstrutura() {

    document
        .querySelectorAll(".secao-editor")
        .forEach((elemento, indice) => {

            if (!plano.estrutura[indice]) {
                return;
            }

            plano.estrutura[indice].titulo =
                elemento
                    .querySelector(".secao-titulo-input")
                    .value
                    .trim();

            plano.estrutura[indice].conteudo =
                elemento
                    .querySelector(".secao-conteudo-input")
                    .value
                    .trim();

        });

}

function validarEstrutura() {

    if (plano.estrutura.length === 0) {

        mostrarToast(
            "Adicione pelo menos uma seção ao plano."
        );

        return false;

    }

    const invalida =
        plano.estrutura.find(
            secao =>
                !secao.titulo.trim() ||
                !secao.conteudo.trim()
        );

    if (invalida) {

        mostrarToast(
            "Preencha o título e o conteúdo das seções."
        );

        return false;

    }

    return true;

}

adicionarSecao.addEventListener(
    "click",
    () => {

        adicionarNovaSecao();

    }
);

/* IA */

promptIA.addEventListener(
    "input",
    () => {

        contadorPrompt.textContent =
            promptIA.value.length;

    }
);

gerarSugestoes.addEventListener(
    "click",
    () => {

        if (!promptIA.value.trim()) {

            mostrarToast(
                "Descreva primeiro o plano que deseja gerar."
            );

            promptIA.focus();

            return;

        }

        /*
            FUTURAMENTE:
            enviar prompt para API/backend.
        */

        mostrarToast(
            "A geração por IA dependerá do backend."
        );

    }
);

/* VISUALIZAÇÃO */

function montarVisualizacao() {

    salvarDadosGerais();

    const dados =
        plano.dadosGerais;

    document.getElementById(
        "previewNome"
    ).textContent =
        dados.nome || "Novo plano";

    const previewSubtitulo =
        document.getElementById(
            "previewSubtitulo"
        );

    previewSubtitulo.textContent =
        dados.subtitulo || "";

    document.getElementById(
        "previewTipo"
    ).textContent =
        nomeTipoPlano(dados.tipo);

    document.getElementById(
        "previewTema"
    ).textContent =
        dados.tema || "Não informado";

    const infos =
        document.getElementById(
            "previewInfos"
        );

    infos.innerHTML = "";

    adicionarInfoPreview(
        infos,
        "Disciplina",
        dados.disciplina || "Não informada"
    );

    adicionarInfoPreview(
        infos,
        "Carga horária",
        dados.cargaHoraria || "Não informada"
    );

    adicionarInfoPreview(
        infos,
        "Professor",
        dados.professor || "Não informado"
    );

    const bncc =
        document.getElementById(
            "previewBNCC"
        );

    bncc.innerHTML = "";

    if (dados.habilidades.length === 0) {

        bncc.innerHTML =
            `<p>Não informadas.</p>`;

    } else {

        const tags =
            document.createElement("div");

        tags.className =
            "preview-tags";

        dados.habilidades.forEach(
            habilidade => {

                const span =
                    document.createElement("span");

                span.textContent =
                    habilidade;

                tags.appendChild(span);

            }
        );

        bncc.appendChild(tags);

    }

    const estrutura =
        document.getElementById(
            "previewEstrutura"
        );

    estrutura.innerHTML = "";

    plano.estrutura.forEach(
        secao => {

            const bloco =
                document.createElement("div");

            bloco.className =
                "preview-secao";

            const titulo =
                document.createElement("h3");

            titulo.textContent =
                secao.titulo;

            const texto =
                document.createElement("p");

            texto.textContent =
                secao.conteudo;

            bloco.appendChild(titulo);
            bloco.appendChild(texto);

            estrutura.appendChild(bloco);

        }
    );

}

function adicionarInfoPreview(
    container,
    titulo,
    valor
) {

    const item =
        document.createElement("div");

    item.className =
        "documento-info";

    item.innerHTML = `
        <strong>${escaparHTML(titulo)}</strong>
        <span>${escaparHTML(valor)}</span>
    `;

    container.appendChild(item);

}

function nomeTipoPlano(tipo) {

    const nomes = {
        estado: "Plano do estado",
        abnt: "Plano ABNT",
        personalizado: "Plano personalizado"
    };

    return nomes[tipo] ||
        "Plano de aula";

}

/* AÇÕES VISUALIZAÇÃO */

document
    .querySelectorAll(
        ".acoes-plano button"
    )
    .forEach(botao => {

        botao.addEventListener(
            "click",
            () => {

                const acao =
                    botao.dataset.acao;

                if (acao === "pdf") {

                    mostrarToast(
                        "A geração do PDF será conectada posteriormente."
                    );

                    return;

                }

                if (acao === "avaliacao") {

                    mostrarToast(
                        "A criação de avaliações será conectada posteriormente."
                    );

                    return;

                }

                if (acao === "compartilhar") {

                    mostrarToast(
                        "O compartilhamento dependerá do backend."
                    );

                }

            }
        );

    });

/* BANCO */

function carregarDisciplinas(dados) {

    if (!Array.isArray(dados)) {
        return;
    }

    dados.forEach(item => {

        const option =
            document.createElement("option");

        option.value =
            item.id ?? item.nome;

        option.textContent =
            item.nome;

        disciplina.appendChild(option);

    });

}

/*
    Futuramente:
    carregarDisciplinas(dadosDoBanco);

    Enquanto não houver backend,
    o select permanece apenas com "Nenhuma".
*/

carregarDisciplinas(null);

/* UTILIDADES */

function mostrarToast(texto) {

    toastTexto.textContent = texto;

    toast.classList.add(
        "mostrar"
    );

    clearTimeout(
        mostrarToast.timer
    );

    mostrarToast.timer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "mostrar"
                );

            },
            3200
        );

}

function escaparHTML(valor = "") {

    const div =
        document.createElement("div");

    div.textContent = valor;

    return div.innerHTML;

}

function escaparAtributo(valor = "") {

    return escaparHTML(valor)
        .replace(/"/g, "&quot;");

}

/* INICIALIZAÇÃO */

secoesPadrao.forEach(
    secao => {

        adicionarNovaSecao(
            secao.titulo,
            secao.conteudo
        );

    }
);

atualizarEtapas();