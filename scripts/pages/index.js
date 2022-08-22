// Importer la classe Recette
import Recipe from "../models/recipe.js";
// Importer le singleton API
import singletonRecipesApi from "./../api/recipesApi.js";
// Importer la fabrique de recette
import * as facRecipe from "./../factories/recipe.js";
// Importer les fonctions utilitaires pour gérer les custom dropdown
import {
  getFilters,
  getAnyTags,
  displayListItem,
  addDropdownToggleEvents,
} from "./../util/dropdown.js";
// Importer les fonctions utilitaires pour créer des éléments du DOM
import * as Dom from "./../util/dom.js";
// Importer les fonctions de la recherche globale
import { findRecipes } from "./../util/search.js";
// Importer les fonctions des recherche par étiquettes
import { findBy } from "./../util/searchtags.js";

/**
 * Afficher les données des recettes
 * dans des html cards.
 * Ajoute les mot clés de rechercher dans les custom dropdown
 * pour les recettes.
 *
 * @param {Array<Recipe>} recipes - une liste de recettes
 */
function displayData(recipes) {
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
        /** @type {[number, Object]} une fonction pour fabriquer la html card d'une recette */
        const recipeModel = facRecipe.recipeFactory(rec);
        /** @type {HTMLElement} un article contenant une recette complète */
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        // Ajouter cette html card fabriquée pour l'afficher dans la page
        parent.appendChild(recipeCardDOM);
        // Imprimer sur la console les recettes
        //console.log(rec.toString());
      });
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
  // Afficher dans les listes déroulantes les mots clés pour filtrer les ingredients, les ustensiles, l' électroménage
  displayTags(recipes);
}

/**
 * Afficher les mots clés de recherche dans les custom dropdown
 * en les détectant à partir d'une liste de recettes
 *
 * @param {Array<Recipe>} recipes - une liste de recettes
 */
function displayTags(recipes) {
  // Obtenir la liste des ingrédients, des ustensiles et de l'électroménager de cette collection de recette
  let {
    /** @type {Set} */ ingredients,
    /** @type {Set} */ ustensils,
    /** @type {Set} */ appliances,
  } = getAnyTags(recipes);

  /** @type {HTMLElement} liste ul des ingrédients */
  const listIngredients = document.getElementById("ingredients-list");
  /** @type {HTMLElement} liste ul des ustensiles */
  const listUstensils = document.getElementById("ustensils-list");
  /** @type {HTMLElement} liste ul de l'électroménager */
  const listAppliances = document.getElementById("appliances-list");

  /** @type {Array<Object>} la liste des étiquettes séléctionnées et affichées */
  const filters = getFilters();

  // Renseigner une dropdown avec les ingrédients uniques provenant dynamiquement des données
  // et founir ses étiquettes de la liste à exclure des ingredients
  displayListItem(
    listIngredients,
    ingredients,
    filters.filter((tag) => tag.list === "ingredients")
  );

  // Renseigner une dropdown avec les ustensiles unique provenant dynamiquement des données
  // et founir ses étiquettes de la liste à exclure des ustensiles
  displayListItem(
    listUstensils,
    ustensils,
    filters.filter((tag) => tag.list === "ustensils")
  );

  // Renseigner une dropdown avec les ustensiles unique provenant dynamiquement des données
  // et founir ses étiquettes de la liste à exclure de l'électroménager
  displayListItem(
    listAppliances,
    appliances,
    filters.filter((tag) => tag.list === "appliances")
  );
}

/**
 * Ajouter les évènements de recherche
 */
const addSearchEvents = () => {
  /** @type {HTMLInputElement} la zone de texte pour la recherche globale */
  const searchInput = document.getElementById("search-input");
  // Ecouter les caractères saisis dans la zone de texte
  searchInput.addEventListener("input", () => {
    // Effectuer une recherche globale, une recherche par étiquettes et afficher le résultat
    filterBySearchAndTags();
  });

  /** @type {HTMLElement} le formulaire de recherche globale */
  const searchForm = document.getElementById("search-form");
  // Ecouter la soumission du formulaire
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // Effectuer une recherche globale, une recherche par étiquettes et afficher le résultat
    filterBySearchAndTags();
  });

  /** @type {NodeList} les trois zones de saisie utilisées pour restreindre l'affichage des étiquettes dans les dropbox */
  const dropdowns = document.querySelectorAll(".filters__dropdown__search");
  // Parcourir les trois boutons toggle
  dropdowns.forEach((elm) => {
    elm.addEventListener("input", (event) =>
      // l'attribut html data-type contient soit ingredients, ustensils, appliances
      filterFunction(event.currentTarget.dataset.type)
    );
  });
};

/**
 * Effectuer une recherche globale de recettes,
 * Filtrer ces recettes à partir d'étiquettes
 * depuis tableau d'objets de filtres
 */
