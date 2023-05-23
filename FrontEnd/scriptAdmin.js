//Importation d'une fonction
import { generationGallery } from "./script.js";
//Stockage du token de connexion dans une variable
const token = localStorage.getItem("token");
//Creation des variables
let works;
let worksFiltrer;
let idWork;
let ids = [];
let formData = null;
let file;
let modalOuverte;
async function requete() {
  //Test de la requête
  try {
    //Requête pour récupérer tous les travaux
    let reponse = await fetch("http://localhost:5678/api/works");
    //Si le status renvoyé est 200 execute le reste du code
    if (reponse.status === 200) {
      let data = await reponse.json();
      works = data;
      worksFiltrer = data;
    }
    //Si le status est autre créer les messages d'erreurs lies au status
    else if (reponse.status === 500) {
      throw new Error("Erreur inattendue");
    } else {
      throw new Error("Erreur inconnue");
    }
  } catch (error) {
    //Message d'erreur si exception levée par try
    console.error(error.message);
  }
}
requete();
//Vérifie que le token soit bien la
if (token != null) {
  console.log(token);
  //Suppression lien "login"
  const login = document.getElementById("lien-login");
  login.style.display = "none";
  //Suppression des boutons de filtre
  const bouton = document.getElementById("btn");
  bouton.style.display = "none";
  //Affiche les boutons "Modifier"
  document.getElementById("btn-modif-profil").style.display = "initial";
  document.getElementById("btn-modif-projet").style.display = "initial";

  //Supprime le/les medias au click sur "publier changement"
  const publierChangement = document.getElementById("publier-change");
  publierChangement.addEventListener("click", (e) => {
    if (ids.length > 0) {
      suppressionMedia(e);
    } else if (formData != null) {
      envoiNouveauMedia(e);
    } else {
      return;
    }
  });

  //Creation du listener sur le bouton "Modifier" (Profil)
  document
    .getElementById("modif-profil")
    .addEventListener("click", ouvreModalProfil);
  //Creation du listener sur le bouton "Modifier" (Mes Projets)
  document
    .getElementById("modif-projet")
    .addEventListener("click", ouvreModalModif);
} else {
  //Sinon enlève le lien "logout"
  document.getElementById("lien-logout").style.display = "none";
  //Enlève le bandeau du mod edition
  document.getElementById("edition").style.display = "none";
}

//Supprime le token lors de la déconnexion
document.getElementById("lien-logout").addEventListener("click", () => {
  localStorage.removeItem("token");
});

//Fonction pour générer les medias dans la modal modif
function generationMedia() {
  //Control si "idWork" est vide sinon enlevé les medias supprimes dans la modal
  if (idWork != null) {
    worksFiltrer = worksFiltrer.filter((i) => i.imageUrl !== idWork);
  }
  //Boucle pour générer les medias
  for (let work of worksFiltrer) {
    //Recuperation de l'element du DOM qui accueil les articles
    const divGallery = document.getElementById("media");
    //Creation d'une balise dédiée aux articles
    const figureElement = document.createElement("figure");
    figureElement.dataset.id = work.id;
    figureElement.setAttribute("class", "fig");
    //Creation des balises img et ajout du contenu
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.crossOrigin = "anonymous";
    //Creation d'un div pour ajouter l’icône de corbeille
    const divPoubelle = document.createElement("div");
    divPoubelle.setAttribute("class", "div-poubelle");
    //Creation d'un element figcaption
    const figcaptionElement = document.createElement("figcaption");
    figcaptionElement.innerText = "éditer";
    //Rattachement des elements créer au DOM
    divGallery.appendChild(figureElement);
    figureElement.appendChild(imageElement);
    figureElement.appendChild(divPoubelle);
    figureElement.appendChild(figcaptionElement);
  }
}

