import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">🎬 MovieFlix</Link>
            </div>
            <div className="navbar-links">
                <Link to="/" className="navbar-item">Home</Link>
                <Link to="/favorites" className="navbar-item">Favorites</Link>
            </div>
        </nav>
    )
}
export default Navbar