import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between">
      <h1 className="font-bold text-xl">Kupovina Avio Karata</h1>
      <nav>
        <Link className="mr-4 hover:underline" to="/">Početna</Link>
        <Link className="hover:underline" to="/rezultati">Rezultati</Link>
      </nav>
    </header>
  );
};

export default Header;
