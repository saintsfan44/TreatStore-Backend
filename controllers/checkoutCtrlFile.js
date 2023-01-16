const stripe = require('stripe')(process.env.STRIPE_SECRET_kEY);
const { productList } = require('../products');
const Email = require('../utils/email');

exports.checkoutCtrlFunction = async (req, res) => {
    try {

        const productsFromFrontend = req.body.products;
        console.log(productList);

        function productsToBuy() {
            let products = [];

            productList.forEach( singleProductList => {
                productsFromFrontend.forEach(singleProductFrontend => {
                    if(singleProductList.tag === singleProductFrontend.tag) {
                        products.push({
                            
                                //name: singleProductList.name,
                                //description: singleProductList.description,
                                //images: [singleProductList.image],
                                //amount: singleProductList.price * 100,
                                //currency: 'usd',
                                price_data: {
                                  currency: 'usd',
                                  unit_amount: singleProductList.price * 100,
                                  product_data: {
                                    name: singleProductList.name,
                                    description: singleProductList.description,
                                    images: [singleProductList.image],
                                  },
                                },
                                quantity: singleProductFrontend.inCart,
                              
                                })     
                    }
                })
            })

            return products
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            //mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/checkout/success`,
            cancel_url: `${req.protocol}://${req.get('host')}/cart`,
            shipping_address_collection: {
                allowed_countries: ['US', 'GB']
            },
            line_items: productsToBuy(),
            mode: 'payment'

        });

        res.status(200).json({
            status: "success",
            session: session
        })
    } catch (error) {
        console.log(error);
    }
}

exports.cartSuccessFunction = (req, res) => {
    res.render('thankyouPage');
}

exports.finishOrder = async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(
        req.params.id
    )

    console.log("My payment was: ");
    console.log(session);

    if(session.payment_status === "paid") {
        const purchasedProducts = session.display_items.map(product => (
            {
                productName: product.custom.name,
                price: product.amount / 100,
                quantity: product.quantity
            }
        ))
        //save transaction into database

        //send and email
        await new Email({
            name: session.shipping.name,
            email: session.customer_details.email
        }, purchasedProducts, session.amount_total).sendThankYou();

        return res.status(200).json({
            success:true
        })
    }

    res.staus(200).json({
        success: false
    })
}