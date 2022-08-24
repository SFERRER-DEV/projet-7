// Le fichier js contenant un array JavaScript de recettes
import { recipes } from "../../data/recipes.js";
// Le type d'objet Recipe
import Recipe from "../models/recipe.js";

/** @type {RecipesApi} - une instance unique de la classe singleton RecipesApi */
let instance;

/**
 *  Classe pour obtenir les données des recettes
 *  - Soit en faisant appel à l'API pour chercher les médias dans le fichier JSON
 *  - Soit en cherchant les données dans un tableau en mémoire renséigné un première lors de l'instanciation de ce singleton
 */
export class RecipesApi {
  /**
   * Créer un singleton pour obtenir des données de type Recipes
   */
  constructor() {
    /** @type {Array<Recipe>} une liste d'objets de type Recipe */
    this._data = [];
    /** @type {number} le nombre de recettes contenues */
    this._count = 0;

    if (instance) {
      throw new Error("You can only create one instance of RecipeApi class !");
    }
    instance = this;

    console.log(`${Date.now()} - Instanciation singleton RecipesApi`);
  }

  /**
   *
   * @returns
   */
  getInstance() {
    return this;
  }

  /**
   * Renseigner les datas
   * Remplir le tableau en mémoire avec une liste d'objets de type Recipe
   *
   * @param {Object} data - les données au format JSON
   */
  setDataRecipes(data) {
    // Parcourir tous les objets JSON
    data.forEach((obj) => {
      /** @type {Recipe} Un objet de type Recette instancié à partir des données JSON */
      let rec = Recipe.createRecipe(obj);
      // Ajouter un objet de type Recipe au tableau
      this._data.push(rec);
      // Incrémenter le compteur de recettes
      this._count++;
    });
  }

  /**
   * Obtenir tous les objets de type Recipe stockés dans le tableau en mémoire
   * Ce tableau est rempli lors de l'instanciation du Singleton
   *
   * @returns {Array<Recipe>} la liste de toutes les recettes
   */
  getDataRecipes() {
    console.log(`>>> Demander les ${this._data.length} recettes connues`);
    return this._data;
  }

  /**
   *  Faire appel à l'API pour obtenir
   *  la liste des recettes au format JSON
   *  depuis le tableau js stocké dans le fichier js
   *
   * @returns {Object} une liste d'objets JSON
   */
  _getAllRecipesJson() {
    /** @type {Object} toutes les recettes converties en json */
    let jsonRecipes;

    // Convertir le tableau JavaScript en notation Objet JSON
    jsonRecipes = JSON.parse(JSON.stringify(recipes));

    return jsonRecipes;
  }

  /**
   * @property {number} le nombre de recettes contenues
   */
  get Count() {
    return this._count;
  }
}

/** @type {RecipesApi} - l'objet unique RecipesApi */
const singletonRecipesApi = new RecipesApi();

// Crée le tableau en mémoire dans ce singleton avec toutes les recettes contenues dans le fichier javascript
singletonRecipesApi.setDataRecipes(singletonRecipesApi._getAllRecipesJson());
// Geler ce singleton
Object.freeze(singletonRecipesApi);

// Afficher le nombre d'ingredients, d'ustensiles et d'électroménager mémorisés dans les variables statiques
// des objets recette de la classe Recipe
console.log(`Recettes trouvées: ${singletonRecipesApi.Count}`);
console.log(`Ingrédients trouvés: ${Recipe.allIngredients.size}`);
console.log(`Ustensiles trouvés: ${Recipe.allUstensils.size}`);
console.log(`Electoménager trouvé: ${Recipe.allAppliances.size}`);

export default singletonRecipesApi;
