// product validation

exports.productValidation = (req,res,next) => {
    req.check('product_name','Product name is requiredddd').notEmpty()
    req.check('product_price','Product price is required').notEmpty()
    .isNumeric()
    .withMessage('Price must be a number')
    req.check('count_In_Stock','Count in stock is required').notEmpty()
    .isNumeric()
    .withMessage('Count must be a number')
    req.check('product_description','Product description is required').notEmpty()
    .isLength({min:20})
    .withMessage('Description must be at least 20 characters in length')
    req.check('category','Category is required').notEmpty()


    const errors = req.validationErrors()

    if(errors){
        const showError = errors.map(err => err.msg)[0]
        return res.status(400).json({error: showError})
    }
    next()
}

exports.categoryValidation = (req,res,next) =>{
    req.check('category_name','Category name is required').notEmpty()

    const errors = req.validationErrors()

    if(errors){
        const showError = errors.map(err => err.msg)[0]
        return res.status(400).json({error: showError})
    }
    next()
}