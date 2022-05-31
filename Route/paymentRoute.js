const express = require('express')
const { processPayment, sendStripeKey } = require('../Controller/paymentController')
const router = express.Router()

router.post('/processpayment',processPayment)
router.get('/stripeapikey', sendStripeKey)

module.exports = router