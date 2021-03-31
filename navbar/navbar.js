Vue.component("navbar", {
	template : `<div id="navbar">
		<div id="titreSite">
			<router-link to="/" class="button">Les recettes de Marjolaine</router-link>
		</div>
		<div id="domaines">
			<router-link to="/Cuisine" class="button">Cuisine</router-link>
			<router-link to="/Maison" class="button">Maison</router-link>
			<router-link to="/Cosmetique" class="button">Cosmétique</router-link>
			<router-link to="/Articles" class="button">Articles</router-link>
			<div v-if="estConnecte"><span id="iconeAjouter" class="icon-ajouter" @click="ajouter"></span></div>
		</div>
		<div id="searchBarContainer">
			<searchBar></searchBar>
		</div>
	</div>`
	,
    data() {
        return {
			store: STORE
        }
    },
	computed: {
		estConnecte() {
			return this.store.estConnecte
		}
	},
	methods: {
		ajouter() {
			STORE.recetteAModifier = null
			this.$router.push({name:"admin"}).catch(()=>{
				this.$router.go({ path: "/admin", force: true });
			})
		}
	}
})