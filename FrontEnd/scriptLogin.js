//Ajout listener sur le bouton du formulaire
document.connexion.addEventListener("submit", async function (e) {
  //Bloque le rechargement auto de la page
  e.preventDefault();
  //Creation de l'objet qui récupère le mail et le mdp du formulaire
  const mail = document.getElementById("mail").value;
  const password = document.getElementById("password").value;
  const user = {
    email: mail,
    password: password,
  };
  //Test de la requête
  try {
    //Requête pour connecter l'utilisateur
    let reponse = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    //Si le status renvoyé est 200 execute le reste du code
    if (reponse.status === 200) {
      let data = await reponse.json();
      localStorage.setItem("token", data.token);
      window.location = "index.html";
    }
    //Si le status est autre créer les messages d'erreurs lies au status
    else if (reponse.status === 401) {
      throw new Error("Non autorisé");
    } else if (reponse.status === 404) {
      throw new Error("Erreur dans l'identifiant ou le mot de passe");
    } else {
      throw new Error("Erreur inconnue \nVeuillez réessayer");
    }
  } catch (error) {
    //Message d'erreur si exception levee par try
    alert(error.message);
  } finally {
    //Vide l'objet user
    user = {};
  }
});
