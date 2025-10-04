import {useState,useEffect} from "react";
import axios from "axios";
import {useNavigate,useParams} from "react-router-dom";

function AddBook(){
  const {id}=useParams();
  const navigate=useNavigate();
  const [form,setForm]=useState({title:"",author:"",description:"",genre:"",year:""});

  useEffect(()=>{
    if(id){
      const token=localStorage.getItem("token");
      axios.get(`http://localhost:5000/api/books/${id}`,{headers:{Authorization:`Bearer ${token}`}})
        .then(res=>setForm(res.data))
        .catch(err=>console.log(err));
    }
  },[id]);

  const handleChange=e=>setForm({...form,[e.target.name]:e.target.value});
  const handleSubmit=async e=>{
    e.preventDefault();
    const token=localStorage.getItem("token");
    if(!token){alert("Please login first");navigate("/login");return;}
    try{
      if(id) await axios.put(`http://localhost:5000/api/books/${id}`,form,{headers:{Authorization:`Bearer ${token}`}});
      else await axios.post(`http://localhost:5000/api/books`,form,{headers:{Authorization:`Bearer ${token}`}});
      navigate("/");
    }catch(err){console.log(err);alert("Failed to save book");}
  };

  return(
    <div className="container mt-5">
      <div className="card shadow-lg p-4 mx-auto" style={{maxWidth:"600px"}}>
        <h2 className="text-center mb-4">{id?"Edit Book":"Add New Book"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} className="form-control" placeholder="Book title" required/>
          </div>
          <div className="mb-3">
            <label className="form-label">Author</label>
            <input type="text" name="author" value={form.author} onChange={handleChange} className="form-control" placeholder="Author name" required/>
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="form-control" placeholder="Brief description" rows="3"></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Genre</label>
            <input type="text" name="genre" value={form.genre} onChange={handleChange} className="form-control" placeholder="Genre"/>
          </div>
          <div className="mb-4">
            <label className="form-label">Year</label>
            <input type="number" name="year" value={form.year} onChange={handleChange} className="form-control" placeholder="Publication year"/>
          </div>
          <button type="submit" className="btn btn-primary w-100">{id?"Update Book":"Add Book"}</button>
        </form>
      </div>
    </div>
  );
}

export default AddBook;
