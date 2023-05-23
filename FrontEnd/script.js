//Declaration de la variable qui contiendra tous les travaux
let works;
//Test de la requête
try {
  //Requête pour récupérer tous les travaux
  let reponse = await fetch("http://localhost:5678/api/works");
  //Si le status renvoyé est 200 execute le reste du code
  if (reponse.status === 200) {
    works = await reponse.json();
    // works = data;
  }
  //Si le status est autre créer les messages d'erreurs lies au status
  else if (reponse.status === 500) {
    throw new Error("Erreur inattendue");
  } else {
    throw new Error("Erreur inconnue");
  }
} catch (error) {
  //Message d'erreur si exception levee par try
  alert(error.message);
}

//Generation de la galerie
export function generationGallery(works) {
  for (let work of works) {
    console.log(work);
    //Recuperation de l'element du DOM qui accueil les articles
    const divGallery = document.querySelector(".gallery");
    console.log(divGallery);
    //Creation d'une balise dédiée aux articles
    const figureElement = document.createElement("figure");
    figureElement.dataset.id = work.id;
    //Creation des balises img
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.crossOrigin = "anonymous";
    //Creation de la légende des images
    const figcaptionElement = document.createElement("figcaption");
    figcaptionElement.innerText = work.title;
    //Rattachement des balises au DOM
    divGallery.appendChild(figureElement);
    figureElement.appendChild(imageElement);
    figureElement.appendChild(figcaptionElement);
  }
}
generationGallery(works);

console.log(document.querySelector(".boutonn"));
// Récupération des boutons
const buttons = document.querySelectorAll(".bouton");
// Ajout de l'écouteur d'événement à chaque bouton
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-name");
    filterWorks(category);
  });
});

// Fonction pour filtrer les travaux par catégorie
function filterWorks(category) {
  const filteredWorks = works.filter((work) => {
    if (category === "All") {
      return true;
    } else {
      return work.category.name === category;
    }
  });
  document.querySelector(".gallery").innerHTML = "";
  // Mise à jour de la galerie avec les travaux filtrés
  generationGallery(filteredWorks);
}
