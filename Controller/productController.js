const Product = require('../Model/product')

exports.addProduct = async (req, res) => {
    let product = new Product({
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        product_image: req.file.path,
        product_description: req.body.product_description,
        count_In_Stock: req.body.count_In_Stock,
        category: req.body.category
    })
    product = await product.save()
    if (!product) {
        return res.status(400).json({ error: "something went wrong" })
    }
    else {
        res.send(product)
    }
}
// to show all products
exports.showProducts = async (req, res) => {
    let order = req.query.order ? req.query.order : 1
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 20000

    let products = await Product.find().populate('category').sort([[sortBy, order]])
        .limit(limit)
    if (!products) {
        return res.status(400).json({ error: "something went wrong" })
    }
    else {
        res.send(products)
    }
}

// to view a product
exports.productDetails = async (req, res) => {
    let product = await Product.findById(req.params.id).populate('category')
    if (!product) {
        return res.status(400).json({ error: "something went wrong" })
    }
    else {
        res.send(product)
    }
}

// to update a product
exports.updateProduct = async (req, res) => {
    let product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            product_name: req.body.product_name,
            product_price: req.body.product_price,
            product_image: req.file.path,
            product_description: req.body.product_description,
            count_In_Stock: req.body.count_In_Stock,
            category: req.body.category
        },
        { new: true }
    )
    if (!product) {
        return res.status(400).json({ error: "something went wrong" })
    }
    else {
        res.send(product)
    }
}


// to delete a product
exports.deleteProduct = (req, res) => {
    let product = Product.findByIdAndRemove(req.params.id)
        .then(product => {
            if (!product) {
                return res.status(400).json({ error: "product not found" })
            }
            else {
                return res.status(200).json({ msg: "product deleted successfully" })
            }
        })
        .catch(error => res.status(400).json({ error: error }))
}

// to find related products
exports.findRelated = async (req, res) => {
    let singleProduct = await Product.findById(req.params.id)
    let product = await Product.find({ category: singleProduct.category, _id: { $ne: singleProduct } }).populate('category', 'category_name')
    if (!product) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(product)
}

// to find filtered products
exports.filterProduct = async (req, res) => {
    let order = req.query.order ? req.query.order : 1
    let sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt'
    let limit = req.query.limit ? parseInt(req.query.limit) : 20000
    // let limit = req.query.limit ? 8 : 20000
    let skip = req.body.skip
console.log("sort by",sortBy, "order",order, "limit",limit)
    //to get filters
    let Args = {}
    for (let key in req.body.filters) {
        // {category:[], product_price:[0 , 999]}
        // [{},{}]
        if (req.body.filters[key].length > 0)
        {
            if (key === 'product_price') {
                Args[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            }
            else {
                Args[key] = req.body.filters[key]
            }
        }   
    }
    // filter[category] = ['asdf','dfsf']
    // args[category] = ['asdf','dfsf']
    // filter[product_price] = [0,999]
    // args[product_price].gte :0
    // args[product_price].lte :999
    // { }

    // )
    let filterProduct = await Product.find(Args)
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .skip(skip)
    if (!filterProduct) {
        return res.status(400).json({ error: "something went wrong" })
    }
    else {
        res.json({
            size: filterProduct.length,
            filterProduct
        })
    }

}