Vue.component("vignetteCategorie", {
    props : ["categorie"],
	template : `<div class="vignette vignetteCategorie" :style="style" v-on:click="goToCategorie">
        {{categorie.nom}}
    </div>`,
    computed: {
        style() {
            let style = {};
            if (this.categorie.urlImage) {
                style.backgroundImage = `url("${this.categorie.urlImage}")`;
            }
            return style;
        }
    },
    methods: {
        goToCategorie() {
            this.$router.push({name:"categorie", params:{domaine: this.$route.params.domaine, categorie: this.categorie.nom}}).catch(()=>{})
        }
    }
})