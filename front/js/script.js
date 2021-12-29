let jsonGlobalProduct;
const items = document.querySelector('#items')

// On recupère tout les produits de l'api, puis on le met en json pour finalement le mettre dans la variable jsonGlobalProduct
const getGlobalProduct = async() => {
    jsonGlobalProduct = await fetch('http://localhost:3000/api/products')
    .then(response => response.json())
    .catch(error => { console.log('Something went wrong' + error.message); });
    console.log(jsonGlobalProduct)
}

// On créer les Produits sur la page index à partir de jsonGlobalProduct avec la fonction map
const showProducts = async() => {
    await getGlobalProduct();

    items.innerHTML =(
        jsonGlobalProduct.map(product =>(
            `
            <a href="./product.html?id=${product._id}">
                <article>
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                    <h3 class="productName">${product.name}</h3>
                    <p class="productDescription">${product.description}</p>
                </article>
            </a>
            `
        )).join('')
    )
}

showProducts()
