// Importer le singleton API et sa classe
import singletonRecipesApi, { RecipesApi } from "./../api/recipesApi.js";
/**
 * Algorithme 1 : Recherche globale des recettes
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
  console.log(`=== Recherche globale avec: "${needle}" ===`);

  /** @type {Array<Recipe>} un tableau avec toutes les recettes connues */
  const allRecipes = singletonRecipesApi.getDataRecipes();

  /** @type {Array<Recipe>} un tableau de recettes qui sont filtrées par la recherche */
  let someRecipes = [];

  /** @type {Object} recherche motif de mot complet en ignorant la casse des lettres */
  const regex = new RegExp(`\\b${needle}`, "i"); // La recherche s'arrête dés l'élément trouvé

  // Obtenir le tableau des recettes filtrées à partir de toutes les recettes
  someRecipes = allRecipes.filter(function (item) {
    // La recherche globale utilise le nom et la description de la recette
    // et le nom de tous ses ingrédients.
    return (
      regex.test(item.name) ||
      regex.test(item.description) ||
      // Applatir le nom des ingrédients d'une recette
      regex.test(Array.from(item.ingredients.values()).toString())
    );
  });

  // Renvoyer les recettes filtrées
  return someRecipes;
}
