import React from "react";
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
