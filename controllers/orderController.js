const Customer = require('../models/Customer');
const Order = require('../models/Order');


//create order

addOrder = async (req, res) => {
    try {
        const neworder = new Order(req.body);
        const order = await neworder.save();

        await Customer.findByIdAndUpdate(req.body.customer, {
            $push: { orders: order },
        });

        res.status(200).json({
            message: 'order created',
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//get order by customer

getOrderByCustomer = async (req, res) => {
    try {
        const order = req.user.orders;
        res.status(201).json({
            message: " get Order by customer",
            data: order,
            success: true
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//get all orders  // admin

allOrders = async (req, res) => {
    try {
        const listOrders = await Order.find({});
        res.status(201).json({
            message: "List of orders",
            data: listOrders,
            success: true
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }
};

// update Category
updateOrders = async (req, res) => {
    try {
        await Order.updateOne({ _id: req.params.id }, (req.body));
        res.status(201).json({
            message: "updated!",
            success: true
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }

}


// delete order

deleteOrder = async (req, res) => {
    try {
        const customer = req.user;
        console.log(customer);
        const order = req.params.id;
        await Customer.findByIdAndUpdate( customer._id ,{
            $pull: { orders: order },
        });
        await Order.deleteOne({ _id: req.params.id });
        res.status(201).json({
            message: "Order deleted !",
            success: true
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }

};



module.exports = {addOrder, getOrderByCustomer, allOrders, updateOrders, deleteOrder }


