import { useEffect, useState } from "react"
import { useLogin } from '../hooks/useLogin';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Link} from 'react-router-dom'

function Login() {
    const {login, error, loading} = useLogin();
    useEffect(() => {
      if(error){
        toast.error(error)
      }
    }, [error])

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        await login(email,password)
    }

  return (
    <div className="login" style={{width:"100%", height:"100vh", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column"}}>
        <h1 style={{margin:"20px 0"}}>Log In</h1>
        <form style={{display:"flex", flexDirection:"column"}}>
            <input style={{margin:"10px 0", padding:"6px 12px"}} type="email" placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            <input style={{margin:"10px 0", padding:"6px 12px"}} type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <button style={{margin:"10px 0", padding:"5px 10px"}} disabled={loading} onClick={handleLogin}>{loading ? 'Logging In' : 'Log In'}</button>
            <p>Create new account. <Link to='/signup'>Signup Now.</Link></p>
        </form>
        <Link to='/blog-app'style={{padding:"8px 15px", margin:"20px", backgroundColor:"#ddd", borderRadius:"8px", color:"#000"}}>See Blogs</Link>
    </div>
  )
}

export default Login