//Fonction de la modal profil
function ouvreModalProfil(e) {
  modalOuverte = "profile";
  //Bloque le rechargement auto de la page
  e.preventDefault();

  const ouvreModalProfil = document.getElementById("btn-modif-profil");
  //Creation de la boite qui accueil la modal
  const profilAside = document.createElement("aside");
  profilAside.setAttribute("id", "modal-profil");
  profilAside.setAttribute("class", "modal flex jc-cent ai-cent");
  profilAside.setAttribute("aria-modal", "true");
  profilAside.setAttribute("role", "dialog");
  profilAside.setAttribute("aria-labelby", "titreModal");
  //Ajout d'un event listener pour fermer la modal
  profilAside.addEventListener("click", fermeModalProfil);
  //Creation d'une div pour accueillir les elements de la modal
  const profilDiv = document.createElement("div");
  profilDiv.setAttribute(
    "class",
    "modal-wrapper modal-stop flex fd-col ai-cent"
  );
  //Ajout d'un event listener pour éviter la propagation de la fonction de fermeture lors du click dans la modal
  profilDiv.addEventListener("click", stopPropagation);
  //Creation d'un bouton  pour fermer la modal
  const profilBoutonFerme = document.createElement("button");
  profilBoutonFerme.setAttribute(
    "class",
    "ferme-modal flex jc-fleend border background"
  );
  //Ajout s'un event listener sur le bouton qui execute la fonction "fermeModalProfil" lors du click
  profilBoutonFerme.addEventListener("click", fermeModalProfil);
  //Creation de l'image du bouton pour fermer la modal
  const profilImg = document.createElement("img");
  profilImg.setAttribute("class", "ferme");
  profilImg.src = "./assets/icons/croix.png";
  //Creation du titre de la modal
  const profilTire = document.createElement("h3");
  profilTire.setAttribute("id", "titreModal");
  profilTire.innerText = "Image de profil";
  //Creation d'une div qui accueille les medias
  const profilDivMedia = document.createElement("div");
  profilDivMedia.setAttribute("id", "img-profil");
  //Creation d'une balise dédiée a l'img de profil
  const profilElement = document.createElement("figure");
  profilElement.setAttribute("class", "fig");
  //Creation de l'image de profil
  const profilImgProfil = document.createElement("img");
  profilImgProfil.src = "./assets/images/sophie-bluel.png";
  //Creation d'une pour accueillir l’icône de poubelle
  const profilDivPoubelle = document.createElement("div");
  profilDivPoubelle.setAttribute("id", "div-poubelle2");
  //Creation d'un bouton pour ajouter un nouveau media
  const profilboutonAjout = document.createElement("button");
  profilboutonAjout.setAttribute("id", "ajout-photo");
  profilboutonAjout.setAttribute("class", "ff-syne col-white border");
  profilboutonAjout.innerText = "Ajouter une photo";
  //Creation d'un bouton pour supprimer toute la galerie
  const profilboutonSuppr = document.createElement("button");
  profilboutonSuppr.setAttribute("id", "suppr-galerie");
  profilboutonSuppr.setAttribute("class", "border background");
  profilboutonSuppr.innerText = "Supprimer la galerie";
  //Rattachement des elements creer au DOM
  ouvreModalProfil.appendChild(profilAside);
  profilAside.appendChild(profilDiv);
  profilDiv.appendChild(profilBoutonFerme);
  profilBoutonFerme.appendChild(profilImg);
  profilDiv.appendChild(profilTire);
  profilDiv.appendChild(profilDivMedia);
  profilDivMedia.appendChild(profilElement);
  profilElement.appendChild(profilImgProfil);
  profilElement.appendChild(profilDivPoubelle);
  profilDiv.appendChild(profilboutonAjout);
  profilDiv.appendChild(profilboutonSuppr);
}

//Fonction pour créer la modal modif
function ouvreModalModif(e) {
  modalOuverte = "modif";
  //Bloque le rechargement auto de la page
  e.preventDefault();
  const ouvreModalGalerie = document.getElementById("btn-modif-projet");
  //Creation de la boite qui accueil la modal
  const modifAside = document.createElement("aside");
  modifAside.setAttribute("id", "modal-modif");
  modifAside.setAttribute("class", "modal flex jc-cent ai-cent");
  modifAside.setAttribute("aria-modal", "true");
  modifAside.setAttribute("role", "dialog");
  modifAside.setAttribute("aria-labelby", "titreModal");
  //Ajout de event listener pour fermer la modal
  modifAside.addEventListener("click", fermeModal);
  //Creation d'une div pour accueillir les elements de la modal
  const modifDiv = document.createElement("div");
  modifDiv.setAttribute(
    "class",
    "modal-wrapper modal-stop flex fd-col ai-cent"
  );
  //Ajout de event listener pour éviter la propagation de la fonction de fermeture lors du click dans la modal
  modifDiv.addEventListener("click", stopPropagation);
  //Creation d'un bouton pour fermer la modal
  const modifboutonFerme = document.createElement("button");
  modifboutonFerme.setAttribute(
    "class",
    "ferme-modal flex jc-fleend border background"
  );
  //Ajout d'un event listener sur le bouton qui execute la fonction "fermeModal" lors du click
  modifboutonFerme.addEventListener("click", fermeModal);
  //Creation de l'image du bouton pour fermer la modal
  const modifImg = document.createElement("img");
  modifImg.setAttribute("class", "ferme");
  modifImg.src = "./assets/icons/croix.png";
  //Creation du titre de la modal
  const modifTitre = document.createElement("h3");
  modifTitre.setAttribute("id", "titreModal");
  modifTitre.innerText = "Galerie photo";
  //Creation d'une div qui accueille les medias
  const modifDivMedia = document.createElement("div");
  modifDivMedia.setAttribute("id", "media");
  //Creation d'un bouton pour ajouter un nouveau media
  const modifboutonAjout = document.createElement("button");
  modifboutonAjout.setAttribute("id", "ajout-photo");
  modifboutonAjout.setAttribute("class", "ff-syne col-white border");
  modifboutonAjout.innerText = "Ajouter une photo";
  //Ajout d'un event listener sur le bouton qui, lors du click, ferme la modal puis ouvre la modal pour ajouter un nouveau media
  modifboutonAjout.addEventListener("click", () => {
    fermeModal();
    ouvreModalAjout(e);
  });
  //Creation d'un bouton pour supprimer toute la galerie
  const modifboutonSuppr = document.createElement("button");
  modifboutonSuppr.setAttribute("id", "suppr-galerie");
  modifboutonSuppr.setAttribute("class", "border background");
  modifboutonSuppr.innerText = "Supprimer la galerie";
  //Ajout d'un event listener qui supprime tous les medias lors du click
  modifboutonSuppr.addEventListener("click", (e) => {
    fermeModal();
    ouvreModalConfirmSuppr(e);
  });
  //Rattachement des elements créer au DOM
  ouvreModalGalerie.appendChild(modifAside);
  modifAside.appendChild(modifDiv);
  modifDiv.appendChild(modifboutonFerme);
  modifboutonFerme.appendChild(modifImg);
  modifDiv.appendChild(modifTitre);
  modifDiv.appendChild(modifDivMedia);
  modifDiv.appendChild(modifboutonAjout);
  modifDiv.appendChild(modifboutonSuppr);

  generationMedia();
  supprMedia();
}

