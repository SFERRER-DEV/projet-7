// Importer le singleton API
import singletonRecipesApi from "./../api/recipesApi.js";
// Importer la fabrique de recette
import * as facRecipe from "./../factories/recipe.js";
// Importer les fonctions utilitaires pour gérer les custom dropdown
import {
  sortSet,
  getFilters,
  getAnyTags,
  addDropdownToggleEvents,
  addDropdownFilterEvents,
} from "./../util/dropdown.js";
// Importer les fonctions utilitaires pour créer des éléments du DOM
import * as Dom from "./../util/dom.js";
// Importer les fonctions de la recherche globale
import { findRecipes } from "./../util/search.js";
// Importer les fonctions des recherche par étiquettes
import { findBy } from "./../util/searchtags.js";

let needles = new Array();

/**
 * Afficher les données des recettes
 * dans des html cards.
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
    console.log(`    ===> ${recipes.length} recettes affichées\n`);
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
        recipeCardDOM.addEventListener("click", () =>
          console.log(rec.toString())
        );
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
}

/**
 * Afficher dans les dropdowns leurs mots clés de recherche
 * en les détectant à partir d'une liste de recettes
 *
 * @param {Array<Recipe>} recipes - une liste de recettes
 */
function displayTags(recipes) {
  // Obtenir la liste des ingrédients, des ustensiles et de l'électroménager
  // de cette collection de recette
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

  // Remplir et afficher une dropdown avec des ingrédients
  // et founir la liste des ingredients à ne pas afficher (exclusion)
  displayListItem(
    listIngredients,
    ingredients,
    filters.filter((tag) => tag.list === "ingredients"),
    recipes
  );

  // Remplir une dropdown avec les ustensiles
  // et founir la liste des ustensiles à ne pas afficher (exclusion)
  displayListItem(
    listUstensils,
    ustensils,
    filters.filter((tag) => tag.list === "ustensils"),
    recipes
  );

  // Renseigner une dropdown avec l'électroménager
  // et founir la liste de l'électroménager à ne pas afficher (exclusion)
  displayListItem(
    listAppliances,
    appliances,
    filters.filter((tag) => tag.list === "appliances"),
    recipes
  );
}

/**
 * Assembler dans une liste html ul les éléments stockés
 * dauns une collection Set pour les ingrédients, les ustensiles
 * et pour l'électroménager
 *
 * @param {HTMLElement} aList une liste html ul
 * @param {Set} someItems une collection d'ingrédients, d'ustensiles ou de l'électroménager
 * @param {Array<Object>} excludes une liste de filtres obtenue à partir des tag sélectionnés
 * @param {Array<Recipe>} recipes - une liste de recettes
 */
function displayListItem(aList, someItems, excludes, recipes) {
  /** @type {HTMLLIElement} un élément li contenant un ingrédient */
  let listItem;

  // Supprimer tous les items li existants
  aList.replaceChildren();

  // Si il y a des étiquettes séléctionnées et affichées
  // alors il y a des items à ne pas montrer dans les listes déroulantes
  if (excludes.length > 0) {
    // Parcourir une collection d'ingredients, d'ustensiles ou d'électromenager
    someItems.forEach(
      function (item) {
        // this est un tableau à exclure
        if (this.includes(item)) {
          someItems.delete(item); // exclure
        }
      },
      // Envoyer dans le scope de la boucle un tableau d'exclusion de libellés de filtres
      excludes.map((e) => e.item) // Ne prendre que le libellé des filtres
    );
  }

  if (someItems.size === 0) {
    listItem = Dom.getListItem("", "Aucun élément");
    // Ajouter l'élément à la liste concernée
    aList.appendChild(listItem);
  } else {
    // Trier sur place par ordre ascendant la liste des items
    sortSet(someItems);
    // Parcourir les items ...
    someItems.forEach((item) => {
      listItem = Dom.getListItem("", item);
      // Ce data attribut permet de marquer l'item pour identifier son type
      listItem.setAttribute("data-type", aList.dataset.type);
      // Ajouter l'évènement pour ajouter une étiquette de filtre
      // en cliquant sur un list-item d'une dropdown
      listItem.addEventListener("click", (event) =>
        clickListItem(event, recipes)
      );
      // Ajouter l'élément à la liste concernée
      aList.appendChild(listItem);
      // Raz
      item = null;
    });
  }
}

