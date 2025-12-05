import Header from "../components/header.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";


export default function Signup() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/register', {
      email: email,
      password: password
    })
    .then(result => {console.log(result) 
      navigate('/home')})
    .catch(err => console.log(err));
  }
  return (
    <>
      <Header />

<form 
  className="signup-container"
  onSubmit={handleSubmit}
>
  <h2 id="sig">Create your account</h2>

  <input
    type="email"
    id="mail"
    placeholder="Enter your email"
    onChange={(e) => setEmail(e.target.value)}
  />

  <input
    type="password"
    id="pass"
    placeholder="Enter your password"
    onChange={(e) => setPassword(e.target.value)}
  />

  <button id="sign" type="submit">Sign Up</button>
</form>

<h3 className="log-text">
  Already have an account?{" "}
  <Link to="/" id="log-link">
    Login
  </Link>
</h3>

    </>
  );
}
