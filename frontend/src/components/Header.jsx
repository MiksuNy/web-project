import { useNavigate } from "react-router-dom";

const Header = ({
  title = "HelpConnect",
  subtitle = "Connect with your community",
}) => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center h-[70px] px-8 border-b border-border bg-background">
      {/* left */}
      <div className="flex items-center gap-3">
        <img
          src="/src/assets/pics/logo.png"
          alt="HelpConnect logo"
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="leading-tight">
          <h1 className="text-xl font-medium text-primary">{title}</h1>
          <span className="text-sm text-muted-foreground">{subtitle}</span>
        </div>
      </div>

      {/* right - login CTA */}
      <button
          onClick={() => navigate("/login")}
  className="flex items-center gap-2 px-5 py-2 rounded-full
             text-white transition"
  style={{
    background: "var(--bg-accent1-active)",
  }}
>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M14 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 12h11m0 0l-4-4m4 4l-4 4"
            stroke="currentColor"
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
