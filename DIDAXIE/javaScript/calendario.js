const calendarDays = document.getElementById("calendarDays");
const monthTitle = document.getElementById("monthTitle");
const previousMonth = document.getElementById("previousMonth");
const nextMonth = document.getElementById("nextMonth");

const todayDate = document.getElementById("todayDate");
const todayEvents = document.getElementById("todayEvents");
const recentEvents = document.getElementById("recentEvents");

const eventModal = document.getElementById("eventModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");

const eventForm = document.getElementById("eventForm");
const eventTitle = document.getElementById("eventTitle");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
const endDateGroup = document.getElementById("endDateGroup");
const dateRow = document.querySelector(".date-row");
const allDay = document.getElementById("allDay");
const eventComment = document.getElementById("eventComment");

const discardButton = document.getElementById("discardButton");
const deleteButton = document.getElementById("deleteButton");

const eventSelect = document.getElementById("eventSelect");
const eventSelectButton = document.getElementById("eventSelectButton");
const eventOptions = document.getElementById("eventOptions");
const selectedTypeDot = document.getElementById("selectedTypeDot");
const selectedTypeText = document.getElementById("selectedTypeText");

const eventPreview = document.getElementById("eventPreview");
const previewDot = document.getElementById("previewDot");
const previewTitle = document.getElementById("previewTitle");
const previewType = document.getElementById("previewType");
const previewStart = document.getElementById("previewStart");
const previewEnd = document.getElementById("previewEnd");
const previewEndRow = document.getElementById("previewEndRow");
const previewComment = document.getElementById("previewComment");
const previewCommentRow = document.getElementById("previewCommentRow");
const previewEditButton = document.getElementById("previewEditButton");

const hoje = new Date();
const mesInicial = hoje.getMonth();
const anoInicial = hoje.getFullYear();

let mesAtual = mesInicial;
let anoAtual = anoInicial;

let tipoSelecionado = "lesson";
let eventoEditandoId = null;
let eventoPreviewId = null;
let elementoReferenciaModal = null;

let eventos = [];

const nomesMeses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];

const tipos = {
    lesson: {
        nome: "Planos de aula",
        classe: "lesson"
    },

    activity: {
        nome: "Atividades",
        classe: "activity"
    },

    correction: {
        nome: "Correções",
        classe: "correction"
    },

    delivery: {
        nome: "Entregas",
        classe: "delivery"
    }
};

function formatarDataInput(ano, mes, dia) {
    return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

function criarDataLocal(valor) {
    const [ano, mes, dia] = valor.split("-").map(Number);

    return new Date(
        ano,
        mes - 1,
        dia
    );
}

function formatarDataExibicao(valor) {
    if (!valor) return "";

    return criarDataLocal(valor).toLocaleDateString(
        "pt-BR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );
}

function formatarDataCurta(valor) {
    return criarDataLocal(valor)
        .toLocaleDateString(
            "pt-BR",
            {
                day: "2-digit",
                month: "short"
            }
        )
        .replace(".", "");
}

function hojeInput() {
    return formatarDataInput(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate()
    );
}

function diferencaMeses(ano, mes) {
    return (
        (ano - anoInicial) * 12 +
        (mes - mesInicial)
    );
}

function atualizarLimitesMes() {
    const diferenca =
        diferencaMeses(
            anoAtual,
            mesAtual
        );

    previousMonth.disabled =
        diferenca <= -12;

    nextMonth.disabled =
        diferenca >= 12;
}

function criarCalendario() {
    calendarDays.innerHTML = "";

    monthTitle.textContent =
        `${nomesMeses[mesAtual]} ${anoAtual}`;

    const primeiroDia =
        new Date(
            anoAtual,
            mesAtual,
            1
        );

    const ultimoDia =
        new Date(
            anoAtual,
            mesAtual + 1,
            0
        );

    const quantidadeDias =
        ultimoDia.getDate();

    const inicioSemana =
        primeiroDia.getDay();

    for (
        let i = 0;
        i < inicioSemana;
        i++
    ) {

        const vazio =
            document.createElement("div");

        vazio.className =
            "calendar-day empty";

        calendarDays.appendChild(vazio);
    }

    for (
        let dia = 1;
        dia <= quantidadeDias;
        dia++
    ) {

        const dataValor =
            formatarDataInput(
                anoAtual,
                mesAtual,
                dia
            );

        const data =
            new Date(
                anoAtual,
                mesAtual,
                dia
            );

        const dayElement =
            document.createElement("div");

        dayElement.className =
            "calendar-day";

        dayElement.dataset.date =
            dataValor;

        if (data.getDay() === 0) {
            dayElement.classList.add(
                "sunday"
            );
        }

        if (
            dia === hoje.getDate() &&
            mesAtual === hoje.getMonth() &&
            anoAtual === hoje.getFullYear()
        ) {

            dayElement.classList.add(
                "today"
            );
        }

        const numero =
            document.createElement("span");

        numero.className =
            "day-number";

        numero.textContent =
            dia;

        const dayEvents =
            document.createElement("div");

        dayEvents.className =
            "day-events";

        eventos
            .filter(
                evento =>
                    evento.startDate ===
                    dataValor
            )
            .forEach(evento => {

                dayEvents.appendChild(
                    criarEventoCalendario(
                        evento
                    )
                );

            });

        dayElement.appendChild(numero);
        dayElement.appendChild(dayEvents);

        dayElement.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest(
                        ".calendar-event"
                    )
                ) {
                    return;
                }

                abrirModalNovo(
                    dataValor,
                    dayElement
                );

            }
        );

        dayElement.addEventListener(
            "contextmenu",
            event => {

                event.preventDefault();

                if (
                    event.target.closest(
                        ".calendar-event"
                    )
                ) {
                    return;
                }

                abrirModalNovo(
                    dataValor,
                    dayElement
                );

            }
        );

        calendarDays.appendChild(
            dayElement
        );
    }

    const total =
        inicioSemana +
        quantidadeDias;

    const faltam =
        total % 7 === 0
            ? 0
            : 7 - (total % 7);

    for (
        let i = 0;
        i < faltam;
        i++
    ) {

        const vazio =
            document.createElement("div");

        vazio.className =
            "calendar-day empty";

        calendarDays.appendChild(vazio);
    }

    atualizarLimitesMes();
    renderizarLaterais();
}