//Fonction de la modal de confirmation pour supprimer toute la galerie
function ouvreModalConfirmSuppr(e) {
  modalOuverte = "confirmSup";
  //Bloque le rechargement auto de la page
  e.preventDefault();
  const ouvreModalConfirmSup = document.getElementById("btn-modif-projet");
  //Creation de la boite qui accueil la modal
  const confirmSupAside = document.createElement("aside");
  confirmSupAside.setAttribute("class", "modal flex jc-cent ai-cent");
  confirmSupAside.setAttribute("id", "modal-conf-sup");
  confirmSupAside.setAttribute("aria-modal", "true");
  confirmSupAside.setAttribute("role", "dialog");
  confirmSupAside.setAttribute("aria-labelby", "titreModal");
  confirmSupAside.addEventListener("click", fermeModalConfirmSup);
  //Creation d'une div pour accueillir les elements de la modal
  const confirmSupDiv = document.createElement("div");
  confirmSupDiv.setAttribute(
    "class",
    "modal-wrapper modal-stop flex fd-col ai-cent"
  );
  confirmSupDiv.addEventListener("click", stopPropagation);
  //Creation d'une div pour accueillir les boutons retour & fermer
  const confirmSupDivRetourFermer = document.createElement("div");
  confirmSupDivRetourFermer.setAttribute("id", "retour-fermer");
  confirmSupDivRetourFermer.setAttribute("class", "flex jc-spabet");
  //Creation du bouton retour
  const confirmSupBoutonRetour = document.createElement("button");
  confirmSupBoutonRetour.setAttribute("id", "retour-modal");
  confirmSupBoutonRetour.setAttribute("class", "jc-fleend border background");
  //Ajout de l'image pour le bouton retour
  const confirmSupImgRetour = document.createElement("img");
  confirmSupImgRetour.setAttribute("id", "retour");
  confirmSupImgRetour.src = "./assets/icons/retour.png";
  //Ajout d'un event listener pour faire un retour lors du click
  confirmSupImgRetour.addEventListener("click", (e) => {
    fermeModalConfirmSup();
    ouvreModalModif(e);
  });
  //Creation du bouton fermer
  const confirmSupBoutonFerme = document.createElement("button");
  confirmSupBoutonFerme.setAttribute(
    "class",
    "ferme-modal flex jc-fleend border background"
  );
  //Ajout de l'image pour le bouton fermer
  const confirmSupImgFerme = document.createElement("img");
  confirmSupImgFerme.setAttribute("class", "ferme");
  confirmSupImgFerme.src = "./assets/icons/croix.png";
  //Ajout d'un event listener pour fermer la modal lors du click
  confirmSupImgFerme.addEventListener("click", () => {
    fermeModalConfirmSup();
  });
  //Creation du titre de la modal
  const confirmSupTitre = document.createElement("h3");
  confirmSupTitre.setAttribute("id", "titreModal");
  confirmSupTitre.innerText =
    "Es-tu sur de vouloir supprimer toutes la galerie ?";
  //Creation d'une div pour les boutons
  const confirmSupDivBouton = document.createElement("div");
  confirmSupDivBouton.setAttribute("id", "btn-confirme");
  confirmSupDivBouton.setAttribute("class", "flex fd-row jc-spaaro");
  //Creation bouton "Valider"
  const confirmSupBoutonOui = document.createElement("button");
  confirmSupBoutonOui.setAttribute("id", "valide-suppr");
  confirmSupBoutonOui.setAttribute("class", "ff-syne col-white border");
  confirmSupBoutonOui.innerText = "Supprimer";
  //Ajout d'un event listener pour récupérer les ids de tous les medias lors du click
  confirmSupBoutonOui.addEventListener("click", () => {
    for (let work of works) {
      ids.push(work.id);
    }
    //Ferme la modal
    fermeModalConfirmSup();
  });
  //Creation bouton "Annuler"
  const confirmSupBoutonNon = document.createElement("button");
  confirmSupBoutonNon.setAttribute("id", "annule-suppr");
  confirmSupBoutonNon.setAttribute("class", "ff-syne col-white");
  confirmSupBoutonNon.innerText = "Annuler";
  //Ajout d'un event listener pour annuler la suppression lors du click
  confirmSupBoutonNon.addEventListener("click", (e) => {
    //Ferme la modal
    fermeModalConfirmSup();
    //Ouvre la modal principal
    ouvreModalModif(e);
  });
  //Rattachement des elements créer au DOM
  ouvreModalConfirmSup.appendChild(confirmSupAside);
  confirmSupAside.appendChild(confirmSupDiv);
  confirmSupDiv.appendChild(confirmSupDivRetourFermer);
  confirmSupDivRetourFermer.appendChild(confirmSupImgRetour);
  confirmSupDivRetourFermer.appendChild(confirmSupImgFerme);
  confirmSupDiv.appendChild(confirmSupTitre);
  confirmSupDiv.appendChild(confirmSupDivBouton);
  confirmSupDivBouton.appendChild(confirmSupBoutonOui);
  confirmSupDivBouton.appendChild(confirmSupBoutonNon);
}
//Fonction de la modal d'ajout
let ajoutImgVierge;
function ouvreModalAjout(e) {
  modalOuverte = "ajout";
  //Bloque le rechargement auto de la page
  e.preventDefault();
  const ouvreModalAjout = document.getElementById("btn-modif-projet");
  //Creation de la boite qui accueil la modal
  const ajoutAside = document.createElement("aside");
  ajoutAside.setAttribute("class", "modal flex jc-cent ai-cent");
  ajoutAside.setAttribute("id", "modal-ajout");
  ajoutAside.setAttribute("aria-modal", "true");
  ajoutAside.setAttribute("role", "dialog");
  ajoutAside.setAttribute("aria-labelby", "titreModal");
  ajoutAside.addEventListener("click", fermeModalAjout);
  //Creation d'une div pour accueillir les elements de la modal
  const ajoutDiv = document.createElement("div");
  ajoutDiv.setAttribute(
    "class",
    "modal-wrapper modal-stop flex fd-col ai-cent"
  );
  ajoutDiv.addEventListener("click", stopPropagation);
  //Creation d'une div pour accueillir les boutons retour & fermer
  const ajoutDivRetourFermer = document.createElement("div");
  ajoutDivRetourFermer.setAttribute("id", "retour-fermer");
  ajoutDivRetourFermer.setAttribute("class", "flex jc-spabet");
  //Creation du bouton retour
  const ajoutBoutonRetour = document.createElement("button");
  ajoutBoutonRetour.setAttribute("id", "retour-modal");
  ajoutBoutonRetour.setAttribute("class", "jc-fleend border background");
  //Ajout de l'image pour le bouton retour
  const ajoutImgRetour = document.createElement("img");
  ajoutImgRetour.setAttribute("id", "retour");
  ajoutImgRetour.src = "./assets/icons/retour.png";
  //Ajout d'un event listener qui ferme la modal ajout et ouvre la modal modif lors du click
  ajoutImgRetour.addEventListener("click", (e) => {
    fermeModalAjout();
    ouvreModalModif(e);
  });
  //Creation du bouton fermer
  const ajoutBoutonFerme = document.createElement("button");
  ajoutBoutonFerme.setAttribute(
    "class",
    "ferme-modal flex jc-fleend border background"
  );
  //Ajout de l'image pour le bouton fermer
  const ajoutImgFerme = document.createElement("img");
  ajoutImgFerme.setAttribute("class", "ferme");
  ajoutImgFerme.src = "./assets/icons/croix.png";
  //Ajout d'un event listener pour fermer la modal lors du click
  ajoutImgFerme.addEventListener("click", () => {
    fermeModalAjout();
  });
  //Creation du titre de la modal
  const ajoutTitre = document.createElement("h3");
  ajoutTitre.setAttribute("id", "titreModal");
  ajoutTitre.innerText = "Ajout photo";
  //Creation de la div qui accueille la nouvelle img
  const ajoutDivNouvelleImg = document.createElement("div");
  ajoutDivNouvelleImg.setAttribute("id", "nouvelle-img");
  ajoutDivNouvelleImg.setAttribute("class", "flex fd-col jc-spaaro ai-cent");
  //Ajout de l'image vierge
  ajoutImgVierge = document.createElement("img");
  ajoutImgVierge.setAttribute("id", "vierge");
  ajoutImgVierge.src = "./assets/icons/picture.png";
  //Creation du bouton "+ Ajouter photo"
  const ajoutLabelInput = document.createElement("button");
  ajoutLabelInput.setAttribute("for", "ajouter-photo-input");
  ajoutLabelInput.setAttribute("id", "ajouter-photo");
  ajoutLabelInput.setAttribute("class", "ff-worksans border");
  ajoutLabelInput.innerText = "+ Ajouter photo";
  //Creation de l'input pour uploader une nouvelle photo
  const ajoutInputAjout = document.createElement("input");
  ajoutInputAjout.setAttribute("type", "file");
  ajoutInputAjout.setAttribute("id", "ajouter-photo-input");
  ajoutInputAjout.setAttribute(
    "accept",
    ".jpeg, .jpg, .png, .gif, .webp, .jfif"
  );
  ajoutInputAjout.setAttribute("hidden", "");
  //Creation du paragraphe qui donne les conditions
  const ajoutTexte = document.createElement("p");
  ajoutTexte.setAttribute("id", "para");
  ajoutTexte.innerText = "jpg, png : 4mo max";
  //Creation du formulaire
  const ajoutFormulaire = document.createElement("form");
  ajoutFormulaire.setAttribute("id", "form-ajout");
  ajoutFormulaire.setAttribute("class", "flex fd-col");
  ajoutFormulaire.setAttribute("name", "suppr");
  ajoutFormulaire.setAttribute("action", "");
  ajoutFormulaire.setAttribute("method", "POST");
  //Creation du label pour le champ titre
  const ajoutNomTitre = document.createElement("label");
  ajoutNomTitre.setAttribute("for", "titre");
  ajoutNomTitre.innerText = "Titre";
  //Creation du champ titre
  const ajoutChampTitre = document.createElement("input");
  ajoutChampTitre.setAttribute("type", "textearea");
  ajoutChampTitre.setAttribute("id", "champ-titre");
  ajoutChampTitre.setAttribute("class", "border");
  ajoutChampTitre.setAttribute("name", "titre");
  ajoutChampTitre.setAttribute("required", "");
  //Ajout d'un event listener pour verifier si le champ est rempli lors de la saisie
  ajoutChampTitre.addEventListener("input", (e) => {
    checkChamp();
  });
  //Creation du label catégorie
  const ajoutNomCategorie = document.createElement("label");
  ajoutNomCategorie.setAttribute("for", "categorie");
  ajoutNomCategorie.innerText = "Catégorie";
  //Creation du champ catégorie
  const ajoutChampCategorie = document.createElement("select");
  ajoutChampCategorie.setAttribute("name", "categorie");
  ajoutChampCategorie.setAttribute("id", "champ-categorie");
  ajoutChampCategorie.setAttribute("class", "border");
  ajoutChampCategorie.setAttribute("required", "");
  //Ajout d'un event listener pour verifier si l'utilisateur à sélectionner un choix
  ajoutChampCategorie.addEventListener("change", (e) => {
    checkChamp();
  });
  //Creation des choix pour le champ catégorie
  const ajoutChoix0 = document.createElement("option");
  ajoutChoix0.setAttribute("value", "0");
  const ajoutChoix1 = document.createElement("option");
  ajoutChoix1.setAttribute("value", "1");
  ajoutChoix1.innerText = "Objets";
  const ajoutChoix2 = document.createElement("option");
  ajoutChoix2.setAttribute("value", "2");
  ajoutChoix2.innerText = "Appartements";
  const ajoutChoix3 = document.createElement("option");
  ajoutChoix3.setAttribute("value", "3");
  ajoutChoix3.innerText = "Hotels & restaurants";
  //Creation du bouton Valider
  const ajoutBoutonValider = document.createElement("button");
  ajoutBoutonValider.setAttribute("id", "ajout-valider");
  ajoutBoutonValider.setAttribute("class", "col-white border");
  ajoutBoutonValider.setAttribute("value", "Valider");
  ajoutBoutonValider.innerText = "Valider";
  //Ajout d'un event listener pour envoyer le nouveau media
  ajoutBoutonValider.addEventListener("click", function (e) {
    //Bloque le rechargement auto de la page
    e.preventDefault();
    //Récupère la valeur du champ titre et enlevé les espaces inutiles
    let titre = ajoutChampTitre.value;
    titre = titre.trim();
    //Récupère la valeur du champ catégorie
    const categorie = ajoutChampCategorie.value;
    //Récupère l'image uploader
    const image = file;
    //Test si les champ "image", "titre" & "catégorie" on bien était renseigne
    if (file === undefined) {
      alert("Veuillez insérer une image");
      return;
    } else if (titre === "") {
      alert("Veuillez mettre un titre");
      return;
    } else if (categorie < 1 || categorie > 3) {
      alert("Veuillez sélectionner une categorie");
      return;
    } else {
      //Création de l'objet "FormData" pour l'envoi du nouveau media à l'API
      formData = new FormData();
      formData.append("title", titre);
      formData.append("image", image);
      formData.append("category", categorie);
      //Ferme la modal d'ajout
      fermeModalAjout();
      //Ouvre la modal modif
      ouvreModalModif(e);
    }
  });

  //Rattachement des elements créer au DOM
  ouvreModalAjout.appendChild(ajoutAside);
  ajoutAside.appendChild(ajoutDiv);
  ajoutDiv.appendChild(ajoutDivRetourFermer);
  ajoutDivRetourFermer.appendChild(ajoutBoutonRetour);
  ajoutBoutonRetour.appendChild(ajoutImgRetour);
  ajoutDivRetourFermer.appendChild(ajoutBoutonFerme);
  ajoutBoutonFerme.appendChild(ajoutImgFerme);
  ajoutDiv.appendChild(ajoutTitre);
  ajoutDiv.appendChild(ajoutDivNouvelleImg);
  ajoutDivNouvelleImg.appendChild(ajoutImgVierge);
  ajoutDivNouvelleImg.appendChild(ajoutLabelInput);
  ajoutDivNouvelleImg.appendChild(ajoutInputAjout);
  ajoutDivNouvelleImg.appendChild(ajoutTexte);
  ajoutDiv.appendChild(ajoutFormulaire);
  ajoutFormulaire.appendChild(ajoutNomTitre);
  ajoutFormulaire.appendChild(ajoutChampTitre);
  ajoutFormulaire.appendChild(ajoutNomCategorie);
  ajoutFormulaire.appendChild(ajoutChampCategorie);
  ajoutChampCategorie.appendChild(ajoutChoix0);
  ajoutChampCategorie.appendChild(ajoutChoix1);
  ajoutChampCategorie.appendChild(ajoutChoix2);
  ajoutChampCategorie.appendChild(ajoutChoix3);
  ajoutDiv.appendChild(ajoutBoutonValider);

  //Gestion du Drag&Drop
  const zone = document.getElementById("nouvelle-img");
  const input = document.getElementById("ajouter-photo-input");
  const bouton = document.getElementById("ajouter-photo");
  //Ajout d'un event listener lors du click sur le bouton "+ Ajouter photo" pour upload l'image
  bouton.addEventListener("click", () => {
    input.click();
  });
  //Ajout d'un event listener pour ne sélectionner que le premier fichier si l'utilisateur en sélectionne plusieurs
  input.addEventListener("change", function () {
    //Selection du premier fichier
    file = this.files[0];
    //Prévisualisation de l'image
    previsualisation();
  });
  //Ajout d'un event listener lors du "Drag" sur la zone
  zone.addEventListener(
    "dragover",
    (e) => {
      e.preventDefault();
    },
    false
  );
  //Ajout d'un event listener lors de la sortie du "Drag" de la zone
  zone.addEventListener("dragleave", () => {}, false);
  //Ajout d'un event listener lors du "Drop" de l'image dans la zone
  zone.addEventListener(
    "drop",
    (e) => {
      //Bloque le rechargement auto de la page
      e.preventDefault();
      //Récupère l'image
      file = e.dataTransfer.files[0];
      //Prévisualisation de l'image
      previsualisation();
    },
    false
  );
}

