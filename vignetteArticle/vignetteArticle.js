Vue.component("vignetteArticle", {
    props : ["article"],
	template : `<div class="vignette vignetteArticle" :style="style" v-on:click="goToArticle">
        {{article.nom}}
    </div>`,
    computed: {
        style() {
            let style = {};
            if (this.article.images && this.article.images.length) {
                style.backgroundImage = `url("${this.article.images[0]}")`;
            }
            return style;
        }
    },
    methods: {
        goToArticle() {
            this.$router.push({name:"article", params:{article: this.article.nom}}).catch(()=>{})
        }
    }
})