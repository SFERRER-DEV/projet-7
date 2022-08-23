# Projet Les petits plats

## Présentation

Réaliser le site de recettes de cuisine les petits plats pour la formation Openclassrooms de développeur d'application JS React. Les petits plats est le projet numéro 7 de la formation.

- Cliquer sur une HTML Card de recette imprime cette recette sur la console avec son id, ses ingrédients, ustentiles, électroménager et description complète.
- Une classe singleton RecipesAPI crée un tableau d'objets Recette tout en découvrant tous les ingrédients, les ustensiles et l'électroménager présents dans les données.
- La classe recette Recipe a trois propriétés statiques allIngredients, allUstensils, allAppliances pour contenir tous les ingrédients, les ustensiles et l'électroménager découverts dans les 50 recettes du tableau JavaScript de données. Ces propriétés sont des stuctures Set.
- La classe recette **Recipe** stocke ses ingrédients de recette dans une structure Map dont la clé est le nom de l'ingrédient et la valeur est un objet de la classe **Ingredient**
- Deux fonctions étendent la classe String pour travailler avec les chaines de caractères:
  - capitalizeFirstLetter()
  - removeDiacritics() : Remplacer tous les signes qui s'ajoute aux lettres avant de faire des recherches.
- Deux expressions régulières sont utilisées par les deux types de recherche :
  - Début de mot pour la recherche globale ("écha" trouve "échalotte" mais pas "préchauffer" par exemple)
  - Mot complet pour la recherche d'étiquettes.
- [L'algorithme utilisant la méthode filter()](https://github.com/SFERRER-DEV/projet-7/blob/dev/scripts/util/search.js) sur les ensembles d'objets Recettes a été choisi (branches champ_de_rercherche_principal_1 -> dev -> main)
- Le fichier Dom.js contient des fonctions utilitaires nécessaires communes aux fabriques pour manipuler et créer les éléments du DOM.
- Une méthode de factory fabrique des HTML Cards pour les cartes des recettes.
- La librairie Bootstrap 4.6.2 est utilisée pour présenter l'affichage. Elle est fournie par BootstrapCDN.

## Liens

- Voir le site sur github pages : [Openclassrooms projet 7: Les petits plats](https://sferrer-dev.github.io/projet-7/index.html)
- Code Climate: [Codebase summary projet 7](https://codeclimate.com/github/SFERRER-DEV/projet-7)
- La recherche globale altenative se trouve sur la branche "champ_de_rercherche_principal_2" tag "v0.6": [Algorithme While & For](https://github.com/SFERRER-DEV/projet-7/blob/v0.6/scripts/util/search.js)
- Le document **jsbench.pdf** dans le dossier **docs/** détail l'utilisation de l'outil de comparaison de performance.
- Exemples de benchmarks Algo Filter versus Algo While & For
  - [Benchmark en recherchant "coco"](https://jsben.ch/76g2e)
  - [Benchmark en recherchant "échalotte"](https://jsben.ch/wGcV5)
  - [Benchmark en recherchant "pim"](https://jsben.ch/dG0mj)
  - [Benchmark en recherchant "Faire cuire les pates"](https://jsben.ch/zQHha)