//Fonction de la modal de confirmation
function ouvreModalConfirmation(e) {
  modalOuverte = "confirmation";
  const ouvreModalConfirmation = document.getElementById("btn-modif-projet");
  //Creation de la boite qui accueil la modal
  const confirmeAside = document.createElement("aside");
  confirmeAside.setAttribute("class", "modal flex jc-cent ai-cent");
  confirmeAside.setAttribute("id", "modal-confirmation");
  confirmeAside.setAttribute("aria-modal", "true");
  confirmeAside.setAttribute("role", "dialog");
  confirmeAside.setAttribute("aria-labelby", "titreModal");
  //Creation d'une div qui accueil les element de la modal
  const confirmeDiv = document.createElement("div");
  confirmeDiv.setAttribute(
    "class",
    "modal-wrapper modal-stop flex fd-col ai-cent"
  );
  //Creation bouton pour fermer
  const confirmeBoutonFerme = document.createElement("button");
  confirmeBoutonFerme.setAttribute(
    "class",
    "ferme-modal flex jc-fleend border background"
  );
  //Creation du titre
  const confirmeTitre = document.createElement("h3");
  confirmeTitre.setAttribute("id", "titreModal");
  confirmeTitre.innerText = "Es-tu sur de vouloir supprimer ?";
  //Creation de la div qui accueille l'image
  const confirmeDivMedia = document.createElement("div");
  confirmeDivMedia.setAttribute("id", "confirme-img");
  //Creation de l'image
  const confirmeImg = document.createElement("img");
  confirmeImg.src = e.target.parentElement.firstChild.currentSrc;
  confirmeImg.crossOrigin = "anonymous";
  //Creation d'une div pour les boutons
  const confirmeDivBouton = document.createElement("div");
  confirmeDivBouton.setAttribute("id", "btn-confirme");
  confirmeDivBouton.setAttribute("class", "flex fd-row jc-spaaro");
  //Creation bouton "Valider"
  const confirmeBoutonOui = document.createElement("button");
  confirmeBoutonOui.setAttribute("id", "valide-suppr");
  confirmeBoutonOui.setAttribute("class", "ff-syne col-white border");
  confirmeBoutonOui.innerText = "Supprimer";
  //Ajout d'un event listener pour récupérer l'id et la source du media lors du click
  confirmeBoutonOui.addEventListener("click", () => {
    idWork = e.target.parentNode.childNodes[0].currentSrc;
    ids.push(e.target.parentElement.dataset.id);
    //Ferme la modal
    fermeModalConfirmation();
    //Ouvre la modal principal
    ouvreModalModif(e);
  });
  //Creation bouton "Annuler"
  const confirmeBoutonNon = document.createElement("button");
  confirmeBoutonNon.setAttribute("id", "annule-suppr");
  confirmeBoutonNon.setAttribute("class", "ff-syne col-white");
  confirmeBoutonNon.innerText = "Annuler";
  //Ajout d'un event listener pour annuler la suppression lors du click
  confirmeBoutonNon.addEventListener("click", () => {
    //Ferme la modal
    fermeModalConfirmation();
    //Ouvre la modal principal
    ouvreModalModif(e);
  });
  //Rattache les elements au DOM
  ouvreModalConfirmation.appendChild(confirmeAside);
  confirmeAside.appendChild(confirmeDiv);
  confirmeDiv.appendChild(confirmeTitre);
  confirmeDiv.appendChild(confirmeDivMedia);
  confirmeDivMedia.appendChild(confirmeImg);
  confirmeDiv.appendChild(confirmeDivBouton);
  confirmeDivBouton.appendChild(confirmeBoutonOui);
  confirmeDivBouton.appendChild(confirmeBoutonNon);
}

