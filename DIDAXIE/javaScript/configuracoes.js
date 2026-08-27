const form = document.getElementById("configForm");
const alterarFoto = document.getElementById("alterarFoto");
const inputFoto = document.getElementById("inputFoto");
const fotoImagem = document.getElementById("fotoImagem");
const fotoPreview = document.getElementById("fotoPreview");

const materiasSelect = document.getElementById("materiasSelect");
const materiasChips = document.getElementById("materiasChips");
const materiasOpcoes = document.getElementById("materiasOpcoes");
const abrirMaterias = document.getElementById("abrirMaterias");

const turmasSelect = document.getElementById("turmasSelect");
const turmasChips = document.getElementById("turmasChips");
const turmasOpcoes = document.getElementById("turmasOpcoes");
const abrirTurmas = document.getElementById("abrirTurmas");

const novaSenha = document.getElementById("novaSenha");
const confirmarSenha = document.getElementById("confirmarSenha");
const senhaErro = document.getElementById("senhaErro");
const forcaBarra = document.getElementById("forcaBarra");
const forcaTexto = document.getElementById("forcaTexto");

const cancelarAlteracoes = document.getElementById("cancelarAlteracoes");
const alteracoesStatus = document.getElementById("alteracoesStatus");
const toast = document.getElementById("toast");
const toastTexto = document.getElementById("toastTexto");

let alterado = false;
let materiasSelecionadas = [];
let turmasSelecionadas = [];

const estadoInicial = new FormData(form);

function marcarAlteracao() {
    alterado = true;
    alteracoesStatus.textContent = "Alterações não salvas";
    alteracoesStatus.style.color = "#7127e8";
}

form.querySelectorAll("input, select").forEach(elemento => {
    elemento.addEventListener("input", marcarAlteracao);
    elemento.addEventListener("change", marcarAlteracao);
});

alterarFoto.addEventListener("click", () => {
    inputFoto.click();
});

