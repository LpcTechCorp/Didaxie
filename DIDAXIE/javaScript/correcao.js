const totalAlunos = document.getElementById("totalAlunos");
const taxaPresenca = document.getElementById("taxaPresenca");
const taxaEntregas = document.getElementById("taxaEntregas");
const textoAlunos = document.getElementById("textoAlunos");
const textoPresenca = document.getElementById("textoPresenca");
const textoEntregas = document.getElementById("textoEntregas");
const graficoTurmas = document.getElementById("graficoTurmas");
const mediaGeral = document.getElementById("mediaGeral");
const textoMedia = document.getElementById("textoMedia");
const totalCorrigidas = document.getElementById("totalCorrigidas");
const totalPendentes = document.getElementById("totalPendentes");
const totalExpiradas = document.getElementById("totalExpiradas");

function atualizarValor(elemento, valor, sufixo = "") {
    const numero = Number(valor) || 0;
    elemento.textContent = `${numero}${sufixo}`;

    if (numero === 0) {
        elemento.classList.add("valor-vazio");
    } else {
        elemento.classList.remove("valor-vazio");
    }
}

function atualizarMedia(valor) {
    const numero = Number(valor) || 0;

    mediaGeral.textContent = numero.toLocaleString("pt-BR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });

    if (numero === 0) {
        mediaGeral.classList.add("valor-vazio");
    } else {
        mediaGeral.classList.remove("valor-vazio");
    }
}

function renderizarGrafico(turmas) {
    graficoTurmas.innerHTML = "";

    if (!Array.isArray(turmas) || turmas.length === 0) {
        graficoTurmas.innerHTML = `
            <div class="grafico-vazio">
                <i class="fi fi-rr-chart-histogram"></i>
                <span>Nenhuma turma cadastrada</span>
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

function escapeHTML(texto) {
    const div = document.createElement("div");
    div.textContent = texto ?? "";
    return div.innerHTML;
}

function carregarDesempenho(dados) {
    atualizarValor(totalAlunos, dados?.alunosAtivos);
    atualizarValor(taxaPresenca, dados?.taxaPresenca, "%");
    atualizarValor(taxaEntregas, dados?.taxaEntregas, "%");

    textoAlunos.textContent = dados?.textoAlunos || "Nenhum dado disponível";
    textoPresenca.textContent = dados?.textoPresenca || "Nenhum dado disponível";
    textoEntregas.textContent = dados?.textoEntregas || "Nenhum dado disponível";

    atualizarMedia(dados?.mediaGeral);
    textoMedia.textContent = dados?.textoMedia || "Nenhum dado disponível";

    atualizarValor(totalCorrigidas, dados?.corrigidas);
    atualizarValor(totalPendentes, dados?.pendentes);
    atualizarValor(totalExpiradas, dados?.expiradas);

    renderizarGrafico(dados?.turmas);
}

/*
Futuramente:

carregarDesempenho({
    alunosAtivos: 128,
    taxaPresenca: 85,
    taxaEntregas: 87,
    mediaGeral: 7.8,
    corrigidas: 12,
    pendentes: 4,
    expiradas: 2,
    turmas: [
        { nome: "Turma 1", media: 8 },
        { nome: "Turma 2", media: 6 }
    ]
});

Por enquanto não existe banco.
*/

carregarDesempenho(null);