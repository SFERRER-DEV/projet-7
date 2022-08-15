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
  /** @type {Array<Recipe>} un tableau avec toutes les recettes connues */
  const allRecipes = singletonRecipesApi.getDataRecipes();

  /** @type {Array<Recipe>} un tableau de recettes qui sont filtrées par la recherche */
  let someRecipes = [];

  const regex = new RegExp(`\\b${needle}`, "i");

  /** @type {number} le nombre de recettes connues */
  let i = allRecipes.length;

  // Parcourir toutes les recettes
  while (i > 0) {
    // Chercher dans le nom de la recette
    if (regex.test(allRecipes[allRecipes.length - i].name)) {
      // Cette recette correspond à la recherche
      someRecipes.push(allRecipes[allRecipes.length - i]);
      i--;
      continue;
    } else {
      // Chercher dans la description de la recette
      if (regex.test(allRecipes[allRecipes.length - i].description)) {
        // Cette recette correspond à la recherche
        someRecipes.push(allRecipes[allRecipes.length - i]);
        i--;
        continue;
      } else {
        // Parcourir tous les ingrédients stockés dans une structure Map de la recette lue
        /** @type {Ingredient} les valeurs de la Map sont des objets du type Ingredient */
        let v;
        for (v of allRecipes[allRecipes.length - i].ingredients.values()) {
          // Chercher dans le nom d'un ingredient
          if (regex.test(v.ingredient)) {
            // Cette recette correspond à la recherche
            someRecipes.push(allRecipes[allRecipes.length - i]);
            break;
          }
        }
      }
    }
    i--;
  }

  // Renvoyer les recettes filtrées
  return someRecipes;
}
