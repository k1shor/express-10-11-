const express = require('express')
const router = express.Router()
const { placeOrder, orderList, orderDetail, userOrder, updateOrder, deleteOrder } = require('../Controller/orderController')
const { requireSignin } = require('../Controller/userController')



router.post('/postorder', requireSignin, placeOrder)
router.get('/orderlist',orderList)
router.post('/orderdetail/:orderid',orderDetail)
router.post('/userorder/:userid',userOrder)
router.put('/updateOrder/:orderid', updateOrder)
router.delete('/deleteOrder/:orderid', deleteOrder)


module.exports = router