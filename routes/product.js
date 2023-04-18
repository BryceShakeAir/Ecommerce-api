const Product = require("../models/Product");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const CryptoJS = require("crypto-js");
const router = require("express").Router();

// create product
router.post("/", verifyTokenAndAdmin, async (req,res)=>{
    const newProd = new Product(req.body);
    try{
        const savedProd = await newProd.save();
        res.status(200).json(savedProd);
    } catch(err){
        res.status(500).json(err);
    }
});

// update product
router.put("/:id", verifyTokenAndAdmin ,async (req, res)=>{
    
     try {
         const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{
             $set: req.body
         }, {new: true});
         res.status(200).json(updatedProduct);
 
     } catch(err) {
         res.status(500).json(err);
     }
 
} );

// delete product
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted");  
    } catch(err) {
        res.status(500).json(err);
    }
} )

// get product by id
router.get("/find/:id", async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        
        res.status(200).json(product);  
    } catch(err) {
        res.status(500).json(err);
    }
} )

// get all products 
router.get("/", async (req, res) => {
    
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try{
        
        var product = {};
        console.log(qCategory);
        if(qNew){
                product = await Product.aggregate([
                {
                    $sort: {_id: -1}
                },
                {
                    $limit: 1
                }
            ]);
        }
        if(qCategory){
            product = await Product.aggregate([
                {
                    $match:{
                        categories:{
                            $in : [qCategory]
                        }
                            
                    }
                }
            ])
        }
        
        res.status(200).json(product);  
    } catch(err) {
        res.status(500).json("error" + err);
    }
} )

module.exports = router;


