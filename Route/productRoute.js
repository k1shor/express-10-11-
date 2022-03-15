const express = require('express')
const { addProduct, showProducts, productDetails, updateProduct, deleteProduct } = require('../Controller/productController')
const { requireSignin } = require('../Controller/userController')
const upload = require('../middleware/upload')
const { productValidation } = require('../Validation/productValidation')
const router = express.Router()

router.post('/addproduct',upload.single('product_image'),productValidation,addProduct)
router.get('/showProducts',showProducts)
router.get('/productdetail/:id',productDetails)
router.put('/updateproduct/:id', updateProduct)
router.delete('/deleteproduct/:id',deleteProduct)


module.exports = router