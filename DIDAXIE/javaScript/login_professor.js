const form = document.getElementById("formCadastro");

const email = document.getElementById("email");
const senha = document.getElementById("senha");
const termos = document.getElementById("termos");

const btnVerSenha = document.getElementById("btnVerSenha");

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
   VALIDAÇÃO EM TEMPO REAL
===================================== */

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


/* =====================================
   SUBMIT
===================================== */

form.addEventListener("submit", (event) => {

    event.preventDefault();

    let formularioValido = true;


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
        "Login com Google será conectado ao backend."
    );

});


/* =====================================
   MICROSOFT
===================================== */

microsoftLogin.addEventListener("click", () => {

    mostrarToast(
        "Login com Microsoft será conectado ao backend."
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