Vue.component("vignetteRecette", {
    props : ["recette", "domaine", "categorie"],
    template : `<div class="vignette vignetteRecette"
        :style="style"
        v-on:click="goToRecette">
        <div class="detailRecetteCategorie">
            <span v-for="categorie in categoriesRecette"> {{categorie.nom}}</span>
        </div>
        <div class="nomRecette">{{recette.nom}}</div>
        <div class="infoSup">
            <div v-if="recette.tempsPreparationMin"><span class="icon-preparation"></span>  {{recette.tempsPreparationMin}} min</div>
            <div v-if="recette.tempsCuissonMin"><span class="icon-cuisson"></span>  {{recette.tempsCuissonMin}} min</div>
            <div v-if="recette.tempsAttenteMin"><span class="icon-attente"></span>  {{recette.tempsAttenteMin}} min</div>      
        </div>
    </div>`,
    data() {
        return {
            categoriesFirebase: CATEGORIES
        }
    },
    computed: {
        style() {
            let style = {};
            if (this.recette.urlsImagesStock && this.recette.urlsImagesStock.length) {
                style.backgroundImage = `url("${this.recette.urlsImagesStock[0]}")`;
            }
            return style;
        },
        categoriesRecette(){
            return this.recette.categories.map(this.getCategorieById)
        }
    },
    methods: {
        goToRecette() {
            this.$router.push({name:"recette", params:{domaine: this.domaine, categorie: this.categorie || this.categoriesRecette[0].nom, recette: this.recette.nom}}).catch(()=>{})
        },
		getCategorieById(id) {
			return this.categoriesFirebase[this.domaine] ? this.categoriesFirebase[this.domaine].find(c => id === c.id) : [];
		},
    }
})