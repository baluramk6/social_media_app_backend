const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")

//REGISTER USER
router.post("/register", async (req, res) => {
    try {
        //genrate new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        //save user and response
        const user = await newUser.save();
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
        console.log(error);
    }
})

//LOGIN USER
router.post("/login", async (req, res) => {
    try {
        //Find user by email
        const user = await User.findOne({ email: req.body.email })
        !user && res.status(404).json("User not found..!")

        //Check password
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("Wrong password..!")

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }

})

module.exports = router;