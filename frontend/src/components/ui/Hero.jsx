import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative w-full h-screen">
      <img
        src="https://i.pinimg.com/originals/d6/d1/e0/d6d1e0bbdd2eda8f44a2125154670e82.gif"
        alt="Avion"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Dobrodošli u Veloro AvioKarte
        </h1>
        <p className="text-lg md:text-2xl max-w-2xl mb-6">
          Kupite avionske karte brzo i jednostavno, rezervišite povratne letove i uživajte u putovanju.
        </p>
        <Link
          to="#search"
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition"
        >
          Pretraži letove
        </Link>
      </div>
    </section>
  );
};

export default Hero;