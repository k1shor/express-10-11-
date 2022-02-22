// exports.showInfo = (req,res) =>{
//     res.send("Message from controller")
// }


// exports.showMessage = (req,res)=>{
//     res.send("This is another message from controller")
// }

const Category = require("../Model/category")

exports.addCategory =async (req,res) =>{
    let category = new Category(req.body)
    category = await category.save()
    if(!category){
        return res.status(400).json({error:"something went wrong"})
    }
    else{
         res.send(category)
    }
}

exports.showCategories = async (req, res) => {
    let categories = await Category.find()
    if (!categories) {
        return res.status(400).json({ error: "something went wrong" })
    }
    else {
        res.send(categories)
    }
}