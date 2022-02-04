let jsonGlobalProduct;
let cart = JSON.parse(localStorage.getItem('cart'));
const cartHTML = document.querySelector('#cart__items');

// On récupère les produits du localstorage et on les affiche sur le panier
const showProducts = () =>{

    cartHTML.innerHTML = (

        cart
        .map(product =>( 
            product.colors.map(i =>(
                `
                <article class="cart__item" data-id="${product.id}" data-color="${i.name}">
                    <div class="cart__item__img">
                      <img src="${product.imageUrl}" alt="${product.altTxt}">
                    </div>
                    <div class="cart__item__content">
                      <div class="cart__item__content__description">
                        <h2>${product.name}</h2>
                        <p>${i.name}</p>
                        <p class="price"></p>
                      </div>
                      <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                          <p>Qté : </p>
                          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${i.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                          <p class="deleteItem">Supprimer</p>
                        </div>
                      </div>
                    </div>
                </article>
                `
            )).join('')
        )).join('')
    )  
}

const getGlobalProduct = async() => {
    jsonGlobalProduct = await fetch('http://localhost:3000/api/products')
    .then(response => response.json())
    .catch(error => { console.log('Something went wrong' + error.message); });
}

showProducts()
getGlobalProduct()

const showPrice = async() =>{
    await getGlobalProduct();
    const price = document.querySelectorAll(".price");
    price.forEach(el =>{
        const closestArticle = el.closest("article");
        const index = jsonGlobalProduct.findIndex(e => e._id == closestArticle.dataset.id);
        if(index >= 0){
        el.innerHTML = jsonGlobalProduct[index].price + "€";
        };
    });
};
showPrice()



const priceHTML = document.querySelector('#totalPrice');
const quantityHTML = document.querySelector('#totalQuantity');
const itemQuantity = document.querySelectorAll('.itemQuantity');
quantityHTML.innerHTML = 0;

// Calcule du total via l'utilisation de findIndex
const total = async() => {
    await showPrice();
    const price = document.querySelectorAll(".price");
    let totalPrice = 0;
    let totalQuantity = 0;
    let currentPrice = 0;

    // Function pour le calcul des quantités
    itemQuantity.forEach(i =>{
        const itemInfo = i.closest("article");
        const index = cart.findIndex(e => e.id == itemInfo.dataset.id);
        const indexColor = cart[index].colors.findIndex(e => e.name == itemInfo.dataset.color);
        if(index >= 0 && indexColor >= 0){
            totalQuantity += parseInt(cart[index].colors[indexColor].quantity, 10);
        }   
    })

    // Function pour le calcul des prix
    price.forEach(e =>{
        const itemInfo = e.closest("article");
        const index = cart.findIndex(e => e.id == itemInfo.dataset.id);
        const indexColor = cart[index].colors.findIndex(e => e.name == itemInfo.dataset.color);
        if(index >= 0 && indexColor >= 0){
            currentPrice = e.innerHTML.replace(/\D/g, '');
            let resultPrice = parseInt(cart[index].colors[indexColor].quantity, 10) * parseInt(currentPrice, 10);
            totalPrice += resultPrice;
        }
    })    

    quantityHTML.innerHTML = totalQuantity;
    priceHTML.innerHTML = totalPrice
};

// Control de la quantité total du panier, si > 100, remet toutes les quantités à 1
const totalControl = async() =>{
    await total();
    if(quantityHTML.innerHTML > 100){
        cart.forEach(i =>{
            i.colors.forEach(el =>{
                el.quantity = 1;
            })
        })
        itemQuantity.forEach(i =>{
            i.value = 1;
        })
        alert("Attention le panier ne peut pas dépasser 100 articles ! Veuillez reconfirmer vos quantités.")
        localStorage.setItem('cart', JSON.stringify(cart));
        total();
    }
}

total();
totalControl();

