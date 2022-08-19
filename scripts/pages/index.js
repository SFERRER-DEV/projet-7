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
import {
  findByAppliance,
  findByIngredient,
  findByUstensil,
} from "./../util/searchtags.js";

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
        console.log(rec.toString());
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
  const listIngredients = document.getElementById("listIngredients");
  /** @type {HTMLElement} liste ul des ustensiles */
  const listUstensils = document.getElementById("listUstensils");
  /** @type {HTMLElement} liste ul de l'électroménager */
  const listAppliances = document.getElementById("listAppliances");

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
    switch (filtre.list) {
      case "appliances":
        found = findByAppliance(filtre.item, found);
        break;
      case "ingredients":
        found = findByIngredient(filtre.item, found);
        break;
      case "ustensils":
        found = findByUstensil(filtre.item, found);
        break;
    }
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
