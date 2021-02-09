Vue.component("vignetteRecette", {
    props : ["recette", "domaine", "categorie"],
    template : `<div class="vignette vignetteRecette"
        :style="style"
        v-on:click="goToRecette">
        <div class="detailRecetteCategorie">
            <span v-for="categorie in categoriesRecette"> {{categorie.nom}}</span>
        </div>
        <div>{{recette.nom}}</div>
        <div class="infoSup">
            <div v-if="recette.tempsPreparationMin"><span class="icon-preparation"></span>  {{recette.tempsPreparationMin}} min</div>
            <div v-if="recette.tempsCuissonMin"><span class="icon-cuisson"></span>  {{recette.tempsCuissonMin}} min</div>
            <div v-if="recette.tempsAttenteMin"><span class="icon-attente"></span>  {{recette.tempsAttenteMin}} min</div>      
        </div>
    </div>`,
    data() {
        return {
            categoriesRecette: 
                this.recette.categories.map(this.getCategorieById)
        }
    },
    computed: {
        style() {
            let style = {};
            if (this.recette.images && this.recette.images.length) {
                style.backgroundImage = `url("${this.recette.images[0]}")`;
            }
            return style;
        }
    },
    methods: {
        goToRecette() {
            this.$router.push({name:"recette", params:{domaine: this.domaine, categorie: this.categorie || this.categoriesRecette[0].nom, recette: this.recette.nom}})
        },
		getCategorieById(id) {
			return chargerCategories(this.domaine).find(c => id === c.id);
		},
    }
})