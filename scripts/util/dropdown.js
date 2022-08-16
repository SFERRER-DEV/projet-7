// Importer les fonctions utilitaires pour créer des éléments du DOM
import * as Dom from "./../util/dom.js";
/**
 * Assembler dans une liste hmtl ul les éléments stockés
 * dauns une collection Set pour les ingrédients, les ustensiles
 * et pour l'électroménager
 *
 * @param {HTMLElement} aList une liste html ul
 * @param {Set} someItems une collection d'ingrédients, d'ustensiles ou de l'électroménager
 */
export function displayListItem(aList, someItems) {
  /** @type {HTMLElement} un élément li contenant un ingrédient */
  let listItem;
  /** @type {Node} le texte de l'ingrédient */
  let text;

  // Supprimer tous les items li existants
  aList.replaceChildren();

  // Trier sur place par ordre ascendant la liste des items
  sortSet(someItems);
  // Parcourir les items ...
  someItems.forEach((item) => {
    listItem = document.createElement("li");
    // Créer le noeud avec le texte de l'items
    text = document.createTextNode(`${Dom.capitalizeFirstLetter(item)}`);
    // Ajouter le texte à l'élément de liste
    listItem.appendChild(text);
    // Ce data attribut permet de marquer l'item pour identifier son type
    listItem.setAttribute("data-type", aList.dataset.type);
    listItem.addEventListener("click", (event) => clickListItem(event));
    // Ajouter l'élément à la liste concernée
    aList.appendChild(listItem);
    // Raz
    item = null;
    text = null;
  });
}

/**
 * Cliquer sur un mot clé dans une des listes
 *
 * @param {Event} event un évènement click sur un list-item bleu, rouge, vert
 */
function clickListItem(event) {
  /** @type {string} le type du filtre cliqué */
  const filterType = event.currentTarget.dataset.type;
  /** @type {string} le texte de l'élément cliqué  */
  const tagText = event.currentTarget.textContent;
  console.log(`Click ! ${filterType}: ${tagText}`);

  /** @type {HTMLDivElement} le conteneur html des étiquettes de filtre */
  const parent = document.getElementById("tags");

  /** @type {HTMLSpanElement} un tag bleu, vert ou rouge */
  const aTag = Dom.getSpan(
    ["tags__tag", "px-2", "py-1", "m-1", "my-2", "rounded"],
    `${tagText}`
  );
  aTag.setAttribute("data-type", filterType);

  /** @type {HTMLElement} - balise pour contenir l'icone croix pour fermer ce tag*/
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

  // Ajouter cette html card fabriquée pour l'afficher dans la page
  parent.appendChild(aTag);
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

/**
 * A partir d'une collection de recettes
 * déterminer tous ses ingrédients uniques, ses ustensiles unqiue
 * et l'électroménager unique détetectés
 *
 * @param {Array<Recipe>} recipes un tableau de recettes filtrées
 * @returns {Set} ingredients la collection d'ingredients uniques des recettes filtrées
 * @returns {Set} ustensils la collection d'ustensiles unsiques des recettes filtrées
 * @returns {Set} appliances une collection d'électroménager uniques des recettes filtrées
 */
export const getAnyTags = (recipes) => {
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
  /** @type {Set} la liste des ingrédients uniques */
  const ingredients = new Set(i);

  /** @type{Array<string>} tous les ustensiles détectés dans cette collection de recettes */
  const u = recipes
    .map(function (item) {
      return Array.from(item.ustensils.values());
    })
    .reduce(function (a, b) {
      return a.concat(b);
    });
  /** @type {Set} la liste des ustensiles uniques */
  const ustensils = new Set(u);

  /** @type {Set} la liste des appareils électroménager uniques */
  const appliances = new Set(recipes.map((r) => r.appliance));

  return { ingredients, ustensils, appliances };
};
