/**
 * Rechercher un tag sélectionné dans l'électroménager
 *
 * @param {string} needle le texte complet du tag à rechercher
 * @param {Array<Recipe>} recipes - une liste de recettes
 *
 * @returns Array<Recipe> la liste des objets recettes trouvés
 */
export function findByAppliance(needle, recipes) {
  console.log(`findByAppliance: ${needle}`);

  /** @type {Array<Recipe>} un tableau de recettes qui sont filtrées par la recherche */
  let someRecipes = [];

  /** @type {Object} recherche motif de mot complet en ignorant la casse des lettres */
  const regex = new RegExp(`\\b${needle}`, "i"); // La recherche s'arrête dés l'élément trouvé

  // Obtenir le tableau des recettes filtrées
  someRecipes = recipes.filter(function (item) {
    // La rechercher l'électroménger
    return regex.test(item.appliance);
  });

  // Renvoyer les recettes filtrées
  return someRecipes;
}

export function findByIngredient(needle, recipes) {
  console.log(`findByIngredient: ${needle}`);
}

export function findByUstensil(needle, recipes) {
  console.log(`findByUstensil: ${needle}`);
}
