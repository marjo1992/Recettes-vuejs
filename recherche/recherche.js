let recherche = {
    template : `<div id="recherche">
		<div id="central">
			<div class="resultatDomaine" v-if="resultatsRecettesCuisine && resultatsRecettesCuisine.length">
				<h1>Cuisine</h1>
				<div class="recettesDuDomaine">
					<vignetteRecette
						v-for="recette in resultatsRecettesCuisine"
						:recette="recette"
						:key="recette.id"
						:domaine="'Cuisine'">
				</vignetteRecette>
				</div>
			</div>
			<div class="resultatDomaine" v-if="resultatsRecettesMaison && resultatsRecettesMaison.length">
				<h1>Maison</h1>
				<div class="recettesDuDomaine">
					<vignetteRecette
						v-for="recette in resultatsRecettesMaison"
						:recette="recette"
						:key="recette.id"
						:domaine="'Maison'">
					</vignetteRecette>
				</div>
			</div>
			<div class="resultatDomaine" v-if="resultatsRecettesCosmetique && resultatsRecettesCosmetique.length">
				<h1>Cosmetique</h1>
				<div class="recettesDuDomaine">
					<vignetteRecette
						v-for="recette in resultatsRecettesCosmetique"
						:recette="recette"
						:key="recette.id"
						:domaine="'Cosmetique'">
					</vignetteRecette>
				</div>
			</div>
		</div>
    </div>`,
	data() {
		return {
			recettes: RECETTES
		}
	},
    computed: {
        resultatsRecettesCuisine() {
            return this.getRecettesByTags("Cuisine");
        },
        resultatsRecettesMaison() {
            return this.getRecettesByTags("Maison");
        },
        resultatsRecettesCosmetique() {
            return this.getRecettesByTags("Cosmetique");
        }
	},
	methods: {
		getRecettesByTags(domaine) {
			return this.recettes
			.filter(r => r.domaine === domaine)
			.filter(r => r.tags.find(t => t === this.$route.params.tag));
		}
	}
}