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
		
		let objetsPourRechercheParNomRecette = ["Cuisine", "Maison", "Cosmetique"]
			.flatMap(this.getObjetsPourRechercheParNomRecetteParDomaine)
		
		let recettes = [...recettesCuisine, ...recettesCosmetique, ...recettesMaison]
		let tags = new Set();
		recettes.flatMap(r => r.tags).forEach(t => tags.add(t));

		let objetsPourRechercheParTag = [...tags]
			.map(t => ({
				type:"tag",
				nom: t
			}))

		return {
			objetsPourRecherche : [...objetsPourRechercheParTag, ...objetsPourRechercheParNomRecette].sort()
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
			return chargerCategories(domaine).find(c => id === c.id).nom;
		},
		getObjetsPourRechercheParNomRecetteParDomaine(domaine) {
			return chargerRecettes(domaine)
			.map(r => ({
				type:"nom recette",
				nom: r.nom,
				recette:r,
				domaine:domaine,
				categorie:this.getNomCategorieById(domaine, r.categories[0])
			}))
		}
    }
})