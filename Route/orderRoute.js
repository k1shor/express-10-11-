const express = require('express')
const router = express.Router()
const { placeOrder, orderList, orderDetail, userOrder, updateOrder, deleteOrder } = require('../Controller/orderController')



router.post('/postorder',placeOrder)
router.get('/orderlist',orderList)
router.get('/orderdetail/:orderid',orderDetail)
router.get('/userorder/:userid',userOrder)
router.put('/updateOrder/:orderid', updateOrder)
router.delete('/deleteOrder/:orderid', deleteOrder)


module.exports = router