Vue.component("blocRecetteInfosAnnexes", {
    props : ["recette", "nbPortions"],
    template : `<div id="blocRecetteInfosAnnexes">
        <div id="tags">
            <h2>Tags</h2>
            <div class="listeObject">
                <span v-for="tag in recette.tags">{{tag}}</span>
            </div>
        </div>
        <div id="blocApportsNutritionels" v-if="recette.apportNutritionelTotal">
            <h2>Apports nutritionels</h2>
            <div id="apportNutritionels" >
                <div id="apportNutritionelsTypes" class="apportNutritionelsLigne">
                    <div></div>
                    <div>total</div>
                    <div>par {{recette.defPortion}}</div>
                </div>
                <div v-for="apport in recette.apportNutritionelTotal" class="apportNutritionelsLigne">
                    <div class="apportType">{{apport.type}}</div>
                    <div>{{apport.quantite * nbPortions / (recette.nbPortions) }} {{apport.unite}}</div>
                    <div>{{apport.quantite / (recette.nbPortions)}} {{apport.unite}}</div>
                </div>
            </div>
        </div>
        <div id="inspirations">
            <h2>Inspirations</h2>
            <div class="listeObject">
                <span v-for="inspiration in recette.inspirations"><span class="icon-inspiration"></span><a :href="inspiration.url">{{inspiration.nom}}</a> {{inspiration.note}}</span>
            </div>
        </div>		
        </div>
    </div>`,
    data() {
        return {
        }
    }
})