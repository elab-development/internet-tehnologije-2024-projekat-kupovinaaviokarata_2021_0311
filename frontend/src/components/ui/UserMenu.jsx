import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaUserCircle, FaSignOutAlt, FaUser } from "react-icons/fa";
import "./UserMenu.css";

const UserMenu = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

if (!user) {
  return (
    <div className="flex items-center space-x-3">
      <Link to="/login" className="user-auth-btn primary">
        Prijava
      </Link>
      <Link to="/register" className="user-auth-btn secondary">
        Registracija
      </Link>
    </div>
  );
}

return (
  <div className="user-menu-wrapper">
    <button onClick={() => setOpen(!open)} className="user-menu-btn">
      <FaUserCircle className="text-lg mr-2" />
      {user.name}
    </button>

    {open && (
      <div className="user-menu-dropdown">
        <Link to="/profil" className="user-menu-item" onClick={() => setOpen(false)}>
          <FaUser /> Moj profil
        </Link>
        <button
          onClick={() => {
            logout();
            setOpen(false);
          }}
          className="user-menu-item w-full text-left"
        >
          <FaSignOutAlt /> Odjavi se
        </button>
      </div>
    )}
  </div>
);

};

export default UserMenu;
