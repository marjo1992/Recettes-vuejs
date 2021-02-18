Vue.component("searchBar", {
	template : `<div id="searchBar">
		<autocomplete ref="autocomplete" 
			:search="search" 
			placeholder=""
			auto-select
			:debounce-time="500"
			:get-result-value="getResultValue"
			@submit="handleSubmit">
			<template #result="{ result, props }">
			  <li v-bind="props" class="autocomplete-result">
				{{ result.type==="tag"?"# ":"" }}{{ result.nom }}
			  </li>
			</template>
		</autocomplete>
		<div class="boutonRecherche"></div>
	</div>`,
	data() {
		return {
			mapCategoriesParDomaine : CATEGORIES,
            recettesFirebase: RECETTES
		}
	},
    computed: {
        objetsPourRecherche(){
			let objetsPourRechercheParNomRecette = this.getObjetsPourRechercheParNomRecetteParDomaine(this.recettesFirebase)

			let tags = new Set();
			this.recettesFirebase.flatMap(r => r.tags).forEach(t => tags.add(t));
	
			let objetsPourRechercheParTag = [...tags].map(t => ({
				type:"tag",
				nom: t
			}));
            return [...objetsPourRechercheParTag, ...objetsPourRechercheParNomRecette].sort()
        }
	},
	methods: {
		search(input) {
			if (input.length < 2) { return [] }
			return this.objetsPourRecherche.filter(o => o.nom.toLowerCase().includes(input.toLowerCase()))
		},
		handleSubmit(result) {
			if (result) {
				this.$refs.autocomplete.setValue('');
				if (result.type === "tag") {
					this.goToRecherche(result.nom)
				} else {
					this.goToRecette(result)
				}
			}
		},
		getResultValue(result) {
		  return result.nom
		},
        goToRecherche(tag) {
            this.$router.push({name:"recherche", params:{tag: tag}}).catch(()=>{})
        },
        goToRecette(objetRecherche) {
			this.$router.push({name:"recette", params:{domaine: objetRecherche.domaine, categorie: objetRecherche.categorie, recette: objetRecherche.nom}}).catch(()=>{})
        },
		getNomCategorieById(domaine, id) {
			return this.mapCategoriesParDomaine[domaine].find(c => id === c.id)?.nom;
		},
		getObjetsPourRechercheParNomRecetteParDomaine(recettes) {
			return recettes.map(r => ({
				type:"nom recette",
				nom: r.nom,
				recette:r,
				domaine:r.domaine,
				categorie:this.getNomCategorieById(r.domaine, r.categories[0])
			}))
		}
    }
})