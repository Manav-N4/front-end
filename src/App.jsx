import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";   
import Signup from "./pages/Signup.jsx"; 
import Home from "./pages/Home.jsx";
import Saved from "./pages/Saved";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/saved" element={<Saved />} />
      </Routes>
    </>
  );
}

export default App;
