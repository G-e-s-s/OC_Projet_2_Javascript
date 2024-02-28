const url = "http://localhost:5678/api/";
const galleryContainer = document.getElementById("gallery");
const filtersContainer = document.getElementById("filters");

//Filtres//
async function getFilters () {
    const reponse = await fetch(url + "categories");
    const categories = await reponse.json();
    categories.unshift({
        id : 0,
        name : "Tous"
    }); // Rajout au début de la categorie "Tous"
    for(i in categories) {
            /*<button id="all">Tous</button> 
            <button id="object">Objets</button> 
            <button id="apartment">Appartements</button> 
            <button id="hotel">Hôtels & restaurants</button>*/
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
    const reponse = await fetch(url + "works"); // Recuperation des images disponibles dans le back-end
    const works = await reponse.json(); // Passage du format JSON à un tableau JS
    galleryContainer.innerHTML = ""; // Enlever les anciennes photos afficher
    for(i in works) {
        if( (works[i].categoryId === categorieNum) || (categorieNum === 0)) {
                /*<figure>
                    <img src="assets/images/abajour-tahina.png" alt="Abat-jour Tahina">
                    <figcaption>Abat-jour Tahina</figcaption>
                </figure>*/
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
        /*<img id="iconeEdition" src="./assets/icons/editer.png" alt="Editer">
        <span id="btnEdition">Mode édition</span>*/
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
        /*<li><a id="log" href="login.html">login</a></li>*/
    const logOut = document.getElementById("log");
    logOut.innerHTML = "Logout"; // Log in -> Log Out
    logOut.setAttribute("href", "");
    logOut.addEventListener("click", (event) => { // Se déconnecter
        event.preventDefault();
        localStorage.removeItem("token"); //Supprime le token en local
        location.reload(); //Rachargement de la page
    });

    //Bouton modifier//
        /*<img id="iconeModification" src="./assets/icons/modifications.png" alt="Modifier">
		<button id="btnModification">Modifier</button>*/
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
    filters.style.display="none"; // Propriété CSS pour cacher les filtres
};


//Modale1 : Supprimer image//
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

    //Elements de la modale 1//
    const popupList = document.createElement("div");
    popupList.setAttribute("id", "popupList");

    //Bouton fermer modale//
    const buttonClose = document.createElement("button");
    buttonClose.setAttribute("id", "close");
    const iconeClose = document.createElement("i");
    iconeClose.setAttribute("class", "fa-solid fa-xmark");
    buttonClose.addEventListener("click", async () => {
        document.getElementById("modal-list").remove(); //Retire l'élément du DOM
    });

    //Afficher les images//
    const h1Galery = document.createElement("h1");
    h1Galery.setAttribute("class", "titlePopUp");
    h1Galery.innerHTML = "Galerie photo";

        /*<div class="imgGalery">
            <i class="fa-solid fa-trash-can iconeGalery"></i>
            <img src="assets/images/abajour-tahina.png" alt="Abat-jour Tahina">
        </div>*/
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
            await fetch("http://localhost:5678/api/works/"+event.target.getAttribute("data-id"),
                {
                    method : "DELETE",
                    headers : {
                        "Authorization" : "Bearer " + window.localStorage.getItem("token"),
                    }
                }
            ).then((response) => { 
                if (response.ok) {
                    document.getElementById("gallery").innerHTML = "";
                    getArticles(0);
                    document.getElementById("modal-list").remove();
                    modaleSuppImg();
                }
            });
            
        });
        imagesProjet.appendChild(imgGalery);
        imgGalery.appendChild(iconeGalery);
        imgGalery.appendChild(img);
    };

    //Bar de séparation//
    const hr = document.createElement("hr");

    //Bouton ajouter photo//
        /*<input id="addImage" type="submit" value="Ajouter une photo">*/
    const inputAddImg = document.createElement("input");
    inputAddImg.setAttribute("id", "addImage");
    inputAddImg.setAttribute("type", "submit");
    inputAddImg.setAttribute("value", "Ajouter une photo");

    //Parents//
    modale.appendChild(aside);
    aside.appendChild(popupList);

    popupList.appendChild(buttonClose);
    buttonClose.appendChild(iconeClose);
    popupList.appendChild(h1Galery);
    popupList.appendChild(imagesProjet);

    popupList.appendChild(hr);
    popupList.appendChild(inputAddImg);

    modale.style.display = "flex";

    //Renvoie vers la 2ème modale//
    inputAddImg.addEventListener("click", async () =>{
        document.getElementById("modal-list").remove(); //Permet de garder une seule modale ouverte
        modalAddImage();
    });

};

