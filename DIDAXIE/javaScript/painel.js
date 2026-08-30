const nomeProfessor = document.getElementById("nomeProfessor");
const dataAtual = document.getElementById("dataAtual");

const totalPlanos = document.getElementById("totalPlanos");
const totalMateriais = document.getElementById("totalMateriais");
const totalAtividades = document.getElementById("totalAtividades");
const totalCorrecoes = document.getElementById("totalCorrecoes");

const progressoCirculo = document.getElementById("progressoCirculo");
const progressoValor = document.getElementById("progressoValor");
const progressoTexto = document.getElementById("progressoTexto");

const atividadesRecentes = document.getElementById("atividadesRecentes");

/* DATA ATUAL */

function mostrarDataAtual() {
    const hoje = new Date();

    let texto = hoje.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    texto = texto.charAt(0).toUpperCase() + texto.slice(1);

    dataAtual.textContent = texto;
}

/* CONTADORES */

function atualizarContador(elemento, valor) {
    const numero = Number(valor) || 0;

    elemento.textContent = numero;

    if (numero === 0) {
        elemento.classList.add("vazio");
    } else {
        elemento.classList.remove("vazio");
    }
}

/* PROGRESSO */

function atualizarProgresso(valor, total) {
    const porcentagem = Math.min(
        100,
        Math.max(0, Number(valor) || 0)
    );

    const totalAtividadesSemana = Number(total) || 0;

    progressoValor.textContent = `${porcentagem}%`;

    progressoCirculo.style.setProperty(
        "--progresso",
        `${porcentagem * 3.6}deg`
    );

    if (porcentagem > 0) {
        progressoCirculo.classList.add("com-progresso");
    } else {
        progressoCirculo.classList.remove("com-progresso");
    }

    if (totalAtividadesSemana === 0) {
        progressoTexto.textContent =
            "Nenhuma atividade planejada para essa semana.";

        return;
    }

    progressoTexto.textContent =
        `Você já concluiu ${porcentagem}% das atividades planejadas para essa semana.`;
}

/* ATIVIDADES RECENTES */

function mostrarAtividadesRecentes(atividades) {
    atividadesRecentes.innerHTML = "";

    if (!Array.isArray(atividades) || atividades.length === 0) {
        atividadesRecentes.innerHTML = `
            <div class="estado-vazio">
                <i class="fi fi-rr-calendar-clock"></i>
                <span>Nenhuma atividade recente</span>
            </div>
        `;

        return;
    }

    atividades.slice(0, 3).forEach(atividade => {
        const item = document.createElement("div");

        item.className = "atividade-recente";

        const icone = document.createElement("div");

        icone.className = "atividade-icone";
        icone.innerHTML =
            '<i class="fi fi-rr-document"></i>';

        const info = document.createElement("div");

        info.className = "atividade-info";

        const nome = document.createElement("strong");

        nome.textContent =
            atividade.nome || "Atividade";

        const turma = document.createElement("span");

        turma.textContent =
            atividade.turma || "";

        info.appendChild(nome);
        info.appendChild(turma);

        const horario = document.createElement("span");

        horario.className = "atividade-horario";
        horario.textContent =
            atividade.horario || "";

        item.appendChild(icone);
        item.appendChild(info);
        item.appendChild(horario);

        atividadesRecentes.appendChild(item);
    });
}

/* DADOS DO PAINEL */

function carregarPainel(dados) {
    /*
        O nome verdadeiro do professor
        será carregado futuramente pelo
        banco/login.

        Enquanto não houver dados reais,
        nenhum nome fictício é exibido.
    */

    nomeProfessor.textContent =
        dados?.professor?.nome || "-----";

    atualizarContador(
        totalPlanos,
        dados?.quantidades?.planosAula
    );

    atualizarContador(
        totalMateriais,
        dados?.quantidades?.materiais
    );

    atualizarContador(
        totalAtividades,
        dados?.quantidades?.atividades
    );

    atualizarContador(
        totalCorrecoes,
        dados?.quantidades?.correcoes
    );

    atualizarProgresso(
        dados?.progresso?.porcentagem,
        dados?.progresso?.total
    );

    mostrarAtividadesRecentes(
        dados?.atividadesRecentes
    );
}

/* INICIALIZAÇÃO */

mostrarDataAtual();

/*
    BANCO AINDA NÃO CONECTADO.

    Por enquanto:

    Nome do professor = -----
    Planos de aula = 0
    Materiais = 0
    Atividades = 0
    Correções = 0
    Progresso = 0%
    Atividades recentes = vazio

    Quando o backend estiver pronto:

    carregarPainel(dadosDoBanco);
*/

carregarPainel(null);