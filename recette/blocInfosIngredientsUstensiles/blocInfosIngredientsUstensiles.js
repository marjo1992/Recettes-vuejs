Vue.component("blocInfosIngredientsUstensiles", {
    props : ["recette", "value"],
    template : `<div id="blocInfosIngredientsUstensiles">
        <div id="blocInfoDiverses" class="listeObject">
            <div id="blocNbPortion" >
                Pour <inputNumber v-model="nbPortionsInput" @input="dispatchInput" min="1"></inputNumber> {{recette.defPortion}}
            </div>
            <div v-if="recette.tempsPreparationMin">
                <span class="icon-preparation"></span>Temps de préparation : {{recette.tempsPreparationMin}} min
            </div>
            <div v-if="recette.tempsCuissonMin">
                <span class="icon-cuisson"></span>Temps de cuisson : {{recette.tempsCuissonMin}} min
            </div>
            <div v-if="recette.tempsAttenteMin">
                <span class="icon-attente"></span>Temps d'attente : {{recette.tempsAttenteMin}} min
            </div>
        </div>
        <div id="blocIngredients">
            <h2>Ingrédients</h2>
            <div class="listeObject">
                <span v-for="ingredient in recette.ingredients">
                    <span class="icon-ingredient"></span><span v-if="ingredient.quantite">{{ingredient.quantite * nbPortionsInput / nbPotionsInitial}} </span><span v-if="ingredient.unite">{{ingredient.unite}} </span>{{ingredient.nom}}<span v-if="ingredient.note"> ({{ingredient.note}})</span>
                </span>
            </div>
        </div>
        <div v-if="recette.ustensiles" id="blocUstensiles">
            <h2>Ustensiles</h2>
            <div class="listeObject">
                <span v-for="ustensile in recette.ustensiles"><span class="icon-ustensile"></span><span v-if="ustensile.quantite">{{ustensile.quantite}} </span>{{ustensile.nom}}<span v-if="ustensile.note"> ({{ustensile.note}})</span></span>
            </div>
        </div>
    </div>`,
    data() {
        let valNbPotionsInitial = this.recette.nbPortions;
        this.dispatchInput(valNbPotionsInitial);
        return {
            nbPotionsInitial: valNbPotionsInitial,
            nbPortionsInput: valNbPotionsInitial
        }
    },
    methods: {
        dispatchInput(event) {
            this.$emit("input", event)
        }
    }
})