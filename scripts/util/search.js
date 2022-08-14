// Importer le singleton API et sa classe
import singletonRecipesApi, { RecipesApi } from "./../api/recipesApi.js";
/**
 * Recherche globale de recettes
 *
 * Trouver un texte dans :
 * - le titre
 * - la description
 * - les ingrédients
 *
 * @param {Event} event
 * @param {string} needle le texte à rechercher
 *
 * @returns Array<Recipe> la liste des objets recette trouvés
 */
export function findRecipes(needle) {
  /** @type {Array<Recipe>} un tableau de recettes qui sont filtrées par la recherche */
  let someRecipes = [];

  // Renvoyer les recettes filtrées
  return someRecipes;
}
