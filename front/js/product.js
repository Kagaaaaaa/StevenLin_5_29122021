const image = document.querySelector('.item__img');
const title = document.querySelector('#title');
const price = document.querySelector('#price');
const description = document.querySelector('#description');
const color = document.querySelector('#colors')
const quantity = document.querySelector('#quantity');
const addToCart = document.querySelector('#addToCart');
let cartProduct;

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

//Sur le click du bouton ajouter , on récupère l'id du produit ainsi que la couleur et les quantités pour les mettres sur le localstorage 
addToCart.addEventListener('click', () => {
    cartProduct = [requiredId, currentProduct.name, color.value, quantity.value];
    localStorage.cart = JSON.stringify(cartProduct);
}, false)