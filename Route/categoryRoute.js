const express = require('express')
const router = express.Router()

const { addCategory, showCategories, findCategory, updateCategory, deleteCategory } = require('../Controller/categoryController')
const { requireSignin } = require('../Controller/userController')
const { categoryValidation } = require('../Validation/productValidation')
// const { route } = require('express/lib/application')
// const { showInfo, showMessage } = require('../Controller/categoryController')

// router.get('/',showInfo)
// router.get('/message',showMessage)

router.post('/addcategory',requireSignin,categoryValidation, addCategory)

router.get('/categories',showCategories)
router.get('/findcategory/:id',findCategory)
router.put('/updateCategory/:id', requireSignin, categoryValidation,updateCategory)
router.delete('/deleteCategory/:id', requireSignin,deleteCategory)






module.exports = router