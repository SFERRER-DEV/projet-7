/**
 * Ajouter un évènement à chaqu'un des boutons  pour ouvrir ou fermer
 * sa listes déroulante.
 * Cliquer en dehors d'une liste ferme toutes listes.
 */
export function addDropdownToggleEvents() {
  /** @type {NodeList} une collection avec les trois boutons pour ouvrir fermer les trois listes déroulantes */
  const toggleButtons = document.querySelectorAll(".filters__dropdown__toggle");

  // Parcourir les trois boutons toggle
  toggleButtons.forEach((elm) => {
    /** @type {string} l'attribut data-type de ce bouton toggle contient le nom du type des éléments à rechercher */
    const filterType = elm.dataset.type;
    /** @type {string} l'identifiant d'une custom liste déroulante correspondant à ce bouton toggle actuellement lu */
    const idDropbox = `${filterType}-dropdown`;

    /** @type {HTMLDivElement} l'élémént div contenant toute la custom iste déroulante */
    const dropdown = document.querySelector(`#${idDropbox}`);
    // Ecouter l'évènement click de toggle bouton pour ...
    elm.addEventListener("click", () => {
      if (dropdown.classList.contains("show")) {
        dropdown.classList.remove("show"); // ... enlever la classe show à sa dropdown
        dropdown.classList.add("col-3");
        dropdown.classList.remove("col-5");
      } else {
        closeAllDropdowns();
        dropdown.classList.add("show"); //  ... ou ajouter la classe show à sa dropdown
        dropdown.classList.add("col-5");
        dropdown.classList.remove("col-3");
      }
    });
  });

  // Cliquer en dehors d'une custom dropdown ferme toute les listes ouvertes
  window.addEventListener("click", (event) => {
    // Si on a pas cliquer dans les listes déroulantes et leurs contenus mais
    if (!event.target.matches([".filters__dropdown", ".filters__dropdown *"])) {
      // ailleurs alors fermer toutes les listes
      closeAllDropdowns();
    }
  });
}

/**
 * Ajouter un évènement à chaqu'une des zones de saisie des dropboxs
 * pour filter l'affichage de ses items dans le but de restreindre
 * son choix d'étiquettes possibles
 */
export function addDropdownFilterEvents() {
  /** @type {NodeList} les trois zones de saisie utilisées pour restreindre l'affichage des étiquettes dans les dropbox */
  const dropdowns = document.querySelectorAll(".filters__dropdown__search");
  // Parcourir les trois boutons toggle
  dropdowns.forEach((elm) => {
    elm.addEventListener("input", (event) =>
      // l'attribut html data-type contient soit ingredients, ustensils, appliances
      filterFunction(event.currentTarget.dataset.type)
    );
  });
}

/**
 * Saisir des caratères dans la zone de texte d'une liste déroulante
 * d'ingrédients, d'ustensiles ou d'électroménager
 * filtre et restreint l'affichage de ses items à choisir.
 *
 * @param {string} filterType - chaine à partir de l'attribut html data-type (ingredients, ustensils ou appliances)
 */
function filterFunction(filterType) {
  /** @type {string} l'identifiant du champ de saisi pour la recherche d'un ingrédient, d'un ustensile ou d'un appareil */
  const idSearch = `${filterType}-search`;
  /** @type {HTMLFormElement} le champ de saisi */
  const input = document.getElementById(idSearch);
  /** @type {string} */
  const filter = input.value.trim().toUpperCase();

  /** @type {string} l'identifiant de la liste d'items d'ingrédients, d'ustensiles ou d'appareils */
  const idList = `${filterType}-list`;
  /** @type {HTMLElement} la liste de ces items */
  const ul = document.getElementById(idList);
  /** @type {HTMLCollection} tous les items de cette liste */
  const listItems = ul.querySelectorAll("li");
  listItems.forEach(function (item) {
    // Certains items pourraient être masqués par une recherche dans l'input de la dropbox
    item.style.display = "list-item"; // alors il faut d'assurer de les afficher tous avant de filtrer
  });

  if (filter.length > 0) {
    /** @type {string} l'identifiant d'une custom dropbox */
    const idDropbox = `${filterType}-dropdown`;
    /** @type {HTMLDivElement} l'élémént div contenant toute la custom dropbox */
    const dropdown = document.querySelector(`#${idDropbox}`);

    /** @type {string} l'identifiant d'un bouton pour afficher masque la custom dropdox */
    const idToogle = `${filterType}-toggle`;
    /** @type {HTMLButtonElement} le bouton pour ouvrir fermer la dropdown */
    const toggle = document.getElementById(idToogle);

    // Si la dropdown n'est pas ouverte ...
    if (!dropdown.classList.contains("show")) {
      toggle.click(); // alors appuyer sur son bouton pour afficher ses items
    }

    /** @type {string} le nom d'un ingredient, d'un ustensile ou d'un appareil affiché dans la liste */
    let txtValue;
    // Parcourir tous les items pour n'afficher que ceux qui correspondent à la saisie
    for (let i = 0; i < listItems.length; i++) {
      txtValue = listItems[i].textContent;
      if (txtValue.toLowerCase() === "aucun élément") {
        // RaB
        input.value = "";
        break;
      } else if (txtValue.toUpperCase().indexOf(filter) > -1) {
        // Afficher un item
        listItems[i].style.display = "list-item";
      } else {
        // Masquer un item qui ne correspond pas au filtre saisi
        listItems[i].style.display = "none";
      }
    }
  }
}

