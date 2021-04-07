Vue.component("blocRecetteInfosAnnexes", {
    props : ["recette", "nbPortions"],
    template : `<div id="blocRecetteInfosAnnexes">
        <div id="tags">
            <h2>Tags</h2>
            <div class="listeObject">
                <span v-for="tag in recette.tags">{{tag}}</span>
            </div>
        </div>
        <div id="blocApportsNutritionels" v-if="recette.apportNutritionelTotal && recette.apportNutritionelTotal.length">
            <h2>Apports nutritionels</h2>
            <div id="apportNutritionels" >
                <div id="apportNutritionelsTypes" class="apportNutritionelsLigne">
                    <div></div>
                    <div>total</div>
                    <div>par {{recette.defPortion}}</div>
                </div>
                <div v-for="apport in recette.apportNutritionelTotal" class="apportNutritionelsLigne">
                    <div class="apportType">{{apport.type}}</div>
                    <div>{{(apport.quantite * nbPortions / (recette.nbPortions)).toFixed(1) }} {{apport.unite}}</div>
                    <div>{{(apport.quantite / (recette.nbPortions)).toFixed(1)}} {{apport.unite}}</div>
                </div>
            </div>
        </div>
        <div id="inspirations">
            <h2>Inspirations</h2>
            <div>
                <span v-for="inspirationGroupe in recette.inspirations" class="listeObject">
                    <h3 v-if="inspirationGroupe.nom">{{inspirationGroupe.nom}}</h3>
                    <span v-for="inspiration in getListeElem(inspirationGroupe)">
                        <span class="icon-inspiration"></span><a :href="inspiration.url" target="_blank">{{inspiration.nom}}</a> {{inspiration.note}}
                    </span>
                </span>
            </div>
        </div>
        <div>
            <h2>Partage</h2>
            <div>
                <a><span class="icon-partager" v-if="displayShare" @click="partager"></span></a>
                <a :href="fbUrl" target="_blank"><span class="icon-facebook"></span></a>
                <a :href="twitterUrl" data-size="large" target="_blank"><span class="icon-twitter"></span></a>
            </div>
        </div>
    </div>`,
    data() {
        let urlShare = window.location.href
        return {
            displayShare: navigator.share,
            urlShare,
            fbUrl: "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(urlShare) + "&amp;src=sdkpreparse",
            twitterUrl: "https://twitter.com/intent/tweet?text=" +  encodeURIComponent(this.recette.nom) + "&url=" + encodeURIComponent(urlShare)
        }
    },
	methods: {
		partager() {
			navigator.share({
				url: this.urlShare
			})
		},
        getListeElem(elemGroupe) {
            return Object.keys(elemGroupe).filter(k => !isNaN(k)).map(k => elemGroupe[k])
        }
	}
})