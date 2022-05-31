const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// payment process
exports.processPayment = async (req,res) => {
    const paymentIntent = await stripe.paymentIntent.create({
        amount: req.body.amount,
        currency: 'npr',
        metadata: {integration_check: 'accept_a_payment'}
    })
    res.status(200).json({
        success:true,
        client_secret: paymentIntent.client_secret
    })
}


// send stripe key to frontend
exports.sendStripeKey = async (req,res) => {
    res.status(200).json({
        success: true,
        stripeAPIKey: process.env.STRIPE_API_KEY
    })
}