//Fonction pour fermer la modal de profil
function fermeModalProfil() {
  const modalProfil = document.getElementById("modal-profil");
  modalOuverte = "";
  modalProfil.remove();
}
//Fonction pour fermer la modal de modif projet
function fermeModal() {
  const modalModif = document.getElementById("modal-modif");
  modalOuverte = "";
  modalModif.remove();
}

//Fonction pour fermer la modal de confirmation de suppression de la galerie
function fermeModalConfirmSup() {
  const modalConfirmSup = document.getElementById("modal-conf-sup");
  modalOuverte = "";
  modalConfirmSup.remove();
}
//Fonction pour fermer la modal d'ajout
function fermeModalAjout() {
  const modalAjout = document.getElementById("modal-ajout");
  modalOuverte = "";
  modalAjout.remove();
}

//Fonction fermer la modal de confirmation
function fermeModalConfirmation() {
  const modalConfirmation = document.getElementById("modal-confirmation");
  modalOuverte = "";
  modalConfirmation.remove();
}

//Ajout d'un listener pour fermer la modal via la touche "Echap"
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.key === "Esc") {
    if (modalOuverte === "profile") {
      fermeModalProfil();
    } else if (modalOuverte === "modif") {
      fermeModal();
    } else if (modalOuverte === "ajout") {
      fermeModalAjout();
    } else if (modalOuverte === "confirmation") {
      fermeModalConfirmation();
    } else if (modalOuverte === "confirmSup") {
      fermeModalConfirmSup();
    } else {
      return;
    }
  }
});

