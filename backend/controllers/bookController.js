const Book=require("../models/BookModel");

const getBooks=async(req,res)=>{
  try{
    const page=parseInt(req.query.page)||1;
    const limit=6;
    const search=req.query.search||"";
    const searchQuery={
      $or:[
        {title:{$regex:search,$options:"i"}},
        {author:{$regex:search,$options:"i"}},
        {genre:{$regex:search,$options:"i"}}
      ]
    };
    const totalBooks=await Book.countDocuments(searchQuery);
    const pages=Math.ceil(totalBooks/limit);
    const books=await Book.find(searchQuery)
      .skip((page-1)*limit)
      .limit(limit)
      .sort({createdAt:-1});
    res.json({books,page,pages,totalBooks});
  }catch(err){
    res.status(500).json({message:err.message});
  }
};

const getBookById=async(req,res)=>{
  try{
    const book=await Book.findById(req.params.id);
    if(!book) return res.status(404).json({message:"Book not found"});
    res.json(book);
  }catch(err){
    res.status(500).json({message:err.message});
  }
};

const addBook=async(req,res)=>{
  try{
    const {title,author,description,genre,year}=req.body;
    const book=new Book({title,author,description,genre,year,addedBy:req.user.id});
    await book.save();
    res.status(201).json(book);
  }catch(err){
    res.status(500).json({message:err.message});
  }
};

const updateBook=async(req,res)=>{
  try{
    const book=await Book.findById(req.params.id);
    if(!book) return res.status(404).json({message:"Book not found"});
    if(book.addedBy.toString()!==req.user.id) return res.status(403).json({message:"Not authorized"});
    Object.assign(book,req.body);
    await book.save();
    res.json(book);
  }catch(err){
    res.status(500).json({message:err.message});
  }
};

const deleteBook=async(req,res)=>{
  try{
    const book=await Book.findById(req.params.id);
    if(!book) return res.status(404).json({message:"Book not found"});
    if(book.addedBy.toString()!==req.user.id) return res.status(403).json({message:"Not authorized"});
    await book.deleteOne();
    res.json({message:"Book deleted"});
  }catch(err){
    res.status(500).json({message:err.message});
  }
};

module.exports={getBooks,getBookById,addBook,updateBook,deleteBook};
