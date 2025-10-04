import {useState,useEffect} from "react";
import {useParams,useNavigate} from "react-router-dom";
import axios from "axios";

function BookDetails(){
  const {id}=useParams();
  const navigate=useNavigate();

  const [book,setBook]=useState({});
  const [reviews,setReviews]=useState([]);
  const [avgRating,setAvgRating]=useState(0);
  const [user,setUser]=useState(null);
  const [reviewText,setReviewText]=useState("");
  const [rating,setRating]=useState(5);
  const [editingReviewId,setEditingReviewId]=useState(null);

  useEffect(()=>{
    const fetchUser=async()=>{
      const token=localStorage.getItem("token");
      if(!token) return setUser(null);
      try{
        const res=await axios.get("http://localhost:5000/api/auth/profile",{headers:{Authorization:`Bearer ${token}`}});
        setUser(res.data);
      }catch(err){console.log(err);setUser(null);}
    };
    fetchUser();
  },[]);

  useEffect(()=>{fetchBook();fetchReviews();},[id]);

  const fetchBook=()=>{axios.get(`http://localhost:5000/api/books/${id}`).then(res=>setBook(res.data)).catch(err=>console.log(err));};
  const fetchReviews=()=>{axios.get(`http://localhost:5000/api/reviews/${id}`).then(res=>{setReviews(res.data.reviews);setAvgRating(res.data.avgRating);}).catch(err=>console.log(err));};

  const handleDeleteBook=async()=>{
    const token=localStorage.getItem("token");
    if(!window.confirm("Are you sure you want to delete this book?")) return;
    try{
      await axios.delete(`http://localhost:5000/api/books/${id}`,{headers:{Authorization:`Bearer ${token}`}});
      alert("Book deleted successfully");
      navigate("/");
    }catch(err){console.log(err);alert(err.response?.data?.message||"Failed to delete book");}
  };

  const handleEditBook=()=>{navigate(`/edit-book/${id}`);};

  const handleReviewSubmit=async e=>{
    e.preventDefault();
    if(!user) return alert("You must be logged in to submit a review.");
    const token=localStorage.getItem("token");
    try{
      if(editingReviewId){
        await axios.put(`http://localhost:5000/api/reviews/${editingReviewId}`,{rating,reviewText},{headers:{Authorization:`Bearer ${token}`}});
        setEditingReviewId(null);
      }else{
        await axios.post(`http://localhost:5000/api/reviews/${id}`,{rating,reviewText},{headers:{Authorization:`Bearer ${token}`}});
      }
      setReviewText("");setRating(5);fetchReviews();
    }catch(err){console.log(err);alert("Failed to submit review");}
  };

  const handleDeleteReview=async reviewId=>{
    const token=localStorage.getItem("token");
    try{await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`,{headers:{Authorization:`Bearer ${token}`}});
      fetchReviews();
    }catch(err){console.log(err);alert("Failed to delete review");}
  };

  const handleEditReview=review=>{setEditingReviewId(review._id);setRating(review.rating);setReviewText(review.reviewText);};

  return(
    <div className="container mt-5">
      <div className="card shadow-lg p-4 mb-4">
        <h2 className="card-title">{book.title}</h2>
        <p className="text-muted mb-1"><strong>Author:</strong> {book.author}</p>
        <p className="mb-2"><strong>Genre:</strong> {book.genre}</p>
        <p className="mb-2"><strong>Published Year:</strong> {book.year}</p>
        <p className="mb-3"><strong>Average Rating:</strong> {avgRating.toFixed(1)} ⭐</p>
        <p className="card-text"><strong>Description:</strong> {book.description}</p>
        {user && book.addedBy===user._id && (
          <div className="mt-3">
            <button className="btn btn-warning me-2" onClick={handleEditBook}>Edit Book</button>
            <button className="btn btn-danger" onClick={handleDeleteBook}>Delete Book</button>
          </div>
        )}
      </div>
      <h3 className="mb-3">Reviews</h3>
      {reviews.length===0?(
        <p className="text-muted">No reviews yet.</p>
      ):(
        reviews.map(r=>(
          <div key={r._id} className="card mb-3 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-start">
              <div>
                <h5 className="card-title">{r.userId.name} <span className="text-warning">{'⭐'.repeat(r.rating)}</span></h5>
                <p className="card-text">{r.reviewText}</p>
              </div>
              {user && user._id===r.userId._id && (
                <div>
                  <button className="btn btn-sm btn-warning me-2" onClick={()=>handleEditReview(r)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={()=>handleDeleteReview(r._id)}>Delete</button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
      {user && (
        <div className="card shadow-lg p-4 mt-4">
          <h4 className="mb-3">{editingReviewId?"Edit Your Review":"Add Your Review"}</h4>
          <form onSubmit={handleReviewSubmit}>
            <div className="mb-3">
              <label className="form-label">Rating</label>
              <select className="form-select" value={rating} onChange={e=>setRating(Number(e.target.value))}>
                {[1,2,3,4,5].map(num=><option key={num} value={num}>{num}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Review</label>
              <textarea className="form-control" value={reviewText} onChange={e=>setReviewText(e.target.value)} rows={3} required></textarea>
            </div>
            <button type="submit" className="btn btn-primary">{editingReviewId?"Update Review":"Submit Review"}</button>
          </form>
        </div>
      )}
      <br/>
    </div>
  );
}

export default BookDetails;
