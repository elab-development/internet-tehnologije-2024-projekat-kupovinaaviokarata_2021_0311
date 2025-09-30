import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import UserMenu from "../ui/UserMenu";

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link to="/" className="text-2xl font-bold tracking-wide">
          ✈️ Veloro AvioKarte
        </Link>

        <nav className="flex space-x-6">
          <Link to="/" className="hover:text-gray-200">Početna</Link>
          <Link to="/o-nama" className="hover:text-gray-200">O nama</Link>
          <Link to="/kontakt" className="hover:text-gray-200">Kontakt</Link>
          <Link to="/faq" className="hover:text-gray-200">FAQ</Link>
          {user?.role === "admin" && (
            <Link to="/admin" className="hover:text-gray-200">Admin</Link>
          )}
        </nav>

        <UserMenu />
      </div>
    </header>
  );
};

export default Header;