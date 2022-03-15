const express = require('express')
const router = express.Router()

const { addCategory, showCategories, findCategory, updateCategory, deleteCategory } = require('../Controller/categoryController')
// const { route } = require('express/lib/application')
// const { showInfo, showMessage } = require('../Controller/categoryController')

// router.get('/',showInfo)
// router.get('/message',showMessage)

router.post('/addcategory',addCategory)

router.get('/categories',showCategories)
router.get('/findcategory/:id',findCategory)
router.put('/updateCategory/:id',updateCategory)
router.delete('/deleteCategory/:id',deleteCategory)






module.exports = router