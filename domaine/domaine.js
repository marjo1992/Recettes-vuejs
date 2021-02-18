let domaine = {
    template : `<div id="domaine">
        <div id="central" v-if="estArticle">
            <vignetteArticle
                v-for="article in articles"
                :article="article"
                :key="article.id">
            </vignetteArticle>
        </div>
        <div id="central" v-else>
            <vignetteCategorie 
                v-for="categorie in categories"
                :categorie="categorie"
                :key="categorie.id">
            </vignetteCategorie>
        </div>
    </div>`,
    data() {
        return {
            categoriesFirebase: CATEGORIES
        }
    },
    computed: {
        estArticle() {
            return this.$route.params.domaine === "Articles"
        },
        articles() {
            return chargerArticles()
        },
        categories() {
            return this.categoriesFirebase[this.$route.params.domaine] || []
        }
    }
}