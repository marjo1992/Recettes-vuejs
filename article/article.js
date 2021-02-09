let article = {
    template : `<div>
    <div id="article">
			<div id="central">
				<h1>{{article.nom}}</h1>
                <div id="blocArticle">
					<div class="blocPhotos" :style="style">
					</div>
                    <vue-showdown id="blocTextArticle" :markdown="article.textMd"></vue-showdown>
					<div class="blocPhotos" :style="style">
					</div>
				</div>
			</div>
		</div>
	</div>`,
    computed: {
		article() {
			return chargerArticles()
				.find(r => r.nom === this.$route.params.article);
        },
        style() {
            let style = {};
            if (this.article.images && this.article.images.length) {
                style.backgroundImage = `url("${this.article.images[0]}")`;
            }
            return style;
		}
	}
}