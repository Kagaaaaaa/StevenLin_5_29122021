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
    color.innerHTML = currentProduct.colors.map(color => `<option value="${color}">${color}</option>`);
}

showOneProducts()

quantity.value = 1;
const quantityCheck = quantity.addEventListener("change", () =>{
    quantityRegex = /^[1-9]$|^[1-9][0-9]$|^(100)$/;
    if(quantity.value.match(quantityRegex)){
        console.log("everything okay")
    } else{
        alert("Veuillez mettre un nombres entre 1 et 100")
        quantity.value = 1;
    }
}) 

let cartProduct;
//Sur le click du bouton ajouter , on récupère ce qu'il y a dans le localstorage , on check l'id et la couleur du currentProduct, si existant : on modifie sinon création d'un objet
const pushIntoCart = addToCart.addEventListener('click', () => {
    let cart = JSON.parse(localStorage.getItem('cart'));
    let colorQuantity = parseInt(quantity.value, 10);
    
    if(!cart){cart = []};

    const index = cart.findIndex(product => product.id == currentProduct._id);
    
    if(index >= 0 ){
        const colorIndex = cart[index].colors.findIndex(el => el.name == color.value);
        if(colorIndex >= 0){
            cart[index].colors[colorIndex].quantity = parseInt(cart[index].colors[colorIndex].quantity, 10) + colorQuantity;
        } else {
            cart[index].colors.push({
                name : color.value, quantity : colorQuantity
            })
        }
    } else{
        cart.push({
            id : currentProduct._id, 
            name : currentProduct.name, 
            imageUrl : currentProduct.imageUrl,
            altTxt : currentProduct.altTxt,
            price : currentProduct.price, 
            colors : [{name : color.value, quantity : colorQuantity}]
        })                       
    }
    localStorage.setItem('cart', JSON.stringify(cart))
}, false)