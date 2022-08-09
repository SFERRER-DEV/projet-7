import Ingredient from "./ingredient.js";

export default class Recipe {
  /** @type {Set} tous les ingredients de toutes les recettes*/
  static _AllIngredients = new Set();
  /** @type {Set} tous les ustensiles nécessaires */
  static _AllUstensils = new Set();
  /** @type {Set} tout l'éléctroménager connus */
  static _AllAppliances = new Set();
  /**
   * @param {number} id identifiant de la recette
   * @param {string} name le nom de la recette
   * @param {number} servings nombre de portions
   * @param {number} time temps de réalisation
   * @param {string} description instruction de réalisation
   * @param {string} appliance appareil électroménager
   */
  constructor(id, name, servings, time, description, appliance = "") {
    /** @type {number} identifiant de la recette */
    this._id = id;
    /** @type {string} nom de la recette */
    this._name = name;
    /** @type {number} nombre de portions */
    this._servings = servings;
    /** @type {number} temps de préparation  */
    this._time = time;
    /** @type {string} instruction pour réaliser la recette */
    this._description = description;
    /** @type {string} un appareil électroménager */
    this._appliance = appliance;
    // Ajouter l'électroménager à la collection statique de tout l'électroménager connu
    Recipe._AllAppliances.add(appliance.toLowerCase());
    /** @type {Set} un ensemble d'ingredients uniques*/
    this._ingredients = new Map();
    /** @type {Set} un ensemble d'ustensiles uniques */
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
   * @property {string} appliance un appareil électroménager nécessaire pour la recette
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
   * @property {Set} ustensils la collection de tous les ustensiles nécessaires pour la recette
   */
  get ustensils() {
    return this._ustensils;
  }

  /**
   * @property {Set} allIngredients la collection de tous les ingredients connus dans toutes les recettes
   */
  static get allIngredients() {
    return Recipe._AllIngredients;
  }

  /**
   * @property {Set} allUstensils la collection de tous les ustensiles connus pour toutes les recettes
   */
  static get allUstensils() {
    return Recipe._AllUstensils;
  }

  /**
   * @property {Set} allAppliances la collection de tout l'électroménager existant
   */
  static get allAppliances() {
    return Recipe._AllAppliances;
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
   * et aussi à sa collection statique
   *
   * @param {Ingredient} ing un ingrédient de la recette
   */
  addIngredient(ing) {
    this._ingredients.set(ing.ingredient, ing);
    // Ajouter le nom de l'ingrédient dans la liste de tous les ingredients uniques de toutes les recettes
    Recipe._AllIngredients.add(ing.ingredient.toLowerCase());
  }

  /**
   * Ajouter un ustensile nécessaire à la recette
   * et aussi à sa collection statique
   *
   * @param {string} ust un ustensile unique utile pour la recette
   */
  addUstensil(ust) {
    this._ustensils.add(ust);
    // Ajouter aussi le nom de l'ustensile dans la liste de tous les ustensiles uniques connus
    Recipe._AllUstensils.add(ust);
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
      // Ajouter l'objet Ingredient dans la collection des ingrédients de la recette
      rec.addIngredient(ing);
      ing = null;
    });

    // Parcourir tous les ustensiles contenus dans l'objet JSON
    obj.ustensils.forEach(function (item) {
      // Ajouter le nom de l'ustensile dans la collection des ustensiles de la recette
      rec.addUstensil(item);
      // Ajouter le nom de l'ustensile dans la liste de tous les ustensile uniques
      Recipe._AllUstensils.add(item);
    });

    return rec;
  }
}
