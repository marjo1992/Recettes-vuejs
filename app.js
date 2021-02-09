
const router = new VueRouter({
	routes: [
		{path: '/', component: accueil, name:"accueil"},
		{path: '/admin', component: admin, name:"admin"},
		{path: '/recherche/:tag', component: recherche, name:"recherche"},
		{path: '/Articles/:article', component: article, name:"article"},
		{path: '/:domaine', component: domaine, name:"domaine"},
		{path: '/:domaine/:categorie', component: categorie, name:"categorie"},
		{path: '/:domaine/:categorie/:recette', component: recette, name:"recette"}
	]
});

Vue.component('vue-multiselect', window.VueMultiselect.default)

new Vue({
	el: '#app',
	router: router
});
