const filtroTurma = document.getElementById("filtroTurma");
const filtroPeriodo = document.getElementById("filtroPeriodo");

const totalAlunos = document.getElementById("totalAlunos");
const taxaPresenca = document.getElementById("taxaPresenca");
const taxaEntregas = document.getElementById("taxaEntregas");
const mediaGeralTopo = document.getElementById("mediaGeralTopo");

const textoAlunos = document.getElementById("textoAlunos");
const textoPresenca = document.getElementById("textoPresenca");
const textoEntregas = document.getElementById("textoEntregas");
const textoMediaTopo = document.getElementById("textoMediaTopo");

const graficoTurmas = document.getElementById("graficoTurmas");
const listaAtencao = document.getElementById("listaAtencao");

const totalCorrigidas = document.getElementById("totalCorrigidas");
const totalPendentes = document.getElementById("totalPendentes");
const totalExpiradas = document.getElementById("totalExpiradas");

const proximasAcoes = document.getElementById("proximasAcoes");
const graficoEvolucao = document.getElementById("graficoEvolucao");
const resumoTurmas = document.getElementById("resumoTurmas");

let dadosDesempenho = null;

function atualizarValor(elemento, valor, sufixo = "") {
    const numero = Number(valor) || 0;
    elemento.textContent = `${numero}${sufixo}`;

    if (numero === 0) {
        elemento.classList.add("valor-vazio");
    } else {
        elemento.classList.remove("valor-vazio");
    }
}

