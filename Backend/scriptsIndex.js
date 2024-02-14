const url = "http://localhost:5678/api/";
const galleryContainer = document.getElementById("gallery");
const filtersContainer = document.getElementById("filters");
window.localStorage.getItem("token");

//Filtres//
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

//Images projets//
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

//Page d'acceuil SI connecté//
const token = window.localStorage.getItem("token");
if (token !== null) {
    //Black Bar//
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

    //Log In -> Log Out//
    const logOut = document.getElementById("log");
    logOut.innerHTML = "Logout";
    logOut.setAttribute("href", "");
    logOut.addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.removeItem("token");
        location.reload();
    });

    //Bouton modifier//
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
    clickBtnModifier();

    //Cacher les filtres//
    const filters = document.getElementById("filters");
    filters.style.display='none';
};

async function clickBtnModifier() {
    const modifierPhoto = document.getElementById("btnModification");

    //Création de la modale dynamique//
    modifierPhoto.addEventListener("click", modaleSuppImg);
};

async function modaleSuppImg() {
    const modale = document.getElementById("modale");

    const aside = document.createElement("aside");
    aside.setAttribute("id", "modal-list");
    aside.setAttribute("aria-hidden", "true");
    aside.setAttribute("role", "dialog");
    aside.setAttribute("aria-labelledby", "titleModal");

    const popupList = document.createElement("div");
    popupList.setAttribute("id", "popupList");

    const buttonClose = document.createElement("button");
    buttonClose.setAttribute("id", "close");
    const iconeClose = document.createElement("i");
    iconeClose.setAttribute("class", "fa-solid fa-xmark");
    buttonClose.addEventListener("click", async () => {
        document.getElementById("modal-list").remove();
    });


    const h1Galery = document.createElement("h1");
    h1Galery.setAttribute("class", "titlePopUp");
    h1Galery.innerHTML = "Galerie photo";

    const imagesProjet = document.createElement("div");
    imagesProjet.setAttribute("id", "images");
    imagesProjet.setAttribute("class", "scroller");
    const reponse = await fetch(url + "works");
    const works = await reponse.json();
    for(i in works) {
        let imgGalery = document.createElement("div");
        imgGalery.setAttribute("class", "imgGalery");
        let iconeGalery = document.createElement("i");
        iconeGalery.setAttribute("class", "fa-solid fa-trash-can iconeGalery");
        iconeGalery.setAttribute("data-id",works[i].id);
        let img = document.createElement("img");
        img.setAttribute("src", works[i].imageUrl);
        img.setAttribute("alt",  works[i].title);
        iconeGalery.addEventListener("click", async (event) => {
            event.preventDefault();
            const reponse = await fetch("http://localhost:5678/api/works/"+event.target.getAttribute("data-id"),
                {method : "DELETE"}
            );
            document.getElementById("modal-list").remove();
            modaleSuppImg();
            console.log(reponse);
        });
        imagesProjet.appendChild(imgGalery);
        imgGalery.appendChild(iconeGalery);
        imgGalery.appendChild(img);
    };

    const hr = document.createElement("hr");

    const inputAddImg = document.createElement("input");
    inputAddImg.setAttribute("id", "addImage");
    inputAddImg.setAttribute("type", "submit");
    inputAddImg.setAttribute("value", "Ajouter une photo");

    modale.appendChild(aside);
    aside.appendChild(popupList);

    popupList.appendChild(buttonClose);
    buttonClose.appendChild(iconeClose);
    popupList.appendChild(h1Galery);
    popupList.appendChild(imagesProjet);

    popupList.appendChild(hr);
    popupList.appendChild(inputAddImg);

    modale.style.display = "flex";

    clickBtnAjouter();
};

