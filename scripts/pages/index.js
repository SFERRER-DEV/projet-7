// Importer le singleton API et la classe e
import Ingredient from "../models/ingredient.js";
import singletonRecipesApi, { RecipesApi } from "./../api/recipesApi.js";

/**
 * Ajouter un évènement à chaqu'un des boutons ouvrant les listes déroulantes
 * add events to show dropdown list for click toggle button, focus, and blur
 *
 */
function addDropdownToggleEvents() {
  /** @type {NodeList} une collection avec les trois boutons pour ouvrir fermer les trois listes déroulantes */
  const toggleButtons = document.querySelectorAll(".filters__dropdown__toogle");

  // Parcourir les trois boutons toggle
  toggleButtons.forEach((elm) => {
    /** @type {string} l'attribut data-type de ce bouton toogle contient le nom du type des éléments à rechercher */
    const searchName = elm.dataset.type;
    /** @type {string} l'identifiant d'une custom liste déroulante correspondant à ce bouton toggle actuellement lu */
    const idDropbox = `${searchName}-dropdown`;

    /** @type {HTMLDivElement} l'élémént div contenant toute la custom iste déroulante */
    const dropdown = document.querySelector(`#${idDropbox}`);
    // Ecouter l'évènement click de toggle bouton pour ...
    elm.addEventListener("click", () => {
      if (dropdown.classList.contains("show")) {
        dropdown.classList.remove("show"); // ... enlever la classe show à sa dropdown
        dropdown.classList.add("col-2");
        dropdown.classList.remove("col-6");
      } else {
        closeAllDropdowns();
        dropdown.classList.add("show"); //  ... ou ajouter la classe show à sa dropdown
        dropdown.classList.add("col-6");
        dropdown.classList.remove("col-2");
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
      ".filters__dropdown__toogle",
      ".filters__dropdown__toogle i",
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
    dropdown.classList.remove("col-6");
    dropdown.classList.add("col-2");
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
  let i = 0;

  try {
    // Parcourir la liste des recettes
    recipes.forEach((rec) => {
      console.log(rec.toString());
      // Parcourir les ingredients de la recette
      rec.ingredients.forEach((ing) => {
        console.log(` > ${ing.toString()}`);
      });
      // Parcourir les ustensiles nécessaires
      rec.ustensils.forEach((ust) => {
        console.log(` >> ${ust}`);
      });
      i++;
      if (i == 3) throw "fin";
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * Point d'entrée de l'application
 * Obtenir les données de manière asynchrone et
 * les afficher
 */
function init() {
  // Ajouter les évènements des dropdowns
  addDropdownToggleEvents();

  /** @type {Array<Recipe>} un tableau de recettes */
  const allRecipes = singletonRecipesApi.getDataRecipes();

  // Afficher les données
  displayData(allRecipes);
}

init();
