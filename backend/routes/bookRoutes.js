const express=require("express");
const router=express.Router();
const {protect}=require("../middleware/authMiddleware");
const {getBooks,getBookById,addBook,updateBook,deleteBook}=require("../controllers/bookController");

router.get("/",getBooks);
router.get("/:id",getBookById);
router.post("/",protect,addBook);
router.put("/:id",protect,updateBook);
router.delete("/:id",protect,deleteBook);

module.exports=router;
