// Importer la classe Recette
import Recipe from "../models/recipe.js";
// Importer le singleton API et sa classe
import singletonRecipesApi, { RecipesApi } from "./../api/recipesApi.js";
// Importer la fabrique de recette
import * as facRecipe from "./../factories/recipe.js";
// Importer les fonctions utilitaires pour gérer les listes de filtres
import * as dropdown from "./../util/dropdown.js";
// Importer les fonctions utilitaires pour créer des éléments du DOM
import * as Dom from "./../util/dom.js";
// Importer les fonctions de recherche
import * as search from "./../util/search.js";
/**
 * Ajouter un évènement à chaqu'un des boutons ouvrant les listes déroulantes
 * add events to show dropdown list for click toggle button, focus, and blur
 *
 */
function addDropdownToggleEvents() {
  /** @type {NodeList} une collection avec les trois boutons pour ouvrir fermer les trois listes déroulantes */
  const toggleButtons = document.querySelectorAll(".filters__dropdown__toggle");

  // Parcourir les trois boutons toggle
  toggleButtons.forEach((elm) => {
    /** @type {string} l'attribut data-type de ce bouton toggle contient le nom du type des éléments à rechercher */
    const searchName = elm.dataset.type;
    /** @type {string} l'identifiant d'une custom liste déroulante correspondant à ce bouton toggle actuellement lu */
    const idDropbox = `${searchName}-dropdown`;

    /** @type {HTMLDivElement} l'élémént div contenant toute la custom iste déroulante */
    const dropdown = document.querySelector(`#${idDropbox}`);
    // Ecouter l'évènement click de toggle bouton pour ...
    elm.addEventListener("click", () => {
      if (dropdown.classList.contains("show")) {
        dropdown.classList.remove("show"); // ... enlever la classe show à sa dropdown
        dropdown.classList.add("col-3");
        dropdown.classList.remove("col-5");
      } else {
        closeAllDropdowns();
        dropdown.classList.add("show"); //  ... ou ajouter la classe show à sa dropdown
        dropdown.classList.add("col-5");
        dropdown.classList.remove("col-3");
      }
    });
  });
}

/**
 * Cliquer en dehors d'une liste custom dropdown
 * ferme toute liste ouverte
 *
 * @param {*} event
 */
window.onclick = function (event) {
  if (
    !event.target.matches([
      ".filters__dropdown",
      ".filters__dropdown ul",
      ".filters__dropdown ul li",
      ".filters__dropdown__toggle",
      ".filters__dropdown__toggle i",
      ".filters__dropdown__search",
    ])
  ) {
    closeAllDropdowns();
  }
};

/**
 * Fermer toutes les listes custom dropdown
 * avec reinitialisation de la largeur
 */
function closeAllDropdowns() {
  const openedDropdowns = document.querySelectorAll(".show");
  openedDropdowns.forEach((dropdown) => {
    dropdown.classList.remove("show");
    dropdown.classList.remove("col-5");
    dropdown.classList.add("col-3");
  });
}

/**
 * Afficher les données des recettes
 * dans des html cards sur la page d'accueil en utilisant
 * la factory Recipe
 *
 * @param {Array<Recipe>} recipes - une liste de recettes
 */
function displayData(recipes) {
  /** @type {number} un compteur pour sotir de la boucle */
  let i = 0;
  /** @type {HTMLDivElement} le conteneur html pour les recettes */
  const parent = document.getElementById("recipes");
  // Toujours enlever les recettes avant d'en afficher à nouveau
  parent.replaceChildren();
  // il y a des recettes à afficher
  if (Array.isArray(recipes) && recipes.length) {
    console.log(`Nombre de recettes: ${recipes.length}`);
    try {
      // Parcourir la liste des recettes
      recipes.forEach((rec) => {
        i++;
        /** @type {[number, Object]} une fonction pour fabriquer la html card d'une recette */
        const recipeModel = facRecipe.recipeFactory(rec);
        /** @type {HTMLElement} un article contenant une recette complète */
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        // Ajouter cette html card fabriquée pour l'afficher dans la page
        parent.appendChild(recipeCardDOM);
      });
      // Afficher les listes déroulantes pour filtrer par ingredients, ustensiles, électroménage
      displayTags(recipes);
    } catch (error) {
      console.log(error);
    }
  } else {
    /** @type {HTMLParagraphElement} message aucune recette trouvée */
    const para = Dom.getPara(
      ["recipes__empty", "m-3"],
      "Aucune recette trouvée"
    );
    // Ajouter ce paragraphe pour l'afficher dans la page
    parent.appendChild(para);
  }
}

/**
 *
 * @param {Array<Recipe>} recipes - une liste de recettes
 */
