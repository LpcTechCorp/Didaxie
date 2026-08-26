const buscarMaterial = document.getElementById("buscarMaterial");
const filtroTurma = document.getElementById("filtroTurma");
const filtroTipo = document.getElementById("filtroTipo");
const arquivosLista = document.getElementById("arquivosLista");
const botaoEnviar = document.getElementById("botaoEnviar");
const inputArquivo = document.getElementById("inputArquivo");

let materiais = [];

/* ==============================
   FORMATOS PERMITIDOS
============================== */

const extensoesPermitidas = [
    "pdf",
    "txt",
    "docx",
    "csv",
    "xlsx",
    "pptx",
    "json",
    "xml",
    "html",
    "htm",
    "md"
];

/* ==============================
   TIPOS DE ARQUIVO
============================== */

const tiposArquivo = {
    pdf: {
        classe: "pdf",
        icone: "fi-rr-file-pdf"
    },

    documento: {
        classe: "documento",
        icone: "fi-rr-document"
    },

    planilha: {
        classe: "planilha",
        icone: "fi-rr-file-spreadsheet"
    },

    apresentacao: {
        classe: "apresentacao",
        icone: "fi-rr-presentation"
    },

    texto: {
        classe: "texto",
        icone: "fi-rr-file"
    },

    codigo: {
        classe: "codigo",
        icone: "fi-rr-code-simple"
    },

    outro: {
        classe: "outro",
        icone: "fi-rr-file"
    }
};

/* ==============================
   EXTENSÃO DO ARQUIVO
============================== */

function obterExtensao(nomeArquivo) {
    const partes = nomeArquivo.split(".");

    if (partes.length < 2) {
        return "";
    }

    return partes.pop().toLowerCase();
}

/* ==============================
   IDENTIFICAR TIPO
============================== */

function identificarTipoArquivo(nomeArquivo) {
    const extensao = obterExtensao(nomeArquivo);

    if (extensao === "pdf") {
        return "pdf";
    }

    if (extensao === "docx") {
        return "documento";
    }

    if (
        extensao === "xlsx" ||
        extensao === "csv"
    ) {
        return "planilha";
    }

    if (extensao === "pptx") {
        return "apresentacao";
    }

    if (
        extensao === "txt" ||
        extensao === "md"
    ) {
        return "texto";
    }

    if (
        extensao === "json" ||
        extensao === "xml" ||
        extensao === "html" ||
        extensao === "htm"
    ) {
        return "codigo";
    }

    return "outro";
}

/* ==============================
   VALIDAR ARQUIVO
============================== */

function arquivoPermitido(arquivo) {
    const extensao = obterExtensao(arquivo.name);

    return extensoesPermitidas.includes(extensao);
}

/* ==============================
   ESTADO VAZIO
============================== */

function mostrarEstadoVazio() {
    arquivosLista.innerHTML = `
        <div class="estado-vazio-materiais">

            <div class="vazio-icone">
                <i class="fi fi-rr-folder-open"></i>
            </div>

            <h3>Nenhum material enviado</h3>

            <p>
                Os arquivos enviados por você aparecerão aqui.
            </p>

            <div class="tipos-exemplo" aria-hidden="true">

                <div class="tipo-exemplo" title="PDF">
                    <i class="fi fi-rr-file-pdf"></i>
                </div>

                <div class="tipo-exemplo" title="Documento">
                    <i class="fi fi-rr-document"></i>
                </div>

                <div class="tipo-exemplo" title="Planilha">
                    <i class="fi fi-rr-file-spreadsheet"></i>
                </div>

            </div>

        </div>
    `;
}

/* ==============================
   CRIAR ITEM DE MATERIAL
============================== */

function criarArquivo(material) {
    const item = document.createElement("article");

    item.className = "arquivo-item";

    const tipoMaterial =
        material.tipo ||
        identificarTipoArquivo(material.nome || "");

    const tipo =
        tiposArquivo[tipoMaterial] ||
        tiposArquivo.outro;

    /* ÍCONE */

    const icone = document.createElement("div");

    icone.className =
        `arquivo-icone ${tipo.classe}`;

    icone.innerHTML =
        `<i class="fi ${tipo.icone}"></i>`;

    /* INFORMAÇÕES */

    const info = document.createElement("div");

    info.className = "arquivo-info";

    const turma = document.createElement("span");

    turma.textContent =
        material.turma || "Sem turma";

    const nome = document.createElement("strong");

    nome.textContent =
        material.nome || "Material";

    nome.title =
        material.nome || "Material";

    info.appendChild(turma);
    info.appendChild(nome);

    /* AÇÕES */

    const acoes = document.createElement("div");

    acoes.className = "arquivo-acoes";

    const abrir = document.createElement("button");

    abrir.type = "button";
    abrir.className = "arquivo-acao";
    abrir.setAttribute(
        "aria-label",
        `Abrir ${material.nome || "material"}`
    );

    abrir.innerHTML =
        '<i class="fi fi-rr-eye"></i>';

    acoes.appendChild(abrir);

    /* MONTAGEM */

    item.appendChild(icone);
    item.appendChild(info);
    item.appendChild(acoes);

    return item;
}

