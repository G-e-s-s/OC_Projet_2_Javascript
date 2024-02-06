//Création de la modale//







//Ouvrir et fermer la modale//
let modal = null;
const FocusableSelector = "button, a, input, textarea";
let focusables = [];

const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute("href"));
    focusables =Array.from(modal.querySelectorAll(FocusableSelector));
    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener('click', closeModal);
    modal.querySelector(".closeModal").addEventListener("click", closeModal);
    modal.querySelector(".modalStop").addEventListener("click", stopPropagation);
};

const closeModal = function (e) {
    if (modal === null) return;
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", 'true');
    modal.removeAttribute("aria-modal");
    modal.removeEventListener('click', closeModal);
    modal.querySelector(".closeModal").removeEventListener("click", closeModal);
    modal.querySelector(".modalStop").removeEventListener("click", stopPropagation);
    modal = null;
};

const stopPropagation = function (e) {
    e.stopPropagation()
};
const focusInModal = function (e) {
    e.preventDefault()
    console.log(focusables);
};

/*.document.querySelectorAll("btnModification").forEach(a => {
    a.addEventListener('click', openModal);
});*/

window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    };
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e);
    };
})