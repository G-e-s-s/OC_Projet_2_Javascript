let form = document.querySelector("form"); //document.getElementById("btnLogin")

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const login = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=password]").value,
    }; // Recupère les valeurs saisies par l'utilisateur
    const loginContainer = JSON.stringify(login); // Convertion de l'objet de login au format JSON (pour l'envoi)
    const reponse = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Precise le type d'information de ce qui est envoyé
        body: loginContainer, // Information envoyée
    }); // Envoi des identifiants aux back-end
    if (reponse.ok){
        const value = await reponse.json();
        window.localStorage.setItem("token", value["token"]); // On stock le token en local
        window.location = "index.html"; // Redirection sur la page d'accueil après connexion
    }
    else{
        if (reponse.status === 401) {
            let erreur = document.getElementById("messageErreur");
            erreur.innerHTML = "E-mail ou mot de passe introuvable";
        }else{
            let erreur = document.getElementById("messageErreur");
            erreur.innerHTML = "E-mail ou mot de passe introuvable";
        }
    };
})