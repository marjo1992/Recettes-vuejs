if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/recettes/serviceworker.js', {scope: '/recettes/'});
	});
}

const router = new VueRouter({
	routes: [
		{path: '/', component: accueil, name:"accueil"},
		{path: '/admin', component: admin, name:"admin"},
		{path: '/adminArticle', component: adminArticle, name:"adminArticle"},
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
let ARTICLES = [];

let STORE = {
	estConnecte : false,
	recetteAModifier : null,
	articleAModifier : null
};

const storageRef = firebase.storage().ref();
firebase.database().ref('recettes').on('value', async res => {
	RECETTES.length = 0;
	for (key in res.val()) {
		let recette = res.val()[key];
		recette.uuid = key;
		if (recette.refImages) {
			recette.urlsImagesStock = []
			for (refImage of recette.refImages) {
				try {
					let url = await storageRef.child(refImage).getDownloadURL()
					recette.urlsImagesStock.push(url)
				} catch (e) {
					console.log()
				}
			}
		}
		RECETTES.push(recette);
	}
});

firebase.database().ref('categories').on('value', res => {
	let val = res.val();
	Object.keys(val).forEach(k => {
		Vue.set(CATEGORIES, k, val[k]);
	});
});

firebase.database().ref('articles').on('value', async res => {
	ARTICLES.length = 0;
	for (key in res.val()) {
		let article = res.val()[key];
		article.uuid = key;
		if (article.refImages) {
			article.urlsImagesStock = []
			for (refImage of article.refImages) {
				try {
					let url = await storageRef.child(refImage).getDownloadURL()
					article.urlsImagesStock.push(url)
				} catch (e) {
					console.log()
				}
			}
		}
		ARTICLES.push(article);
	}
});

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		Vue.set(STORE, "estConnecte", true);
	} else {
		Vue.set(STORE, "estConnecte", false);
	}
  });

new Vue({
	el: '#app',
	router: router,
});
