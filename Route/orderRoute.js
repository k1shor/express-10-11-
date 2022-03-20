const express = require('express')
const router = express.Router()
const { placeOrder } = require('../Controller/orderController')



router.post('/postorder',placeOrder)


module.exports = router