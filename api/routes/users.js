const router = require('express').Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');
const {verifyApiKey} = require('./verifyApiKey');
const { verify, verifyTokenAndAuthorization } = require('../verifyToken');

//GET ALL USERS
router.get("/",verify, async(req, res)=>{
    const query = req.query.new;
    try{
        const users = query ?  await User.find().sort({_id: -1}) : await User.find(); 
           res.status(200).json(users);
       }catch(err){
           res.status(500).json(err);
       }
});
//GET ONE USER
router.get("/find/:id",verify, async(req, res)=>{
    try{
     const user = await User.findById(req.params.id);
     const{password, ...info} = user._doc;
        res.status(200).json(info);
    }catch(err){
        res.status(500).json(err);
    }
});
// Route to get user by API key
router.get('/by-apikey', async (req, res) => {
    try {
        const { apiKey } = req.query;
        // Validate input
        if (!apiKey) {
            return res.status(400).json({ error: 'API key is required' });
        }
        // Find the user by API key
        const user = await User.findOne({ apiKey });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Respond with the user data
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Error retrieving user by API key:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
router.put("/:id",verify, async(req, res)=>{
    if(req.body.password){
        req.body.password = await bcrypt.hash(req.body.password, 10);
        // req.body.password = bcrypt.hash(req.body.password, 10);
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
        res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json(err);
    }
});
//DELETE USER
router.delete("/:id",verify, async(req, res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
           res.status(200).json("User has been deleted");
       }catch(err){
           res.status(500).json(err);
       }
});
// Endpoint to validate API key
router.get('/validate-key', async (req, res) => {
    try {
        const apiKey = req.query.apiKey;
        if (!apiKey) {
            return res.status(400).json({ success: false, message: 'API Key is missing.' });
        }
        // Check if the API key exists in the database
        const user = await User.findOne({ apiKey });
        if (user) {
            return res.json({ success: true, message: 'API Key is valid.' });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid API Key.' });
        }
    } catch (error) {
        console.error('Error validating API key:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

module.exports = router;