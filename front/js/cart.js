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

showProducts()

const itemQuantity = document.querySelectorAll('.itemQuantity');
const total = () =>{
    let totalQuantity = document.querySelector('#totalQuantity');
    let totalPrice = document.querySelector('#totalPrice')

}

total()

// sur modification du champ de quantité , on récupère l'info sur le produit en question via l'index et on modifie la valeur dans le localstorage
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
            itemInfo.innerHTML = "";
        } else{
            alert('erreur produit');
            console.log(error.message);
        }

        localStorage.setItem('cart', JSON.stringify(cart))
    })
})