//Fonction pour ajouter les corbeilles sur les medias
function supprMedia() {
  const poubelles = document.getElementsByClassName("div-poubelle");
  for (let poubelle of poubelles) {
    //Ajout d'un event listener pour ouvrir la modal de confirmation lors du click
    poubelle.addEventListener("click", (e) => {
      e.preventDefault();
      //Ferme la modal
      fermeModal();
      //Ouvre la modal pour confirmer la suppression
      ouvreModalConfirmation(e);
    });
  }
}

//Fonction pour bloquer la propagation
const stopPropagation = function (e) {
  e.stopPropagation();
};

//Fonction qui control si les champs "titre" & "categorie" sont remplis
//pour modifier la couleur du bouton "Valider" dans la modal d'ajout
function checkChamp() {
  const champInput = document.getElementById("champ-titre");
  const champSelect = document.getElementById("champ-categorie");
  const boutonValider = document.getElementById("ajout-valider");
  //Verifie que le champ titre est rempli & qu'une categorie est sélectionnée
  if (champInput.value.length > 0 && champSelect.value > 0) {
    //Applique la couleur verte au bouton "Valider"
    boutonValider.style.background = "#1D6154";
  } else {
    //Applique la couleur grise au bouton "Valider"
    boutonValider.style.background = "#A7A7A7";
  }
}

