import React from "react";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Rezervacija uspešna 🎉
        </h1>
        <p className="text-gray-700 mb-6">
          Vaša karta je uspešno rezervisana. Proverite email za detalje.
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nazad na početnu
        </Link>
      </div>
    </div>
  );
};

export default Success;