/* ==============================
   RENDERIZAR MATERIAIS
============================== */

function renderizarMateriais(lista) {
    arquivosLista.innerHTML = "";

    if (
        !Array.isArray(lista) ||
        lista.length === 0
    ) {
        mostrarEstadoVazio();
        return;
    }

    lista.forEach(material => {
        arquivosLista.appendChild(
            criarArquivo(material)
        );
    });
}

/* ==============================
   FILTROS
============================== */

function filtrarMateriais() {
    const busca =
        buscarMaterial.value
            .trim()
            .toLowerCase();

    const turmaSelecionada =
        filtroTurma.value;

    const tipoSelecionado =
        filtroTipo.value;

    const filtrados =
        materiais.filter(material => {

            const nome =
                (material.nome || "")
                    .toLowerCase();

            const nomeCorresponde =
                !busca ||
                nome.includes(busca);

            const turmaCorresponde =
                !turmaSelecionada ||
                material.turma === turmaSelecionada;

            const tipoMaterial =
                material.tipo ||
                identificarTipoArquivo(
                    material.nome || ""
                );

            const tipoCorresponde =
                !tipoSelecionado ||
                tipoMaterial === tipoSelecionado;

            return (
                nomeCorresponde &&
                turmaCorresponde &&
                tipoCorresponde
            );
        });

    renderizarMateriais(filtrados);
}

/* ==============================
   EVENTOS DOS FILTROS
============================== */

buscarMaterial.addEventListener(
    "input",
    filtrarMateriais
);

filtroTurma.addEventListener(
    "change",
    filtrarMateriais
);

filtroTipo.addEventListener(
    "change",
    filtrarMateriais
);

/* ==============================
   ABRIR SELETOR DE ARQUIVOS
============================== */

botaoEnviar.addEventListener(
    "click",
    () => {
        inputArquivo.click();
    }
);

/* ==============================
   SELEÇÃO DE ARQUIVOS
============================== */

inputArquivo.addEventListener(
    "change",
    () => {

        const arquivosSelecionados =
            Array.from(inputArquivo.files);

        if (arquivosSelecionados.length === 0) {
            return;
        }

        const arquivosInvalidos =
            arquivosSelecionados.filter(
                arquivo =>
                    !arquivoPermitido(arquivo)
            );

        if (arquivosInvalidos.length > 0) {

            const nomesInvalidos =
                arquivosInvalidos
                    .map(arquivo => arquivo.name)
                    .join("\n");

            alert(
                "Os seguintes arquivos não são permitidos:\n\n" +
                nomesInvalidos +
                "\n\nFormatos aceitos:\n" +
                "PDF, TXT, DOCX, CSV, XLSX, PPTX, JSON, XML, HTML e MD."
            );

            inputArquivo.value = "";

            return;
        }

        /*
            ARQUIVOS VÁLIDOS.

            Não adicionamos nada visualmente ainda.

            Quando o backend estiver pronto,
            aqui será feita a requisição para
            enviar os arquivos ao servidor.

            Exemplo futuro:

            enviarMateriais(arquivosSelecionados);
        */

        inputArquivo.value = "";
    }
);

/* ==============================
   CARREGAR TURMAS
============================== */

function carregarTurmas(turmas) {

    filtroTurma.innerHTML =
        '<option value="">Todas</option>';

    /*
        Se não houver dados vindos do banco,
        nenhuma turma é criada.
    */

    if (
        !Array.isArray(turmas) ||
        turmas.length === 0
    ) {
        return;
    }

    turmas.forEach(turma => {

        const option =
            document.createElement("option");

        option.value =
            turma.id || turma.nome;

        option.textContent =
            turma.nome;

        filtroTurma.appendChild(option);
    });
}

/* ==============================
   CARREGAR TIPOS
============================== */

function carregarTipos() {

    filtroTipo.innerHTML = `
        <option value="">Todos</option>
        <option value="pdf">PDF</option>
        <option value="documento">Documento</option>
        <option value="planilha">Planilha</option>
        <option value="apresentacao">Apresentação</option>
        <option value="texto">Texto</option>
        <option value="codigo">Código / dados</option>
    `;
}

/* ==============================
   CARREGAR MATERIAIS
============================== */

function carregarMateriais(dados) {

    materiais =
        Array.isArray(dados)
            ? dados
            : [];

    renderizarMateriais(materiais);
}

/* ==============================
   INICIALIZAÇÃO
============================== */

carregarTipos();

/*
    Ainda não temos banco.

    Portanto:

    - Nenhuma turma aparece.
    - Nenhum material aparece.
    - Nenhum dado fictício é criado.

    Futuramente:

    carregarTurmas(turmasDoBanco);
    carregarMateriais(materiaisDoBanco);
*/

carregarTurmas(null);
carregarMateriais(null);