function criarEventoCalendario(evento) {
    const item =
        document.createElement("button");

    item.type = "button";

    item.className =
        `calendar-event ${evento.type}`;

    item.textContent =
        evento.title;

    item.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            abrirPreview(
                evento,
                item
            );

        }
    );

    item.addEventListener(
        "mouseenter",
        () => {

            abrirPreview(
                evento,
                item
            );

        }
    );

    return item;
}

function selecionarTipo(tipo) {
    tipoSelecionado = tipo;

    selectedTypeText.textContent =
        tipos[tipo].nome;

    selectedTypeDot.className =
        `type-dot ${tipos[tipo].classe}-dot`;

    eventSelect.classList.remove(
        "open"
    );
}

eventSelectButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        eventSelect.classList.toggle(
            "open"
        );

    }
);

eventOptions
    .querySelectorAll(".event-option")
    .forEach(option => {

        option.addEventListener(
            "click",
            () => {

                selecionarTipo(
                    option.dataset.value
                );

            }
        );

    });

document.addEventListener(
    "click",
    event => {

        if (
            !eventSelect.contains(
                event.target
            )
        ) {

            eventSelect.classList.remove(
                "open"
            );

        }

    }
);

allDay.addEventListener(
    "change",
    atualizarCampoTermino
);

function atualizarCampoTermino() {
    if (allDay.checked) {

        endDate.value = "";

        endDateGroup.classList.add(
            "hidden-date"
        );

        dateRow.classList.add(
            "all-day-active"
        );

    } else {

        endDateGroup.classList.remove(
            "hidden-date"
        );

        dateRow.classList.remove(
            "all-day-active"
        );

    }
}

function abrirModalNovo(
    data,
    elemento
) {

    eventoEditandoId = null;
    elementoReferenciaModal =
        elemento;

    modalTitle.textContent =
        "Adicionar ao calendário";

    eventForm.reset();

    eventTitle.value = "";
    eventComment.value = "";

    startDate.value =
        data;

    endDate.value = "";

    allDay.checked =
        false;

    atualizarCampoTermino();
    selecionarTipo("lesson");

    deleteButton.classList.add(
        "hidden"
    );

    fecharPreview();
    abrirModal(elemento);
}

function abrirModalEdicao(
    evento,
    elemento
) {

    eventoEditandoId =
        evento.id;

    elementoReferenciaModal =
        elemento;

    modalTitle.textContent =
        "Editar calendário";

    eventTitle.value =
        evento.title;

    startDate.value =
        evento.startDate;

    endDate.value =
        evento.endDate || "";

    allDay.checked =
        evento.allDay;

    eventComment.value =
        evento.comment || "";

    atualizarCampoTermino();
    selecionarTipo(evento.type);

    deleteButton.classList.remove(
        "hidden"
    );

    fecharPreview();
    abrirModal(elemento);
}

function abrirModal(elemento) {
    modalBackdrop.classList.add(
        "open"
    );

    eventModal.classList.add(
        "open"
    );

    requestAnimationFrame(() => {

        posicionarModal(elemento);

        eventTitle.focus();

    });
}