function atualizarMedia(elemento, valor) {
    const numero = Number(valor) || 0;

    elemento.textContent = numero.toLocaleString("pt-BR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });

    if (numero === 0) {
        elemento.classList.add("valor-vazio");
    } else {
        elemento.classList.remove("valor-vazio");
    }
}

function carregarTurmasFiltro(turmas) {
    filtroTurma.innerHTML = '<option value="">Todas as turmas</option>';

    if (!Array.isArray(turmas)) {
        return;
    }

    turmas.forEach(turma => {
        const option = document.createElement("option");
        option.value = turma.id || turma.nome;
        option.textContent = turma.nome;
        filtroTurma.appendChild(option);
    });
}

function renderizarGrafico(turmas) {
    graficoTurmas.innerHTML = "";

    if (!Array.isArray(turmas) || turmas.length === 0) {
        graficoTurmas.innerHTML = `
            <div class="grafico-vazio">
                <i class="fi fi-rr-chart-histogram"></i>
                <strong>Nenhuma turma cadastrada</strong>
                <span>Os dados de desempenho aparecerão aqui.</span>
            </div>
        `;
        return;
    }

    turmas.forEach(turma => {
        const media = Math.min(10, Math.max(0, Number(turma.media) || 0));

        const linha = document.createElement("div");
        linha.className = "grafico-linha";

        linha.innerHTML = `
            <span>${escapeHTML(turma.nome || "Turma")}</span>
            <div class="barra-track">
                <div class="barra" style="width:${media * 10}%"></div>
            </div>
            <strong class="grafico-nota">${media.toLocaleString("pt-BR", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            })}</strong>
        `;

        graficoTurmas.appendChild(linha);
    });
}

function renderizarAtencao(alertas) {
    listaAtencao.innerHTML = "";

    if (!Array.isArray(alertas) || alertas.length === 0) {
        listaAtencao.innerHTML = `
            <div class="estado-vazio-menor">
                <i class="fi fi-rr-bell-ring"></i>
                <span>Nenhum alerta no momento</span>
            </div>
        `;
        return;
    }

    alertas.forEach(alerta => {
        const item = document.createElement("div");
        item.className = "alerta-item";

        const titulo = document.createElement("strong");
        titulo.textContent = alerta.titulo || "Atenção";

        const descricao = document.createElement("span");
        descricao.textContent = alerta.descricao || "";

        item.appendChild(titulo);
        item.appendChild(descricao);

        listaAtencao.appendChild(item);
    });
}

function renderizarProximasAcoes(acoes) {
    proximasAcoes.innerHTML = "";

    if (!Array.isArray(acoes) || acoes.length === 0) {
        proximasAcoes.innerHTML = `
            <div class="estado-vazio-grande">
                <div class="estado-vazio-icone">
                    <i class="fi fi-rr-calendar-clock"></i>
                </div>
                <h3>Nenhuma ação pendente</h3>
                <p>Quando houver correções ou prazos próximos, eles aparecerão aqui.</p>
            </div>
        `;
        return;
    }

    acoes.forEach(acao => {
        const item = document.createElement("article");
        item.className = "acao-item";

        const info = document.createElement("div");
        info.className = "acao-info";

        const nome = document.createElement("strong");
        nome.textContent = acao.nome || "Atividade";

        const turma = document.createElement("span");
        turma.textContent = acao.turma || "";

        info.appendChild(nome);
        info.appendChild(turma);

        const prazo = document.createElement("span");
        prazo.className = "acao-prazo";
        prazo.textContent = acao.prazo || "";

        const status = document.createElement("span");
        status.className = "acao-status";
        status.textContent = acao.status || "";

        item.appendChild(info);
        item.appendChild(prazo);
        item.appendChild(status);

        proximasAcoes.appendChild(item);
    });
}

function renderizarResumoTurmas(turmas) {
    resumoTurmas.innerHTML = "";

    if (!Array.isArray(turmas) || turmas.length === 0) {
        resumoTurmas.innerHTML = `
            <tr class="tabela-vazia">
                <td colspan="5">Nenhuma turma cadastrada.</td>
            </tr>
        `;
        return;
    }

    turmas.forEach(turma => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${escapeHTML(turma.nome || "")}</td>
            <td>${formatarNumero(turma.media)}</td>
            <td>${formatarPercentual(turma.presenca)}</td>
            <td>${formatarPercentual(turma.entregas)}</td>
            <td>${Number(turma.alunos) || 0}</td>
        `;

        resumoTurmas.appendChild(linha);
    });
}

function renderizarEvolucao(evolucao) {
    if (!Array.isArray(evolucao) || evolucao.length < 2) {
        graficoEvolucao.innerHTML = `
            <i class="fi fi-rr-chart-line-up"></i>
            <strong>Sem dados suficientes</strong>
            <span>A evolução será exibida depois que houver registros em mais de um período.</span>
        `;
        return;
    }

    graficoEvolucao.innerHTML = `
        <strong>Dados de evolução disponíveis</strong>
        <span>O gráfico poderá ser desenhado aqui quando o backend estiver conectado.</span>
    `;
}

function formatarNumero(valor) {
    const numero = Number(valor) || 0;

    return numero.toLocaleString("pt-BR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
}

function formatarPercentual(valor) {
    return `${Number(valor) || 0}%`;
}

function escapeHTML(texto) {
    const div = document.createElement("div");
    div.textContent = texto ?? "";
    return div.innerHTML;
}

function carregarDesempenho(dados) {
    dadosDesempenho = dados || null;

    atualizarValor(totalAlunos, dados?.alunosAtivos);
    atualizarValor(taxaPresenca, dados?.taxaPresenca, "%");
    atualizarValor(taxaEntregas, dados?.taxaEntregas, "%");
    atualizarMedia(mediaGeralTopo, dados?.mediaGeral);

    textoAlunos.textContent = dados?.textoAlunos || "Nenhum dado disponível";
    textoPresenca.textContent = dados?.textoPresenca || "Nenhum dado disponível";
    textoEntregas.textContent = dados?.textoEntregas || "Nenhum dado disponível";
    textoMediaTopo.textContent = dados?.textoMedia || "Nenhum dado disponível";

    atualizarValor(totalCorrigidas, dados?.corrigidas);
    atualizarValor(totalPendentes, dados?.pendentes);
    atualizarValor(totalExpiradas, dados?.expiradas);

    carregarTurmasFiltro(dados?.turmas);
    renderizarGrafico(dados?.turmas);
    renderizarAtencao(dados?.alertas);
    renderizarProximasAcoes(dados?.proximasAcoes);
    renderizarResumoTurmas(dados?.turmas);
    renderizarEvolucao(dados?.evolucao);
}

function aplicarFiltros() {
    /*
        Futuramente:

        const turma = filtroTurma.value;
        const periodo = filtroPeriodo.value;

        Aqui vocês poderão buscar novamente os dados
        do backend usando a turma e o período escolhidos.
    */

    console.log("Filtro turma:", filtroTurma.value);
    console.log("Filtro período:", filtroPeriodo.value);
}

filtroTurma.addEventListener("change", aplicarFiltros);
filtroPeriodo.addEventListener("change", aplicarFiltros);

/*
Futuramente:

carregarDesempenho({
    alunosAtivos: 128,
    taxaPresenca: 85,
    taxaEntregas: 87,
    mediaGeral: 7.8,
    corrigidas: 22,
    pendentes: 8,
    expiradas: 3,

    turmas: [
        {
            id: 1,
            nome: "Turma 1",
            media: 8,
            presenca: 90,
            entregas: 86,
            alunos: 32
        }
    ],

    alertas: [
        {
            titulo: "Turma 2 precisa de atenção",
            descricao: "Média abaixo de 6,0."
        }
    ],

    proximasAcoes: [
        {
            nome: "Atividade de algoritmos",
            turma: "Turma 1",
            prazo: "Hoje",
            status: "Pendente"
        }
    ],

    evolucao: [
        { periodo: "Junho", media: 6.8 },
        { periodo: "Julho", media: 7.2 }
    ]
});

Por enquanto não existe banco.
*/

carregarDesempenho(null);