const Footer = () => {
  return (
    <footer className="bg-white border-t border-pink-100 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-pink-800 font-medium">
          © {new Date().getFullYear()} Professora Sara Ramos. Ensinando com amor ❤️
        </p>
      </div>
    </footer>
  );
};

export default Footer;
