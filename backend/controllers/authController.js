const User=require("../models/UserModel");
const jwt=require("jsonwebtoken");

const signup=async(req,res)=>{
  try{
    const {name,email,password}=req.body;
    const existing=await User.findOne({email});
    if(existing) return res.status(400).json({message:"Email already exists"});
    const user=new User({name,email,password});
    await user.save();

    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn: "1d"});
    res.status(201).json({token,name: user.name});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"Signup failed",error: err.message});
  }
};

const login=async(req,res)=>{
  try{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user) return res.status(401).json({message: "Invalid credentials"});

    const isMatch=await user.comparePassword(password);
    if(!isMatch) return res.status(401).json({message:"Invalid credentials"});

    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn: "1d"});
    res.status(200).json({ token, name: user.name });
  }catch(err){
    console.log(err);
    res.status(500).json({message:"Login failed",error: err.message});
  }
};

const getProfile=async(req,res)=>{
  try{
    res.json({ name: req.user.name });
  }catch(err){
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

module.exports={signup,login,getProfile};
