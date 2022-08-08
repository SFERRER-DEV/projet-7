/**
 * Obtenir un div avec sa ou ses classe(s)
 *
 * @param {string | Array<string> } [strClasses = "" ] - une classe ou une liste de classes CSS/Boostrap
 *
 * @returns {HTMLDivElement} balise div conteneur
 */
export const getDiv = (strClasses = "") => {
  /** @type {HTMLDivElement} - balise div */
  const div = document.createElement("div");

  return _setBalise(div, strClasses);
};

/**
 * Obtenir un span avec sa ou ses classe(s)
 *
 * @param {string | Array<string> } [strClasses = "" ] - une classe ou une liste de classes CSS/Boostrap
 * @param {string} strText - une chaine de caractère à afficher
 *
 * @returns {HTMLDivElement} balise span conteneur
 */
export const getSpan = (strClasses = "", strText) => {
  /** @type {HTMLDivElement} - balise div */
  const span = document.createElement("span");

  return _setBalise(span, strClasses, strText);
};

/**
 * Obtenir un texte contenu dans un titre
 *
 * @param {string} hBalise - une notation h1 ... h6
 * @param {string} strText - une chaine de caractère pour le titre
 * @param {string | Array<string> } [strClasses = "" ] - une classe ou une liste de classes CSS/Boostrap
 * @param {string} [strAriaLabel = ""] - une chaine de caractère pour l'ARIA
 * @returns {HTMLTitleElement | HTMLParagraphElement | HTMLSpanElement} balise titre h1 ... h6
 */
export const getTitle = (
  hBalise,
  strText,
  strClasses = "",
  strAriaLabel = ""
) => {
  /** @type {HTMLTitleElement } - balise de titre h1 ... h6  */
  const titre = document.createElement(hBalise);

  if (strAriaLabel !== undefined && strAriaLabel !== "") {
    titre.setAttribute("aria-label", strAriaLabel);
  }

  return _setBalise(titre, strClasses, strText);
};

/**
 * Obtenir un paragraphe avec sa ou ses classe(s)
 *
 * @param {string | Array<string> } [strClasses = "" ] - une classe ou une liste de classes CSS/Boostrap
 * @param {string} [strText=""] - une chaine de caractère
 * @returns {HTMLSpanElement} balise paragraphe
 */
export const getPara = (strClasses = "", strText = "") => {
  /** @type {HTMLParagraphElement} - balise p */
  const para = document.createElement("p");

  return _setBalise(para, strClasses, strText);
};

/**
 * Paramétrer une balise html div, p, span
 * pouvant contenir du texte.
 *
 * @param {HTMLDivElement |HTMLParagraphElement | HTMLSpanElement} balise l'élément HTML à configurer
 * @param {string | Array<string>} strClasses - une classe CSS ou une liste de classes CSS/Boostrap
 * @param {string} [strText = ""] - une chaine de caractère
 *
 * @returns {HTMLDivElement | HTMLParagraphElement | HTMLSpanElement} span balise span conteneur.
 */
const _setBalise = (balise, strClasses, strText = "") => {
  if (strClasses !== undefined) {
    if (Array.isArray(strClasses)) {
      // il y a une liste de classes à ajouter
      if (!strClasses.length) {
        // liste vide : ne rien faire
      } else {
        // ajouter toutes les classes
        strClasses.forEach((strClass) => balise.classList.add(strClass));
      }
    } else if (strClasses !== "") {
      // la seule classe a été indiquée dans une chaine de caractères
      balise.classList.add(strClasses);
    }
  }
  if (strText !== undefined && strText !== "") {
    /** @type {HTMLElement} - une chaine de caractère */
    const strNode = document.createTextNode(strText);
    balise.appendChild(strNode);
  }

  return balise;
};
