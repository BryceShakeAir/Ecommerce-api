const User = require("../models/User");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const CryptoJS = require("crypto-js");
const router = require("express").Router();


// Update
router.put("/:id", verifyTokenAndAuthorization ,async (req, res)=>{
    
   // user updates password 
    if(req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set: req.body
        }, {new: true});
        res.status(200).json(updatedUser);

    } catch(err) {
        res.status(500).json(err);
    }

} );

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted");  
    } catch(err) {
        res.status(500).json(err);
    }
} )

router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        const {password , ...others} = user._doc;
        res.status(200).json(others);  
    } catch(err) {
        res.status(500).json(err);
    }
} )

// Find all

router.get("/", verifyTokenAndAdmin, async (req, res) => {

    const query = req.query.new;
    try{
        const users = query ? await User.find().sort({ _id: -1}).limit(5) : 
            await User.find();
        res.status(200).json(users);  
    } catch(err) {
        res.status(500).json(err);
    }
} )

// get stats of # users registered in past year aggregated by month
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {

    try{
        
        const finalDate = new Date("1/1/2020");
        const users = await User.aggregate(
            [
              {
                $match: {
                  createdAt: {
                    $gt: finalDate
                  }
                }
              },
              {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
              }
            ]
          );

        res.status(200).json(users);  
    } catch(err) {
        res.status(500).send("error"+err);
    }
} )


module.exports = router;