Vue.component("categorieMenu", {
    props : ["categorie", "selected"],
	template : `<div :class="classes" :style="style" v-on:click="goToCategorie">
        {{categorie.nom}}
    </div>`,
    data() {
        return {
        }
    },
    methods: {
        goToCategorie() {
            this.$router.push({name:"categorie", params:{domaine: this.$route.params.domaine, categorie: this.categorie.nom}}).catch(()=>{})
        }
    },
    computed: {
        classes() {
            return {
                vignette:true,
                categorieMenu:true,
                selected:this.selected
            }
        },
        style() {
            return {
                backgroundImage: `url("${this.categorie.urlImage}")`
            }
        }
    }
})