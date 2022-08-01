addDropdownToggleEvents();

/**
 * Ajouter un évènement à chaqu'un des boutons ouvrant les listes déroulantes
 * add events to show dropdown list for click toggle button, focus, and blur
 *
 */
function addDropdownToggleEvents() {
  /** @type {NodeList} une collection avec les trois boutons pour ouvrir fermer les trois listes déroulantes */
  const toggleButtons = document.querySelectorAll(".filters__dropdown__toogle");

  // Parcourir les trois boutons toggle
  toggleButtons.forEach((elm) => {
    /** @type {string} l'attribut data-type de ce bouton toogle contient le nom du type des éléments à rechercher */
    const searchName = elm.dataset.type;
    /** @type {string} l'identifiant d'une custom liste déroulante correspondant à ce bouton toggle actuellement lu */
    const idDropbox = `${searchName}-dropdown`;

    /** @type {HTMLDivElement} l'élémént div contenant toute la custom iste déroulante */
    const dropdown = document.querySelector(`#${idDropbox}`);
    // Ecouter l'évènement click de toggle bouton pour ...
    elm.addEventListener("click", () => {
      if (dropdown.classList.contains("show")) {
        dropdown.classList.remove("show"); // ... enlever la classe show à sa dropdown
        dropdown.classList.add("col-2");
        dropdown.classList.remove("col-6");
      } else {
        closeAllDropdowns();
        dropdown.classList.add("show"); //  ... ou ajouter la classe show à sa dropdown
        dropdown.classList.add("col-6");
        dropdown.classList.remove("col-2");
      }
    });
  });
}

/**
 * Cliquer en dehors d'une liste custom dropdown
 * ferme toute liste ouverte
 *
 * @param {*} event
 */
window.onclick = function (event) {
  if (
    !event.target.matches([
      ".filters__dropdown",
      ".filters__dropdown ul",
      ".filters__dropdown ul li",
      ".filters__dropdown__toogle",
      ".filters__dropdown__toogle i",
      ".filters__dropdown__search",
    ])
  ) {
    closeAllDropdowns();
  }
};

/**
 * Fermer toutes les listes custom dropdown
 * avec reinitialisation de la largeur
 */
function closeAllDropdowns() {
  const openedDropdowns = document.querySelectorAll(".show");
  openedDropdowns.forEach((dropdown) => {
    dropdown.classList.remove("show");
    dropdown.classList.remove("col-6");
    dropdown.classList.add("col-2");
  });
}

/** @type {NodeList} une collection avec les trois input */
const searchByTagInput = document.querySelectorAll(
  ".filters__dropdown__search"
);
//
searchByTagInput.forEach((input) => {
  const type = input.dataset.type;
  input.addEventListener("input", (event) => {
    filterTagSuggestions(event.target.value, type);
  });
});

/**
 * filter tag suggestions based on searchInput
 * @param {String} searchInput
 * @param {String} type
 */
function filterTagSuggestions(searchInput, type) {
  const regex = new RegExp(`${searchInput}`, "i");

  let results;

  switch (type) {
    case "ingredients":
      let ingredients = getTagList("ingredients", filteredRecipes);
      results = ingredients.filter((ingredient) => regex.test(ingredient));
      break;

    case "appliances":
      let appliances = getTagList("appliances", filteredRecipes);
      results = appliances.filter((appliance) => regex.test(appliance));
      break;

    case "ustensils":
      let ustensils = getTagList("ustensils", filteredRecipes);
      results = ustensils.filter((ustensil) => regex.test(ustensil));
      break;
  }
  updateDatalist(results, type);
}

//
function myFunction() {
  var input, filter, ul, li, a, i, txtValue;

  input = document.getElementById("myInput");

  filter = input.value.toUpperCase();

  ul = document.getElementById("myUL");
  li = ul.getElementsByTagName("li");

  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