//Modale2 : Ajouter image//
async function modalAddImage(){
    const modale = document.getElementById("modale");

    const aside = document.createElement("aside");
    aside.setAttribute("id", "modal-add");
    aside.setAttribute("aria-hidden", "true");
    aside.setAttribute("role", "dialog");
    aside.setAttribute("aria-labelledby", "titleModal");

    //Elements de la modale 2//
    const popupAdd = document.createElement("div");
    popupAdd.setAttribute("id", "popupAdd");

    //Bouton retour et croix pour fermer modale//
        /*<div id="return">
            <button id="returnModal"><i class="fa-solid fa-arrow-left"></i></button>
            <button id="closeModal"><i class="fa-solid fa-xmark"></i></button>
        </div>*/
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

    //Titre//
    const h1AjoutImg = document.createElement("h1");
    h1AjoutImg.setAttribute("class", "titlePopUp");
    h1AjoutImg.innerHTML = "Ajout photo";

    //Ajouter photo//
    const ajoutPhoto = document.createElement("div");
    ajoutPhoto.setAttribute("id", "ajoutPhoto");

    //Télécharger l'image à ajouter//
            /*<div id="element">
                <div id="imageEnCours">
                    <img src= ""><i id="iconeImage" class="fa-regular fa-image"></i>
                </div>
				<button id="classImage">
                    label for ="btnAddImage" id="btnFile">+ Ajouter photo</label>
                    <input id="btnAddImage" type="file" accept = ".jpg,.png"/>
				</button>
				<p id="textInfo">jpg, png : 4mo max</p>
			</div>*/
    const element = document.createElement("div");
    element.setAttribute("id", "element");
        const iconeImage = document.createElement("i");
            iconeImage.setAttribute("id", "iconeImage");
            iconeImage.setAttribute("class", "fa-regular fa-image");
        const classImage = document.createElement("div");
            classImage.setAttribute("id", "classImage"); 
        const btnFile = document.createElement("label");
            btnFile.setAttribute("for", "btnAddImage");
            btnFile.setAttribute("id", "btnFile");
            btnFile.innerHTML = "+ Ajouter photo";
        const btnAddImage = document.createElement("input");
            btnAddImage.setAttribute("id", "btnAddImage");
            btnAddImage.setAttribute("type", "file");
            btnAddImage.setAttribute("name","image")
            btnAddImage.setAttribute("accept", ".jpg,.png");
            btnAddImage.setAttribute("required",true);
            btnAddImage.addEventListener("input",valider);
        const textInfo = document.createElement("p");
            textInfo.setAttribute("id", "textInfo");
            textInfo.innerHTML = "jpg, png : 4mo max";
        btnAddImage.onchange = ("inputs", async() => {
            const [file] = btnAddImage.files
            if (file) {
                const newImage = document.createElement("img");
                newImage.src = URL.createObjectURL(file);
                newImage.setAttribute("src", URL.createObjectURL(file));
                document.getElementById("iconeImage").remove();
                document.getElementById("btnFile").remove();
                document.getElementById("textInfo").remove();
                const element = document.getElementById("element");
                element.appendChild(newImage);
                const btnAddImage = document.getElementById("btnAddImage");
                btnAddImage.style.fontSize = "120px";
            }
        });

    //Ajouter le titre de l'image//
        /*<label for="title" id="label">Title</label>
		<input type="text" id="namePhoto" name="title" required>*/
    const label = document.createElement("label");
    label.setAttribute("for", "title");
    label.setAttribute("id", "label");
    label.innerHTML = "Title";

    const namePhoto = document.createElement("input");
    namePhoto.setAttribute("type", "text");
    namePhoto.setAttribute("id", "namePhoto");
    namePhoto.setAttribute("name", "title");
    namePhoto.setAttribute("required",true);
    namePhoto.addEventListener("input",valider);

    //Ajouter catégorie de l'image en dynamique//
        /*<form method="get" action="">
            <p>
                <label id="categorie" for="title">Catégorie</label>
                <select name="categorie" id="nameCategorie">
                    <option value=""></option>
                </select>
            </p>
		</form>*/
    const form = document.createElement("form");
    form.setAttribute("method", "get");
    form.setAttribute("action", "");
        const pCategory = document.createElement("p");
            const categorie = document.createElement("label");
            categorie.setAttribute("id", "categorie");
            categorie.setAttribute("for", "title");
            categorie.innerHTML = "Catégorie";

            const categoriesJSON = await fetch(url + "categories"); 
            const categories = await categoriesJSON.json();
            const nameCategorie = document.createElement("select");
            nameCategorie.setAttribute("id", "nameCategorie");
            nameCategorie.setAttribute("name", "categorie");
            nameCategorie.setAttribute("required",true);
            nameCategorie.addEventListener("input",valider);
            let option = document.createElement("option");
            option.setAttribute("value","");
            nameCategorie.appendChild(option);
            for(i in categories) {
                let option = document.createElement("option");
                option.setAttribute("value",categories[i].id);
                option.innerHTML = categories[i].name;
                nameCategorie.appendChild(option);
            }
    //Message erreur si formulaire mal rempli//
    const messageErreur = document.createElement("span");
    messageErreur.setAttribute("id", "messageErreur")
    
    //Bar de séparation//
    const hr = document.createElement("hr");

    //Bouton enregistrer nouvelle image//
        /*<input id="validerImage" type="submit" value="Valider">*/
    const validerImage = document.createElement("input");
    validerImage.setAttribute("id", "validerImage");
    validerImage.setAttribute("type", "submit");
    validerImage.setAttribute("value", "Valider");
    validerImage.addEventListener("click", async (event) => {
        event.preventDefault();
        const data = new FormData();
           const image = document.getElementById("btnAddImage");
           const title= document.getElementById("namePhoto");
           const category= document.getElementById("nameCategorie");
           data.append("image", image.files[0]);
           data.append("title", title.value);
           data.append("category", category.value);

        const reponse = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            accept: "application/json",
            headers: 
                { 
                    "Authorization" : "Bearer " + window.localStorage.getItem("token")
                },
            body: data,
        });
        if (reponse.ok){
            document.getElementById("gallery").innerHTML = "";
            getArticles(0);
            document.getElementById("modal-add").remove();
            modalAddImage();
        }
        else{
            let erreur = document.getElementById("messageErreur");
            erreur.innerHTML = "Le formulaire n’est pas correctement rempli";
        }
    });
    
    //Parents//
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
    element.appendChild(classImage);
    classImage.appendChild(btnFile);
    classImage.appendChild(btnAddImage);
    element.appendChild(textInfo);

    ajoutPhoto.appendChild(label);
    ajoutPhoto.appendChild(namePhoto);

    ajoutPhoto.appendChild(form);
    form.appendChild(pCategory);
    pCategory.appendChild(categorie);
    pCategory.appendChild(nameCategorie);

    popupAdd.appendChild(messageErreur);
    popupAdd.appendChild(hr);
    popupAdd.appendChild(validerImage);

    popupAdd.style.display = "flex";
};

//Bouton "valider image" si formulaire bien rempli//
function valider(){
    file = document.getElementById("btnAddImage");
    title = document.getElementById("namePhoto");
    categorie = document.getElementById("nameCategorie");
    validAjout = document.getElementById("validerImage");
    if((file != "") && (title.value != "") && (categorie.value != "")){ //Afficher le bouton en vert si tout est correctement rempli
        //validAjout.disabled = false;
        validAjout.style.backgroundColor = "rgba(29, 97, 84, 1)";
    } else {
        //validAjout.disabled = true;
        validAjout.style.backgroundColor = "rgba(167, 167, 167, 1)";
    }
};