/**
 * Ajouter les évènements de recherche
 * lors de la saisie de caratères dans la zone
 * ou de soumission du formulaire
 * Lancer la recherche générale des recettes (axe de recherche 1)
 */
const addSearchEvents = () => {
  /** @type {Array<Recipe>} la liste des objets recettes trouvés */
  let recipesFound = [];

  /** @type {HTMLInputElement} la zone de texte pour la recherche globale */
  const searchInput = document.getElementById("search-input");

  // Ecouter les caractères saisis dans la zone de texte
  searchInput.addEventListener("input", () => {
    needles.push(searchInput.value.trim());
    // Effectuer une recherche globale, une recherche par étiquettes et afficher le résultat
    recipesFound = filterBySearch(recipesFound);
    recipesFound = filterByTags(recipesFound);
    // Afficher le résultat de la recherche
    displayData(recipesFound);
    // Afficher les mot-clés de recherche dans les dropdowns
    displayTags(recipesFound);
  });

  /** @type {HTMLElement} le formulaire de recherche globale */
  const searchForm = document.getElementById("search-form");
  // Ecouter la soumission du formulaire
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // Vider les recherché précédentes
    needles.splice(0, needles.length);
    needles.push(searchInput.value.trim());
    // Effectuer une recherche globale, une recherche par étiquettes et afficher le résultat
    recipesFound = filterBySearch(recipesFound);
    recipesFound = filterByTags(recipesFound);
    // Afficher le résultat de la recherche
    displayData(recipesFound);
    // Afficher les mot-clés de recherche dans les dropdowns
    displayTags(recipesFound);
  });
};

/**
 * Cliquer sur un item dans une des listes ingredients, ustensiles
 * ou électroménager
 * Ajouter un tag bleu, rouge ou vert dans la zone des filtres d'étiquettes
 * Lancer le filtre des recettes par les étiquettes (axe de recherche 2)
 *
 * @param {Event} event un évènement click sur un list-item bleu, rouge, vert
 */
function clickListItem(event, recipes) {
  /** @type {string} le type du filtre cliqué */
  const filterType = event.currentTarget.dataset.type;
  /** @type {string} le texte de l'élément cliqué  */
  const tagText = event.currentTarget.textContent;
  /** @type {HTMLDivElement} le conteneur des étiquettes de filtre */
  const parent = document.getElementById("tags");

  /** @type {HTMLSpanElement} une étiquette html bleue, verte ou rouge */
  const aTag = Dom.getSpan(
    ["tags__tag", "px-2", "py-1", "m-1", "my-2", "rounded"],
    `${tagText}`
  );
  // Typer l'étiquette: ingredient, ustensile, électroménager
  aTag.setAttribute("data-type", filterType);

  /** @type {HTMLElement} - l'icone croix pour fermer ce tag */
  const icone = Dom.getIcone([
    "tags__tag__cross",
    "bi",
    "bi-x-circle",
    "ml-3",
    "my-auto",
  ]);

  // Ajouter la croix au tag
  aTag.append(icone);

  // Ajouter l'évènement pour faire disparaitre l'étiquette avec sa croix
  aTag.addEventListener("click", (event) => closeTag(event));

  // Ajouter ce tag pour l'afficher sur la ligne des tags
  parent.appendChild(aTag);
  console.log(`    ADD Tag: ${tagText}`);

  /** @type {string} l'identifiant du champ de saisi pour la recherche d'un ingrédient, d'un ustensile ou d'un appareil */
  const idSearch = `${filterType}-search`;
  /** @type {HTMLFormElement} le champ de saisi */
  const input = document.getElementById(idSearch);
  // Remise à blanc de la zone de saisie  des filtres d'étiquettes
  input.value = "";

  // Filtrer les recettes à partir des tags sélectionnés et affichés
  recipes = filterByTags(recipes);

  // Afficher le résultat de la recherche
  displayData(recipes);
  // Afficher les mot-clés de recherche dans les dropdowns
  displayTags(recipes);
}

/**
 * Fermer un tag pour enlever une étiquette de recherche
 * Lancer le filtre des recettes par les étiquettes (axe de recherche 2)
 *
 * @param {Event} event un évènement click sur la croix d'une étiquette
 */
