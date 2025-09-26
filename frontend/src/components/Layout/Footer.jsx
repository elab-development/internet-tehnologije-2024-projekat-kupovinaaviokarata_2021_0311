import React from "react";
import { Link } from "react-router-dom";
import { Plane, Facebook, Instagram } from "lucide-react"; 

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white mt-10">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="flex flex-col items-start space-y-2">
          <div className="flex items-center space-x-2 text-2xl font-bold">
            <Plane className="w-6 h-6" />
            <span>AvioKarte</span>
          </div>
          <p className="text-sm text-blue-100">
            Kupite avionske karte brzo i jednostavno, rezervišite povratne letove i
            uživajte u  putovanju.
          </p>
        </div>

        <div className="flex flex-col space-y-2">
          <h3 className="font-semibold text-lg">Navigacija</h3>
          <Link to="/" className="hover:underline">
            Početna
          </Link>
          <Link to="/about" className="hover:underline">
            O nama
          </Link>
          <Link to="/contact" className="hover:underline">
            Kontakt
          </Link>
          <Link to="/faq" className="hover:underline">
            FAQ
          </Link>
          <Link to="/profil" className="hover:underline">
            Profil
          </Link>
        </div>

        
        <div className="flex flex-col space-y-2">
          <h3 className="font-semibold text-lg">Pratite nas</h3>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="hover:text-blue-200">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-blue-200">
              <Instagram className="w-6 h-6" />
            </a>
          </div>
          <p className="text-sm mt-4 text-blue-100">
            © 2024 AvioKarte. Sva prava zadržana.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