async function clickBtnAjouter() {
    const ajouterPhoto = document.getElementById("addImage");

    //Création de la modale2 dynamique//
    ajouterPhoto.addEventListener("click", () => {
        document.getElementById("modal-list").remove();

        const modale = document.getElementById("modale");

        const aside = document.createElement("aside");
        aside.setAttribute("id", "modal-add");
        aside.setAttribute("aria-hidden", "true");
        aside.setAttribute("role", "dialog");
        aside.setAttribute("aria-labelledby", "titleModal");

        const popupAdd = document.createElement("div");
        popupAdd.setAttribute("id", "popupAdd");

        const back = document.createElement("div");
        back.setAttribute("id", "return");
            const returnModal = document.createElement("button");
                returnModal.setAttribute("id", "returnModal");
                const iconeReturn = document.createElement("i");
                iconeReturn.setAttribute("class", "fa-solid fa-arrow-left");
                returnModal.addEventListener("click", async () => {
                    document.getElementById("modal-add").remove();
                    document.getElementById("btnModification").click();
                });
            const closeModal = document.createElement("button");
                closeModal.setAttribute("id", "closeModal");
                closeModal.addEventListener("click", async () => {
                    document.getElementById("modal-add").remove();
                });
                const iconeClose = document.createElement("i");
                iconeClose.setAttribute("class", "fa-solid fa-xmark");

        const h1AjoutImg = document.createElement("h1");
        h1AjoutImg.setAttribute("class", "titlePopUp");
        h1AjoutImg.innerHTML = "Ajout photo";

        const ajoutPhoto = document.createElement("div");
        ajoutPhoto.setAttribute("id", "ajoutPhoto");

        const element = document.createElement("div");
        element.setAttribute("id", "element");
            const iconeImage = document.createElement("i");
                iconeImage.setAttribute("id", "iconeImage");
                iconeImage.setAttribute("class", "fa-regular fa-image");
            const btnAddImage = document.createElement("input");
                btnAddImage.setAttribute("id", "btnAddImage");
                btnAddImage.setAttribute("type", "submit");
                btnAddImage.setAttribute("value", "+ Ajouter photo");
            const textInfo = document.createElement("p");
                textInfo.setAttribute("id", "textInfo");
                textInfo.innerHTML = "jpg, png : 4mo max";
        
        const label = document.createElement("label");
        label.setAttribute("for", "title");
        label.setAttribute("id", "label");
        label.innerHTML = "Title";

        const namePhoto = document.createElement("input");
        namePhoto.setAttribute("type", "text");
        namePhoto.setAttribute("id", "namePhoto");
        namePhoto.setAttribute("name", "title");

        const form = document.createElement("form");
        form.setAttribute("method", "get");
        form.setAttribute("action", "");
            const pCategory = document.createElement("p");
                    const categorie = document.createElement("label");
                    categorie.setAttribute("id", "categorie");
                    categorie.setAttribute("for", "title");
                    categorie.innerHTML = "Catégorie";
                    
                    const nameCategorie = document.createElement("select");
                    nameCategorie.setAttribute("id", "nameCategorie");
                    nameCategorie.setAttribute("name", "categorie");
                    const option = document.createElement("option");
                    option.setAttribute("value", "");

        const hr = document.createElement("hr");

        const validerImage = document.createElement("input");
        validerImage.setAttribute("id", "validerImage");
        validerImage.setAttribute("type", "submit");
        validerImage.setAttribute("value", "Valider");

        modale.appendChild(aside);
        aside.appendChild(popupAdd);

        popupAdd.appendChild(back);
        back.appendChild(returnModal);
        back.appendChild(closeModal);
        returnModal.appendChild(iconeReturn);
        closeModal.appendChild(iconeClose);

        popupAdd.appendChild(h1AjoutImg);
        popupAdd.appendChild(ajoutPhoto);

        ajoutPhoto.appendChild(element);
        element.appendChild(iconeImage);
        element.appendChild(btnAddImage);
        element.appendChild(textInfo);

        ajoutPhoto.appendChild(label);
        ajoutPhoto.appendChild(namePhoto);

        ajoutPhoto.appendChild(form);
        form.appendChild(pCategory);
        pCategory.appendChild(categorie);
        pCategory.appendChild(nameCategorie);
        nameCategorie.appendChild(option);

        popupAdd.appendChild(hr);
        popupAdd.appendChild(validerImage);

        popupAdd.style.display = "flex";
    });
};
