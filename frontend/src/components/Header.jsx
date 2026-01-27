import { useNavigate } from "react-router";
import { MdLogin } from "react-icons/md";

const Header = ({
  title = "HelpConnect",
  subtitle = "Connect with your community",
}) => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center h-17.5 px-8 border-b border-border bg-background">
      {/* left */}
      <div className="flex items-center gap-3 text-green-600 select-none cursor-pointer" onClick={() => navigate("/")}>
        <img
          src="/logo.svg"
          alt="HelpConnect logo"
          className="w-10 h-10 object-cover"
        />

        <div className="leading-tight">
          <h1 className="text-xl font-medium bg-linear-to-r from-green-600 to-gray-700 bg-clip-text text-transparent">{title}</h1>
          <span className="text-sm text-muted-foreground">{subtitle}</span>
        </div>
      </div>

      {/* right - login CTA */}
      <button
        onClick={() => navigate("/login")}
        className="flex items-center gap-2 px-5 py-2 rounded-full button-primary"
      >
        <MdLogin />
        Log In
      </button>
    </header>
  );
};

export default Header;
