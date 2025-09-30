import React from "react";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-lg">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Rezervacija uspešna 🎉
        </h1>
        <p className="text-gray-700 mb-3">
          Vaša karta je uspešno rezervisana.
        </p>
        <p className="text-gray-700 mb-3">
          Detalje o letu i elektronsku kartu možete pronaći u svom <strong>emailu</strong>.
        </p>
        <p className="text-gray-700 mb-6">
          Takođe ćete dobiti informacije o <strong>aerodromu</strong>, <strong>check-in proceduri</strong> i <strong>vodič do gejta</strong>.
        </p>

        <Link
          to="/"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-lg shadow-md hover:scale-105 transition-transform"
        >
          ⬅ Nazad na početnu
        </Link>
      </div>
    </div>
  );
};

export default Success;
