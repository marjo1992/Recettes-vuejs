let ADMIN_UTILS = {
    async enregistreImage(inputFile, nom, nbAnciennesRefs, dossier, resize = 400) {

        // Create a root reference
        var storageRef = firebase.storage().ref();

        // Create the file metadata
        var metadata = {
            contentType: 'image/jpg'
        };

        await Promise.all([...inputFile.files].map(async (fichier, i) => {

            let imageRedimensionnee = await this.redimensionnerImage(fichier, nom, nbAnciennesRefs, i, resize)

            let uploadTask = storageRef
                .child(this.generateRefImage(dossier, nom, nbAnciennesRefs, i))
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
    enregistrePathImage(inputFile, refImages, nom, nbAnciennesRefs, dossier) {
        refImages.length = 0;
        [...inputFile.files].forEach((fichier, i) => {
            refImages.push(this.generateRefImage(dossier, nom, nbAnciennesRefs, i))
        })
    },
    generateRefImage(dossier, nom, nbAnciennesRefs, i) {
        let nomFichier = this.generateNomImage(nom, nbAnciennesRefs, i)
        return  `images/${dossier}/${nomFichier}.jpg`
    },
    generateNomImage(nom, nbAnciennesRefs, i) {
        // Formate le nom du fichier : nom de la recette en minuscule et sans accents, avec les espaces remplacés par des underscore
        let nomFichier = nom.toLowerCase().replaceAll(" ", "_").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        return  `${nomFichier}_${i+nbAnciennesRefs}`
    },
    redimensionnerImage(fichierImage, nom, nbAnciennesRefs, i, resize) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            let canvas = document.createElement('canvas');

            reader.onload = _ => {
                let image = new Image();
                image.onload = _ => {
                    let r = resize / Math.max(resize, image.width, image.height) // Si image plus petite que resize, pas d'effet
                    let newWidth = image.width * r
                    let newHeight = image.height * r
                    canvas.width = newWidth;
                    canvas.height = newHeight;

                    canvas.getContext('2d').drawImage(image, 0, 0, newWidth, newHeight);
                    var dataUrl = canvas.toDataURL('image/jpg');
                    fetch(dataUrl)
                        .then(res => res.blob())
                        .then(blob => {
                            let returnFile = new File([blob], this.generateNomImage(nom, nbAnciennesRefs, i), {type: 'image/jpg'});
                            resolve(returnFile);
                        })
                }
                image.src = reader.result;
            }
            reader.readAsDataURL(fichierImage);
        });
    }
}