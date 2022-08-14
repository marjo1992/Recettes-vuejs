let article = {
	template : `<div>
    	<div id="article" v-if="article">
			<div id="central">
				<h1>{{article.nom}} <span v-if="store.estConnecte" id="iconeModifier" class="icon-modifier" @click="modifier"></span></h1>
                <div id="blocArticle">
					<div class="blocPhotos" :style="style">
					</div>
					<div id="blocTextArticle">
						<vue-showdown :markdown="article.textMd"></vue-showdown>
						<h2>Inspirations</h2>
						<div>
							<div v-for="inspirationGroupe in article.inspirations" class="listeObject">
								<h3 v-if="inspirationGroupe.nom">{{inspirationGroupe.nom}}</h3>
								<p>
									<div v-for="inspiration in getListeElem(inspirationGroupe)">
										<span class="icon-inspiration"></span><a :href="inspiration.url" target="_blank">{{inspiration.nom}}</a> {{inspiration.note}}
									</div>
								</p>
							</div>
						</div>
					</div>
					<div class="blocPhotos" :style="style">
					</div>
				</div>
			</div>
		</div>
	</div>`,
    data() {
        return {
            articlesFirebase: ARTICLES,
			store: STORE
        }
    },
    computed: {
		article() {
			return this.articlesFirebase.find(r => r.nom === this.$route.params.article);
        },
        style() {
            let style = {};
            if (this.article.urlsImagesStock && this.article.urlsImagesStock.length) {
                style.backgroundImage = `url("${this.article.urlsImagesStock[0]}")`;
            }
            return style;
		}
	},
	methods: {
        modifier() {
			STORE.articleAModifier = this.article
            this.$router.push({name:"adminArticle"}).catch(()=>{})
        },
        getListeElem(elemGroupe) {
            return Object.keys(elemGroupe).filter(k => !isNaN(k)).map(k => elemGroupe[k])
        }
	}
}