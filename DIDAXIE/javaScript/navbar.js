const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");

const mobileMenuButton = document.getElementById("mobileMenuButton");
const sidebarOverlay = document.getElementById("sidebarOverlay");


// ======================================
// CLIQUE NA SETA
// ======================================

sidebarToggle.addEventListener("click", () => {

    // MOBILE
    if (window.innerWidth <= 768) {

        fecharMenuMobile();
        return;

    }


    // DESKTOP
    sidebar.classList.toggle("collapsed");

    // Remove abertura temporária
    sidebar.classList.remove("hover-open");

});


// ======================================
// PASSAR O MOUSE
// ======================================

sidebar.addEventListener("mouseenter", () => {

    // Só funciona no desktop
    if (window.innerWidth <= 768) {
        return;
    }


    // Só abre pelo mouse se estiver recolhida
    if (sidebar.classList.contains("collapsed")) {

        sidebar.classList.add("hover-open");

    }

});


// ======================================
// TIRAR O MOUSE
// ======================================

sidebar.addEventListener("mouseleave", () => {

    if (window.innerWidth <= 768) {
        return;
    }


    // Fecha novamente, pois foi apenas
    // uma abertura temporária pelo mouse
    sidebar.classList.remove("hover-open");

});


// ======================================
// MOBILE
// ======================================

mobileMenuButton.addEventListener("click", () => {

    sidebar.classList.add("mobile-open");

    sidebarOverlay.classList.add("active");

});


sidebarOverlay.addEventListener("click", fecharMenuMobile);


function fecharMenuMobile() {

    sidebar.classList.remove("mobile-open");

    sidebarOverlay.classList.remove("active");

}


// ======================================
// REDIMENSIONAMENTO DA TELA
// ======================================

window.addEventListener("resize", () => {

    if (window.innerWidth > 768) {

        sidebar.classList.remove("mobile-open");

        sidebarOverlay.classList.remove("active");

    } else {

        sidebar.classList.remove("hover-open");

    }

});