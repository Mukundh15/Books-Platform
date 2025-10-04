import {Link,useNavigate} from "react-router-dom";
import {useState,useEffect} from "react";

function Navbar(){
  const [user,setUser]=useState(null);
  const [searchTerm,setSearchTerm]=useState("");
  const navigate=useNavigate();

  useEffect(()=>{
    const token=localStorage.getItem("token");
    const name=localStorage.getItem("name");
    if(token&&name) setUser(name);
    else setUser(null);
  },[]);

  const handleLogout=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setUser(null);
    navigate("/login");
  };

  const handleSearch=(e)=>{
    e.preventDefault();
    navigate(`/books?search=${encodeURIComponent(searchTerm)}`);
  };

  return(
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">BookPlatform</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          <form className="d-flex mx-auto" onSubmit={handleSearch}>
            <input className="form-control me-2" type="search" placeholder="Search books..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
            <button className="btn btn-outline-light" type="submit">Search</button>
          </form>
          <ul className="navbar-nav">
            {!user?(
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/signup">Signup</Link></li>
              </>
            ):(
              <>
                <li className="nav-item"><Link className="nav-link" to="/add-book">Add Book</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/profile">{user}</Link></li>
                <li className="nav-item"><button className="btn btn-outline-light ms-2" onClick={handleLogout}>Logout</button></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
