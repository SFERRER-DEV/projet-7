// Importer le singleton API et sa classe
import singletonRecipesApi, { RecipesApi } from "./../api/recipesApi.js";
/**
 * Algorithme 2 : Recherche globale des recettes
 *
 * Trouver un texte dans :
 * - le titre
 * - la description
 * - les ingrédients
 *
 * @param {string} needle le texte à rechercher fait au minimum 3 caractères
 *
 * @returns Array<Recipe> la liste des objets recettes trouvés
 */
export function findRecipes(needle) {
  /** @type {Array<Recipe>} un tableau de recettes qui sont filtrées par la recherche */
  let someRecipes = [];

  // Renvoyer les recettes filtrées
  return someRecipes;
}
