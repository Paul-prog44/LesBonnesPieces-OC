import { ajoutListenersAvis,  ajoutListenerEnvoyerAvis } from "./avis.js";

//Récupération des pièces éventuellement stockées en localstorage
let pieces = window.localStorage.getItem("pieces");


if (pieces === null){
    // Récupération des pièces depuis l'API
    const reponse = await fetch('http://localhost:8081/pieces');
    pieces = await reponse.json();
    // Transformation des pièces en JSON
    const valeurPieces = JSON.stringify(pieces);
    // Stockage des informations dans le localStorage
    window.localStorage.setItem("pieces", valeurPieces);
 }else{
    pieces = JSON.parse(pieces);
 }

ajoutListenerEnvoyerAvis()



function genererPieces(pieces) {
    for (let i = 0; i < pieces.length; i++) {
        const article = pieces[i];
        // Récupération de l'élément du DOM qui accueillera les fiches
        const sectionFiches = document.querySelector(".fiches");
        // Création d’une balise dédiée à une pièce automobile
        const pieceElement = document.createElement("article");
        // Création des balises 
        const imageElement = document.createElement("img");
        imageElement.src = article.image;
        const nomElement = document.createElement("h2");
        nomElement.innerText = article.nom;
        const prixElement = document.createElement("p");
        prixElement.innerText = `Prix: ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})`;
        const categorieElement = document.createElement("p");
        categorieElement.innerText = article.categorie ?? "(aucune catégorie)";
        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = article.description ?? "Pas de description pour le moment.";
        const stockElement = document.createElement("p");
        stockElement.innerText = article.disponibilite ? "En stock" : "Rupture de stock";
        const avisBouton = document.createElement("button");
        avisBouton.dataset.id = article.id;
        avisBouton.textContent = "Afficher les avis";

        // On rattache la balise article a la section Fiches
        sectionFiches.appendChild(pieceElement);
        // On rattache l’image à pieceElement (la balise article)
        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(nomElement);
        pieceElement.appendChild(prixElement);
        pieceElement.appendChild(categorieElement);
        //Ajout des éléments au DOM pour l'exercice
        pieceElement.appendChild(descriptionElement);
        pieceElement.appendChild(stockElement);
        pieceElement.appendChild(avisBouton);
    }
    ajoutListenersAvis();
}
//Premiere generation de la page
genererPieces(pieces);

for (let i = 0; i <pieces.length; i++) {
    const id = pieces[i].id
    const avisJson = window.localStorage.getItem(`avis-pieces-${id}`)
    const avis = JSON.stringify(avisJson)
}

 const boutonTrier = document.querySelector(".btn-trier");
 boutonTrier.addEventListener("click", function () {
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function(a, b) {
        return a.prix- b.prix
    })
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnees); 
})

 const boutonFiltrer = document.querySelector(".btn-filtrer");
 boutonFiltrer.addEventListener("click", function() {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.prix <= 35
    })
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
})

 const boutonDescriptionFilter = document.querySelector(".btn-filtrerdescription")
 boutonDescriptionFilter.addEventListener("click", function() {
    const piecesAvecDescription = pieces.filter(function (piece) {
        return piece.description != undefined
    })
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesAvecDescription); 
})

 const boutonTrierDecroissant = document.querySelector(".btn-trier-decroissant");
 boutonTrierDecroissant.addEventListener("click", function () {
    const piecePrixDecroissant = Array.from(pieces);
    piecePrixDecroissant.sort(function(a, b) {
        return b.prix- a.prix
    })
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecePrixDecroissant); 
})
 const noms = pieces.map(piece => piece.nom);
 for(let i = pieces.length -1 ; i >= 0; i--){
    if(pieces[i].prix > 35){
        noms.splice(i,1)
    }
 }
 
 //Création de la liste
const abordablesElements = document.createElement('ul');
//Ajout de chaque nom à la liste
for(let i=0; i < noms.length ; i++){
   const nomElement = document.createElement('li');
   nomElement.innerText = noms[i];
   abordablesElements.appendChild(nomElement)
}
// Ajout de l'en-tête puis de la liste au bloc résultats filtres
document.querySelector('.abordables')
   .appendChild(abordablesElements)

//filtrage des pièces disponibles
    const piecesDisponibles = pieces.map(piece =>piece.nom)
    const prixDisponible = pieces.map(piece =>piece.prix)

for (let i = pieces.length -1 ; i >= 0; i--){
    if(pieces[i].disponibilite === false ){
        piecesDisponibles.splice(i,1)
        prixDisponible.splice(i,1)
    }
}

//Création liste éléments disponibles
const disponiblesElements = document.createElement('ul')
for(let i=0; i <piecesDisponibles.length; i++) {
    const nomElement = document.createElement('li');
    nomElement.innerText = piecesDisponibles[i] +" - " + prixDisponible[i] +" €"
    disponiblesElements.appendChild(nomElement)
}
document.querySelector('.disponibles')
   .appendChild(disponiblesElements)

//Filtrage des produits en fonction du prix
const fitrePrix = document.getElementById("filtrePrix")

fitrePrix.addEventListener("change", function() {
    document.getElementById("filtrePrixValue")  
        .innerText = fitrePrix.value + " €"
    const elementFiltres = pieces.filter(piece => piece.prix <= fitrePrix.value)
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(elementFiltres)  
})

// Ajout du listener pour mettre à jour des données du localStorage
const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener("click", function () {
  window.localStorage.removeItem("pieces");
});