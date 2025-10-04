if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const dotenv=require("dotenv");

const authRoutes=require("./routes/authRoutes");
const bookRoutes=require("./routes/bookRoutes");
const reviewRoutes=require("./routes/reviewRoutes");
const app=express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DBURL)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

app.use("/api/auth",authRoutes);
app.use("/api/books",bookRoutes);
app.use("/api/reviews",reviewRoutes);

const PORT=process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
});