//Fonction pour prévisualiser l'image upload
function previsualisation() {
  const regleRegex = /\.(jpe?g|png|gif|webp|jfif)$/i;
  if (!regleRegex.test(file.name)) {
    alert(
      `Ce fichier n'est pas au bon format. \nVeuillez insérer un fichier au format jpg ou png.`
    );
    zone.classList.remove("active");
  } else if (file.size > 4194304) {
    alert(
      "Ce fichier est trop grand. \nVeuillez insérer un fichier de moins de 4Mo"
    );
  } else {
    let fileReader = new FileReader();
    fileReader.onload = () => {
      let fileURL = fileReader.result;
      // const img = document.getElementById("vierge");
      const bouton = document.getElementById("ajouter-photo");
      const input = document.getElementById("ajouter-photo-input");
      const p = document.getElementById("para");
      bouton.remove();
      input.remove();
      p.remove();
      ajoutImgVierge.style.margin = "0";
      ajoutImgVierge.style.height = "100%";
      ajoutImgVierge.style.width = "auto";
      ajoutImgVierge.src = fileURL;
    };
    fileReader.readAsDataURL(file);
    console.log(file);
  }
}

//Fonction d'envoi du nouveau media à l'API
async function envoiNouveauMedia(e) {
  e.preventDefault();
  //Test de la requête
  try {
    //Requête d'envoi du nouveau media
    let reponse = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    //Si le status renvoyé est 201 execute le reste du code
    if (reponse.status === 201) {
      setTimeout(() => {
        requete();
      }, "100");
      setTimeout(() => {
        document.querySelector(".gallery").innerHTML = "";
        generationGallery(works);
      }, "1000");
    }
    //Si le status est autre que 201 créer les messages d'erreurs lies au status
    else if (reponse.status === 400) {
      throw new Error("Mauvaise requête");
    } else if (reponse.status === 401) {
      throw new Error("Non autorisé");
    } else if (reponse.status === 500) {
      throw new Error("Erreur inattendu");
    } else {
      throw new Error("Erreur inconnue");
    }
  } catch (error) {
    //Message d'erreur si exception levée par try
    alert(error.message);
  } finally {
    //Vide le formData
    formData.delete("title");
    formData.delete("image");
    formData.delete("category");
  }
}

//Fonction suppression des medias
async function suppressionMedia(e) {
  e.preventDefault();
  for (let i in ids) {
    //Test de la requête
    try {
      //Requête de surpression du/des medias sélectionnés
      let reponse = await fetch(`http://localhost:5678/api/works/${ids[i]}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      //Si le status renvoyé est 204 execute le reste du code
      if (reponse.status === 204) {
        requete();
        setTimeout(() => {
          document.querySelector(".gallery").innerHTML = "";
          generationGallery(works);
        }, "1000");
      }
      //Si le status est autre créer les messages d'erreurs lies au status
      else if (reponse.status === 401) {
        throw new Error("Non autorisé");
      } else if (reponse.status === 500) {
        throw new Error("Comportement inattendu");
      } else {
        throw new Error("Erreur inconnue");
      }
    } catch (error) {
      //Message d'erreur si exception levée par try
      alert(error.message);
    }
  }
  //Vide l'array ids
  ids = [];
}
