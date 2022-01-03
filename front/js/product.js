const image = document.querySelector('.item__img');
const title = document.querySelector('#title');
const price = document.querySelector('#price');
const description = document.querySelector('#description');
const color = document.querySelector('#colors')
const quantity = document.querySelector('#quantity');
const addToCart = document.querySelector('#addToCart');

// On créer l'url à partir de la localisation de l'utilisateur, on fait une recherche sur l'url et on récupère uniquement l'id. 
let currentUrl = new URL(location.href);
let searchUrl = new URLSearchParams(currentUrl.search);
let requiredId = searchUrl.get('id');

let currentProduct;

// On récupère le produit dont l'id a été récupéré au préalable 
const getProducts = async() => {    
    currentProduct = await fetch("http://localhost:3000/api/products/" + requiredId)
    .then(response => response.json())
    .catch(err => console.log('Something went wrong' + err.message))
    console.log(currentProduct);
}

// On affiche le produit sur la page product
const showOneProducts = async() =>{
    await getProducts();

    image.innerHTML = `<img src="${currentProduct.imageUrl}" alt="${currentProduct.altTxt}">`;
    title.innerHTML = currentProduct.name;
    price.innerHTML = currentProduct.price;
    description.innerHTML = currentProduct.description;
    color.innerHTML = currentProduct.colors.map(color => `<option value="${colors}">${color}</option>`);
}

showOneProducts()

let cartProduct;
let neededColor;
//Sur le click du bouton ajouter , on récupère l'id du produit ainsi que la couleur et les quantités pour les mettres sur le localstorage 
addToCart.addEventListener('click', () => {

    /* For (i of currentProduct.color) {
        if (i === color.value){
            return neededColor = i = quantity.value;
        } else {
            console.log(error.message)
        }
    } */
    cartProduct = [requiredId, currentProduct.name, currentProduct.imageUrl, color.value, quantity.value];

    if (requiredId === '107fb5b75607497b96722bda5b504926') {
        localStorage.object1 = JSON.stringify(cartProduct);
    } else if ( requiredId === '415b7cacb65d43b2b5c1ff70f3393ad1'){
        localStorage.object2 = JSON.stringify(cartProduct);
    } else if ( requiredId === '055743915a544fde83cfdfc904935ee7'){
        localStorage.object3 = JSON.stringify(cartProduct);
    } else if ( requiredId === 'a557292fe5814ea2b15c6ef4bd73ed83'){
        localStorage.object4 = JSON.stringify(cartProduct);
    } else if ( requiredId === '8906dfda133f4c20a9d0e34f18adcf06'){
        localStorage.object5 = JSON.stringify(cartProduct);
    } else if ( requiredId === '77711f0e466b4ddf953f677d30b0efc9'){
        localStorage.object6 = JSON.stringify(cartProduct);
    } else if ( requiredId === '034707184e8e4eefb46400b5a3774b5f'){
        localStorage.object7 = JSON.stringify(cartProduct);
    } else {
        localStorage.object8 = JSON.stringify(cartProduct);
    }
}, false)