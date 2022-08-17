// Importer la fonction pour préparer l'expression rationnelle avec un motif de recherche
import { getRegExp } from "./../util/regex.js";

/**
 * Rechercher une étiquette d'électroménager
 * Correspondance de mot complet et
 * en remplaçant tous les signes diacritiques
 * dans la recherche des étiquettes
 *
 * @param {string} str le texte complet du tag à rechercher
 * @param {Array<Recipe>} recipes - une liste de recettes
 *
 * @returns Array<Recipe> la liste des objets recettes trouvés
 */
export function findByAppliance(str, recipes) {
  /** @type {string} les signes diacritiques sont remplacés dans la chaine à rechercher */
  const needle = str.removeDiacritics();
  console.log(`findByAppliance: ${needle}`);

  /** @type {Array<Recipe>} un tableau de recettes qui sont filtrées par la recherche */
  let someRecipes = [];

  /** @type {Object} recherche par correspodance complète */
  const regex = getRegExp(needle, true);

  // Obtenir le tableau des recettes filtrées
  someRecipes = recipes.filter(function (item) {
    // les signes diacritiques sont remplacés dans l'électroménager des recettes
    return regex.test(item.appliance.removeDiacritics());
  });

  // Renvoyer les recettes filtrées
  return someRecipes;
}

/**
 * Rechercher une étiquette d'ingrédient
 * Correspondance de mot complet et
 * en remplaçant tous les signes diacritiques
 * dans la recherche des étiquettes
 *
 * @param {string} str le texte complet du tag à rechercher
 * @param {Array<Recipe>} recipes - une liste de recettes
 *
 * @returns Array<Recipe> la liste des objets recettes trouvés
 */
export function findByIngredient(str, recipes) {
  /** @type {string} les signes diacritiques sont remplacés dans la chaine à rechercher */
  const needle = str.removeDiacritics();
  console.log(`findByIngredient: ${needle}`);
  /** @type {Array<Recipe>} un tableau de recettes qui sont filtrées par la recherche */
  let someRecipes = [];

  /** @type {Object} recherche par correspodance complète */
  const regex = getRegExp(needle, true);

  // Obtenir le tableau des recettes filtrées
  someRecipes = recipes.filter(function (item) {
    /** @type {string} applatir la structure Set contenant les ingrédients */
    const flatten = Array.from(item.ingredients.values()).toString();
    // les signes diacritiques sont remplacés dans les ingrédients des recettes
    return regex.test(flatten.removeDiacritics());
  });

  // Renvoyer les recettes filtrées
  return someRecipes;
}

/**
 * Rechercher une étiquette d'ustensile
 * Correspondance de mot complet et
 * en remplaçant tous les signes diacritiques
 * dans la recherche des étiquettes
 *
 * @param {string} str le texte complet du tag à rechercher
 * @param {Array<Recipe>} recipes - une liste de recettes
 *
 * @returns Array<Recipe> la liste des objets recettes trouvés
 */
export function findByUstensil(str, recipes) {
  /** @type {string} les signes diacritiques sont remplacés dans la chaine à rechercher */
  const needle = str.removeDiacritics();
  console.log(`findByUstensil: ${needle}`);
  /** @type {Array<Recipe>} un tableau de recettes qui sont filtrées par la recherche */
  let someRecipes = [];

  /** @type {Object} recherche par correspodance complète */
  const regex = getRegExp(needle, true);

  // Obtenir le tableau des recettes filtrées
  someRecipes = recipes.filter(function (item) {
    /** @type {string} applatir la structure Set contenant les ustensiles */
    const flatten = Array.from(item.ustensils.values()).toString();
    // les signes diacritiques sont remplacés dans les ustensiles des recettes
    return regex.test(flatten.removeDiacritics());
  });

  // Renvoyer les recettes filtrées
  return someRecipes;
}
