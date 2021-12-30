const image = document.querySelector('.item__img');
const title = document.querySelector('#title');
const price = document.querySelector('#price');
const description = document.querySelector('#description');
const color = document.querySelector('option')
const quantity = document.querySelector('#quantity');

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
    color.innerHTML = `<option value="${currentProduct.colors[0]}">${currentProduct.colors[0]}</option> <option value="${currentProduct.colors[1]}">${currentProduct.colors[1]}</option>`;
}

showOneProducts()