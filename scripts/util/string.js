// Utile étendre la classe String de JS pour
// supprimer les caractères non alphabétiques et les accents d'une chaîne
if (!String.prototype.removeDiacritics) {
  String.prototype.removeDiacritics = function () {
    return this.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\(\)]/g, ""); // il y a des parenthèses dans les données
  };
}

// Utile étendre la classe String de JS pour
// Mette la première lettre d'une chaine de caractère en majuscule et le reste en miniscules
if (!String.prototype.capitalizeFirstLetter) {
  String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
  };
}
