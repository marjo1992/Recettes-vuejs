let categorie = {
    template : `<div>
        <div id="menuGauche">
            <categorieMenu
                v-for="categorie in categories"
                :categorie="categorie"
                :selected="categorie.id===categorieSelected.id"
                :key="categorie.id">
            </categorieMenu>
        </div>
        <div id="categorie">
            <div id="central">
                <div class="recettesSousCategorie">
                    <vignetteRecette
                        v-for="recette in recettesSansSousCategorie"
                        :recette="recette"
                        :key="recette.id"
                        :domaine="domaine"
                        :categorie="categorieSelected.nom">
                    </vignetteRecette>
                </div>
                <div class="blocSousCategorie"
                    v-for="sousCategorie in categorieSelected.sousCategories"
                    v-if="recettesParSousCategories(sousCategorie.id).length" >
                    <h1>{{sousCategorie.nom}}</h1>
                    <div class="recettesSousCategorie">
                        <vignetteRecette
                            v-for="recette in recettesParSousCategories(sousCategorie.id)"
                            :recette="recette"
                            :key="recette.id"
                            :domaine="domaine"
                            :categorie="categorieSelected.nom">
                        </vignetteRecette>
                    </div>
                </div>
            </div>
        </div>
	</div>`,
    data() {
        const categories = chargerCategories(this.$route.params.domaine);
        if (categories) {
            categories.forEach(r => {
                if (r.sousCategories) {
                    r.sousCategories.sort((sc1, sc2) => sc1.nom.localeCompare(sc2.nom))
                }
            })
        }

        return {
            categories
        }
    },
    computed: {
        domaine(){
            return this.$route.params.domaine
        },
        categorieSelected() {
            return this.categories.find(c => c.nom === this.$route.params.categorie);
        },
        recettes() {
            return chargerRecettes(this.$route.params.domaine).filter(r => r.categories.find(c => c === this.categorieSelected.id));
        },
        recettesSansSousCategorie() {
            return this.recettes.filter(r => !r.sousCategories || !r.sousCategories.find(sc => Math.floor(sc) === this.categorieSelected.id));
        }
    },
    methods: {
        recettesParSousCategories(sousCategorieId) {
            return this.recettes.filter(r => r.sousCategories.includes(sousCategorieId));
        }
    }
}