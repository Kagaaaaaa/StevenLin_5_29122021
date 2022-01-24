let currentUrl = new URL(location.href);
let searchUrl = new URLSearchParams(currentUrl.search);
let orderId = searchUrl.get('id');

orderIdHTML = document.querySelector('#orderId');

orderIdHTML.innerHTML = orderId;