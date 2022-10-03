stage = 'dev';
const host = stage === 'dev' ? 'http://localhost:5000' : 'https://clownfish-app-l9fo7.ondigitalocean.app';

const startCheckout = document.getElementById('startCheckout');

startCheckout.addEventListener('click', () => {
    console.log('Buy btn clicked');
    startCheckout.textContent = "Processing..."
    myProducts()
});

function myProducts() {
    const getProducts = JSON.parse(localStorage.getItem('productsInCart'));

    const products = [];
    for( const property in getProducts) {
        products.push({
            tag: getProducts[property].tag,
            inCart: getproducts[property].inCart
        })
    }

    return products;
}