// Importer les fonctions pour travailler avec les chaines de caractères en étendant la class String
import "./../util/string.js";
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
 * @param {Array<Recipe>} recipes une liste de recettes
 *
 * @returns Array<Recipe> la liste des objets recettes trouvés
 */
export function findRecipes(str, recipes) {
  /** @type {string} les signes diacritiques sont remplacés dabs la chaine à rechercher */
  const needle = str.removeDiacritics();
  console.log(`    findRecipes: ${needle}`);

  /** @type {Array<Recipe>} un tableau de recettes qui sont filtrées par la recherche */
  let someRecipes = [];

  /** @type {Object} recherche correspondance */
  const regex = getRegExp(needle);

  // Obtenir le tableau des recettes filtrées à partir de toutes les recettes
  someRecipes = recipes.filter(function (item) {
    // La recherche globale utilise le nom et la description de la recette
    // et le nom de tous ses ingrédients.
    return (
      regex.test(item.name.removeDiacritics()) ||
      regex.test(item.description.removeDiacritics()) ||
      // Aplatir le nom des ingrédients d'une recette
      regex.test(
        Array.from(item.ingredients.values()).toString().removeDiacritics()
      )
    );
  });

  // Imprimer le nombre de recettes filtrées
  console.log(`    ${recipes.length} => ${someRecipes.length} recettes`);

  // Renvoyer les recettes filtrées
  return someRecipes;
}