export const filterBySearchAndTags = () => {
  console.log("=== Filter by Search & Tags ===");

  /** @type {Array<Recipe>} un tableau de recettes filtrées */
  let found;

  /** @type {HTMLInputElement} la zone de texte pour la recherche globale */
  const searchInput = document.getElementById("search-input");
  /** @type string le texte saisi dans la zone de recherche par l'utilisateur */
  const needle = searchInput.value.trim();
  // Obtenir les recettes affichées via une nouvelle recherche globale
  // La recherche globale ne commence que quand l'utilisateur rentre 3 caractères
  if (needle !== "" && needle.length >= 3) {
    // Effectuer une recherche globale
    found = findRecipes(needle);
  } else {
    // ou prendre toutes les recettes connues
    found = singletonRecipesApi.getDataRecipes();
  }

  /** @type {Array<Object>} la liste des tags séléctionnés et affichés */
  const filters = getFilters();

  // Parcourir la liste des tags des filtres sélectionnés
  filters.forEach((filtre) => {
    // Déterminer le type de filtre à appliquer à l'item
    found = findBy(filtre.item, found, filtre.list);
  });

  // Afficher le résultat de la recherche
  displayData(found);
};

/**
 * Est-ce que toutes les recettes connues sont affichées
 * dans la page ?
 *
 * @returns {boolean} repondre à la question
 */
const areAllRecipesDiplayed = () => {
  /** @type {NodeList} toutes les Html Cards recettes affichées dans la page */
  const articles = document.querySelectorAll("#recipes article.card-recipe");
  /** @type {number} le nombre de recettes actuellement affichées */
  const displayedRecipes = articles.length;
  /** @type {number} le nombre de recettes connues */
  const allRecipes = singletonRecipesApi.getDataRecipes().length;

  return displayedRecipes === allRecipes;
};

/**
 * Saisir des caratères dans la zone de texte d'une liste déroulante
 * d'ingrédients, d'ustensiles ou d'électroménager
 * filtre et restreint l'affichage de ses items à choisir.
 *
 * @param {string} filterType - chaine à partir de l'attribut html data-type (ingredients, ustensils ou appliances)
 */
function filterFunction(filterType) {
  /** @type {string} l'identifiant du champ de saisi pour la recherche d'un ingrédient, d'un ustensile ou d'un appareil */
  const idSearch = `${filterType}-search`;
  /** @type {HTMLFormElement} le champ de saisi */
  const input = document.getElementById(idSearch);
  /** @type {string} */
  const filter = input.value.trim().toUpperCase();

  /** @type {string} l'identifiant de la liste d'items d'ingrédients, d'ustensiles ou d'appareils */
  const idList = `${filterType}-list`;
  /** @type {HTMLElement} la liste de ces items */
  const ul = document.getElementById(idList);
  /** @type {HTMLCollection} tous les items de cette liste */
  const listItems = ul.querySelectorAll("li");
  listItems.forEach(function (item) {
    // Certains items pourraient être masqués par une recherche dans l'input de la dropbox
    item.style.display = "list-item"; // // alors il faut d'assurer de les afficher tous avant de filtrer
  });

  if (filter.length > 0) {
    /** @type {string} l'identifiant d'une custom dropbox */
    const idDropbox = `${filterType}-dropdown`;
    /** @type {HTMLDivElement} l'élémént div contenant toute la custom dropbox */
    const dropdown = document.querySelector(`#${idDropbox}`);

    /** @type {string} l'identifiant d'un bouton pour afficher masque la custom dropdox */
    const idToogle = `${filterType}-toggle`;
    /** @type {HTMLButtonElement} le bouton pour ouvrir fermer la dropdown */
    const toggle = document.getElementById(idToogle);

    // Si la dropdown n'est pas ouverte ...
    if (!dropdown.classList.contains("show")) {
      toggle.click(); // alors appuyer sur son bouton pour afficher ses items
    }

    /** @type {string} le nom d'un ingredient, d'un ustensile ou d'un appareil affiché dans la liste */
    let txtValue;
    // Parcourir tous les items pour n'afficher que ceux qui correspondent à la saisie
    for (let i = 0; i < listItems.length; i++) {
      txtValue = listItems[i].textContent;
      if (txtValue.toLowerCase() === "aucun élément") {
        // RaB
        input.value = "";
        break;
      } else if (txtValue.toUpperCase().indexOf(filter) > -1) {
        // Afficher un item
        listItems[i].style.display = "list-item";
      } else {
        // Masquer un item qui ne correspond pas au filtre saisi
        listItems[i].style.display = "none";
      }
    }
  }
}

/**
 * Point d'entrée de l'application
 * Obtenir les données et les afficher
 */
function init() {
  /** @type {Array<Recipe>} un tableau avec toutes les recettes connues */
  const allRecipes = singletonRecipesApi.getDataRecipes();

  // Afficher le nombre d'ingredients, d'ustensiles et d'électroménager mémorisés dans les variables statiques
  // des objets recette de la classe Recipe
  console.log(`Ingrédients trouvés: ${Recipe.allIngredients.size}`);
  console.log(`Ustensiles trouvés: ${Recipe.allUstensils.size}`);
  console.log(`Electoménager trouvé: ${Recipe.allAppliances.size}`);

  // Afficher les données des recettes
  displayData(allRecipes);

  // Ajouter les évènements des dropdowns (UI open/close)
  addDropdownToggleEvents();

  // Ajouter les évènements de recherche
  addSearchEvents();
}

init();
