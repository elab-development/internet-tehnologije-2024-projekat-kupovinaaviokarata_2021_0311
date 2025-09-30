import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import UserMenu from "../ui/UserMenu";
import "./Header.css";

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          ✈️ Veloro AvioKarte
        </Link>

        <nav className="header-nav">
          <Link to="/">Početna</Link>
          <Link to="/o-nama">O nama</Link>
          <Link to="/kontakt">Kontakt</Link>
          <Link to="/faq">FAQ</Link>
          {user?.role === "admin" && <Link to="/admin">Admin</Link>}
        </nav>

        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
