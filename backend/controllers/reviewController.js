const Review=require("../models/ReviewModel");

const addReview=async(req,res)=>{
  try{
    const {bookId,rating,reviewText}=req.body;
    const review=new Review({bookId,rating,reviewText,userId:req.user._id});
    await review.save();
    res.status(201).json(review);
  }catch(err){
    res.status(500).json({message:"Adding review failed",error:err.message});
  }
};

const getReviews=async(req,res)=>{
  try{
    const {bookId}=req.params;
    const reviews=await Review.find({bookId}).populate("userId","name");
    const avgRating=reviews.reduce((sum,r)=>sum+r.rating,0)/(reviews.length||1);
    res.status(200).json({reviews,avgRating});
  }catch(err){
    res.status(500).json({message:"Fetching reviews failed",error:err.message});
  }
};

module.exports={addReview,getReviews};
