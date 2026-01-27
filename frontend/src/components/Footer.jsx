const Footer = () => {
  return (
    <footer className="flex justify-between items-center px-8 py-4 border-t border-border text-muted-foreground text-sm">
      <div className="flex items-center gap-2">
        <span className="text-primary">
          <img
            src="/src/assets/pics/logo.png"
            alt="HelpConnect Logo"
            className="w-10 h-10 rounded-full object-cover"
          />
        </span>
        © 2026 HelpConnect. Connecting communities through kindness.
      </div>

      <div className="flex gap-4">
        <a className="hover:text-primary" href="#">
          Privacy Policy
        </a>
        <a className="hover:text-primary" href="#">
          Terms
        </a>
        <a className="hover:text-primary" href="#">
          Contact
        </a>
      </div>
    </footer>
  );
};

export default Footer;
