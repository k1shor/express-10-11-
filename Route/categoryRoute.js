const express = require('express')
const router = express.Router()

const { addCategory, showCategories } = require('../Controller/categoryController')
// const { route } = require('express/lib/application')
// const { showInfo, showMessage } = require('../Controller/categoryController')

// router.get('/',showInfo)
// router.get('/message',showMessage)

router.post('/addcategory',addCategory)

router.get('/categories',showCategories)






module.exports = router