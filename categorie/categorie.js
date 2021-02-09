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
                <vignetteRecette
                    v-for="recette in recettes"
                    :recette="recette"
                    :key="recette.id"
                    :domaine="domaine"
                    :categorie="categorieSelected.nom">
                </vignetteRecette>
            </div>
        </div>
	</div>`,
    data() {
        const categories = chargerCategories(this.$route.params.domaine);

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
        }
    }
}