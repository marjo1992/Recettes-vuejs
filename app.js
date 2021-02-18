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

// Initialize Firebase
var firebaseConfig = {
	apiKey: "AIzaSyBxla4ypV4DqmM_-9SMUwrmDvyW0CkLJ9c",
	authDomain: "recettes-b9205.firebaseapp.com",
	projectId: "recettes-b9205",
	storageBucket: "recettes-b9205.appspot.com",
	messagingSenderId: "807033148426",
	appId: "1:807033148426:web:1d74d2583628f769417bf3",
	measurementId: "G-C4GD5PCG60"
};
firebase.initializeApp(firebaseConfig);

let RECETTES = [];
let CATEGORIES = {};
firebase.database().ref('recettes').on('value', res => {
	RECETTES.length = 0;
	RECETTES.push(...Object.values(res.val()));
});
firebase.database().ref('categories').on('value', res => {
	let val = res.val();
	Object.keys(val).forEach(k => {
		Vue.set(CATEGORIES, k, val[k]);
	});
});

new Vue({
	el: '#app',
	router: router,
});
