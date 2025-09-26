import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserMenu from "../ui/UserMenu";
import { AuthContext } from "../../context/AuthContext";

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Veloro AvioKarte
      </Link>

      <nav className="flex space-x-4 items-center">
        {user?.role === "admin" && (
          <Link to="/admin" className="hover:underline">
            Admin Panel
          </Link>
        )}

        <Link to="/kontakt" className="hover:underline">
          Kontakt
        </Link>
        <Link to="/o-nama" className="hover:underline">
          O nama
        </Link>
        <Link to="/faq" className="hover:underline">
          FAQ
        </Link>
      </nav>

      <UserMenu />
    </header>
  );
};

export default Header;
