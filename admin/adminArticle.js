let adminArticle = {
    template : `<div id="adminArticle">
        <div class="formulaire" v-if="estConnecte" >
            <div><span class="nomChamp">Nom</span><div class="champ"><input v-model="nom"></div></div>
            <div><span class="nomChamp">Fichier Image</span><div class="champ"><input type="file" v-on:change="enregistrePathImage" ref="fichierImageInput" accept="image/*"></div></div>
            <div><span class="nomChamp">Inspirations</span><div class="champ"><textarea v-model="inspirations" placeholder="Ex: [nom](url) note"/></div></div>
            <div id="inputTexteArticle"><div class="champ"><textarea v-model="textMd" placeholder="Texte en markdown"/></div></div>
        </div>
        <div id="affichage"  v-if="estConnecte">
            <div id="boutons">
                <div class="bouton" @click="generate">Enregistrer</div>
            </div>
            <div id="article"><vue-showdown id="blocTextArticle" :markdown="textMd"></vue-showdown></div>
        </div>
    </div>`,
	data() {
        let date = new Date();
        let articleAModifier = STORE.articleAModifier

		return {
            articles: ARTICLES,
            nom : articleAModifier ? articleAModifier.nom : "",
            refImages : [],
            ancienneRefImages : articleAModifier ? this.retrieveRefImages(articleAModifier) : [],
            textMd: articleAModifier ? this.retrieveTextMd(articleAModifier) : "",
            inspirations: articleAModifier ? this.retrieveInspirations(articleAModifier) : "",
            date: articleAModifier ? articleAModifier.dateAjout : `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
            store:STORE
		}
    },
    computed: {
        estConnecte() {
            return this.store.estConnecte
        },
        article() {
            console.log(this.refImages.length ? this.refImages : this.ancienneRefImages)
            console.log('toto')
            return {
                nom : this.nom,
                dateAjout : this.date,
                refImages: this.refImages.length ? this.refImages : this.ancienneRefImages,
                textMd : this.textMd,
                inspirations : this.extraireTableauxDesChamps(this.inspirations, this.extraireInspiration)
            }
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
        async generate() {
            await this.enregistreImage()

            if (STORE.articleAModifier) {
                var update = {};
                update[`/articles/${STORE.articleAModifier.uuid}`] = this.article
                firebase.database().ref().update(update, error => {
                    if (!error) {
                        STORE.articleAModifier = null
                    }
                })
            } else {
                firebase.database().ref('articles').push().set(this.article)  
            }
            
            let articleToGo = this.nom;

            this.reinit()

            if (articleToGo) {
                // go to article
                this.$router.push({name:"article", params:{article: articleToGo}}).catch(()=>{})
            }

        },
        reinit() {
            let date = new Date();
            this.nom = "";
            this.refImages= [];
            this.textMd= "";
            this.inspirations= "";
            this.date= `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        },
        retrieveRefImages(articleAModifier) {
            return articleAModifier.refImages || [];
        },
        retrieveTextMd(articleAModifier) {
            if (!articleAModifier.textMd) return ""
            return articleAModifier.textMd
        },
        retrieveInspirations(articleAModifier) {
            if (!articleAModifier.inspirations) return ""

            return articleAModifier.inspirations
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
        async enregistreImage() {
            await ADMIN_UTILS.enregistreImage(this.$refs.fichierImageInput, this.nom, 0, 'Articles', 800);
        },
        enregistrePathImage() {
            ADMIN_UTILS.enregistrePathImage(this.$refs.fichierImageInput, this.refImages, this.nom, 0, 'Articles');
        }
    }
}