// sur modification du champ de quantité , on récupère l'info sur le produit en question via l'index et on modifie la valeur dans le localstorage
const modifyQuantity = itemQuantity.forEach(i =>{
    i.addEventListener('change', () =>{
        const itemInfo = i.closest("article");
        const index = cart.findIndex(e => e.id == itemInfo.dataset.id);
        const indexColor = cart[index].colors.findIndex(e => e.name == itemInfo.dataset.color);

        let colorQuantity = parseInt(i.value, 10);

        quantityRegex = /^[1-9]$|^[1-9][0-9]$|^(100)$/;
        if(i.value.match(quantityRegex)){
            if(index >= 0 && indexColor >= 0){
                cart[index].colors[indexColor].quantity = colorQuantity;
            } else{
                alert('erreur produit');
            }    
        } else{
            alert("Veuillez mettre un nombres entre 1 et 100");
            cart[index].colors[indexColor].quantity = 1;
            i.value = 1
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        totalPrice = 0;
        totalQuantity = 0;
        total();
        totalControl()
    })
}) 

// sur click du bouton supprimer, on récupère l'info sur le produit en question via l'index, on delete la couleur et la quantité du localstorage puis on supprime l'html du produit
const deleteHTML = document.querySelectorAll('.deleteItem');
const deleteItem = deleteHTML.forEach(i =>{
    i.addEventListener('click', () =>{
        const itemInfo = i.closest("article");
        const index = cart.findIndex(e => e.id == itemInfo.dataset.id);
        const indexColor = cart[index].colors.findIndex(e => e.name == itemInfo.dataset.color);

        if(index >= 0){
            cart[index].colors.splice(cart[index].colors[indexColor], 1);
            if(cart[index].colors.length === 0){
                cart.splice(index, 1);
            }
            itemInfo.remove();
        } else{
            alert('erreur produit');
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        totalPrice = 0;
        totalQuantity = 0;
        total();
        totalControl()
    })
})

let order = {
    contact : {
        firstName : "",
        lastName : "",
        address : "",
        city : "",
        email : "",
    },
    products : [],
};
const firstNameHTML = document.querySelector('#firstName');
const lastNameHTML = document.querySelector('#lastName');
const addressHTML = document.querySelector('#address');
const cityHTML = document.querySelector('#city');
const emailHTML = document.querySelector('#email');
const orderHTML = document.querySelector('#order');

// Première temps, vérification du formulaire avec du regex basique, si validé on envoie une requete post à l'api qui contient order et il nous retourne la commande + son numéro puis on redirige vers la page confirm
const createOrder = orderHTML.addEventListener('click', async () =>{

    const regexAlpha = /^[a-zA-Z]+$/;
    const regexAlphaNumeric = /^[a-zA-Z0-9 ]*$/;
    const regexEmail = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/;

    // Formulaire + Regex
    if(firstNameHTML.value.match(regexAlpha)){
        order.contact.firstName = firstNameHTML.value
    } else{
        alert('Prénom invalide, veuillez mettre uniquement des lettres');
    }
    if(lastNameHTML.value.match(regexAlpha)){
        order.contact.lastName = lastNameHTML.value
    } else{
        alert('Nom invalide, veuillez mettre uniquement des lettres');
    }
    if(addressHTML.value.match(regexAlphaNumeric)){
        order.contact.address = addressHTML.value
    } else{
        alert('adresse invalide, veuillez mettre uniquement des chiffres et des lettres');
    }
    if(cityHTML.value.match(regexAlphaNumeric)){
        order.contact.city = cityHTML.value
    } else{
        alert('Ville invalide, veuillez mettre uniquement des lettres et des chiffres');
    }
    if(emailHTML.value.match(regexEmail)){
        order.contact.email = emailHTML.value
    } else{
        alert('email invalide, exemple : Jeremie1990@abc.com');
    };

    order.products.push(...cart.map(el =>{
       return el.id;
    }));
    localStorage.removeItem(cart);
    // requete post vers l'api
    fetch('http://localhost:3000/api/products/order', {
        method : "POST",
        headers : {'Content-Type': 'application/json'},
        body : JSON.stringify(order)
    })
    .then(response => response.json())
    .then(data =>{window.location.href = `${window.location.origin}/front/html/confirmation.html?id=${data.orderId}`;});
})
