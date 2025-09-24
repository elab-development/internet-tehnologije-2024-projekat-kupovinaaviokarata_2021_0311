import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const UserMenu = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link to="/login" className="text-blue-600 hover:underline">
          Prijava
        </Link>
        <Link to="/register" className="text-blue-600 hover:underline">
          Registracija
        </Link>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {user.name}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
          <Link
            to="/profil"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Moj profil
          </Link>
          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            Odjavi se
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
