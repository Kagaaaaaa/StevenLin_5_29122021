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
                        <p>${product.price}€</p>
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

let totalPrice = 0;
const priceHTML = document.querySelector('#totalPrice');
const quantityHTML = document.querySelector('#totalQuantity');
quantityHTML.innerHTML = 0;
const total = () => {
    cart.forEach(product =>{
        let productQ = 1;
        if(product.colors.lenght > 1){
            productQ = product.colors.reduce((p, c) =>{
                if(p instanceof Object){
                    return p.quantity + c.quantity;
                }else{
                    return p + c.quantity;
                }
            })
        } else{
            productQ = product.colors[0].quantity
        }  

        totalPrice += product.price * productQ;
        quantityHTML.innerHTML += parseInt(productQ, 10);
        priceHTML.innerHTML = totalPrice;
    })
};

showProducts()
total()
// sur modification du champ de quantité , on récupère l'info sur le produit en question via l'index et on modifie la valeur dans le localstorage
const itemQuantity = document.querySelectorAll('.itemQuantity');
const modifyQuantity = itemQuantity.forEach(i =>{
    i.addEventListener('change', () =>{
        const itemInfo = i.closest("article");
        const index = cart.findIndex(e => e.id == itemInfo.dataset.id);
        const indexColor = cart[index].colors.findIndex(e => e.name == itemInfo.dataset.color);

        let colorQuantity = parseInt(i.value, 10);
        if(index >= 0 && indexColor >= 0){
            cart[index].colors[indexColor].quantity = colorQuantity;
        } else{
            alert('erreur produit');
            console.log(error.message);
        }

        localStorage.setItem('cart', JSON.stringify(cart))
        total()
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
                cart.splice(index, 1)
            }
            itemInfo.remove();
        } else{
            alert('erreur produit');
            console.log(error.message);
        }

        localStorage.setItem('cart', JSON.stringify(cart))
        total()
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
    products : cart,
};
const firstNameHTML = document.querySelector('#firstName');
const lastNameHTML = document.querySelector('#lastName');
const addressHTML = document.querySelector('#address');
const cityHTML = document.querySelector('#city');
const emailHTML = document.querySelector('#email');
const orderHTML = document.querySelector('#order');


const createOrder = orderHTML.addEventListener('click', () =>{

    const regexAlpha = /^[a-zA-Z]+$/;
    const regexAlphaNumeric = /^[a-zA-Z0-9 ]*$/;
    const regexEmail = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/;

    if(firstNameHTML.value.match(regexAlpha)){
        order.contact.firstName = firstNameHTML.value
    } else{
        alert('Prénom invalide, veuillez mettre uniquement des lettres')
    }
    if(lastNameHTML.value.match(regexAlpha)){
        order.contact.lastName = lastNameHTML.value
    } else{
        alert('Nom invalide, veuillez mettre uniquement des lettres')
    }
    if(addressHTML.value.match(regexAlphaNumeric)){
        order.contact.address = addressHTML.value
    } else{
        alert('adresse invalide, veuillez mettre uniquement des chiffres et des lettres')
    }
    if(cityHTML.value.match(regexAlphaNumeric)){
        order.contact.city = cityHTML.value
    } else{
        alert('Ville invalide, veuillez mettre uniquement des lettres et des chiffres')
    }
    if(emailHTML.value.match(regexEmail)){
        order.contact.email = emailHTML.value
    } else{
        alert('email invalide, exemple : Jeremie1990@abc.com')
    }
    console.log(order)

    fetch('http://localhost:3000/api/products/order', {
        method : "POST",
        headers : {'Content-Type': 'application/json'},
        body : order
    })
    .then(response => response.json())
    .then(data => console.log(data))
})
