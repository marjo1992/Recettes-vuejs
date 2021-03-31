let recette = {
    template : `<div id="recetteView">
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
				<h1>{{recette.nom}}<span v-if="estConnecte" id="iconeModifier" class="icon-modifier" @click="modifier"></span></h1>
				<div id="categories">
					<span v-for="categorie in categoriesRecette">{{categorie.nom}}</span>
				</div>
				<div id="blocIngredientsEtapesPhotos">
					<blocInfosIngredientsUstensiles :recette="recette" v-model="nbPortions"></blocInfosIngredientsUstensiles>
					<div id="blocEtapesVariantesRemarques">
						<div id="etape">
							<h2>Etapes</h2>
							<div>
								<span v-for="etapeGroupe in recette.etapes" class="listeObject">
									<h3 v-if="etapeGroupe.nom">{{etapeGroupe.nom}}</h3>
									<span v-for="etape in getListeElem(etapeGroupe)">
									<span class="icon-etape"></span>{{etape}}
									</span>
								</span>
							</div>
						</div>
						<div v-if="recette.variantes">
							<h2>Variantes</h2>
							<div>
								<span v-for="varianteGroupe in recette.variantes" class="listeObject">
									<h3 v-if="varianteGroupe.nom">{{varianteGroupe.nom}}</h3>
									<span v-for="variante in getListeElem(varianteGroupe)">
									<span class="icon-variante"></span>{{variante}}
									</span>
								</span>
							</div>
						</div>
						<div v-if="recette.remarques">
							<h2>Remarques</h2>
							<div>
								<span v-for="remarqueGroupe in recette.remarques" class="listeObject">
									<h3 v-if="remarqueGroupe.nom">{{remarqueGroupe.nom}}</h3>
									<span v-for="remarque in getListeElem(remarqueGroupe)">
									<span class="icon-remarque"></span>{{remarque}}
									</span>
								</span>
							</div>
						</div>
					</div>
					<div id="blocPhotos" v-if="recette.urlsImagesStock && recette.urlsImagesStock.length">
						<div id="photosRecette" >
							<carousselPhotos :photosUrl="recette.urlsImagesStock"></carousselPhotos>
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
        getListeElem(elemGroupe) {
            return Object.keys(elemGroupe).filter(k => !isNaN(k)).map(k => elemGroupe[k])
        }
	}
}