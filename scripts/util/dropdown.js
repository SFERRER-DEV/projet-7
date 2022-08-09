/**
 * Assembler dans une liste hmtl ul les éléments stockés
 * dauns une collection Set pour les ingrédients, les ustensiles
 * et pour l'électroménager
 *
 * @param {HTMLElement} aList une liste html ul
 * @param {Set} someItems une collection d'ingrédients, d'ustensiles ou de l'électroménager
 */
export function displayListItem(aList, someItems) {
  /** @type {HTMLElement} un élément li contenant un ingrédient */
  let listItem;
  /** @type {Node} le texte de l'ingrédient */
  let text;

  // Supprimer tous les items li existants
  aList.replaceChildren();

  // Trier sur place par ordre ascendant la liste des items
  sortSet(someItems);
  // Parcourir les items ...
  someItems.forEach((item) => {
    //  <li data-type="ingredients">Ail</li>
    console.log(item);
    listItem = document.createElement("li");
    // Créer le noeud avec le texte de l'items
    text = document.createTextNode(`${capitalizeFirstLetter(item)}`);
    // Ajouter le texte à l'élément de liste
    listItem.appendChild(text);
    // Ce data attribut permet de marquer l'item pour identifier son type
    listItem.setAttribute("data-type", aList.dataset.type);
    // Ajouter l'élément à la liste concernée
    aList.appendChild(listItem);
    // Raz
    item = null;
    text = null;
  });
}

/**
 * Trier une collection de type Set sur place
 * et la renvoyer après un tri ascendant
 * tenant compte des accents
 *
 * @param {Set} set une structure à trier
 * @returns {Set} Structure triée
 */
function sortSet(set) {
  const entries = [];
  for (const member of set) {
    entries.push(member);
  }
  set.clear();
  entries.sort(function (a, b) {
    return a.localeCompare(b);
  });
  for (const entry of entries) {
    set.add(entry);
  }
  return set;
}

/**
 *
 * @param {string} string
 * @returns  {string} Foo
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
