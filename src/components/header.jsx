import logo from "../assets/logo.png";
function Header() {
    return (
        <header>
        <div className="header">
        <img id="logo" src={logo}  height="100px" width="100px" ></img>
        <h1 id="title" >NextRead</h1>
        <h3 id="subtitle">What’s Next Starts Here</h3>
        </div>
        </header>
    );
} 
export default Header;