const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/register",async (req, res)=>{

    const u1 = new User({
        username: req.body.username,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC ),
        email: req.body.email
    });

    try{
        const savedUser = await u1.save();
        res.status(201).send(savedUser);
    } catch(err){
        res.status(500).send("Error" + err);
    }
})

router.post("/login", async (req,res)=>{

    try{

        const user = await User.findOne({username: req.body.username});

        if(!user){
            res.status(401).send("Username doesnt exist");
            return;
        }
        const hashedPassword = CryptoJS.AES.decrypt( user.password, process.env.PASS_SEC );

        const Opassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        if( Opassword!=req.body.password ){ 
            res.status(401).json("Wrong Credentials");
            return;
        }

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_SEC,
        {expiresIn: "3d"});

        const { password, ...others } = user._doc;

        res.status(200).json({...others,accessToken});

    } catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;