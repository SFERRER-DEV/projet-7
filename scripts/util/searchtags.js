// Importer les fonctions pour travailler avec les chaines de caractères en étendant la class String
import "./../util/string.js";
// Importer la fonction pour préparer l'expression rationnelle avec un motif de recherche
import { getRegExp } from "./../util/regex.js";
/**
 * Rechercher une étiquette d'électroménager
 * ou rechercher une étiquette d'ustensile
 * our echercher une étiquette d'ingrédient
 * par correspondance de mot complet et
 * en remplaçant tous les signes diacritiques
 * dans la recherche des étiquettes
 *
 * @param {string} str le texte complet du tag à rechercher
 * @param {Array<Recipe>} recipes une liste de recettes
 * @param {string} typeFiltre le type de filtres de recherche (appliances, ingredients, ustensils)
 *
 * @returns Array<Recipe> la liste des objets recettes trouvés
 */
export function findBy(str, recipes, typeFiltre) {
  /** @type {string} les signes diacritiques sont remplacés dans la chaine à rechercher */
  const needle = str.removeDiacritics();

  console.log(`    findBy ${typeFiltre}: ${needle}`);

  /** @type {Array<Recipe>} un tableau de recettes qui sont filtrées par la recherche */
  let someRecipes = [];

  /** @type {Object} recherche par correspodance complète */
  const regex = getRegExp(needle, true);

  if (typeFiltre === "appliances") {
    // Obtenir le tableau des recettes filtrées
    someRecipes = recipes.filter(function (item) {
      // les signes diacritiques sont remplacés dans l'électroménager
      return regex.test(item.appliance.removeDiacritics());
    });
  } else {
    // Obtenir le tableau des recettes filtrées
    someRecipes = recipes.filter(function (item) {
      /** @type {string} applatir une structure Set */
      let flatten;
      if (typeFiltre === "ingredients") {
        // applatir la structure Set contenant les ingrédients
        flatten = Array.from(item.ingredients.values()).toString();
      } else if (typeFiltre === "ustensils") {
        // applatir la structure Set contenant les ustensiles */
        flatten = Array.from(item.ustensils.values()).toString();
      }
      // les signes diacritiques sont remplacés
      return regex.test(flatten.removeDiacritics());
    });
  }

  // Imprimer le nombre de recettes filtrées
  console.log(`    ${recipes.length} => ${someRecipes.length} recettes`);

  // Renvoyer les recettes filtrées
  return someRecipes;
}
