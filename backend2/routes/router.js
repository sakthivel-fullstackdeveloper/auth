const mongoose =require('mongoose')
const express = require('express');
const User = require('../model/User')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', async(req, res) => {
    try {
        const {name,username,password}= req.body;
        const check = await User.findOne({username:username});
        if(check){ return res.status(400).json({message:"user already registered"});}
        const hashedpassword = await bcrypt.hash(password,10);
        const data = new User({name:name,username:username,password:hashedpassword})
        await data.save();
        res.status(201).json({message:"succes",data:data})
    } catch (error) {
        res.status(500).json({message:error.message});
    }
})
router.post('/login', async(req, res) => {
    try {
        const {username,password}= req.body;
        const user= await User.findOne({username:username})
        if(!user){return res.status(400).json({message:"user not registered"}); }
        const check=await bcrypt.compare(password,user.password);
        if(check){
         const token= jwt.sign({username,password},"dnjknkdn",{expiresIn:'1h'});
         return res.status(200).json({message:"success",data:token,name:user.name});
        }
        else{
        return res.status(400).json({message:"invalid creditonals"});
        }
         
    } catch (error) {
        res.status(500).json({message:error.message});
    }
})
router.put('/update', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username" });
    }
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = saltRounds
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { password: hashedPassword },
      { new: true }
    );
    res.status(200).json({ message: "Success", data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
})

const authed =async(req,res,next)=>{
    const token = req.header('Authorization');
    if(!token){return res.status(404).json({message:"no token"});}
    try{const check =jwt.verify(token,"dnjknkdn")
    next();}
    catch(err){ return res.status(400).json({message:"invalid token"});}
}

module.exports =router;