function closeTag(event) {
  /** @type {HTMLDivElement} le conteneur html des étiquettes de filtre */
  const parent = document.getElementById("tags");
  /** @type {HTMLSpanElement} l'étiquette cliquée  */
  const tag = event.currentTarget;

  // faire disparaitre le tag de l'affichage
  parent.removeChild(tag);
  console.log(`    CLOSE Tag: ${tag.textContent}`);

  // et filtrer à partir de toutes les recettes
  let recipesFound = [];
  recipesFound = filterBySearch(singletonRecipesApi.getDataRecipes());
  recipesFound = filterByTags(recipesFound);

  // Afficher le résultat de la recherche
  displayData(recipesFound);
  // Afficher les mot-clés de recherche dans les dropdowns
  displayTags(recipesFound);
}

/**
 * Effectuer une recherche globale de recettes,
 * Filtrer ces recettes à partir d'étiquettes
 * depuis tableau d'objets de filtres
 *
 * @param {Array<Recipe>} recipes une liste de recettes filtrée ou toutes les recettes connues
 * @returns {Array<Recipe>} la liste des objets recettes trouvés
 */
const filterBySearch = (recipes = []) => {
  console.log("    ===> Filter by Search");
  /** @type {string} la dernière recherche saisie*/
  const needle = needles.at(-1) !== undefined ? needles.at(-1) : "";
  /** @type {string} l'avant dernière recherche saisie*/
  const needlePrevious = needles.at(-2) !== undefined ? needles.at(-2) : "";

  // Obtenir les recettes affichées via une nouvelle recherche globale
  // La recherche globale ne commence que quand l'utilisateur rentre 3 caractères
  if (needle.length < 3 && !areAllRecipesDiplayed()) {
    // Obtenir toutes les recettes connues
    // au premier affichage ou à la demande
    // quand le formulaire est soumis avec moins de trois lettres
    // et que toutes les recettes connues ne sont pas passées en paramètre
    if (recipes.length !== singletonRecipesApi.Count) {
      recipes = singletonRecipesApi.getDataRecipes();
    }
  } else if (
    needle.length >= 3 &&
    needle.length < needlePrevious.length &&
    needlePrevious.indexOf(needle) === 0
  ) {
    // Effectuer une recherche globale dans toutes les recettes connues
    // quand des lettres sont supprimées de la zone de saisie
    // "Limonade" 50 => 2
    // "Limonade de coco" 2 => 1
    // "Limonade" 50 => 2
    recipes = findRecipes(needle, singletonRecipesApi.getDataRecipes());
  } else if (needle.length >= 3 && needle !== needlePrevious) {
    // Effectuer une recherche globale dans les recettes filtrées
    // en évitant de refaire deux fois de suite la même recherche
    if (recipes.length > 0) {
      // Protection: les recherches précédentes peuvent ne plus rien trouver
      recipes = findRecipes(needle, recipes);
    } else if (needle.indexOf(needlePrevious) === -1) {
      // "Rac" 50 => 1
      // "Raclettt" 1 => 0
      // "Raclettte" 0 => 0
      needles.splice(0, needles.length);
      recipes = singletonRecipesApi.getDataRecipes();
    }
  } else {
    // Ne rien faire
  }

  return recipes;
};

/**
 *
 * @param {Array<Recipe>} recipes une liste de recettes
 * @returns {Array<Recipe>} la liste des objets recettes trouvés
 */
const filterByTags = (recipes = []) => {
  console.log("    ===> Filter by Tags");

  /** @type {Array<Object>} la liste des tags séléctionnés et affichés */
  const filters = getFilters();

  // Parcourir la liste des tags des filtres sélectionnés
  filters.forEach((filtre) => {
    // Il n'est pas utile de filtrer plus
    // commes les filtre sont obtenus par les recettes
    if (recipes.length > 1) {
      // Déterminer le type de filtre à appliquer à l'item
      recipes = findBy(filtre.item, recipes, filtre.list);
    }
  });

  return recipes;
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

  return displayedRecipes === singletonRecipesApi.Count;
};

/**
 * Point d'entrée de l'application
 * Obtenir les données et les afficher
 */
function init() {
  // Ajouter les évènements de recherche globale (axe 1)
  addSearchEvents();

  /** @type {HTMLInputElement} le bouton de soumission de la recherche globale */
  const submit = document.getElementById("search-recipes");
  // Lancer une première recherche sans filtre pour afficher
  // une première fois toutes les recettes connues
  submit.click();

  // Ajouter les évènements des dropdowns
  addDropdownToggleEvents();
  addDropdownFilterEvents();
}

init();
