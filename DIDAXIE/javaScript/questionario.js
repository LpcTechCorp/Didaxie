const etapas = document.querySelectorAll(".etapa");
const contadorEtapa = document.getElementById("contadorEtapa");
const barraProgresso = document.getElementById("barraProgresso");
const voltarEtapa = document.getElementById("voltarEtapa");
const continuarEtapa = document.getElementById("continuarEtapa");
const pularPergunta = document.getElementById("pularPergunta");
const pularPerguntaRodape = document.getElementById("pularPerguntaRodape");

const modalAdicionar = document.getElementById("modalAdicionar");
const modalTitulo = document.getElementById("modalTitulo");
const novaOpcao = document.getElementById("novaOpcao");
const fecharModal = document.getElementById("fecharModal");
const cancelarModal = document.getElementById("cancelarModal");
const confirmarAdicionar = document.getElementById("confirmarAdicionar");

const toast = document.getElementById("toast");
const toastTexto = document.getElementById("toastTexto");

let etapaAtual = 1;
let grupoAdicionar = null;

const respostas = {
    turmas: [],
    disciplinas: [],
    organizacao: [],
    uso: []
};

function atualizarTela() {
    etapas.forEach(etapa => {
        const numero = Number(etapa.dataset.etapa);
        etapa.classList.toggle("ativa", numero === etapaAtual);
    });

    contadorEtapa.textContent = `${etapaAtual} de ${etapas.length}`;
    barraProgresso.style.width = `${(etapaAtual / etapas.length) * 100}%`;
    voltarEtapa.disabled = etapaAtual === 1;

    continuarEtapa.innerHTML = etapaAtual === etapas.length
        ? `Finalizar <i class="fi fi-rr-check"></i>`
        : `Continuar <i class="fi fi-rr-angle-right"></i>`;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function configurarCard(card) {
    card.addEventListener("click", () => {
        const grupo = card.dataset.grupo;
        const valor = card.dataset.valor;

        card.classList.toggle("selecionada");

        if (card.classList.contains("selecionada")) {
            if (!respostas[grupo].includes(valor)) {
                respostas[grupo].push(valor);
            }
        } else {
            respostas[grupo] = respostas[grupo].filter(item => item !== valor);
        }
    });
}

document.querySelectorAll(".opcao-card[data-grupo]").forEach(configurarCard);

continuarEtapa.addEventListener("click", () => {
    if (etapaAtual < etapas.length) {
        etapaAtual++;
        atualizarTela();
        return;
    }

    finalizarQuestionario();
});

voltarEtapa.addEventListener("click", () => {
    if (etapaAtual <= 1) return;

    etapaAtual--;
    atualizarTela();
});

function pularEtapa() {
    if (etapaAtual < etapas.length) {
        etapaAtual++;
        atualizarTela();
        return;
    }

    finalizarQuestionario();
}

pularPergunta.addEventListener("click", pularEtapa);
pularPerguntaRodape.addEventListener("click", pularEtapa);

document.querySelectorAll("[data-adicionar]").forEach(botao => {
    botao.addEventListener("click", () => {
        grupoAdicionar = botao.dataset.adicionar;

        modalTitulo.textContent = grupoAdicionar === "turmas"
            ? "Adicionar turma ou etapa"
            : "Adicionar disciplina";

        novaOpcao.value = "";
        modalAdicionar.classList.add("aberto");

        setTimeout(() => novaOpcao.focus(), 50);
    });
});

confirmarAdicionar.addEventListener("click", () => {
    const valor = novaOpcao.value.trim();

    if (!valor || !grupoAdicionar) return;

    if (respostas[grupoAdicionar].includes(valor)) {
        mostrarToast("Essa opção já foi adicionada.");
        return;
    }

    respostas[grupoAdicionar].push(valor);
    criarOpcaoPersonalizada(grupoAdicionar, valor);
    fecharModalAdicionar();
    mostrarToast("Opção adicionada.");
});

function criarOpcaoPersonalizada(grupo, valor) {
    const botaoAdicionar = document.querySelector(`[data-adicionar="${grupo}"]`);

    if (!botaoAdicionar) return;

    const card = document.createElement("button");

    card.type = "button";
    card.className = "opcao-card simples selecionada";
    card.dataset.grupo = grupo;
    card.dataset.valor = valor;

    card.innerHTML = `
        <span class="opcao-nome"></span>
        <span class="check-visual"></span>
    `;

    card.querySelector(".opcao-nome").textContent = valor;

    configurarCard(card);

    botaoAdicionar.parentElement.insertBefore(card, botaoAdicionar);
}

function fecharModalAdicionar() {
    modalAdicionar.classList.remove("aberto");
    novaOpcao.value = "";
    grupoAdicionar = null;
}

fecharModal.addEventListener("click", fecharModalAdicionar);
cancelarModal.addEventListener("click", fecharModalAdicionar);

modalAdicionar.addEventListener("click", event => {
    if (event.target === modalAdicionar) {
        fecharModalAdicionar();
    }
});

novaOpcao.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        confirmarAdicionar.click();
    }

    if (event.key === "Escape") {
        fecharModalAdicionar();
    }
});

function finalizarQuestionario() {
    /*
        FUTURAMENTE:
        aqui as respostas serão enviadas para o backend/banco.

        respostas = {
            turmas: [...],
            disciplinas: [...],
            organizacao: [...],
            uso: [...]
        }
    */

    console.log("Respostas do questionário:", respostas);

    mostrarToast("Questionário concluído.");

    /*
        Quando o backend estiver pronto, depois de salvar:

        window.location.href = "painel.html";
    */
}

function mostrarToast(texto) {
    toastTexto.textContent = texto;
    toast.classList.add("show");

    clearTimeout(mostrarToast.timeout);

    mostrarToast.timeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

atualizarTela();