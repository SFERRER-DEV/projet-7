// Importer le singleton API
import singletonRecipesApi from "./../api/recipesApi.js";
// Importer la fonction pour préparer l'expression rationnelle avec un motif de recherche
import { getRegExp } from "./../util/regex.js";
/**
 * Algorithme 1 : Recherche globale des recettes
 *
 * Trouver un texte dans :
 * - le titre
 * - la description
 * - les ingrédients
 *
 * @param {string} str le texte à rechercher
 *
 * @returns Array<Recipe> la liste des objets recettes trouvés
 */
export function findRecipes(str) {
  /** @type {string} les signes diacritiques sont remplacés dabs la chaine à rechercher */
  const needle = str.removeDiacritics();
  console.log(`findRecipes: ${needle}`);

  /** @type {Array<Recipe>} un tableau avec toutes les recettes connues */
  const allRecipes = singletonRecipesApi.getDataRecipes();

  /** @type {Array<Recipe>} un tableau de recettes qui sont filtrées par la recherche */
  let someRecipes = [];

  /** @type {Object} recherche correspondance */
  const regex = getRegExp(needle);

  // Obtenir le tableau des recettes filtrées à partir de toutes les recettes
  someRecipes = allRecipes.filter(function (item) {
    // La recherche globale utilise le nom et la description de la recette
    // et le nom de tous ses ingrédients.
    return (
      regex.test(item.name.removeDiacritics()) ||
      regex.test(item.description.removeDiacritics()) ||
      // Applatir le nom des ingrédients d'une recette
      regex.test(
        Array.from(item.ingredients.values()).toString().removeDiacritics()
      )
    );
  });

  // Renvoyer les recettes filtrées
  return someRecipes;
}
