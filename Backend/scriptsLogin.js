let form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const login = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=password]").value,
    };
    const loginContainer = JSON.stringify(login);
    const reponse = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: loginContainer,
    });
    if (reponse.ok){
        const value = await reponse.json();
        window.localStorage.setItem("token", value["token"]);
        window.location = "index.html";
    }
    else{
        if (reponse.status === 401) {
            let erreur = document.getElementById("messageErreur");
            erreur.innerHTML = "Utilisateur non autorisé";
        } else{
            let erreur = document.getElementById("messageErreur");
            erreur.innerHTML = "Utilisateur non trouvé";
        }
    };
});

        /*if(response == login) {
            setData(container) ;
        } else {
            setError({
                title: "E-mail ou mot de passe introuvable",
                message: container.error,
            }),
        };
    });
};
getLogin();*/
