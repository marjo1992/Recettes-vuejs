let recette = {
    template : `<div>
		<div id="menuGauche">
			<categorieMenu
				v-for="categorie in categories"
				:categorie="categorie"
				:selected="categorie.id===categorieSelected.id"
				:key="categorie.id">
			</categorieMenu>
		</div>
		<div id="recette" v-if="recette">
			<div id="central">
				<h1>{{recette.nom}}<img v-if="estConnecte" id="iconeModifier" src="_ressources/images/modifier.png" @click="modifier"></h1>
				<div id="categories">
					<span v-for="categorie in categoriesRecette">{{categorie.nom}}</span>
				</div>
				<div id="blocIngredientsEtapesPhotos">
					<blocInfosIngredientsUstensiles :recette="recette" v-model="nbPortions"></blocInfosIngredientsUstensiles>
					<div id="blocEtapesVariantesRemarques">
						<div id="etape">
							<h2>Etapes</h2>
							<div class="listeObject">
								<span v-for="etape in recette.etapes"><span class="icon-etape"></span>{{etape}}</span>
							</div>
						</div>
						<div v-if="recette.variantes">
							<h2>Variantes</h2>
							<div class="listeObject">
								<span v-for="variante in recette.variantes"><span class="icon-variante"></span>{{variante}}</span>
							</div>
						</div>
						<div v-if="recette.remarques">
							<h2>Remarques</h2>
							<div class="listeObject">
								<span v-for="remarque in recette.remarques"><span class="icon-remarque"></span>{{remarque}}</span>
							</div>
						</div>
					</div>
					<div id="blocPhotos" v-if="recette.images && recette.images.length">
						<div id="photosRecette" >
							<carousselPhotos :photosUrl="recette.images"></carousselPhotos>
						</div>
					</div>
				</div>
			</div>
		</div>
		<blocRecetteInfosAnnexes v-if="recette" :recette="recette" :nbPortions="nbPortions"></blocRecetteInfosAnnexes>
	</div>`,
    data() {
        return {
			nbPortions : null,
			recettesFirebase : RECETTES,
			categoriesFirebase: CATEGORIES,
			store: STORE
        }
    },
    computed: {
		estConnecte() {
			return this.store.estConnecte
		},
		categories() {
			return this.categoriesFirebase[this.$route.params.domaine];
		},
        categorieSelected() {
            return this.categories ? this.categories.find(c => c.nom === this.$route.params.categorie) : {};
        },
		categoriesRecette() {
			return this.recette.categories.map(this.getCategorieById);
		},
		recette() {
			return this.recettesFirebase
				.filter(r => r.domaine === this.$route.params.domaine)
				.filter(r => r.categories.find(c => c === this.categorieSelected.id))
				.find(r => r.nom === this.$route.params.recette);
		}
	},
	methods: {
		getCategorieById(id) {
			return this.categories.find(c => id === c.id);
		},
		getStyleBackgroundByImg(urlImg) {
			return {
				backgroundImage: `url("${urlImg}")`
			}
		},
        modifier() {
			STORE.recetteAModifier = this.recette
            this.$router.push({name:"admin"}).catch(()=>{})
        },
	}
}