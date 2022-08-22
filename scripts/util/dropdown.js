// Importer les fonctions utilitaires pour créer des éléments du DOM
import * as Dom from "./../util/dom.js";
// Importer les fonctions utilitaires pour gérer les listes de filtres
import { filterBySearchAndTags } from "./../pages/index.js";

/**
 * Ajouter un évènement à chaqu'un des boutons  pour ouvrir ou fermer
 * sa listes déroulante.
 * Cliquer en dehors d'une liste ferme toutes listes.
 */
export function addDropdownToggleEvents() {
  /** @type {NodeList} une collection avec les trois boutons pour ouvrir fermer les trois listes déroulantes */
  const toggleButtons = document.querySelectorAll(".filters__dropdown__toggle");

  // Parcourir les trois boutons toggle
  toggleButtons.forEach((elm) => {
    /** @type {string} l'attribut data-type de ce bouton toggle contient le nom du type des éléments à rechercher */
    const filterType = elm.dataset.type;
    /** @type {string} l'identifiant d'une custom liste déroulante correspondant à ce bouton toggle actuellement lu */
    const idDropbox = `${filterType}-dropdown`;

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

  // Cliquer en dehors d'une custom dropdown ferme toute les listes ouvertes
  window.addEventListener("click", (event) => {
    // Si on a pas cliquer dans les listes déroulantes et leurs contenus mais
    if (!event.target.matches([".filters__dropdown", ".filters__dropdown *"])) {
      // ailleurs alors fermer toutes les listes
      closeAllDropdowns();
    }
  });
}

/**
 * Assembler dans une liste html ul les éléments stockés
 * dauns une collection Set pour les ingrédients, les ustensiles
 * et pour l'électroménager
 *
 * @param {HTMLElement} aList une liste html ul
 * @param {Set} someItems une collection d'ingrédients, d'ustensiles ou de l'électroménager
 * @param {Array<Object>} excludes une liste de filtres obtenue à partir des tag sélectionnés
 */
export function displayListItem(aList, someItems, excludes) {
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
      listItem.addEventListener("click", (event) => clickListItem(event));
      // Ajouter l'élément à la liste concernée
      aList.appendChild(listItem);
      // Raz
      item = null;
    });
  }
}

/**
 * A partir d'une collection de recettes
 * déterminer tous ses ingrédients uniques, ses ustensiles uniques
 * et l'électroménager unique
 *
 * @param {Array<Recipe>} recipes un tableau de recettes
 * @returns {Set} ingredients la collection d'ingredients uniques des recettes filtrées
 * @returns {Set} ustensils la collection d'ustensiles unsiques des recettes filtrées
 * @returns {Set} appliances une collection d'électroménager uniques des recettes filtrées
 */
export const getAnyTags = (recipes) => {
  /** @type {Set} la liste des ingrédients uniques */
  let ingredients = new Set();
  /** @type {Set} la liste des ustensiles uniques */
  let ustensils = new Set();
  /** @type {Set} la liste des appareils électroménager uniques */
  let appliances = new Set();

  // Si il n'y a pas de recettes renvoyer des Set vides d'ingredients, ustensiles, électroménager
  if (recipes.length > 0) {
    /** @type{Array<string>} tous les ingredients détectés dans cette collection de recettes */
    const i = recipes
      .map(function (item) {
        // item.ingredients est une structure Map
        return Array.from(item.ingredients.values()).map(function (item) {
          // dont les valeurs
          return item.ingredient; // sont des objets de la classe Ingredient avec
        }); // une propriété nommée .ingredient qui stocke le nom de l'ingrédient
      })
      .reduce(function (a, b) {
        return a.concat(b);
      });
    ingredients = new Set(i);

    /** @type{Array<string>} tous les ustensiles détectés dans cette collection de recettes */
    const u = recipes
      .map(function (item) {
        return Array.from(item.ustensils.values());
      })
      .reduce(function (a, b) {
        return a.concat(b);
      });
    ustensils = new Set(u);

    /** @type {Set} la liste des appareils électroménager uniques */
    appliances = new Set(recipes.map((r) => r.appliance));
  }

  return { ingredients, ustensils, appliances };
};

/**
 * Obtenir un tableau d'objets pour créer les filtres
 * à partir des tags affichés depuis leurs HTMLSpanElements
 * bleu, rouge ou vert
 *
 * @returns {Array<Object>} la liste des tags séléctionnés pour filtrer
 */
export const getFilters = () => {
  /** @type {Array<Object>} la liste des tags séléctionnés pour filtrer */
  let filters = [];

  /** @type {HTMLDivElement} le conteneur html des étiquettes de filtre */
  const parent = document.getElementById("tags");

  /** @type {NodeList} la collection des HTMLSpanElements affichés contenant les tags */
  const allTags = parent.querySelectorAll("#tags span.tags__tag");

  // Lancer le filtre par les tags si il y a des tags affichés
  if (allTags.length > 0) {
    // Créer un tableau d'objets pour le filtre des tags à partir des HTMLSpanElements
    allTags.forEach(function (currentValue) {
      filters = [
        ...filters,
        { list: currentValue.dataset.type, item: currentValue.textContent },
      ];
    });
  }

  return filters;
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
 * Cliquer sur un item dans une des listes ingredients, ustensiles
 * ou électroménager ajouter un tag bleu, rouge ou vert dans la zone
 * des filtres d'étiquettes
 * et lance le filtre des recettes par les tags
 *
 * @param {Event} event un évènement click sur un list-item bleu, rouge, vert
 */
function clickListItem(event) {
  /** @type {string} le type du filtre cliqué */
  const filterType = event.currentTarget.dataset.type;
  /** @type {string} le texte de l'élément cliqué  */
  const tagText = event.currentTarget.textContent;

  console.log(`Click ! ${filterType}: ${tagText}`);

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

  // Ajouter l'évènement pour faire disparaitre l'étiquette avec ss croix
  aTag.addEventListener("click", (event) => closeTag(event));

  // Ajouter ce tag pour l'afficher sur la ligne des tags
  parent.appendChild(aTag);

  /** @type {string} l'identifiant du champ de saisi pour la recherche d'un ingrédient, d'un ustensile ou d'un appareil */
  const idSearch = `${filterType}-search`;
  /** @type {HTMLFormElement} le champ de saisi */
  const input = document.getElementById(idSearch);
  // Remise à blanc de la zone de saisie après l'ajout du tag dans la zone des filtres d'étiquettes
  input.value = "";

  // Filtrer les recettes à partir des tags sélectionnés et affichés
  filterBySearchAndTags();
}

/**
 * Fermer une étiquette
 *
 * @param {Event} event un évènement click sur la croix d'une étiquette
 */
function closeTag(event) {
  /** @type {HTMLDivElement} le conteneur html des étiquettes de filtre */
  const parent = document.getElementById("tags");
  /** @type {HTMLSpanElement} l'étiquette cliquée  */
  const tag = event.currentTarget;
  // faire disparaitre l'étiquette
  parent.removeChild(tag);

  // Filtrer les recettes à partir des tags sélectionnés et affichés
  filterBySearchAndTags();
}

/**
 * Trier une collection de type Set sur place
 * et la renvoyer après un tri ascendant
 * tenant compte des accents
 *
 * @param {Set} set une structure à trier
 * @returns {Set} Structure triée
 */
function sortSet(set) {
  const entries = [];
  for (const member of set) {
    entries.push(member);
  }
  set.clear();
  entries.sort(function (a, b) {
    return a.localeCompare(b);
  });
  for (const entry of entries) {
    set.add(entry);
  }
  return set;
}
