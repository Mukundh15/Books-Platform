import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Login(){
  const [form,setForm]=useState({email:"",password:""});
  const navigate=useNavigate();

  const handleChange=e=>setForm({...form,[e.target.name]:e.target.value});

  const handleSubmit=async e=>{
    e.preventDefault();
    try{
      const res=await axios.post("http://localhost:5000/api/auth/login",form);
      localStorage.setItem("token",res.data.token);
      localStorage.setItem("name",res.data.name);
      navigate("/profile");
    }catch(err){
      alert(err.response?.data?.message||"Login failed");
      console.log(err);
    }
  };

  return(
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-5 rounded-4" style={{maxWidth:"400px",width:"100%"}}>
        <h2 className="text-center mb-4 fw-bold">Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="form-control form-control-lg rounded-3" required/>
          </div>
          <div className="mb-4">
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="form-control form-control-lg rounded-3" required/>
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">Login</button>
        </form>
        <p className="text-center mt-3 text-muted">Don’t have an account? <a href="/signup" className="text-primary fw-bold">Sign up</a></p>
      </div>
    </div>
  );
}

export default Login;