function posicionarModal(elemento) {
    if (
        window.innerWidth <= 768 ||
        !elemento
    ) {
        return;
    }

    const rect =
        elemento.getBoundingClientRect();

    const modalRect =
        eventModal.getBoundingClientRect();

    const margem = 12;

    let left =
        rect.right + margem;

    let top =
        rect.top;

    if (
        left +
        modalRect.width >
        window.innerWidth - margem
    ) {

        left =
            rect.left -
            modalRect.width -
            margem;
    }

    if (left < margem) {
        left = margem;
    }

    if (
        top +
        modalRect.height >
        window.innerHeight - margem
    ) {

        top =
            window.innerHeight -
            modalRect.height -
            margem;
    }

    if (top < margem) {
        top = margem;
    }

    eventModal.style.left =
        `${left}px`;

    eventModal.style.top =
        `${top}px`;
}

function fecharModal() {
    eventModal.classList.remove(
        "open"
    );

    modalBackdrop.classList.remove(
        "open"
    );

    eventSelect.classList.remove(
        "open"
    );

    eventoEditandoId = null;
    elementoReferenciaModal = null;
}

eventForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const titulo =
            eventTitle.value.trim();

        if (
            !titulo ||
            !startDate.value
        ) {
            return;
        }

        if (
            !allDay.checked &&
            endDate.value &&
            criarDataLocal(endDate.value) <
            criarDataLocal(startDate.value)
        ) {
            return;
        }

        const dados = {

            title: titulo,
            type: tipoSelecionado,

            startDate:
                startDate.value,

            endDate:
                allDay.checked
                    ? ""
                    : endDate.value,

            allDay:
                allDay.checked,

            comment:
                eventComment.value.trim()

        };

        if (
            eventoEditandoId !== null
        ) {

            const evento =
                eventos.find(
                    item =>
                        item.id ===
                        eventoEditandoId
                );

            if (evento) {
                Object.assign(
                    evento,
                    dados
                );
            }

        } else {

            eventos.push({

                id: Date.now(),

                ...dados

            });

        }

        fecharModal();
        criarCalendario();

    }
);

function excluirEvento(id) {
    eventos =
        eventos.filter(
            evento =>
                evento.id !== id
        );

    fecharPreview();
    fecharModal();
    criarCalendario();
}

deleteButton.addEventListener(
    "click",
    () => {

        if (
            eventoEditandoId !== null
        ) {

            excluirEvento(
                eventoEditandoId
            );

        }

    }
);

discardButton.addEventListener(
    "click",
    fecharModal
);

modalClose.addEventListener(
    "click",
    fecharModal
);

modalBackdrop.addEventListener(
    "click",
    fecharModal
);

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            fecharPreview();
            fecharModal();

        }

    }
);

previousMonth.addEventListener(
    "click",
    () => {

        if (
            diferencaMeses(
                anoAtual,
                mesAtual
            ) <= -12
        ) {
            return;
        }

        mesAtual--;

        if (mesAtual < 0) {

            mesAtual = 11;
            anoAtual--;

        }

        fecharPreview();
        criarCalendario();

    }
);

nextMonth.addEventListener(
    "click",
    () => {

        if (
            diferencaMeses(
                anoAtual,
                mesAtual
            ) >= 12
        ) {
            return;
        }

        mesAtual++;

        if (mesAtual > 11) {

            mesAtual = 0;
            anoAtual++;

        }

        fecharPreview();
        criarCalendario();

    }
);

function renderizarLaterais() {
    renderizarHoje();
    renderizarRecentes();
}

function renderizarHoje() {
    const eventosHoje =
        eventos.filter(
            evento =>
                evento.startDate ===
                hojeInput()
        );

    todayEvents.innerHTML = "";

    if (!eventosHoje.length) {

        todayEvents.innerHTML =
            '<div class="empty-message">Nenhuma atividade para hoje.</div>';

        return;
    }

    eventosHoje.forEach(
        evento => {

            todayEvents.appendChild(
                criarEventoLateral(
                    evento
                )
            );

        }
    );
}

function renderizarRecentes() {
    recentEvents.innerHTML = "";

    const ordenados =
        [...eventos]
            .sort(
                (a, b) =>
                    criarDataLocal(
                        b.startDate
                    ) -
                    criarDataLocal(
                        a.startDate
                    )
            )
            .slice(0, 6);

    if (!ordenados.length) {

        recentEvents.innerHTML =
            '<div class="empty-message">Nenhuma atividade recente.</div>';

        return;
    }

    ordenados.forEach(
        evento => {

            const wrapper =
                document.createElement(
                    "div"
                );

            const data =
                document.createElement(
                    "small"
                );

            data.textContent =
                formatarDataCurta(
                    evento.startDate
                );

            wrapper.appendChild(
                data
            );

            wrapper.appendChild(
                criarEventoLateral(
                    evento
                )
            );

            recentEvents.appendChild(
                wrapper
            );

        }
    );
}

