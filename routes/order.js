const Order = require("../models/Order");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const CryptoJS = require("crypto-js");
const router = require("express").Router();

// create Order
router.post("/", verifyTokenAndAuthorization, async (req,res)=>{
    const newOrder = new Order(req.body);
    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch(err){
        res.status(500).json(err);
    }
});

// update Order
router.put("/:id", verifyTokenAndAuthorization , async (req, res)=>{
    
     try {
         const updatedOrder = await Order.findByIdAndUpdate(req.params.id,{
             $set: req.body
         }, {new: true});
         res.status(200).json(updatedOrder);
 
     } catch(err) {
         res.status(500).json(err);
     }
 
} );

// delete Order
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted");  
    } catch(err) {
        res.status(500).json(err);
    }
} )

// get Order by id
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const Order1 = await Order.findOne({ userId: req.params.userId });
        res.status(200).json(Order1);

    } catch(err) {
        res.status(500).json(err);
    }
} )

// get all Orders 
router.get("/", verifyTokenAndAuthorization, async (req, res) => {

    try{
        const Order1 = await Order.findAll();        
        res.status(200).json(Order1);  
    } catch(err) {
        res.status(500).json("error" + err);
    }
} )

// monthy amount paid

module.exports = router;