/**
 * A partir d'une collection de recettes
 * déterminer tous ses ingrédients uniques, ses ustensiles uniques
 * et l'électroménager unique
 *
 * @param {Array<Recipe>} recipes un tableau de recettes
 * @returns {Set} ingredients la collection d'ingredients uniques des recettes filtrées
 * @returns {Set} ustensils la collection d'ustensiles unsiques des recettes filtrées
 * @returns {Set} appliances une collection d'électroménager uniques des recettes filtrées
 */
export const getAnyTags = (recipes) => {
  /** @type {Set} la liste des ingrédients uniques */
  let ingredients = new Set();
  /** @type {Set} la liste des ustensiles uniques */
  let ustensils = new Set();
  /** @type {Set} la liste des appareils électroménager uniques */
  let appliances = new Set();

  // Si il n'y a pas de recettes renvoyer des Set vides d'ingredients, ustensiles, électroménager
  if (recipes.length > 0) {
    /** @type{Array<string>} tous les ingredients détectés dans cette collection de recettes */
    const i = recipes
      .map(function (item) {
        // item.ingredients est une structure Map
        return Array.from(item.ingredients.values()).map(function (item) {
          // dont les valeurs
          return item.ingredient; // sont des objets de la classe Ingredient avec
        }); // une propriété nommée .ingredient qui stocke le nom de l'ingrédient
      })
      .reduce(function (a, b) {
        return a.concat(b);
      });
    ingredients = new Set(i);

    /** @type{Array<string>} tous les ustensiles détectés dans cette collection de recettes */
    const u = recipes
      .map(function (item) {
        return Array.from(item.ustensils.values());
      })
      .reduce(function (a, b) {
        return a.concat(b);
      });
    ustensils = new Set(u);

    /** @type {Set} la liste des appareils électroménager uniques */
    appliances = new Set(recipes.map((r) => r.appliance));
  }

  return { ingredients, ustensils, appliances };
};

/**
 * Obtenir un tableau d'objets pour créer les filtres
 * à partir des tags affichés depuis leurs HTMLSpanElements
 * bleu, rouge ou vert
 *
 * @returns {Array<Object>} la liste des tags séléctionnés pour filtrer
 */
export const getFilters = () => {
  /** @type {Array<Object>} la liste des tags séléctionnés pour filtrer */
  let filters = [];

  /** @type {HTMLDivElement} le conteneur html des étiquettes de filtre */
  const parent = document.getElementById("tags");

  /** @type {NodeList} la collection des HTMLSpanElements affichés contenant les tags */
  const allTags = parent.querySelectorAll("#tags span.tags__tag");

  // Lancer le filtre par les tags si il y a des tags affichés
  if (allTags.length > 0) {
    // Créer un tableau d'objets pour le filtre des tags à partir des HTMLSpanElements
    allTags.forEach(function (currentValue) {
      filters = [
        ...filters,
        { list: currentValue.dataset.type, item: currentValue.textContent },
      ];
    });
  }

  return filters;
};

/**
 * Fermer toutes les listes custom dropdown
 * avec reinitialisation de la largeur
 */
function closeAllDropdowns() {
  const openedDropdowns = document.querySelectorAll(".show");
  openedDropdowns.forEach((dropdown) => {
    dropdown.classList.remove("show");
    dropdown.classList.remove("col-5");
    dropdown.classList.add("col-3");
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
export function sortSet(set) {
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
