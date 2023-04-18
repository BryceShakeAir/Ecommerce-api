const Cart = require("../models/Cart");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const CryptoJS = require("crypto-js");
const router = require("express").Router();

// create Cart
router.post("/", verifyTokenAndAuthorization, async (req,res)=>{
    const newCart = new Cart(req.body);
    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch(err){
        res.status(500).json(err);
    }
});

// update Cart
router.put("/:userId", verifyTokenAndAuthorization , async (req, res)=>{
    
     try {
         const updatedCart = await Cart.findOneAndUpdate({userId : req.params.userId},{
             $set: req.body
         }, {new: true});
         res.status(200).json(updatedCart);
 
     } catch(err) {
         res.status(500).json(err);
     }
 
} );

// delete Cart
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try{
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted");  
    } catch(err) {
        res.status(500).json(err);
    }
} )

// get Cart by id
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const Cart1 = await Cart.findOne({ userId: req.params.userId });
        res.status(200).json(Cart1);

    } catch(err) {
        res.status(500).json(err);
    }
} )

// get all Carts 
router.get("/", verifyTokenAndAuthorization, async (req, res) => {

    try{
        const cart1 = await Cart.findAll();        
        res.status(200).json(cart1);  
    } catch(err) {
        res.status(500).json("error" + err);
    }
} )

module.exports = router;


