const url = "http://localhost:5678/api/";
const galleryContainer = document.getElementById("gallery");
const filtersContainer = document.getElementById("filters");

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
