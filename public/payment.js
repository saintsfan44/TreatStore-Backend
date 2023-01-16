stage = 'dev';
const host = stage === 'dev' ? 'http://localhost:5000' : 'https://pretty-pastries.shop';

const stripe = Stripe('pk_test_51LocyQLzN3UbXMRJGNtp7RldWLlfDn8EGtptD4fLPCNMOMDQePfAd4DaUwLAzUulV5yp0wupxQAMNV3Fbb1vEV0D00dQP7p21G');

const startCheckout = document.getElementById('startCheckout');

startCheckout.addEventListener('click', () => {
    console.log('Buy btn clicked');
    startCheckout.textContent = "Processing..."
    buyProducts(myProducts())
});

function myProducts() {
    const getProducts = JSON.parse(localStorage.getItem('productsInCart'));

    const products = [];
    for( const property in getProducts) {
        products.push({
            tag: getProducts[property].tag,
            inCart: getProducts[property].inCart
        })
    }

    return products;
}

async function buyProducts(cartProducts) {
    try {
        const body = JSON.stringify({
            products: cartProducts
        })
        const response = await axios.post(`${host}/checkout`, body, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"

            }
        })

        console.log(response.data);

        localStorage.setItem('sessionId', response.data.session.id);

        await stripe.redirectToCheckout({
            sessionId: response.data.session.id
        })
    } catch (error) {
       
    }
}