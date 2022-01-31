// On recupère l'id de la commande pour ensuite l'envoyer dans l'HTML
let currentUrl = new URL(location.href);
let searchUrl = new URLSearchParams(currentUrl.search);
let orderId = searchUrl.get('id');

orderIdHTML = document.querySelector('#orderId');

orderIdHTML.innerHTML = orderId;