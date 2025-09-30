import React from "react";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Kupite avio karte brzo i jednostavno
        </h1>
        <p className="text-lg mb-6">
          Rezervišite povratne letove i uživajte u putovanju bez stresa.
        </p>
       
   <a href="#search-form" className="hero-button">
          Pretraži letove
        </a>
      </div>
    </section>
  );
};

export default Hero;



/*import React from "react";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <h1>Dobrodošli u Veloro AvioKarte</h1>
        <p>
          Kupite avionske karte brzo i jednostavno, rezervišite povratne letove i uživajte u putovanju.
        </p>
        <a href="#search" className="hero-button">Pretraži letove</a>
      </div>
    </section>
  );
}
  */
