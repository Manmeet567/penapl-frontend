import { useState, useEffect } from "react"
import { useSignup } from "../hooks/useSignup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

function Signup() {
  const {signup, error, loading} = useSignup()

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function validateInputs(email, username, password) {
    if (!email || !username || !password) {
      return false; 
    }
    
    return true; 
  }

  useEffect(() => {
    if(error) {
      toast.error(error)
    }
  }, [error])

  const handleSignup = async (e) => {
    e.preventDefault()

    if(validateInputs(email,username,password)){
      await signup(email,username,password)
    }
    else{
      toast.error("Please fill in all fields!")
    }
  }


  const handleChange = (event)=>(setState)=>{
    setState(event.target.value)
  }

  return (
    <div className="signup" style={{height:"100vh", width:"100%", display:"flex", justifyContent:"center", alignItems:'center', flexDirection:"column" }} >
        <h1 style={{margin:"20px 0"}}>Sign Up</h1>
        <form style={{display:'flex', flexDirection:"column"}}>
            <input type="email" style={{margin:"10px 0", padding:'6px 12px'}} placeholder='email' value={email} onChange={(e) =>handleChange(e)(setEmail)} />
            <input type="text" style={{margin:"10px 0", padding:'6px 12px'}} name="username" placeholder="username" value={username} onChange={(e) =>handleChange(e)(setUsername)}/>
            <input type="password" style={{margin:"10px 0", padding:'6px 12px'}} placeholder='password' value={password} onChange={(e) =>handleChange(e)(setPassword)} />
            <button onClick={handleSignup} disabled={loading} style={{margin:"10px 0", padding:'5px 10px', cursor:'pointer'}}>{loading ? 'Signing Up' : 'Sign Up'}</button>
            <p>Already a User? <Link to='/login'>Login Here.</Link></p>
        </form>
        <Link to='/blog-app'style={{padding:"8px 15px", margin:"20px", backgroundColor:"#ddd", borderRadius:"8px", color:"#000"}}>See Blogs</Link>

        <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  )
}

export default Signup