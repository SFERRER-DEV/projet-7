// Importer les fonctions pour travailler avec les chaines de caractères en étendant la class String
import "./../util/string.js";
// Importer le singleton API
import singletonRecipesApi from "./../api/recipesApi.js";
// Importer la fonction pour préparer l'expression rationnelle avec un motif de recherche
import { getRegExp } from "./../util/regex.js";

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

  /** @type {number} le nombre de recettes connues */
  let i = allRecipes.length;

  // Parcourir toutes les recettes
  while (i > 0) {
    // Chercher dans le nom de la recette
    if (regex.test(allRecipes[allRecipes.length - i].name.removeDiacritics())) {
      // Cette recette correspond à la recherche
      someRecipes.push(allRecipes[allRecipes.length - i]);
      i--;
      continue;
    } else {
      // Chercher dans la description de la recette
      if (
        regex.test(
          allRecipes[allRecipes.length - i].description.removeDiacritics()
        )
      ) {
        // Cette recette correspond à la recherche
        someRecipes.push(allRecipes[allRecipes.length - i]);
        i--;
        continue;
      } else {
        // Parcourir tous les ingrédients stockés dans une structure Map de la recette lue
        // les valeurs de la Map sont des objets du type Ingredient
        for (let v of allRecipes[allRecipes.length - i].ingredients.values()) {
          // Chercher dans le nom d'un ingredient
          if (regex.test(v.ingredient.removeDiacritics())) {
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
