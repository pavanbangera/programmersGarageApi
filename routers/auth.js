const express = require('express')
const router = express.Router();
const users = require('../models/User')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const fetchUserData = require('../midleware/fetchUserData')
const sendEmail = require('../midleware/sendEmail')

router.post("/loginAdmin", async (req, res) => {
    let success = false;
    const { email, password } = req.body;
    try {
        if (email === "admin@gmail.com" && password === "admin") {
            res.send({ success: true })
        } else {
            res.send("Incredentials")
        }
    }
    catch (err) {
        console.log("Some error occures")
        return res.status(500).send("somthing happend")
    }
})

router.post('/createUser', [
    body('name', "Please enter Name").isLength({ min: 5 }),
    body('password', "Password length should be >=5").isLength({ min: 6 }),
    body('email', "Please enter valid email").isEmail()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    //validator for chekking information
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //checking email alredy exist or not
    try {
        let user = await users.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).send({ error: "User already exist" })
        }
        //password hass
        const salt = bcrypt.genSaltSync(10);
        const passHash = bcrypt.hashSync(req.body.password, salt)

        //stored at user collection
        await users.create({
            name: req.body.name,
            email: req.body.email,
            password: passHash
        })
        user = await users.findOne({ email: req.body.email });
        //create private token for authentication...hereb 'notebook is secrete sign
        // const data = {
        //     user: {
        //         id: user.id
        //     }
        // }
        // var authToken = jwt.sign(data, 'pavan');
        // res.send({ success: true, authToken, id: user.id })
        const url = `${process.env.BASE_URL}user/verify/${user.id}`;
        await sendEmail(user.email, "Verify Email", url);
        res.send({ success: true, msg: " An Email sent to your account please verify" })
    }

    catch (err) {
        console.log("Some error occures")
        return res.status(500).send("somthing happend")
    }
})


router.post("/loginUser", [
    body('password', "Password length should be >=5").isLength({ min: 6 }),
    body('email', "Please enter valid email").isEmail()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(400).send({ error: "Incorrect credentials" })
        }
        else {
            if (user.verified === false) {
                const url = `${process.env.BASE_URL}user/verify/${user.id}`;
                await sendEmail(user.email, "Verify Email", url);
                return res.send({ success: false, msg: " An Email sent to your account please verify" })
            } else {
                const passCompare = bcrypt.compareSync(password, user.password)
                if (!passCompare) {
                    return res.status(400).send({ error: "Incorrect credentials" })
                }
                const data = {
                    user: {
                        id: user.id
                    }
                }
                var authToken = jwt.sign(data, 'pavan');
                res.send({ success: true, authToken, id: user.id })
            }
        }

    }
    catch (err) {
        console.log("Some error occures")
        return res.status(500).send("somthing happend")
    }
})

router.get("/countUser", async (req, res) => {
    try {
        const count = await users.countDocuments();
        res.send(count.toString());
    } catch (err) {
        console.log("Some error occurred");
        return res.status(500).send("Something happened");
    }
});
router.get('/verify/:id', async (req, res) => {

    try {
        const verify = await users.findById(req.params.id)
        if (verify) {
            const update = await users.findByIdAndUpdate(req.params.id, { verified: true }, { new: true })
            res.status(200).send({ success: true, update })
        }
        else {
            return res.status(404).send({ success: false })
        }
    }
    catch (err) {
        console.log("Some error occurred");
        return res.status(500).send({ success: false });
    }
})
router.post('/forgot', async (req, res) => {
    const { email } = req.body;

    try {
        const verify = await users.findOne({ email })
        if (verify) {
            const url = `${process.env.BASE_URL}user/change-password/${verify.id}`;
            await sendEmail(verify.email, "Change password", url);
            return res.status(200).send({ success: true, msg: " An Email sent to your account checkout" })
        }
        else {

            return res.status(404).send({ success: false })
        }
    }
    catch (err) {
        console.log("Some error occurred");
        return res.status(500).send({ success: false });
    }
})
router.post('/Changepassword', async (req, res) => {
    const { id, password } = req.body;

    try {
        const verify = await users.findById(id)
        if (verify) {
            const salt = bcrypt.genSaltSync(10);
            const passHash = bcrypt.hashSync(password, salt)
            await users.findByIdAndUpdate(id, { password: passHash }, { new: true })
            return res.status(200).send({ success: true })
        } else {
            return res.status(400).send({ success: false })
        }
    }
    catch (err) {
        console.log("Some error occurred");
        return res.status(500).send({ success: false });
    }
})

module.exports = router