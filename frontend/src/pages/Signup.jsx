import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Signup(){
  const [form,setForm]=useState({name:"",email:"",password:""});
  const navigate=useNavigate();

  const handleChange=e=>setForm({...form,[e.target.name]:e.target.value});

  const handleSubmit=async e=>{
    e.preventDefault();
    try{
      const res=await axios.post("http://localhost:5000/api/auth/signup",form);
      localStorage.setItem("token",res.data.token);
      navigate("/profile");
    }catch(err){
      alert(err.response?.data?.message||"Signup failed");
      console.log(err);
    }
  };

  return(
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-5 rounded-4" style={{maxWidth:"400px",width:"100%"}}>
        <h2 className="text-center mb-4 fw-bold">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="form-control form-control-lg rounded-3" required/>
          </div>
          <div className="mb-3">
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="form-control form-control-lg rounded-3" required/>
          </div>
          <div className="mb-4">
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="form-control form-control-lg rounded-3" required/>
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">Sign Up</button>
        </form>
        <p className="text-center mt-3 text-muted">Already have an account? <a href="/login" className="text-primary fw-bold">Login</a></p>
      </div>
    </div>
  );
}

export default Signup;