inputFoto.addEventListener("change", () => {
    const arquivo = inputFoto.files[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
        mostrarToast("Selecione uma imagem válida.");
        inputFoto.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = event => {
        fotoImagem.src = event.target.result;
        fotoImagem.style.display = "block";

        const icone = fotoPreview.querySelector("i");

        if (icone) {
            icone.style.display = "none";
        }

        marcarAlteracao();
    };

    reader.readAsDataURL(arquivo);
});

document.querySelectorAll(".ver-senha").forEach(botao => {
    botao.addEventListener("click", () => {
        const input = document.getElementById(botao.dataset.target);
        const icone = botao.querySelector("i");

        if (input.type === "password") {
            input.type = "text";
            icone.className = "fi fi-rr-eye-crossed";
        } else {
            input.type = "password";
            icone.className = "fi fi-rr-eye";
        }
    });
});

novaSenha.addEventListener("input", () => {
    const senha = novaSenha.value;

    let pontos = 0;

    if (senha.length >= 8) pontos++;
    if (/[A-Z]/.test(senha)) pontos++;
    if (/[0-9]/.test(senha)) pontos++;
    if (/[^A-Za-z0-9]/.test(senha)) pontos++;

    const porcentagem = pontos * 25;

    forcaBarra.style.width = `${porcentagem}%`;

    if (!senha) {
        forcaTexto.textContent = "Digite uma nova senha";
        forcaBarra.style.background = "#bbb";
        return;
    }

    if (pontos <= 1) {
        forcaTexto.textContent = "Senha fraca";
        forcaBarra.style.background = "#e45f76";
    } else if (pontos <= 3) {
        forcaTexto.textContent = "Senha média";
        forcaBarra.style.background = "#e0aa3d";
    } else {
        forcaTexto.textContent = "Senha forte";
        forcaBarra.style.background = "#55ac79";
    }

    validarConfirmacaoSenha();
});

confirmarSenha.addEventListener("input", validarConfirmacaoSenha);

function validarConfirmacaoSenha() {
    if (!confirmarSenha.value) {
        senhaErro.textContent = "";
        return true;
    }

    if (novaSenha.value !== confirmarSenha.value) {
        senhaErro.textContent = "As senhas não coincidem.";
        return false;
    }

    senhaErro.textContent = "";
    return true;
}

function configurarMultiSelect({
    container,
    botao,
    opcoesContainer,
    chipsContainer,
    selecionados,
    vazio
}) {
    botao.addEventListener("click", event => {
        event.stopPropagation();

        document.querySelectorAll(".multi-select.open").forEach(select => {
            if (select !== container) {
                select.classList.remove("open");
            }
        });

        container.classList.toggle("open");
    });

    function renderizarChips() {
        chipsContainer.innerHTML = "";

        if (!selecionados.length) {
            const placeholder = document.createElement("span");
            placeholder.className = "placeholder-chip";
            placeholder.textContent = vazio;
            chipsContainer.appendChild(placeholder);
            return;
        }

        selecionados.forEach(item => {
            const chip = document.createElement("span");
            chip.className = "chip";

            const texto = document.createElement("span");
            texto.textContent = item.nome;

            const remover = document.createElement("button");
            remover.type = "button";
            remover.innerHTML = "×";
            remover.setAttribute("aria-label", `Remover ${item.nome}`);

            remover.addEventListener("click", event => {
                event.stopPropagation();

                const index = selecionados.findIndex(valor => valor.id === item.id);

                if (index !== -1) {
                    selecionados.splice(index, 1);
                }

                renderizarChips();
                renderizarOpcoes();
                marcarAlteracao();
            });

            chip.appendChild(texto);
            chip.appendChild(remover);

            chipsContainer.appendChild(chip);
        });
    }

    function renderizarOpcoes(opcoes = []) {
        opcoesContainer.innerHTML = "";

        if (!opcoes.length) {
            const vazioElemento = document.createElement("div");
            vazioElemento.className = "multi-option";
            vazioElemento.textContent = "Nenhuma opção disponível";
            vazioElemento.style.cursor = "default";

            opcoesContainer.appendChild(vazioElemento);
            return;
        }

        opcoes.forEach(item => {
            const selecionado = selecionados.some(valor => valor.id === item.id);

            if (selecionado) return;

            const opcao = document.createElement("button");
            opcao.type = "button";
            opcao.className = "multi-option";
            opcao.textContent = item.nome;

            opcao.addEventListener("click", () => {
                selecionados.push(item);
                renderizarChips();
                renderizarOpcoes(opcoes);
                container.classList.remove("open");
                marcarAlteracao();
            });

            opcoesContainer.appendChild(opcao);
        });
    }

    return {
        renderizar(opcoes) {
            renderizarChips();
            renderizarOpcoes(opcoes);
        }
    };
}

const materiasUI = configurarMultiSelect({
    container: materiasSelect,
    botao: abrirMaterias,
    opcoesContainer: materiasOpcoes,
    chipsContainer: materiasChips,
    selecionados: materiasSelecionadas,
    vazio: "Nenhuma matéria cadastrada"
});

const turmasUI = configurarMultiSelect({
    container: turmasSelect,
    botao: abrirTurmas,
    opcoesContainer: turmasOpcoes,
    chipsContainer: turmasChips,
    selecionados: turmasSelecionadas,
    vazio: "Nenhuma turma cadastrada"
});

document.addEventListener("click", event => {
    if (!materiasSelect.contains(event.target)) {
        materiasSelect.classList.remove("open");
    }

    if (!turmasSelect.contains(event.target)) {
        turmasSelect.classList.remove("open");
    }
});

function carregarMaterias(materias) {
    materiasUI.renderizar(
        Array.isArray(materias) ? materias : []
    );
}

function carregarTurmas(turmas) {
    turmasUI.renderizar(
        Array.isArray(turmas) ? turmas : []
    );
}

function carregarConfiguracoes(dados) {
    if (!dados) {
        carregarMaterias([]);
        carregarTurmas([]);
        return;
    }

    document.getElementById("nomeCompleto").value = dados.nome || "";
    document.getElementById("email").value = dados.email || "";
    document.getElementById("cargo").value = dados.cargo || "";
    document.getElementById("instituicao").value = dados.instituicao || "";
    document.getElementById("departamento").value = dados.departamento || "";

    document.getElementById("tema").value = dados.tema || "claro";
    document.getElementById("notificacoesEmail").checked = Boolean(dados.notificacoesEmail);
    document.getElementById("idioma").value = dados.idioma || "pt-BR";
    document.getElementById("formatoData").value = dados.formatoData || "dd-mm-yyyy";

    materiasSelecionadas.length = 0;
    turmasSelecionadas.length = 0;

    if (Array.isArray(dados.materiasSelecionadas)) {
        materiasSelecionadas.push(...dados.materiasSelecionadas);
    }

    if (Array.isArray(dados.turmasSelecionadas)) {
        turmasSelecionadas.push(...dados.turmasSelecionadas);
    }

    carregarMaterias(dados.materiasDisponiveis);
    carregarTurmas(dados.turmasDisponiveis);

    alterado = false;
    alteracoesStatus.textContent = "Nenhuma alteração";
    alteracoesStatus.style.color = "#999";
}

cancelarAlteracoes.addEventListener("click", () => {
    form.reset();

    materiasSelecionadas.length = 0;
    turmasSelecionadas.length = 0;

    carregarMaterias([]);
    carregarTurmas([]);

    fotoImagem.src = "";
    fotoImagem.style.display = "none";

    const icone = fotoPreview.querySelector("i");

    if (icone) {
        icone.style.display = "block";
    }

    alterado = false;
    alteracoesStatus.textContent = "Nenhuma alteração";
    alteracoesStatus.style.color = "#999";
});

form.addEventListener("submit", event => {
    event.preventDefault();

    if (!validarConfirmacaoSenha()) {
        confirmarSenha.focus();
        return;
    }

    /*
        Futuramente:
        enviar os dados para o backend.

        Nenhuma configuração é persistida
        localmente por enquanto.
    */

    mostrarToast("Alterações prontas para serem salvas.");

    alterado = false;
    alteracoesStatus.textContent = "Nenhuma alteração";
    alteracoesStatus.style.color = "#999";
});

function mostrarToast(texto) {
    toastTexto.textContent = texto;
    toast.classList.add("show");

    clearTimeout(mostrarToast.timeout);

    mostrarToast.timeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

/*
    Futuramente:

    carregarConfiguracoes({
        nome: "...",
        email: "...",
        cargo: "professor",
        instituicao: "...",
        departamento: "...",

        materiasDisponiveis: [
            { id: 1, nome: "Programação" }
        ],

        materiasSelecionadas: [
            { id: 1, nome: "Programação" }
        ],

        turmasDisponiveis: [
            { id: 10, nome: "1º ano C" }
        ],

        turmasSelecionadas: [
            { id: 10, nome: "1º ano C" }
        ]
    });
*/

carregarConfiguracoes(null);