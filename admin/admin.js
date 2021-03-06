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
            <div><span class="nomChamp">Fichier Image</span><div class="champ"><input type="file" multiple v-on:change="enregistrePathImage" ref="fichierImageInput" accept="image/*"></div></div>
            <div><span class="nomChamp">Nombre de portion</span><div class="champ"><inputNumber v-model="nbPortions" min="1"></inputNumber></div></div>
            <div><span class="nomChamp">Définition de portion</span><div class="champ"><input v-model="defPortion" placeholder="Ex: petit pot"></div></div>
            <div><span class="nomChamp">Temp de cuisson (en min)</span><div class="champ"><input type="number" v-model="tempsCuissonMin"></div></div>
            <div><span class="nomChamp">Temp de préparation (en min)</span><div class="champ"><input type="number" v-model="tempsPreparationMin"></div></div>
            <div><span class="nomChamp">Temp d'attente (en min)</span><div class="champ"><input type="number" v-model="tempsAttenteMin"></div></div>
            
            <div><span class="nomChamp">Kcal (pour la quantité total)</span><div class="champ"><input type="number" v-model="kcal"></div></div>
            <div><span class="nomChamp">Glucides (en g, pour la quantité total)</span><div class="champ"><input type="number" v-model="glucides"></div></div>
            <div><span class="nomChamp">Lipides (en g, pour la quantité total)</span><div class="champ"><input type="number" v-model="lipides"></div></div>
            <div><span class="nomChamp">Proteines (en g, pour la quantité total)</span><div class="champ"><input type="number" v-model="proteines"></div></div>
            
            <div><span class="nomChamp">Ingrédients</span><div class="champ"><TextareaAutosize v-model="ingredients" placeholder="Ex: Petit pain 3 cuillères à soupe (ingrédient quantité unité (note))"/></div></div>
            <div><span class="nomChamp">Ustensiles</span><div class="champ"><TextareaAutosize v-model="ustensiles" placeholder="Ex: Grand saladier 1 (inox ou verre)"/></div></div>
            <div><span class="nomChamp">Etapes</span><div class="champ"><TextareaAutosize v-model="etapes"/></div></div>
            <div><span class="nomChamp">Variantes</span><div class="champ"><TextareaAutosize v-model="variantes"/></div></div>
            <div><span class="nomChamp">Remarques</span><div class="champ"><TextareaAutosize v-model="remarques"/></div></div>
            <div><span class="nomChamp">Inspirations</span><div class="champ"><TextareaAutosize v-model="inspirations" placeholder="Ex: [nom](url) note"/></div></div>
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

		return {
            recettes: RECETTES,
            domaineRecette : recetteAModifier ? recetteAModifier.domaine : "",
            mapCategoriesParDomaine: CATEGORIES,
            categories: recetteAModifier ? this.retrieveCategories(recetteAModifier) : [],
            sousCategories: recetteAModifier ? this.retrieveSousCategories(recetteAModifier) : [],
            refImages : [],
            ancienneRefImages : recetteAModifier ? this.retrieveRefImages(recetteAModifier) : [],
            nbPortions: recetteAModifier ? recetteAModifier.nbPortions : 1,
            defPortion: recetteAModifier ? recetteAModifier.defPortion : "",
            tempsCuissonMin: recetteAModifier ? (recetteAModifier.tempsCuissonMin ? recetteAModifier.tempsCuissonMin : null) : null,
            tempsPreparationMin: recetteAModifier ? (recetteAModifier.tempsPreparationMin ? recetteAModifier.tempsPreparationMin : null) : null,
            tempsAttenteMin: recetteAModifier ? (recetteAModifier.tempsAttenteMin ? recetteAModifier.tempsAttenteMin : null) : null,
            kcal: recetteAModifier ? this.retrieveKcal(recetteAModifier) : null,
            glucides: recetteAModifier ? this.retrieveGlucides(recetteAModifier) : null,
            lipides: recetteAModifier ? this.retrieveLipides(recetteAModifier) : null,
            proteines: recetteAModifier ? this.retrieveProteines(recetteAModifier) : null,
            ingredients: recetteAModifier ? this.retrieveIngredients(recetteAModifier) : "",
            ustensiles: recetteAModifier ? this.retrieveUstensiles(recetteAModifier) : "",
            etapes: recetteAModifier ? this.retrieveEtapes(recetteAModifier) : "",
            variantes: recetteAModifier ? this.retrieveVariantes(recetteAModifier) : "",
            remarques: recetteAModifier ? this.retrieveRemarques(recetteAModifier) : "",
            inspirations: recetteAModifier ? this.retrieveInspirations(recetteAModifier) : "",
            nom : recetteAModifier ? recetteAModifier.nom : "",
            domaines,
            tagsRecette: recetteAModifier ? this.retrieveTags(recetteAModifier) : null,
            nouveauxTags: "",
            date: recetteAModifier ? recetteAModifier.dateAjout : `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
            connexionMail: null,
            connexionMdp: null,
            connexionErreurs: null,
            store:STORE
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
            return this.mapCategoriesParDomaine[this.domaineRecette] || [];
        },
        recette() {
            let apportNutritionelTotal = [];
            if (this.kcal) apportNutritionelTotal.push({type: "kcal", quantite: this.kcal});
            if (this.glucides) apportNutritionelTotal.push({type: "glucides", quantite: this.glucides, unite: "g"});
            if (this.proteines) apportNutritionelTotal.push({type: "proteines", quantite: this.proteines, unite: "g"});
            if (this.lipides) apportNutritionelTotal.push({type: "lipides", quantite: this.lipides, unite: "g"});
            let nouveauxTagsSplit = this.nouveauxTags.split(', ').filter(e => e)
            return {
                domaine : this.domaineRecette,
                nom : this.nom,
                dateAjout : this.date,
                categories : this.categories.map(c => c.id),
                sousCategories : this.sousCategories.map(c => c.id),
                refImages: this.refImages.concat(this.ancienneRefImages).sort(),
                tags: [...(this.tagsRecette||[]), ...nouveauxTagsSplit],
                nbPortions: this.nbPortions,
                defPortion: this.defPortion,
                tempsPreparationMin : this.tempsPreparationMin,
                tempsAttenteMin : this.tempsAttenteMin,
                tempsCuissonMin : this.tempsCuissonMin,
                apportNutritionelTotal: apportNutritionelTotal,
                ingredients:  this.extraireTableauxDesChamps(this.ingredients, this.extraireIngredient),
                ustensiles: this.extraireTableauxDesChamps(this.ustensiles, this.extraireUstensile),
                etapes : this.extraireTableauxDesChamps(this.etapes),
                variantes : this.extraireTableauxDesChamps(this.variantes),
                remarques : this.extraireTableauxDesChamps(this.remarques),
                inspirations : this.extraireTableauxDesChamps(this.inspirations, this.extraireInspiration)
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
            
            let domaineToGo = this.domaineRecette;
            let categorieToGo = this.categories[0].nom;
            let recetteToGo = this.nom;

            this.reinit()

            if (domaineToGo && categorieToGo && recetteToGo) {
                // go to recette
                this.$router.push({name:"recette", params:{domaine: domaineToGo, categorie: categorieToGo, recette: recetteToGo}}).catch(()=>{})
            }

        },
        reinit() {
            let date = new Date();
            this.domaineRecette = "";
            this.categories= [];
            this.sousCategories= [];
            this.ancienneRefImages= [];
            this.refImages= [];
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
            this.ustensiles= "";
            this.etapes= "";
            this.variantes= "";
            this.remarques= "";
            this.inspirations= "";
            this.nom = "";
            this.tagsRecette= null;
            this.nouveauxTags="";
            this.date= `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        },
        retrieveCategories(recetteAModifier) {            
            return recetteAModifier.categories? CATEGORIES[recetteAModifier.domaine].filter(c => recetteAModifier.categories.includes(c.id)) : []
        },
        retrieveSousCategories(recetteAModifier) {            
            return recetteAModifier.sousCategories? CATEGORIES[recetteAModifier.domaine].filter(c => recetteAModifier.categories.includes(c.id)).flatMap(c => c.sousCategories).filter(sc => recetteAModifier.sousCategories.includes(sc.id)) : []
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

            // Create a root reference
            var storageRef = firebase.storage().ref();

            // Create the file metadata
            var metadata = {
                contentType: 'image/jpg'
            };

            await Promise.all([...this.$refs.fichierImageInput.files].map(async (fichier, i) => {

                let imageRedimensionnee = await this.redimensionnerImage(fichier, i)

                let uploadTask = storageRef
                    .child(this.generateRefImage(imageRedimensionnee, i))
                    .put(imageRedimensionnee, metadata)
                uploadTask.on(
                        firebase.storage.TaskEvent.STATE_CHANGED,
                        (snapshot) => {}, 
                        (error) => { console.log(error) }, 
                        () => {
                            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                console.log('File available at', downloadURL);
                            });
                        }
                    );
            }))

        },
        enregistrePathImage() {
            this.refImages.length = 0;
            [...this.$refs.fichierImageInput.files].forEach((fichier, i) => {
                this.refImages.push(this.generateRefImage(fichier, i))
            })
        },
        generateRefImage(fichier, i) {
            let nomFichier = this.generateNomImage(i)
            //let extension = fichier.name.substring(fichier.name.lastIndexOf('.') + 1)
            return  `images/${this.domaineRecette}/${nomFichier}.jpg`
        },
        generateNomImage(i) {
            // Formate le nom du fichier : nom de la recette en minuscule et sans accents, avec les espaces remplacés par des underscore
            let nomFichier = this.nom.toLowerCase().replaceAll(" ", "_").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            return  `${nomFichier}_${i+this.ancienneRefImages.length}`
        },
        redimensionnerImage(fichierImage, i) {
			return new Promise((resolve, reject) => {
				let reader = new FileReader();
				let canvas = document.createElement('canvas');



				reader.onload = _ => {
					let image = new Image();
					image.onload = _ => {
                        let r = 400 / Math.max(image.width, image.height) // 400 taille max image (hauteur et longueur)
                        let newWidth = image.width * r
                        let newHeight = image.height * r
                        canvas.width = newWidth;
                        canvas.height = newHeight;

						canvas.getContext('2d').drawImage(image, 0, 0, newWidth, newHeight);
						var dataUrl = canvas.toDataURL('image/jpg');
						fetch(dataUrl)
							.then(res => res.blob())
							.then(blob => {
								let returnFile = new File([blob], this.generateNomImage(i), {type: 'image/jpg'});
								resolve(returnFile);
							})
					}
					image.src = reader.result;
				}
				reader.readAsDataURL(fichierImage);
			});
		}
    }
}