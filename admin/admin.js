let admin = {
    template : `<div id="admin">
        <div id="connexion" v-if="!estConnecte">
            <form id="signup" method="post" @submit.prevent="connecter">
                <div id="formulaireConnexion" class="formulaire">
                    <div>
                        <span class="nomChamp">Adresse mail</span>
                        <div class="champ"><input type="text" name="username" v-model="connexionMail" autocomplete="username" required></div>
                    </div>
                    <div>
                        <span class="nomChamp">Mot de passe</span>
                        <div class="champ"><input type="password" name="password" v-model="connexionMdp" autocomplete="current-password" required></div>
                    </div>
                </div>
                <button class="bouton" type="submit">Se connecter</button>
                <div id="erreurs">
                    <div>{{connexionErreurs}}</div>
                </div>
            </form>
        </div>
        <div class="formulaire" v-else >
            <div><span class="nomChamp">Nom</span><div class="champ"><input v-model="formRecette.nom"></div></div>
            <div>
                <span class="nomChamp">Domaine</span>
                <div class="champ" >
                    <select v-model="formRecette.domaineRecette">
                        <option disabled value="">Choisissez</option>
                        <option v-for="domaine in domaines">{{domaine}}</option>
                    </select>
                </div>
            </div>
            <div>
                <span class="nomChamp">Categories</span>
                <div class="champ">
                    <select v-model="formRecette.categories" multiple>
                        <option v-for="categorie in categoriesDuDomaine" :value="categorie">{{categorie.nom}}</option>
                    </select>
                </div>
            </div>
            <div>
                <span class="nomChamp">Sous-categories</span>
                <div class="champ">
                    <vue-multiselect v-model="formRecette.sousCategories" :options="formRecette.categories" :multiple="true"
                        group-values="sousCategories" group-label="nom" :group-select="true" 
                        track-by="id" label="nom">
                    </vue-multiselect>
                </div>
            </div>
            <div>
                <span class="nomChamp">Tags</span>
                <div class="champ">
                    <vue-multiselect v-model="formRecette.tagsRecette" :options="tags" :multiple="true"
                            :close-on-select="false" :clear-on-select="false" :preserve-search="true" 
                            placeholder="Choisissez un ou des tags existants">
                        <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} options selected</span></template>
                    </vue-multiselect>
                    <input v-model="formRecette.nouveauxTags" placeholder="Ex: tag 1, tag 2">
                </div>
            </div>
            <div><span class="nomChamp">Fichier Image</span><div class="champ"><input type="file" multiple v-on:change="enregistrePathImage" ref="fichierImageInput" accept="image/*"></div></div>
            <div><span class="nomChamp">Nombre de portion</span><div class="champ"><inputNumber v-model="formRecette.nbPortions" min="1"></inputNumber></div></div>
            <div><span class="nomChamp">Définition de portion</span><div class="champ"><input v-model="formRecette.defPortion" placeholder="Ex: petit pot"></div></div>
            <div><span class="nomChamp">Temp de cuisson (en min)</span><div class="champ"><input type="number" v-model="formRecette.tempsCuissonMin"></div></div>
            <div><span class="nomChamp">Temp de préparation (en min)</span><div class="champ"><input type="number" v-model="formRecette.tempsPreparationMin"></div></div>
            <div><span class="nomChamp">Temp d'attente (en min)</span><div class="champ"><input type="number" v-model="formRecette.tempsAttenteMin"></div></div>
            
            <div><span class="nomChamp">Kcal (pour la quantité total)</span><div class="champ"><input type="number" v-model="formRecette.kcal"></div></div>
            <div><span class="nomChamp">Glucides (en g, pour la quantité total)</span><div class="champ"><input type="number" v-model="formRecette.glucides"></div></div>
            <div><span class="nomChamp">Lipides (en g, pour la quantité total)</span><div class="champ"><input type="number" v-model="formRecette.lipides"></div></div>
            <div><span class="nomChamp">Proteines (en g, pour la quantité total)</span><div class="champ"><input type="number" v-model="formRecette.proteines"></div></div>
            
            <div><span class="nomChamp">Ingrédients</span><div class="champ"><TextareaAutosize v-model="formRecette.ingredients" placeholder="Ex: Petit pain 3 cuillères à soupe (ingrédient quantité unité (note))"/></div></div>
            <div><span class="nomChamp">Ustensiles</span><div class="champ"><TextareaAutosize v-model="formRecette.ustensiles" placeholder="Ex: Grand saladier 1 (inox ou verre)"/></div></div>
            <div><span class="nomChamp">Etapes</span><div class="champ"><TextareaAutosize v-model="formRecette.etapes"/></div></div>
            <div><span class="nomChamp">Variantes</span><div class="champ"><TextareaAutosize v-model="formRecette.variantes"/></div></div>
            <div><span class="nomChamp">Remarques</span><div class="champ"><TextareaAutosize v-model="formRecette.remarques"/></div></div>
            <div><span class="nomChamp">Inspirations</span><div class="champ"><TextareaAutosize v-model="formRecette.inspirations" placeholder="Ex: [nom](url) note"/></div></div>
        </div>
        <div id="affichage"  v-if="estConnecte">
            <div id="boutons">
                <div class="bouton" @click="generate">Enregistrer</div>
                <div class="bouton" @click="deconnecter">Se déconnecter</div>
            </div>
            <pre>{{resultat}}</pre>
        </div>
    </div>`,
	data() {
		let domaines = ["Cuisine", "Maison", "Cosmetique"]
        let date = new Date();

        let recetteAModifier = STORE.recetteAModifier
        let recetteCache = window.localStorage.getItem('recetteEnCours') ? JSON.parse(window.localStorage.getItem('recetteEnCours')) : {}

		return {
            recettes: RECETTES,
            mapCategoriesParDomaine: CATEGORIES,
            formRecette: {
                domaineRecette : recetteAModifier ? recetteAModifier.domaine : (recetteCache.domaineRecette || ""),
                categories: recetteAModifier ? this.retrieveCategories(recetteAModifier) : (recetteCache.categories || []),
                sousCategories: recetteAModifier ? this.retrieveSousCategories(recetteAModifier) : (recetteCache.sousCategories || []),
                ancienneRefImages : recetteAModifier ? this.retrieveRefImages(recetteAModifier) : [],
                refImages : [],
                nbPortions: recetteAModifier ? recetteAModifier.nbPortions : (recetteCache.nbPortions || 1),
                defPortion: recetteAModifier ? recetteAModifier.defPortion : (recetteCache.defPortion || ""),
                tempsCuissonMin: recetteAModifier ? (recetteAModifier.tempsCuissonMin ? recetteAModifier.tempsCuissonMin : null) : (recetteCache.tempsCuissonMin || null),
                tempsPreparationMin: recetteAModifier ? (recetteAModifier.tempsPreparationMin ? recetteAModifier.tempsPreparationMin : null) : (recetteCache.tempsPreparationMin || null),
                tempsAttenteMin: recetteAModifier ? (recetteAModifier.tempsAttenteMin ? recetteAModifier.tempsAttenteMin : null) : (recetteCache.tempsAttenteMin || null),
                kcal: recetteAModifier ? this.retrieveKcal(recetteAModifier) : (recetteCache.kcal || null),
                glucides: recetteAModifier ? this.retrieveGlucides(recetteAModifier) : (recetteCache.glucides || null),
                lipides: recetteAModifier ? this.retrieveLipides(recetteAModifier) : (recetteCache.lipides || null),
                proteines: recetteAModifier ? this.retrieveProteines(recetteAModifier) : (recetteCache.proteines || null),
                ingredients: recetteAModifier ? this.retrieveIngredients(recetteAModifier) : (recetteCache.ingredients || ""),
                ustensiles: recetteAModifier ? this.retrieveUstensiles(recetteAModifier) : (recetteCache.ustensiles || ""),
                etapes: recetteAModifier ? this.retrieveEtapes(recetteAModifier) : (recetteCache.etapes || ""),
                variantes: recetteAModifier ? this.retrieveVariantes(recetteAModifier) : (recetteCache.variantes || ""),
                remarques: recetteAModifier ? this.retrieveRemarques(recetteAModifier) : (recetteCache.remarques || ""),
                inspirations: recetteAModifier ? this.retrieveInspirations(recetteAModifier) : (recetteCache.inspirations || ""),
                nom : recetteAModifier ? recetteAModifier.nom : (recetteCache.nom || ""),
                tagsRecette: recetteAModifier ? this.retrieveTags(recetteAModifier) : (recetteCache.tagsRecette || null),
                nouveauxTags: (recetteCache.nouveauxTags || ""),
                date: recetteAModifier ? recetteAModifier.dateAjout : (recetteCache.date || `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`),
            },
            domaines,
            connexionMail: null,
            connexionMdp: null,
            connexionErreurs: null,
            store:STORE
		}
    },
    watch: {
        formRecette: {
            handler(newVal) {
                if (!this.recetteAModifier) window.localStorage.setItem('recetteEnCours', JSON.stringify(newVal));
            },
            deep: true
        }
    },
    computed: {
        estConnecte() {
            return this.store.estConnecte
        },
        tags() {
            let tags = new Set();
            this.recettes.filter(r => r.tags).flatMap(r => r.tags).forEach(t => tags.add(t));
            return [...tags].sort();
        },
        categoriesDuDomaine() {
            return this.mapCategoriesParDomaine[this.formRecette.domaineRecette] || [];
        },
        recette() {
            let apportNutritionelTotal = [];
            if (this.formRecette.kcal) apportNutritionelTotal.push({type: "kcal", quantite: this.formRecette.kcal});
            if (this.formRecette.glucides) apportNutritionelTotal.push({type: "glucides", quantite: this.formRecette.glucides, unite: "g"});
            if (this.formRecette.proteines) apportNutritionelTotal.push({type: "proteines", quantite: this.formRecette.proteines, unite: "g"});
            if (this.formRecette.lipides) apportNutritionelTotal.push({type: "lipides", quantite: this.formRecette.lipides, unite: "g"});
            let nouveauxTagsSplit = this.formRecette.nouveauxTags.split(', ').filter(e => e)
            return {
                domaine : this.formRecette.domaineRecette,
                nom : this.formRecette.nom,
                dateAjout : this.formRecette.date,
                categories : this.formRecette.categories.map(c => c.id),
                sousCategories : this.formRecette.sousCategories.map(c => c.id),
                refImages: this.formRecette.refImages.concat(this.formRecette.ancienneRefImages).sort(),
                tags: [...(this.formRecette.tagsRecette||[]), ...nouveauxTagsSplit],
                nbPortions: this.formRecette.nbPortions,
                defPortion: this.formRecette.defPortion,
                tempsPreparationMin : this.formRecette.tempsPreparationMin,
                tempsAttenteMin : this.formRecette.tempsAttenteMin,
                tempsCuissonMin : this.formRecette.tempsCuissonMin,
                apportNutritionelTotal: apportNutritionelTotal,
                ingredients:  this.extraireTableauxDesChamps(this.formRecette.ingredients, this.extraireIngredient),
                ustensiles: this.extraireTableauxDesChamps(this.formRecette.ustensiles, this.extraireUstensile),
                etapes : this.extraireTableauxDesChamps(this.formRecette.etapes),
                variantes : this.extraireTableauxDesChamps(this.formRecette.variantes),
                remarques : this.extraireTableauxDesChamps(this.formRecette.remarques),
                inspirations : this.extraireTableauxDesChamps(this.formRecette.inspirations, this.extraireInspiration)
            }
        },
        resultat(){
            return JSON.stringify(this.recette, null, '\t')
        }
    },
    methods: {
        extraireTableauxDesChamps(value, functionCreationObjet) {
            let regexTitreTableau = /^# (.*)/;
            return value.split('##')
                .map(e => {
                    tmp = [];
                    e.split('\n')
                        .forEach(ee => {
                            if (ee.startsWith('#')) tmp.nom = regexTitreTableau.exec(ee)[1]
                            else if (ee) tmp.push(functionCreationObjet ? functionCreationObjet(ee) : ee)
                        });
                    return tmp
                })
                .filter(e => e.length)
        },
        extraireInspiration(ligneInspiration) {
            let regexInspirations = /^\[(.*)\](\((.*)\))?( (.*))?/;
            if (regexInspirations.test(ligneInspiration)) {
                let res = regexInspirations.exec(ligneInspiration);
                return {
                    nom: res[1],
                    url: res[3] || null,
                    note: res[5] || null
                }
            }
        },
        extraireIngredient(ligneIngredient) {
            let regexIngredients = /^(\D+)( (\d+(?:\.\d+)?))?( ([^\d\(\)]+))?( \((.*)\))?$/;
            if (regexIngredients.test(ligneIngredient)) {
                let res = regexIngredients.exec(ligneIngredient);
                return {
                    nom: res[1],
                    quantite: res[3] || null,
                    unite: res[5] || null,
                    note: res[7] || null
                }
            }
        },
        extraireUstensile(ligneUstensile) {
            let regexUstensiles = /^(\D+)( (\d+(?:\.\d+)?))?( \((.*)\))?$/;
            if (regexUstensiles.test(ligneUstensile)) {
                let res = regexUstensiles.exec(ligneUstensile);
                return {
                    nom: res[1],
                    quantite: res[3] || null,
                    note: res[5] || null
                }
            }
        },
        getTags(input) {
			if (input.length < 2) { return [] }
			return this.tags.filter(t => t.toLowerCase().includes(input.toLowerCase()))
        },
        connecter(event) {
            if (this.connexionMail && this.connexionMdp) {
                event.preventDefault();

                firebase.auth().signInWithEmailAndPassword(this.connexionMail, this.connexionMdp)
                .then((userCredential) => {
                    if (window.PasswordCredential) {
                        var c = new PasswordCredential(event.target);
                        navigator.credentials.store(c)
                        .then(res => console.log(res));
                      } else {
                        return Promise.resolve(profile);
                      }
                })
                .catch((error) => {
                    this.connexionErreurs = error.message
                });
            }
        },
        deconnecter() {
            firebase.auth().signOut().then(() => {
                // Sign-out successful.
              }).catch((error) => {
                // An error happened.
              });
        },
        async generate() {
            await this.enregistreImage()

            if (STORE.recetteAModifier) {
                var update = {};
                update[`/recettes/${STORE.recetteAModifier.uuid}`] = this.recette
                firebase.database().ref().update(update, error => {
                    if (!error) {
                        STORE.recetteAModifier = null
                    }
                })
            } else {
                firebase.database().ref('recettes').push().set(this.recette)  
            }
            
            let domaineToGo = this.formRecette.domaineRecette;
            let categorieToGo = this.formRecette.categories[0].nom;
            let recetteToGo = this.formRecette.nom;

            this.reinit()

            if (domaineToGo && categorieToGo && recetteToGo) {
                // go to recette
                this.$router.push({name:"recette", params:{domaine: domaineToGo, categorie: categorieToGo, recette: recetteToGo}}).catch(()=>{})
            }

        },
        reinit() {
            let date = new Date();
            this.formRecette.domaineRecette = "";
            this.formRecette.categories= [];
            this.formRecette.sousCategories= [];
            this.formRecette.ancienneRefImages= [];
            this.formRecette.refImages= [];
            this.formRecette.nbPortions= 1;
            this.formRecette.defPortion= "";
            this.formRecette.tempsCuissonMin= null;
            this.formRecette.tempsPreparationMin= null;
            this.formRecette.tempsAttenteMin= null;
            this.formRecette.kcal= null;
            this.formRecette.glucides= null;
            this.formRecette.lipides= null;
            this.formRecette.proteines= null;
            this.formRecette.ingredients= "";
            this.formRecette.ustensiles= "";
            this.formRecette.etapes= "";
            this.formRecette.variantes= "";
            this.formRecette.remarques= "";
            this.formRecette.inspirations= "";
            this.formRecette.nom = "";
            this.formRecette.tagsRecette= null;
            this.formRecette.nouveauxTags="";
            this.formRecette.date= `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`

            window.localStorage.removeItem('recetteEnCours')
        },
        retrieveCategories(recetteAModifier) {            
            return recetteAModifier.categories? CATEGORIES[recetteAModifier.domaine].filter(c => recetteAModifier.categories.includes(c.id)) : []
        },
        retrieveSousCategories(recetteAModifier) {            
            return recetteAModifier.sousCategories? CATEGORIES[recetteAModifier.domaine].filter(c => recetteAModifier.categories.includes(c.id)).flatMap(c => c.sousCategories || []).filter(sc => recetteAModifier.sousCategories.includes(sc.id)) : []
        },
        retrieveRefImages(recetteAModifier) {
            return recetteAModifier.refImages || [];
        },
        retrieveTags(recetteAModifier) {
            let tags = new Set();
            RECETTES.filter(r => r.tags).flatMap(r => r.tags).forEach(t => tags.add(t));
            return recetteAModifier.tags ? [...tags].sort().filter(t => recetteAModifier.tags.includes(t)) : [];
        },
        retrieveIngredients(recetteAModifier) {
            if (!recetteAModifier.ingredients) return ""
            return recetteAModifier.ingredients
                    .map(t => 
                        (t.nom ? `### ${t.nom}\n` : "") +
                        Object.keys(t).filter(k => !isNaN(k)).map(k => t[k]).map(i =>
                            "" + i.nom
                            + (i.quantite ? ` ${i.quantite}` : "")
                            + (i.unite ? ` ${i.unite}` : "")
                            + (i.note ? ` (${i.note})` : "")
                        )
                        .join("\n")
                    ).join("\n")
        },
        retrieveUstensiles(recetteAModifier) {
            if (!recetteAModifier.ustensiles) return ""

            return recetteAModifier.ustensiles
                    .map(t => 
                        (t.nom ? `### ${t.nom}\n` : "") +
                        Object.keys(t).filter(k => !isNaN(k)).map(k => t[k]).map(u =>
                            "" + u.nom
                            + (u.quantite ? ` ${u.quantite}` : "")
                            + (u.note ? ` (${u.note})` : "")
                        )
                        .join("\n")
                    ).join("\n")
        },
        retrieveEtapes(recetteAModifier) {
            if (!recetteAModifier.etapes) return ""
            return recetteAModifier.etapes
                    .map(t => 
                        (t.nom ? `### ${t.nom}\n` : "") +
                        Object.keys(t).filter(k => !isNaN(k)).map(k => t[k]).join("\n")
                    ).join("\n")
        },
        retrieveVariantes(recetteAModifier) {
            if (!recetteAModifier.variantes) return ""
            return recetteAModifier.variantes
                    .map(t => 
                        (t.nom ? `### ${t.nom}\n` : "") +
                        Object.keys(t).filter(k => !isNaN(k)).map(k => t[k]).join("\n")
                    ).join("\n")
        },
        retrieveRemarques(recetteAModifier) {
            if (!recetteAModifier.remarques) return ""
            return recetteAModifier.remarques
                    .map(t => 
                        (t.nom ? `### ${t.nom}\n` : "") +
                        Object.keys(t).filter(k => !isNaN(k)).map(k => t[k]).join("\n")
                    ).join("\n")
        },
        retrieveInspirations(recetteAModifier) {
            if (!recetteAModifier.inspirations) return ""

            return recetteAModifier.inspirations
                    .map(t => 
                        (t.nom ? `### ${t.nom}\n` : "") +
                        Object.keys(t).filter(k => !isNaN(k)).map(k => t[k]).map(i =>
                            "[" + i.nom + "]"
                            + (i.url ? `(${i.url})` : "")
                            + (i.note ? ` ${i.note}` : "")
                        )
                        .join("\n")
                    ).join("\n")
        },
        retrieveKcal(recetteAModifier) {
            if (!recetteAModifier.apportNutritionelTotal) return null;
            return recetteAModifier.apportNutritionelTotal.find(a => a.type === "kcal")?.quantite;
        },
        retrieveGlucides(recetteAModifier) {
            if (!recetteAModifier.apportNutritionelTotal) return null;
            return recetteAModifier.apportNutritionelTotal.find(a => a.type === "glucides")?.quantite;
        },
        retrieveLipides(recetteAModifier) {
            if (!recetteAModifier.apportNutritionelTotal) return null;
            return recetteAModifier.apportNutritionelTotal.find(a => a.type === "lipides")?.quantite;
        },
        retrieveProteines(recetteAModifier) {
            if (!recetteAModifier.apportNutritionelTotal) return null;
            return recetteAModifier.apportNutritionelTotal.find(a => a.type === "proteines")?.quantite;
        },
        async enregistreImage() {
            await ADMIN_UTILS.enregistreImage(this.$refs.fichierImageInput, this.formRecette.nom, this.formRecette.ancienneRefImages.length, this.formRecette.domaineRecette);
        },
        enregistrePathImage() {
            ADMIN_UTILS.enregistrePathImage(this.$refs.fichierImageInput, this.formRecette.refImages, this.formRecette.nom, this.formRecette.ancienneRefImages.length, this.formRecette.domaineRecette);
        }
    }
}