function criarEventoLateral(evento) {
    const item =
        document.createElement("div");

    item.className =
        "side-event";

    const conteudo =
        document.createElement("div");

    conteudo.className =
        `side-event-content ${evento.type}`;

    conteudo.textContent =
        evento.title;

    conteudo.addEventListener(
        "mouseenter",
        () => {

            abrirPreview(
                evento,
                conteudo
            );

        }
    );

    conteudo.addEventListener(
        "click",
        () => {

            abrirPreview(
                evento,
                conteudo
            );

        }
    );

    const remover =
        document.createElement(
            "button"
        );

    remover.type = "button";

    remover.className =
        "side-event-remove";

    remover.innerHTML =
        '<i class="fi fi-rr-cross-small"></i>';

    remover.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            excluirEvento(
                evento.id
            );

        }
    );

    item.appendChild(
        conteudo
    );

    item.appendChild(
        remover
    );

    return item;
}

function abrirPreview(
    evento,
    elemento
) {

    eventoPreviewId =
        evento.id;

    previewTitle.textContent =
        evento.title;

    previewType.textContent =
        tipos[evento.type].nome;

    previewStart.textContent =
        formatarDataExibicao(
            evento.startDate
        );

    previewDot.className =
        `type-dot ${tipos[evento.type].classe}-dot`;

    if (
        evento.allDay ||
        !evento.endDate
    ) {

        previewEndRow.style.display =
            "none";

    } else {

        previewEndRow.style.display =
            "flex";

        previewEnd.textContent =
            formatarDataExibicao(
                evento.endDate
            );

    }

    if (evento.comment) {

        previewCommentRow.style.display =
            "flex";

        previewComment.textContent =
            evento.comment;

    } else {

        previewCommentRow.style.display =
            "none";

    }

    eventPreview.classList.add(
        "open"
    );

    posicionarPreview(
        elemento
    );
}

function posicionarPreview(elemento) {
    if (
        window.innerWidth <= 768
    ) {
        return;
    }

    const rect =
        elemento.getBoundingClientRect();

    const previewRect =
        eventPreview.getBoundingClientRect();

    const margem = 7;

    let left =
        rect.left;

    let top =
        rect.bottom + margem;

    if (
        left +
        previewRect.width >
        window.innerWidth - margem
    ) {

        left =
            window.innerWidth -
            previewRect.width -
            margem;

    }

    if (
        top +
        previewRect.height >
        window.innerHeight - margem
    ) {

        top =
            rect.top -
            previewRect.height -
            margem;

    }

    if (left < margem) {
        left = margem;
    }

    if (top < margem) {
        top = margem;
    }

    eventPreview.style.left =
        `${left}px`;

    eventPreview.style.top =
        `${top}px`;
}

function fecharPreview() {
    eventPreview.classList.remove(
        "open"
    );

    eventoPreviewId = null;
}

previewEditButton.addEventListener(
    "click",
    () => {

        const evento =
            eventos.find(
                item =>
                    item.id ===
                    eventoPreviewId
            );

        if (!evento) {
            return;
        }

        const elemento =
            document.querySelector(
                `.calendar-day[data-date="${evento.startDate}"]`
            );

        abrirModalEdicao(
            evento,
            elemento ||
            previewEditButton
        );

    }
);

eventPreview.addEventListener(
    "mouseleave",
    () => {

        fecharPreview();

    }
);

document.addEventListener(
    "click",
    event => {

        if (
            eventPreview.classList.contains(
                "open"
            ) &&
            !eventPreview.contains(
                event.target
            ) &&
            !event.target.closest(
                ".calendar-event"
            ) &&
            !event.target.closest(
                ".side-event-content"
            )
        ) {

            fecharPreview();

        }

    }
);

function mostrarDataAtual() {
    todayDate.textContent =
        hoje.toLocaleDateString(
            "pt-BR",
            {
                day: "numeric",
                month: "long"
            }
        );
}

window.addEventListener(
    "resize",
    () => {

        fecharPreview();

        if (
            eventModal.classList.contains(
                "open"
            ) &&
            elementoReferenciaModal
        ) {

            posicionarModal(
                elementoReferenciaModal
            );

        }

    }
);

mostrarDataAtual();
selecionarTipo("lesson");
atualizarCampoTermino();
criarCalendario();