function displayTags(recipes) {
  // Obtenir la liste des ingrédients, des ustensiles et de l'électroménager de cette collection de recette
  let {
    /** @type {Set} */ ingredients,
    /** @type {Set} */ ustensils,
    /** @type {Set} */ appliances,
  } = dropdown.getAnyTags(recipes);

  /** @type {HTMLElement} liste ul des ingrédients */
  const listIngredients = document.getElementById("listIngredients");
  /** @type {HTMLElement} liste ul des ustensiles */
  const listUstensils = document.getElementById("listUstensils");
  /** @type {HTMLElement} liste ul de l'électroménager */
  const listAppliances = document.getElementById("listAppliances");

  // Renseigner une dropdown avec les ingrédients uniques provenant dynamiquement des données
  dropdown.displayListItem(listIngredients, ingredients);

  // Renseigner une dropdown avec les ustensiles unique provenant dynamiquement des données
  dropdown.displayListItem(listUstensils, ustensils);

  // Renseigner une dropdown avec les ustensiles unique provenant dynamiquement des données
  dropdown.displayListItem(listAppliances, appliances);
}

/**
 * Ajouter les évènement de recherche
 */
const addSearchEvents = () => {
  /** @type string le texte saisi dans la zone de recherche par l'utilisateur */
  let needle = "";
  /** @type {HTMLInputElement} la zone de texte pour la recherche globale */
  const searchInput = document.getElementById("search-input");
  // Ecouter les caractères saisis dans la zone de texte
  searchInput.addEventListener("input", (event) => {
    // le texte recherché
    needle = event.currentTarget.value.trim();
    // La recherche globale ne commence que quand l'utilisateur rentre 3 caractères
    if (needle.length >= 3) {
      /** @type {Array<Recipe>} un tableau de recettes filtrées par la recherche */
      const found = search.findRecipes(needle);
      // Afficher le résultat de la recherche
      displayData(found);
    } else {
      /** @type {HTMLParagraphElement} paragraphe affichant qu'aucune recette n'a été trouvée*/
      const empty = document.querySelector(".recipes__empty");
      /** @type {NodeList} tous les articles recettes affichés dans la page*/
      const articles = document.querySelectorAll(
        "#recipes article.card-recipe"
      );
      // Si toutes les recettes connues ne sont pas affichés à l'écran ..
      if (
        empty !== null ||
        articles.length !== singletonRecipesApi.getDataRecipes().length
      ) {
        // .. lors afficher toutes les recettes connues
        displayData(singletonRecipesApi.getDataRecipes());
      }
    }
  });

  /** @type {HTMLElement} le formulaire de recherche globale */
  const searchForm = document.getElementById("search-form");
  // Ecouter la soumission du formulaire
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    needle = event.currentTarget.querySelector(".form-control").value;
    // La recherche globale ne commence que quand l'utilisateur rentre 3 caractères
    if (needle.length >= 3) {
      /** @type {Array<Recipe>} un tableau de recettes filtrées par la recherche */
      const found = search.findRecipes(needle);
      // Afficher le résultat de la recherche
      displayData(found);
    } else {
      // Effacer les caractères saisis
      event.currentTarget.querySelector(".form-control").value = "";
      // Afficher toutes les recettes connues
      displayData(singletonRecipesApi.getDataRecipes());
    }
  });
};

/**
 * Point d'entrée de l'application
 * Obtenir les données de manière asynchrone et
 * les afficher
 */
function init() {
  /** @type {HTMLElement} liste ul des ingrédients */
  //const listIngredients = document.getElementById("listIngredients");
  /** @type {HTMLElement} liste ul des ustensiles */
  //const listUstensils = document.getElementById("listUstensils");
  /** @type {HTMLElement} liste ul de l'électroménager */
  //const listAppliances = document.getElementById("listAppliances");

  // Renseigner une dropdown avec les ingrédients uniques provenant dynamiquement des données
  //dropdown.displayListItem(listIngredients, Recipe.allIngredients);

  // Renseigner une dropdown avec les ustensiles unique provenant dynamiquement des données
  //dropdown.displayListItem(listUstensils, Recipe.allUstensils);

  // Renseigner une dropdown avec les ustensiles unique provenant dynamiquement des données
  //dropdown.displayListItem(listAppliances, Recipe.allAppliances);

  // Ajouter les évènements des dropdowns (UI open/close)
  addDropdownToggleEvents();

  // Ajoute les évènements de recherche
  addSearchEvents();

  /** @type {Array<Recipe>} un tableau avec toutes les recettes connues */
  const allRecipes = singletonRecipesApi.getDataRecipes();

  // Afficher le nombre d'ingredients, d'ustensiles et d'électroménager mémorisés dans les variables statiques
  // des objets recette de la classe Recipe
  console.log(`Ingrédients trouvés: ${Recipe.allIngredients.size}`);
  console.log(`Ustensiles trouvés: ${Recipe.allUstensils.size}`);
  console.log(`Electoménager trouvé: ${Recipe.allAppliances.size}`);

  // Afficher les données
  displayData(allRecipes);
}

init();
