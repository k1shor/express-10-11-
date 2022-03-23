const OrderItem = require('../Model/orderItem')
const Order = require('../Model/order')


//product1 - {_id,quantity,product}, product2, product3
exports.placeOrder = async (req, res) =>{
    const orderItemIds = await Promise.all(
        req.body.orderItems.map(async (orderItem)=>{
            let newOrderItem = new OrderItem({
                product: orderItem.product,
                quantity: orderItem.quantity
            })
            newOrderItem = await newOrderItem.save()
            return newOrderItem._id
        })
    )


    //calculating total price
    const individualTotalPrice = await Promise.all(orderItemIds.map(async (orderItem)=>{
        const order = await OrderItem.findById(orderItem).populate('product','product_price')
        const total = order.quantity*order.product.product_price
        return total
    })
    )

    /*
arr = [1,2,3,4,5]
arr.reduce((acc,curr)=>{return acc+curr})
acc = 1, curr = 2
acc = 1+2, curr = 3
acc = 3+3, curr = 4
acc = 6+4, curr = 5
acc = 10+5 
return 15
*/




    const TotalPrice = individualTotalPrice.reduce((a,b)=>a+b) // reduce function

    let order = new Order({
        OrderItems:orderItemIds,
        user: req.body.user,
        shippingAddress: req.body.shippingAddress,
        shippingAddress2: req.body.shippingAddress2,
        phone: req.body.phone,
        totalPrice: TotalPrice
    })
    order = await order.save()
    if(!order){
        return res.status(400).json({error:"order could not be placed"})
    }
    res.send(order)

}


// to view all orders
exports.orderList = async(req,res) => {
    const order = await Order.find().populate('user','name')
    if(!order){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(order)
}

// to view order details of a particular order
exports.orderDetail = async (req,res) => {
    const order = await Order.findById(req.params.orderid).populate('user','name')
    .populate({path:'OrderItems',populate:{path:'product',populate:'category'}})
    if(!order){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(order)
}

// to view order details of a particular user
exports.userOrder = async (req,res) =>{
    const order = await Order.find({user:req.params.userid})
    .populate({path:'OrderItems',populate:{path:'product',populate:'category'}})
    if(!order){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(order)
}

// to update order
exports.updateOrder = async (req,res) =>{
    const order = await Order.findByIdAndUpdate(req.params.orderid,
        {
            status: req.body.status
        },
        {new:true})
        if(!order){
            return res.status(400).json({error:"something went wrong"})
        }
        res.send(order)
}


// to delete order
exports.deleteOrder = (req, res) =>{
    Order.findByIdAndRemove(req.params.orderid)
    .then(async order => {
        if(order){
            await order.OrderItems.map( async orderItem =>{
                await orderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({message:"Order deleted successfully"})
        }
        else{
            return res.status(400).json({error:"failed to delete order"})
        }
    })
    .catch(error=>{
        return res.status(400).json({error:error})
    })
}

