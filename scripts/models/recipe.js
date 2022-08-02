import Ingredient from "./ingredient.js";

export default class Recipe {
  /**
   * @param {number} id identifiant de la recette
   * @param {string} name le nom de la recette
   * @param {number} servings nombre de portions
   * @param {number} time temps de réalisation
   * @param {string} description instruction de réalisation
   * @param {string} appliance appareil électroménager
   */

  constructor(id, name, servings, time, description, appliance = "") {
    /** @type {number} _id identifiant de la recette */
    this._id = id;
    /** @type {string} _name nom de la recette */
    this._name = name;
    /** @type {number} _servings nombre de portions */
    this._servings = servings;
    /** @type {number} _time temps de préparation  */
    this._time = time;
    /** @type {string} _description instruction pour réaliser la recette */
    this._description = description;
    /** @type {string} _appliance un appareil électroménager */
    this._appliance = appliance;

    /** @type {Set} _ingredients un ensemble d'ingredients uniques*/
    this._ingredients = new Map();

    /** @type {Set} _ustensils un ensemble d'ustensiles uniques */
    this._ustensils = new Set();
  }

  /**
   * @property {number} id identifiant de la recette
   */
  get id() {
    return this._id;
  }

  /**
   * @property {string} name nom de la recette
   */
  get name() {
    return this._name;
  }

  /**
   * @property {number} servings nombre de portions
   */
  get servings() {
    return this._servings;
  }

  /**
   * @property {number} time temps de réalisation
   */
  get time() {
    return this._time;
  }

  /**
   * @property {string} description instructions pour réaliser la recette
   */
  get description() {
    return this._description;
  }

  /**
   * @property {string} appliance appareil électroménager nécessaire
   */
  get appliance() {
    return this._appliance;
  }

  /**
   * @property {Array<Ingredient>} ingredients la collection de tous les ingrédients de la recette
   */
  get ingredients() {
    return this._ingredients;
  }

  /**
   * @property {Set} ustensils la collection de tous les ustensiles nécessaires
   */
  get ustensils() {
    return this._ustensils;
  }

  /**
   *
   * @returns {string} chaine de caractères
   */
  toString() {
    return `${this._id}-${this._name} (${this._ingredients.size} ingredients, ${this._ustensils.size} ustensils) ${this._appliance}`;
  }

  /**
   * Ajouter un ingrédient à la recette
   *
   * @param {Ingredient} ing un ingrédient de la recette
   */
  addIngredient(ing) {
    this._ingredients.set(ing.ingredient, ing);
  }

  /**
   * Ajouter un ustensile nécessaire
   *
   * @param {string} ust un ustensil unique utile pour la recette
   */
  addUstensil(ust) {
    this._ustensils.add(ust);
  }

  /**
   * Méthode statique pour instancier une recette à partir d'un
   * objet JSON.
   *
   * @param {Object} obj données au format JSON
   * @returns {Recipe} rec un objet recette typé Recipe
   */
  static createRecipe(obj) {
    /** @type {Recipe} Un objet recette typé Recipe instancier à partir des données json */
    let rec = new Recipe(
      obj.id,
      obj.name,
      obj.servings,
      obj.time,
      obj.description,
      obj.appliance
    );

    /** @type {Ingredient} Un objet ingrédient typé Ingredient instancier à partir des données json */
    let ing;
    // Parcourir tous les ingrédients contenus dans l'objet JSON
    obj.ingredients.forEach(function (data) {
      // Instancier l'objet ingrédient à partir des données lues
      ing = Ingredient.createIngredient(data);
      // Ajouter l'ingrédient dans la collections des ingrédients de la recette
      rec.addIngredient(ing);
      ing = null;
    });

    // Parcourir tous les ustensiles contenus dans l'objet JSON
    obj.ustensils.forEach(function (item) {
      rec.addUstensil(item);
    });

    return rec;
  }
}
