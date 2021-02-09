function chargerRecettes(domaine) {
    switch (domaine) {
        case "Cuisine" : 
            var recettes= recettesCuisine;
            break;
        case "Cosmetique" : 
            var recettes= recettesCosmetique;
            break;
        case "Maison" : 
            var recettes= recettesMaison;
            break;
    }
    recettes.forEach(r => {
        if (!r.nbPortions) {
            r.nbPortions = 1;
        }
        if (!r.defPortion) {
            r.defPortion = 'portion'
        }
    })
    return recettes;
}

function chargerCategories(domaine) {
    switch (domaine) {
        case "Cuisine" : 
            var categories= categoriesCuisine;
            break;
        case "Cosmetique" : 
            var categories= categoriesCosmetique;
            break;
        case "Maison" : 
            var categories= categoriesMaison;
            break;
    }
    return categories;
}

function chargerArticles() {
    return articles;
}
