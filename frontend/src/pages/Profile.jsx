import {useEffect,useState} from "react";
import axios from "axios";

function Profile(){
  const [user,setUser]=useState(null);

  useEffect(()=>{
    const fetchUser=async()=>{
      const token=localStorage.getItem("token");
      if(!token){setUser(null);return;}
      try{
        const res=await axios.get("http://localhost:5000/api/auth/profile",{headers:{Authorization:`Bearer ${token}`}});
        setUser(res.data.name);
      }catch(err){console.log(err);setUser(null);}
    };
    fetchUser();
  },[]);

  return(
    <div className="container d-flex align-items-center justify-content-center" style={{minHeight:"100vh"}}>
      {user?(
        <div className="card shadow-lg p-4 w-50 text-center">
          <h1 className="mb-3">Hello, {user} 👋</h1>
          <p>Welcome to your profile page.</p>
        </div>
      ):(
        <h2>Please login first</h2>
      )}
    </div>
  );
}

export default Profile;
