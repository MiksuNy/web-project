import "./Header.css";
import { useNavigate } from "react-router-dom";

const Header = ({
  title = "HelpConnect",
  subtitle = "Connect with your community",
}) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo"></div>

        <div className="text">
          <h1>{title}</h1>
          <span>{subtitle}</span>
        </div>
      </div>

      <button className="login-btn" onClick={() => navigate("/login")}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          
          <path
            d="M14 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          <path
            d="M4 12h11m0 0l-4-4m4 4l-4 4"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Log In
      </button>
    </header>
  );
};

export default Header;
