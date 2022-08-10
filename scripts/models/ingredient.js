export default class Ingredient {
  /**
   * @param {string} ingredient nom de l'ingrédient
   * @param {number} quantity quantité d'unité de l'ingrédient
   * @param {string} unit unité de l'ingrédient
   */
  constructor(ingredient, quantity = 0, unit = "") {
    /** @type {string} _ingredient nom de l'ingrédient */
    this._ingredient = ingredient;
    /** @type {number} _quantity quantité d'unité d'ingrédient */
    this._quantity = quantity;
    /** @type {string} _unit unité de l'ingrédient  */
    this._unit = unit;
  }

  /**
   * @property {string} ingredient nom de l'ingrédient
   */
  get ingredient() {
    return this._ingredient;
  }

  /**
   * @property {string} quantity quantité d'unité d'ingrédient
   */
  get quantity() {
    return this._quantity;
  }

  /**
   * @property {number} unit unité de l'ingrédient
   */
  get unit() {
    return this._unit;
  }

  /**
   *
   * @returns {string} chaine de caractères
   */
  toString() {
    return `${this._ingredient}`;
  }

  /**
   * Méthode statique pour instancier une recette à partir d'un
   * objet JSON.
   *
   * @param {Object} obj données au format JSON
   * @returns {Ingredient} ing un objet typé Ingredient
   */
  static createIngredient(obj) {
    /** @type {number} quantité d'ingrédient, cette donnée n'est pas toujours présente dans le fichier */
    let quantity = 0;
    /** @type {string} unité de la quantité d'ingrédient, cette donnée n'est pas toujours présente dans le fichier */
    let unit = "";

    if (Object.prototype.hasOwnProperty.call(obj, "quantity")) {
      quantity = obj.quantity;
    }
    if (Object.prototype.hasOwnProperty.call(obj, "unit")) {
      unit = obj.unit;
    }
    /** @type {Ingredient} Un objet de type Ingredient instancié à partir des données json*/
    const ing = new Ingredient(obj.ingredient, quantity, unit);

    return ing;
  }
}
