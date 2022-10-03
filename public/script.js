let stage = 'dev';
const mainContainer = document.querySelector('.container');
const candyPage = document.querySelector('.candyPage');
const candyBtn = document.querySelector('.btn');
let  carts = document.querySelectorAll('.add-Cart');

let products = [];

async function getProducts() {
    const host = stage === 'dev' ? 'http://localhost:5000' : 'https://clownfish-app-l9fo7.ondigitalocean.app'
    const response = await axios.get(`${host}/products`);
    console.log(response.data);
    products = response.data.products

    populateProducts();
}
getProducts();

function populateProducts() {
    const container = document.querySelector('.candy-main');

    const productsHtml = products.map( (product, i) => {
        return (
            `
            <div class="custom-card">
          <div class="card-top">
            <img src="${product.image}" alt="${product.description}" class="card-img">
          </div>

          <div class="card-bottom">
            <h2 class="item-name">${product.name}</h2>
            <div class="btn">
              <button class="add-Cart">Add to Cart</button>
            </div>
            <p class="item-Description">${product.description}</p>
            <p class="price">${product.price}</p>
          </div>
        </div>
            `
        )

    })

    if(container) {
        container.innerHTML += productsHtml.toString()
    }

    addCartAction();
}

function addCartAction() {
    let carts = document.querySelectorAll('.add-Cart');

    for(let i=0; i < carts.length; i++) {
        carts[i].addEventListener('click', () => {
            cartNumbers(products[i]);
            totalCost(products[i]);
            console.log("added to cart");
        })
    }
}

/**************************************/
/**************************************/


for (let i=0; i < carts.length; i++) {
    carts[i].addEventListener('click', () => {
        cartNumbers(products[i]);
        totalCost(products[i]);
    })
}

function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');

    if(productNumbers ) {
        document.querySelector('.cart-items').textContent = productNumbers;
    }
}

function cartNumbers(product, action) {
    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);

    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if(action == 'decrease') {
        localStorage.setItem('cartNumbers', productNumbers - 1);
        document.querySelector('.cart-items').textContent = productNumbers - 1;
    } else if(productNumbers) {
        localStorage.setItem("cartNumbers", productNumbers + 1);
        document.querySelector('.cart-items').textContent = productNumbers + 1;
    } else {
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('.cart-items').textContent = 1;
    }

    

    setItems(product);
    
}

function setItems(product) {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    

    if(cartItems != null) {
        if(cartItems[product.tag] == undefined) {
            cartItems = {
                ...cartItems,
                [product.tag]: product
            }
        }
        cartItems[product.tag].inCart += 1;
    } else {
        product.inCart = 1;
        cartItems = {
            [product.tag]: product
        }
    }
    

    localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

function totalCost(product, action) {
    //console.log("the product price is", product.price);

    let cartCost = localStorage.getItem('totalCost');

    if(action == "decrease") {
        cartCost = parseInt(cartCost);

        localStorage.setItem('totalCost', cartCost - product.price)

    }else if(cartCost != null) {
        cartCost = parseInt(cartCost);
        localStorage.setItem("totalCost", cartCost +  product.price);

    } else {
        localStorage.setItem("totalCost", product.price);
    }
    

    

    

}

function displayCart() {
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
    let productContainer = document.querySelector(".products");
    let cartCost = localStorage.getItem('totalCost');

    if(cartItems && productContainer ) {
        productContainer.innerHTML = '';
        Object.values(cartItems).map(item => {
            productContainer.innerHTML += `
            <div class="product">
                <i class="fa-sharp fa-solid fa-circle-xmark"></i>
                <img src="Images/${item.tag}.jpg">
                <span>${item.name}</span>
            </div>
            <div class="price">$${item.price}.00</div>
            <div class="quantity">
            <i class="fa-solid fa-minus"></i>
            <span>${item.inCart}</span>
            <i class="fa-sharp fa-solid fa-plus"></i>
            </div>
            <div class="total">
                $${item.inCart * item.price}.00
            </div>

            `
        });

        productContainer.innerHTML += `
            <div class="basketTotalContainer">
                <h4 class="basketTotalTitle">
                    Basket Total
                </h4>
                <h4 class="basketTotal">
                    $${cartCost}.00
                </h4>
        `
    }

    deleteButtons();
    manageQuantity();
}

function deleteButtons() {
    let deleteButtons = document.querySelectorAll('.product .fa-circle-xmark');
    let productName;
    let productNumbers = localStorage.getItem('cartNumbers');
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let cartCost = localStorage.getItem('totalCost');

    for(let i=0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', () => {
            productName = deleteButtons[i].parentElement.textContent.trim().toLowerCase().replace(/ /g, '');
            
            localStorage.setItem('cartNumbers', productNumbers - cartItems[productName].inCart);

            localStorage.setItem('totalCost', cartCost - (cartItems[productName].price * cartItems[productName].inCart));

            delete cartItems[productName];
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));

            displayCart();
            onLoadCartNumbers();
        });
    }
}

function manageQuantity() {
    let decreaseButtons = document.querySelectorAll('.fa-minus');
    let increaseButtons = document.querySelectorAll('.fa-plus');
    let cartItems = localStorage.getItem('productsInCart');
    let currentQuantity = 0;
    let currentProduct = "";
    cartItems = JSON.parse(cartItems);

    for(let i=0; i < decreaseButtons.length; i++) {
        decreaseButtons[i].addEventListener('click', () => {
            currentQuantity = decreaseButtons[i].parentElement.querySelector('span').textContent;
            console.log(currentQuantity);
            currentProduct = decreaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLowerCase().replace(/ /g, '').trim();
            console.log(currentProduct);

            if(cartItems[currentProduct].inCart > 1) {
                cartItems[currentProduct].inCart = cartItems[currentProduct].inCart -1;
                cartNumbers(cartItems[currentProduct], "decrease");
                totalCost(cartItems[currentProduct], "decrease");
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));
                displayCart();
            }

            
        })
    }

    
    for(let i=0; i < increaseButtons.length; i++) {
        increaseButtons[i].addEventListener('click', () => {
            currentQuantity = increaseButtons[i].parentElement.querySelector('span').textContent;
            console.log(currentQuantity);

           
            currentProduct = increaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLowerCase().replace(/ /g, '').trim();
            console.log(currentProduct);

            
                cartItems[currentProduct].inCart = cartItems[currentProduct].inCart + 1;
                cartNumbers(cartItems[currentProduct]);
                totalCost(cartItems[currentProduct]);
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));
                displayCart();
            
        })
    }
}

onLoadCartNumbers();
displayCart();