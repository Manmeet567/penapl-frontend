import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className='Home' style={{display: 'flex', flexDirection:'column', width:'1300px', textAlign:"justify", alignItems:'center', justifyContent:'center', height:'100vh', margin:'0 auto'}}>
        <h1 style={{margin:'20px 0 5px'}}>Welcome to PenPal</h1>
        <p style={{marginBottom:'20px'}}>Explore the World of Knowledge and Inspiration</p>

        <h3 style={{margin:'20px 0'}}> "Welcome to PenPal, where curiosity meets creativity! We have curated a diverse collection of articles, stories, and insights to help you expand your horizons and discover new passions. Whether you're looking for expert advice, thought-provoking discussions, or simply a dose of inspiration, you've come to the right place."</h3>

        <Link to='/blog-app' style={{padding:"8px 15px", backgroundColor:"#ddd", borderRadius:"8px", color:"#000"}}>See Blogs</Link>

        <p style={{margin:'10px 0'}}>Sign up, if you are new here. <Link to="/signup">Click here to Signup.</Link></p>
        <p>Already a user? <Link to="/login">Click here to Login</Link></p>
    </div>
  )
}

export default Home