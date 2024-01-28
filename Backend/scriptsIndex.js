const url = "http://localhost:5678/api/";
const galleryContainer = document.getElementById("gallery");
const filtersContainer = document.getElementById("filters");
window.localStorage.getItem("token");

async function getFilters () {
    const reponse = await fetch(url + "categories");
    const categories = await reponse.json();
    categories.unshift({
        id : 0,
        name : "Tous"
    });
    for(i in categories) {
        let button = document.createElement("button");
        button.innerHTML = categories[i].name;
        button.setAttribute("data-id", categories[i].id);
        button.addEventListener("click", (event) => {
            event.preventDefault();
            getArticles(parseInt(event.target.getAttribute("data-id")));
        });
        filtersContainer.appendChild(button);
    }
};
getFilters();

async function getArticles (categorieNum) {
    const reponse = await fetch(url + "works");
    const works = await reponse.json();
    galleryContainer.innerHTML = "";
    for(i in works) {
        if( (works[i].categoryId === categorieNum) || (categorieNum === 0)) {
            let figure = document.createElement("figure");
            let img = document.createElement("img");
            let figcaption = document.createElement("figcaption");
            img.setAttribute("src", works[i].imageUrl);
            img.setAttribute("alt", works[i].title);
            figcaption.innerHTML = works[i].title;
            figure.appendChild(img);
            figure.appendChild(figcaption);
            galleryContainer.appendChild(figure);
        }
    }
};
getArticles(0);

const token = window.localStorage.getItem("token");
if (token !== null) {
    const blackBar = document.getElementById("blackBar");
    let img = document.createElement("img");
    img.setAttribute("id", "iconeEdition");
    img.setAttribute("src", "./assets/icons/editer.png");
    img.setAttribute("alt", "Editer");
    let span = document.createElement("span");
    span.setAttribute("id", "btnEdition");
    span.innerHTML = "Mode édition";
    blackBar.appendChild(img);
    blackBar.appendChild(span);
    blackBar.style.display = "flex";

    const logOut = document.getElementById("log");
    logOut.innerHTML = "Logout";

    const projets = document.getElementById("projets");
    let imgProjets = document.createElement("img");
    imgProjets.setAttribute("id", "iconeModification");
    imgProjets.setAttribute("src", "./assets/icons/modifications.png");
    imgProjets.setAttribute("alt", "Modifier");
    let button = document.createElement("button");
    button.setAttribute("id", "btnModification");
    button.innerHTML = "Modifier";
    projets.appendChild(imgProjets);
    projets.appendChild(button);
};
