Vue.component("carousselPhotos", {
    props : ["photosUrl"],
    template : `<div class="carousselPhotos">
        <div class="carousselPhotosImages">
            <div :class="classeFlecheGauche" v-on:click="changeImagePrecedente"></div>
            <!-- img :src="photosUrl[idPhotoActuelle]" -->
            <div class="imageCaroussel" :style="style"></div>
            <div :class="classeFlecheDroite" v-on:click="changeImageSuivante"></div>
        </div>
        <div class="carousselPhotosPuces">
            <div v-for="idPhoto in photosUrl.keys()" :class="getClasseCercle(idPhoto)" v-on:click="gotoPhoto(idPhoto)"></div>
        </div>
    </div>`,
    data() {
        return {
            idPhotoActuelle : 0,
            classeFlecheGauche : this.photosUrl.length == 1 ? "hidden" : "fleche-gauche",
            classeFlecheDroite : this.photosUrl.length == 1 ? "hidden" : "fleche-droite"
        }
    },
    computed: {
        style() {
            return {
                backgroundImage: `url("${this.photosUrl[this.idPhotoActuelle]}")`
            }
        }
    },
    methods: {
        changeImagePrecedente(){
            this.idPhotoActuelle = this.idPhotoActuelle == 0 ? this.photosUrl.length - 1 : this.idPhotoActuelle - 1
        },
        changeImageSuivante(){
            this.idPhotoActuelle = this.idPhotoActuelle + 1 == this.photosUrl.length ? 0 : this.idPhotoActuelle + 1
        },
        gotoPhoto(idPhoto) {
            this.idPhotoActuelle = idPhoto;
        },
        getClasseCercle(idPhoto){
            return idPhoto == this.idPhotoActuelle ? "cercle selected" : "cercle"
        }
    }
})