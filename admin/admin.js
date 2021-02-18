let admin = {
    template : `<div id="admin">
        <div id="formulaire">
            <div><span class="nomChamp">Nom</span><div class="champ"><input v-model="nom"></div></div>
            <div>
                <span class="nomChamp">Domaine</span>
                <div class="champ" >
                    <select v-model="domaineRecette">
                        <option disabled value="">Choisissez</option>
                        <option v-for="domaine in domaines">{{domaine}}</option>
                    </select>
                </div>
            </div>
            <div>
                <span class="nomChamp">Categories</span>
                <div class="champ">
                    <select v-model="categories" multiple>
                        <option v-for="categorie in categoriesDuDomaine" :value="categorie">{{categorie.nom}}</option>
                    </select>
                </div>
            </div>
            <div>
                <span class="nomChamp">Sous-categories</span>
                <div class="champ">
                    <vue-multiselect v-model="sousCategories" :options="categories" :multiple="true"
                        group-values="sousCategories" group-label="nom" :group-select="true" 
                        track-by="id" label="nom">
                    </vue-multiselect>
                </div>
            </div>
            <div>
                <span class="nomChamp">Tags</span>
                <div class="champ">
                    <vue-multiselect v-model="tagsRecette" :options="tags" :multiple="true"
                            :close-on-select="false" :clear-on-select="false" :preserve-search="true" 
                            placeholder="Choisissez un ou des tags existants">
                        <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} options selected</span></template>
                    </vue-multiselect>
                    <input v-model="nouveauxTags" placeholder="Ex: tag 1, tag 2">
                </div>
            </div>
            <div><span class="nomChamp">Images</span><div class="champ"><TextareaAutosize v-model="images"/></div></div>
            <div><span class="nomChamp">Nombre de portion</span><div class="champ"><inputNumber v-model="nbPortions" min="1"></inputNumber></div></div>
            <div><span class="nomChamp">Définition de portion</span><div class="champ"><input v-model="defPortion" placeholder="Ex: petit pot"></div></div>
            <div><span class="nomChamp">Temp de cuisson (en min)</span><div class="champ"><input type="number" v-model="tempsCuissonMin"></div></div>
            <div><span class="nomChamp">Temp de préparation (en min)</span><div class="champ"><input type="number" v-model="tempsPreparationMin"></div></div>
            <div><span class="nomChamp">Temp d'attente (en min)</span><div class="champ"><input type="number" v-model="tempsAttenteMin"></div></div>
            
            <div><span class="nomChamp">Kcal (pour la quantité total)</span><div class="champ"><input type="number" v-model="kcal"></div></div>
            <div><span class="nomChamp">Glucides (en g, pour la quantité total)</span><div class="champ"><input type="number" v-model="glucides"></div></div>
            <div><span class="nomChamp">Lipides (en g, pour la quantité total)</span><div class="champ"><input type="number" v-model="lipides"></div></div>
            <div><span class="nomChamp">Proteines (en g, pour la quantité total)</span><div class="champ"><input type="number" v-model="proteines"></div></div>
            
            <div><span class="nomChamp">Ingrédients</span><div class="champ"><TextareaAutosize v-model="ingredients" placeholder="Ex: Petit pain 3 cuillères à soupe (ingrédient quantité unité)"/></div></div>
            <div><span class="nomChamp">Etapes</span><div class="champ"><TextareaAutosize v-model="etapes"/></div></div>
            <div><span class="nomChamp">Variantes</span><div class="champ"><TextareaAutosize v-model="variantes"/></div></div>
            <div><span class="nomChamp">Remarques</span><div class="champ"><TextareaAutosize v-model="remarques"/></div></div>
            <div><span class="nomChamp">Inspirations</span><div class="champ"><TextareaAutosize v-model="inspirations" placeholder="Ex: [nom](url) note"/></div></div>
        </div>
        <div id="affichage">
            <div id="boutonGenerer" @click="generate">Enregistrer</div>
            <pre>{{resultat}}</pre>
        </div>
    </div>`,
	data() {
		let domaines = ["Cuisine", "Maison", "Cosmetique"]
        let date = new Date();
		return {
            recettes: RECETTES,
            domaineRecette : "",
            mapCategoriesParDomaine: CATEGORIES,
            categories: [],
            sousCategories: [],
            images: "",
            nbPortions: 1,
            defPortion: "",
            tempsCuissonMin: null,
            tempsPreparationMin: null,
            tempsAttenteMin: null,
            kcal: null,
            glucides: null,
            lipides: null,
            proteines: null,
            ingredients: "",
            etapes: "",
            variantes: "",
            remarques: "",
            inspirations: "",
            nom : "",
            domaines,
            tagsRecette: null,
            nouveauxTags:"",
            date: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
		}
    },
    computed: {
        tags() {
            let tags = new Set();
            this.recettes.filter(r => r.tags).flatMap(r => r.tags).forEach(t => tags.add(t));
            return [...tags].sort();
        },
        categoriesDuDomaine() {
            return this.mapCategoriesParDomaine[this.domaineRecette] || [];
        },
        recette() {
            let apportNutritionelTotal = [];
            if (this.kcal) apportNutritionelTotal.push({type: "kcal", quantite: this.kcal});
            if (this.glucides) apportNutritionelTotal.push({type: "glucides", quantite: this.glucides, unite: "g"});
            if (this.proteines) apportNutritionelTotal.push({type: "proteines", quantite: this.proteines, unite: "g"});
            if (this.lipides) apportNutritionelTotal.push({type: "lipides", quantite: this.lipides, unite: "g"});
            let regexIngredients = /^(\D+)( (\d+))?( (\D+))?$/;
            let regexInspirations = /^\[(.*)\](\((.*)\))?( (.*))?/;
            let nouveauxTagsSplit = this.nouveauxTags.split(', ').filter(e => e)
            return {
                domaine : this.domaineRecette,
                nom : this.nom,
                dateAjout : this.date,
                categories : this.categories.map(c => c.id),
                sousCategories : this.sousCategories.map(c => c.id),
                images: this.images.split('\n').filter(e => e).map(i => "_sources/" + (this.domaineRecette ? (this.domaineRecette.toLowerCase()) : "") + "/images/" + i),
                tags: [...(this.tagsRecette||[]), ...nouveauxTagsSplit],
                nbPortions: this.nbPortions,
                defPortion: this.defPortion,
                tempsPreparationMin : this.tempsPreparationMin,
                tempsAttenteMin : this.tempsAttenteMin,
                tempsCuissonMin : this.tempsCuissonMin,
                apportNutritionelTotal: apportNutritionelTotal,
                ingredients: this.ingredients.split('\n').filter(e => regexIngredients.test(e)).map(i => {
                    let res = regexIngredients.exec(i);
                    return {
                        nom: res[1],
                        quantite: res[3] || null,
                        unite: res[5] || null
                    }
                }),
                etapes : this.etapes.split('\n').filter(e => e),
                variantes : this.variantes.split('\n').filter(e => e),
                remarques : this.remarques.split('\n').filter(e => e),
                inspirations : this.inspirations.split('\n').filter(e => regexInspirations.test(e)).map(i => {
                    let res = regexInspirations.exec(i);
                    return {
                        nom: res[1],
                        url: res[3] || null,
                        note: res[5] || null
                    }
                })
            }
        },
        resultat(){
            return JSON.stringify(this.recette, null, '\t')
        }
    },
    methods: {
        getTags(input) {
			if (input.length < 2) { return [] }
			return this.tags.filter(t => t.toLowerCase().includes(input.toLowerCase()))
        },
        generate() {
            var postListRef = firebase.database().ref('recettes');
            var newPostRef = postListRef.push();
            newPostRef.set(this.recette);
            this.reinit()
        },
        reinit() {
            let date = new Date();
            this.domaineRecette = "";
            this.categories= [];
            this.sousCategories= [];
            this.images= "";
            this.nbPortions= 1;
            this.defPortion= "";
            this.tempsCuissonMin= null;
            this.tempsPreparationMin= null;
            this.tempsAttenteMin= null;
            this.kcal= null;
            this.glucides= null;
            this.lipides= null;
            this.proteines= null;
            this.ingredients= "";
            this.etapes= "";
            this.variantes= "";
            this.remarques= "";
            this.inspirations= "";
            this.nom = "";
            this.tagsRecette= null;
            this.nouveauxTags="";
            this.date= `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        }
    }
}