// Utile étendre la classe String de JS pour
// supprimer les caractères non alphabétiques et les accents d'une chaîne
if (!String.prototype.removeDiacritics) {
  String.prototype.removeDiacritics = function () {
    return this.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };
}
/**
 * Obtenir une Expression pour les recherches
 *
 * @param {string} needle les caractères recherchés
 */
export const getRegExp = (needle, full = false) => {
  /** @type {string} le motif de recherche */
  let motif;
  if (full) {
    // correspondance pour un mot complet (recherche par étiquette)
    motif = "\\b" + needle + "\\b";
  } else {
    // correspondance début de mot (recherche globale)
    motif = "\\b" + needle;
  }
  // i: insensible à la casse
  // g: correspond plusieurs fois au modèle => trouver 1er occurence suffit
  // m: active le mode multiligne => il n'y pas de saut de ligne dans la description
  // u: prise en chage unicode.
  return new RegExp(motif, "i");
};
