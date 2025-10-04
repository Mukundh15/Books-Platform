import {useState,useEffect} from "react";
import {Link,useLocation,useNavigate} from "react-router-dom";
import axios from "axios";

function BookListPage(){
  const [books,setBooks]=useState([]);
  const [page,setPage]=useState(1);
  const [pages,setPages]=useState(1);
  const location=useLocation();
  const navigate=useNavigate();
  const params=new URLSearchParams(location.search);
  const searchTerm=params.get("search")||"";

  useEffect(()=>{fetchBooks();},[page,location.search]);

  const fetchBooks=async()=>{
    try{
      const res=await axios.get(`http://localhost:5000/api/books?page=${page}&search=${searchTerm}`);
      setBooks(res.data.books);
      setPages(res.data.pages);
    }catch(err){console.log(err);}
  };

  const handlePageChange=newPage=>{setPage(newPage);};

  return(
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Book List</h1>
      {searchTerm && <h5 className="text-center mb-3">Search results for "{searchTerm}"</h5>}
      <div className="row g-4">
        {books.length===0?(
          <p className="text-center">No books found.</p>
        ):(
          books.map(book=>(
            <div key={book._id} className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text mb-1"><strong>Author:</strong> {book.author}</p>
                  <p className="card-text mb-2"><strong>Genre:</strong> {book.genre}</p>
                  <p className="card-text mb-2"><strong>Published:</strong> {book.year}</p>
                  <Link to={`/books/${book._id}`} className="btn btn-primary mt-auto">View Details</Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 d-flex justify-content-center">
        {Array.from({length:pages},(_,i)=>(
          <button key={i} className={`btn me-2 ${i+1===page?"btn-primary":"btn-outline-primary"}`} onClick={()=>handlePageChange(i+1)}>{i+1}</button>
        ))}
      </div>
    </div>
  );
}

export default BookListPage;
