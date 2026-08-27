const materialForm = document.getElementById("materialForm");
const nomeMaterial = document.getElementById("nomeMaterial");
const disciplina = document.getElementById("disciplina");
const plano = document.getElementById("plano");
const uploadArea = document.getElementById("uploadArea");
const inputArquivo = document.getElementById("inputArquivo");
const arquivoNome = document.getElementById("arquivoNome");
const arquivoInfo = document.getElementById("arquivoInfo");
const arquivoIcone = document.getElementById("arquivoIcone");
const removerArquivo = document.getElementById("removerArquivo");
const btnSalvar = document.getElementById("btnSalvar");

const erroNome = document.getElementById("erroNome");
const erroDisciplina = document.getElementById("erroDisciplina");
const erroArquivo = document.getElementById("erroArquivo");

const toast = document.getElementById("toast");
const toastTexto = document.getElementById("toastTexto");

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

const tamanhoMaximo = 30 * 1024 * 1024;

let arquivoSelecionado = null;

function obterExtensao(nome) {
    const partes = nome.split(".");
    return partes.length > 1 ? partes.pop().toLowerCase() : "";
}

function arquivoPermitido(arquivo) {
    return extensoesPermitidas.includes(obterExtensao(arquivo.name));
}

function formatarTamanho(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function obterTipoVisual(nome) {
    const extensao = obterExtensao(nome);

    if (extensao === "pdf") {
        return {
            classe: "pdf",
            icone: "fi-rr-file-pdf",
            nome: "PDF"
        };
    }

    if (extensao === "docx") {
        return {
            classe: "documento",
            icone: "fi-rr-document",
            nome: "Documento"
        };
    }

    if (extensao === "xlsx" || extensao === "csv") {
        return {
            classe: "planilha",
            icone: "fi-rr-file-spreadsheet",
            nome: "Planilha"
        };
    }

    if (extensao === "pptx") {
        return {
            classe: "apresentacao",
            icone: "fi-rr-presentation",
            nome: "Apresentação"
        };
    }

    if (extensao === "txt" || extensao === "md") {
        return {
            classe: "texto",
            icone: "fi-rr-file",
            nome: "Texto"
        };
    }

    return {
        classe: "codigo",
        icone: "fi-rr-code-simple",
        nome: "Dados / Código"
    };
}

function selecionarArquivo(arquivo) {
    erroArquivo.textContent = "";

    if (!arquivoPermitido(arquivo)) {
        arquivoSelecionado = null;
        erroArquivo.textContent = "Formato de arquivo não permitido.";
        mostrarToast("Esse tipo de arquivo não é aceito.");
        return;
    }

    if (arquivo.size > tamanhoMaximo) {
        arquivoSelecionado = null;
        erroArquivo.textContent = "O arquivo deve ter no máximo 30 MB.";
        mostrarToast("O arquivo ultrapassa o limite de 30 MB.");
        return;
    }

    arquivoSelecionado = arquivo;

    const tipo = obterTipoVisual(arquivo.name);

    arquivoNome.textContent = arquivo.name;
    arquivoNome.title = arquivo.name;
    arquivoInfo.textContent = `${tipo.nome} • ${formatarTamanho(arquivo.size)}`;

    arquivoIcone.className = `arquivo-icone ${tipo.classe}`;
    arquivoIcone.innerHTML = `<i class="fi ${tipo.icone}"></i>`;

    uploadArea.classList.add("com-arquivo");

    if (!nomeMaterial.value.trim()) {
        const nomeSemExtensao = arquivo.name.replace(/\.[^/.]+$/, "");
        nomeMaterial.value = nomeSemExtensao;
    }
}

uploadArea.addEventListener("click", event => {
    if (event.target.closest("#removerArquivo")) return;
    inputArquivo.click();
});

uploadArea.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        inputArquivo.click();
    }
});

inputArquivo.addEventListener("change", () => {
    const arquivo = inputArquivo.files[0];

    if (arquivo) {
        selecionarArquivo(arquivo);
    }
});

["dragenter", "dragover"].forEach(evento => {
    uploadArea.addEventListener(evento, event => {
        event.preventDefault();
        uploadArea.classList.add("drag-over");
    });
});

["dragleave", "drop"].forEach(evento => {
    uploadArea.addEventListener(evento, event => {
        event.preventDefault();
        uploadArea.classList.remove("drag-over");
    });
});

uploadArea.addEventListener("drop", event => {
    const arquivos = event.dataTransfer.files;

    if (!arquivos.length) return;

    if (arquivos.length > 1) {
        mostrarToast("Envie apenas um arquivo por material.");
    }

    selecionarArquivo(arquivos[0]);
});

removerArquivo.addEventListener("click", event => {
    event.stopPropagation();

    arquivoSelecionado = null;
    inputArquivo.value = "";
    uploadArea.classList.remove("com-arquivo");

    erroArquivo.textContent = "";
});

function validarFormulario() {
    let valido = true;

    erroNome.textContent = "";
    erroDisciplina.textContent = "";
    erroArquivo.textContent = "";

    if (!nomeMaterial.value.trim()) {
        erroNome.textContent = "Digite o nome do material.";
        valido = false;
    }

    if (!disciplina.value) {
        erroDisciplina.textContent = "Selecione uma disciplina.";
        valido = false;
    }

    if (!arquivoSelecionado) {
        erroArquivo.textContent = "Adicione um arquivo.";
        valido = false;
    }

    return valido;
}

btnSalvar.addEventListener("click", () => {
    if (!validarFormulario()) {
        mostrarToast("Preencha os campos obrigatórios.");
        return;
    }

    /*
        AQUI ENTRA O BACKEND FUTURAMENTE.

        Seria necessário enviar:
        - nomeMaterial.value
        - disciplina.value
        - plano.value
        - arquivoSelecionado

        Exemplo futuro:
        const formData = new FormData();
        formData.append("nome", nomeMaterial.value);
        formData.append("disciplina", disciplina.value);
        formData.append("plano", plano.value);
        formData.append("arquivo", arquivoSelecionado);

        fetch(...)

        Por enquanto NÃO fazemos upload
        e NÃO simulamos salvamento.
    */

    mostrarToast("Material válido. O envio dependerá do backend.");
});

function carregarDisciplinas(disciplinas) {
    disciplina.innerHTML = '<option value="">Selecione uma disciplina</option>';

    if (!Array.isArray(disciplinas) || disciplinas.length === 0) {
        return;
    }

    disciplinas.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.nome;
        disciplina.appendChild(option);
    });
}

function carregarPlanos(planos) {
    plano.innerHTML = '<option value="">Nenhum plano</option>';

    if (!Array.isArray(planos) || planos.length === 0) {
        return;
    }

    planos.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.titulo;
        plano.appendChild(option);
    });
}

function mostrarToast(texto) {
    toastTexto.textContent = texto;
    toast.classList.add("show");

    clearTimeout(mostrarToast.timeout);

    mostrarToast.timeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

/*
    FUTURAMENTE, vindo do banco:

    carregarDisciplinas([
        { id: 1, nome: "Desenvolvimento Web" },
        { id: 2, nome: "Algoritmos" }
    ]);

    carregarPlanos([
        { id: 10, titulo: "Introdução ao HTML" }
    ]);
*/

carregarDisciplinas(null);
carregarPlanos(null);