const router = require("express").Router();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth")
const User = require("../models/userModel");

router.post("/register", async (req, res) => {
    try{
        let {email, password, passwordCheck, displayName} = req.body;

        //checks to make sure all fields have been entered
        if (!email || !password || !passwordCheck) 
            return res.status(400).json({msg: "Not all fields have been entered."});

            //checks to make sure password is at least 5 characters long
            if (password.length < 5) 
            return res
                .status(400)
                .json({ msg: "The password needs to be at least 5 characters long."});

        //checks to make sure both passwords are the same
        if (password !== passwordCheck) 
            return res
                .status(400)
                .json({msg: "Enter the same password twice for verfication."});

        //checks to see if e-mail already exists in database
        const existingUser = await User.findOne({email: email});
        if (existingUser)
            return res
                .status(400)
                .json({msg: "Account with this e-mail already exists."});
                
        //if user has not entered a display name then their e-mail is used instead        
        if (!displayName) displayName = email;

        
        //converts password to gibberish using the bcryptjs npm
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        //saves new user to the database
        const newUser = new User({
            email,
            password: passwordHash,
            displayName
        });
        const savedUser = await newUser.save();
        res.json(savedUser);
        
        //throws an error if anything goes wrong in this 'try' block
        } catch (err) {
            res.status(500).json({error: err.message}); 
        }
});

router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password)
            return res.status(400).json({msg: "Not all fields have been entered."});
        
        const user = await User.findOne({email: email});
        if (!user)
        return res.status(400).json({msg: "No account with this e-mail has been registered."});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({msg: "Invalid credentials."});

        //token verfication
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        res.json({
            token,
            user: {
                id: user._id,
                displayName: user.displayName,
                email: user.email,
            }
        })
    } catch (err) {
        res.status(500).json({error: err.message}); 
    }
});

router.delete("/delete", auth, async (req, res) => {
    try{
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);

    } catch (err) {
        res.status(500).json({error: err.message});
    } 
});

router.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);

        
    } catch (err) {
        res.status(500).json({error: err.message});
        
    }
});

router.get("/", auth, async (req,res) => {
    const user = await User.findById(req.user);
    res.json(user);
})

module.exports = router;