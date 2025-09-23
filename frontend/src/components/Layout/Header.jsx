import React from "react";
import { Link } from "react-router-dom";
import UserMenu from "../ui/UserMenu";

const Header = () => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Veloro AvioKarte
      </Link>

      
        <UserMenu />
    </header>
  );
};

export default Header;