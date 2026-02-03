import logo from "/logo.svg";

const Footer = () => {
  return (
    <footer className="bottom-0 flex justify-between items-center px-8 py-4 border-t border-border text-muted-foreground text-sm">
      <div className="flex items-center gap-6">
        <span className="text-primary">
          <img
            src={logo}
            alt="HelpConnect Logo"
            className="w-10 h-10"
          />
        </span>
        © 2026 HelpConnect. Connecting communities through kindness.
      </div>

      <div className="flex gap-4">
        <a className="hover:text-primary" href="/legal/privacy">
          Privacy Policy
        </a>
        <a className="hover:text-primary" href="/legal/terms">
          Terms
        </a>
        <a className="hover:text-primary" href="/contact">
          Contact
        </a>
      </div>
    </footer>
  );
};

export default Footer;
