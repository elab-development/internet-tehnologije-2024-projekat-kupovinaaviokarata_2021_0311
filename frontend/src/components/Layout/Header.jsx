import React from "react";
import { Link } from "react-router-dom";
import UserMenu from "../ui/UserMenu";
import { AuthContext } from "../../context/AuthContext";



const Header = () => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Veloro AvioKarte
      </Link>

<Link to="/kontakt" className="hover:underline">Kontakt</Link>
<Link to="/o-nama" className="hover:underline">O nama</Link>

        <UserMenu />
    </header>
  );
};

export default Header;