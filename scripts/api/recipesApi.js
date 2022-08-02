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
    /** @type {Recipe[]} une liste d'objets de type Recipe */
    this._data = [];

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
    data.forEach((obj) => {
      /** @type {Recipe} Un objet de type Recette instancié à partir des données json*/
      let rec = Recipe.createRecipe(obj);
      // Ajouter un objet de type Recipe au tableau
      this._data.push(rec);
    });
  }

  /**
   * Obtenir tous les objets de type Recipe stockés dans le tableau en mémoire
   * Ce tableau est rempli lors de l'instanciation du Singleton
   *
   * @returns {Array<Recipe>} la liste de toutes les recettes
   */
  getDataRecipes() {
    return this._data;
  }

  /**
   *  Faire appel à l'API pour obtenir
   *  la liste des recettes au format JSON
   *  depuis le tableau js stocké dans le fichier js
   *
   * @returns {Object} une liste d'objets JSON
   */
  _getAllRecipes() {
    /** @type {Object} toutes les recettes converties en json */
    let jsonRecipes;

    // Convertir le tableau JavaScript en notation Objet JSON
    jsonRecipes = JSON.parse(JSON.stringify(recipes));

    return jsonRecipes;
  }
}

/** @type {RecipesApi} - l'objet unique RecipesApi */
const singletonRecipesApi = new RecipesApi();

// Renseigner le tableau en mémoire dans ce singleton avec toutes les recettes du fichier javascript des recettes
singletonRecipesApi.setDataRecipes(singletonRecipesApi._getAllRecipes());
// Geler ce singleton
Object.freeze(singletonRecipesApi);

export default singletonRecipesApi;
