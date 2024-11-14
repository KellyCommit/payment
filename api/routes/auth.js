const router = require('express').Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const crypto = require('crypto');

function generateApiKey() {
    return crypto.randomBytes(16).toString('hex');
}
router.post('/register', async (req, res) => {
    try {
        const { name, phone, userName, password, referralId, accountName, accountNumber, bank } = req.body;
        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // Generate an API key for the user
        const apiKey = generateApiKey();
        let newUser = new User({
            name,
            phone,
            userName,
            referralId,
            password: hashedPassword,
            accountName,
            accountNumber,
            bank,
            apiKey
        });
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
//Login User

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ userName: req.body.userName });

        if (!user) {
            return res.status(401).json("Wrong password or mobile number");
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            return res.status(401).json("Wrong password or mobile number");
        }

        const accessToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.SECRET_KEY, { expiresIn: "30d" });
        const { password, ...info } = user._doc;

        res.status(200).json({ ...info, accessToken });
    } catch (err) {
        console.error("Error in login route:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;