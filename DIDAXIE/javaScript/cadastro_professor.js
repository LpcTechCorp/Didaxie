const form = document.getElementById("formCadastro");

const nome = document.getElementById("nome");

const sobrenome = document.getElementById("sobrenome");

const email = document.getElementById("email");

const senha = document.getElementById("senha");

const confirmarSenha = document.getElementById("confirmarSenha");

const termos = document.getElementById("termos");

const btnVerSenha = document.getElementById("btnVerSenha");

const btnVerConfirmarSenha = document.getElementById("btnVerConfirmarSenha");

const googleLogin = document.getElementById("googleLogin");

const microsoftLogin = document.getElementById("microsoftLogin");

const toast = document.getElementById("toast");

const toastTexto = document.getElementById("toastTexto");


/* =====================================
   MOSTRAR / ESCONDER SENHA
===================================== */

btnVerSenha.addEventListener("click", () => {

    const senhaEstaVisivel = senha.type === "text";

    senha.type = senhaEstaVisivel
        ? "password"
        : "text";

});


btnVerConfirmarSenha.addEventListener("click", () => {

    const senhaEstaVisivel =
        confirmarSenha.type === "text";

    confirmarSenha.type = senhaEstaVisivel
        ? "password"
        : "text";

});


/* =====================================
   EXIBIR ERRO
===================================== */

function mostrarErro(input, mensagem) {

    input.classList.add("erro");

    const campo = input.closest(".campo");

    const mensagemErro =
        campo.querySelector(".mensagem-erro");

    mensagemErro.textContent = mensagem;

}


/* =====================================
   REMOVER ERRO
===================================== */

function removerErro(input) {

    input.classList.remove("erro");

    const campo = input.closest(".campo");

    const mensagemErro =
        campo.querySelector(".mensagem-erro");

    mensagemErro.textContent = "";

}


/* =====================================
   VALIDAR EMAIL
===================================== */

function validarEmail(emailDigitado) {

    const regex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(emailDigitado);

}


/* =====================================
   VALIDAR NOME
===================================== */

function validarNome(nomeDigitado) {

    const regex =
        /^[A-Za-zÀ-ÿ\s'-]+$/;

    return regex.test(nomeDigitado);

}


/* =====================================
   VALIDAÇÃO EM TEMPO REAL
===================================== */

nome.addEventListener("input", () => {

    if (nome.value.trim() !== "") {

        removerErro(nome);

    }

});


sobrenome.addEventListener("input", () => {

    if (sobrenome.value.trim() !== "") {

        removerErro(sobrenome);

    }

});


email.addEventListener("input", () => {

    if (email.value.trim() !== "") {

        removerErro(email);

    }

});


senha.addEventListener("input", () => {

    if (senha.value.trim() !== "") {

        removerErro(senha);

    }

});


confirmarSenha.addEventListener("input", () => {

    if (confirmarSenha.value.trim() !== "") {

        removerErro(confirmarSenha);

    }

});


/* =====================================
   SUBMIT
===================================== */

form.addEventListener("submit", (event) => {

    event.preventDefault();

    let formularioValido = true;


    /* NOME */

    if (nome.value.trim() === "") {

        mostrarErro(
            nome,
            "Digite seu nome."
        );

        formularioValido = false;

    } else if (nome.value.trim().length < 2) {

        mostrarErro(
            nome,
            "Nome muito curto."
        );

        formularioValido = false;

    } else if (!validarNome(nome.value.trim())) {

        mostrarErro(
            nome,
            "Digite um nome válido."
        );

        formularioValido = false;

    } else {

        removerErro(nome);

    }


    /* SOBRENOME */

    if (sobrenome.value.trim() === "") {

        mostrarErro(
            sobrenome,
            "Digite seu sobrenome."
        );

        formularioValido = false;

    } else if (sobrenome.value.trim().length < 2) {

        mostrarErro(
            sobrenome,
            "Sobrenome muito curto."
        );

        formularioValido = false;

    } else if (!validarNome(sobrenome.value.trim())) {

        mostrarErro(
            sobrenome,
            "Digite um sobrenome válido."
        );

        formularioValido = false;

    } else {

        removerErro(sobrenome);

    }


    /* EMAIL */

    if (email.value.trim() === "") {

        mostrarErro(
            email,
            "Digite seu e-mail."
        );

        formularioValido = false;

    } else if (!validarEmail(email.value.trim())) {

        mostrarErro(
            email,
            "Digite um e-mail válido."
        );

        formularioValido = false;

    } else {

        removerErro(email);

    }


    /* SENHA */

    if (senha.value.trim() === "") {

        mostrarErro(
            senha,
            "Digite sua senha."
        );

        formularioValido = false;

    } else if (senha.value.length < 6) {

        mostrarErro(
            senha,
            "Mínimo de 6 caracteres."
        );

        formularioValido = false;

    } else {

        removerErro(senha);

    }


    /* CONFIRMAR SENHA */

    if (confirmarSenha.value.trim() === "") {

        mostrarErro(
            confirmarSenha,
            "Confirme sua senha."
        );

        formularioValido = false;

    } else if (confirmarSenha.value !== senha.value) {

        mostrarErro(
            confirmarSenha,
            "As senhas não coincidem."
        );

        formularioValido = false;

    } else {

        removerErro(confirmarSenha);

    }


    /* TERMOS */

    if (!termos.checked) {

        mostrarToast(
            "Você precisa aceitar os termos."
        );

        formularioValido = false;

    }


    /* FORMULÁRIO CORRETO */

    if (!formularioValido) {

        return;

    }


    const dados = {

        nome: nome.value.trim(),

        sobrenome: sobrenome.value.trim(),

        email: email.value.trim(),

        senha: senha.value,

        termosAceitos: termos.checked

    };


    console.log(
        "Dados enviados:",
        dados
    );


    mostrarToast(
        "Cadastro realizado com sucesso!"
    );


    /*
        Aqui depois podemos ligar ao backend.

        Exemplo:

        fetch("http://localhost:8000/cadastro", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(dados)

        });

    */

});


/* =====================================
   GOOGLE
===================================== */

googleLogin.addEventListener("click", () => {

    mostrarToast(
        "Cadastro com Google será conectado ao backend."
    );

});


/* =====================================
   MICROSOFT
===================================== */

microsoftLogin.addEventListener("click", () => {

    mostrarToast(
        "Cadastro com Microsoft será conectado ao backend."
    );

});


/* =====================================
   TOAST
===================================== */

let timeoutToast;

function mostrarToast(mensagem) {

    clearTimeout(timeoutToast);

    toastTexto.textContent = mensagem;

    toast.classList.add("ativo");


    timeoutToast = setTimeout(() => {

        toast.classList.remove("ativo");

    }, 3000);

}