import React from "react";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <div className="about-card">
        <Breadcrumbs
          items={[
            { label: "Početna", to: "/" },
            { label: "O nama" }
          ]}
        />

        <h1 className="about-title">O nama</h1>

        <p className="about-text">
          Dobrodošli na <span className="font-semibold">AvioKarte</span> – vašu onlajn destinaciju
          za brzo i jednostavno pretraživanje i kupovinu avionskih karata širom sveta.
          Naša misija je da povežemo putnike sa najboljim ponudama letova, povoljnim cenama
          i fleksibilnim opcijama rezervacije.
        </p>

        <h2 className="about-subtitle">Šta radimo</h2>
        <p className="about-text">
          AvioKarte vam omogućava da na jednom mestu pronađete, uporedite i rezervišete letove svih
          većih aviokompanija. Naš sistem nudi pregled cena, filtere za destinacije i datume,
          kao i mogućnost biranja sedišta i dodavanja povratne karte – sve u jednoj aplikaciji.
        </p>

        <h2 className="about-subtitle">Zašto nas izabrati</h2>
        <ul className="about-list">
          <li>Veliki izbor letova i destinacija</li>
          <li>Jednostavna rezervacija i pregled profila</li>
          <li>Filteri i paginacija za brzu pretragu</li>
          <li>Mogućnost biranja sedišta ili automatske dodele</li>
          <li>Povratne karte u jednom koraku</li>
          <li>Podrška dostupna radnim danima</li>
        </ul>

        <h2 className="about-subtitle">Naša vizija</h2>
        <p className="about-text">
          Cilj nam je da modernizujemo način na koji putnici planiraju i kupuju svoje karte.
          Sa fokusom na brzinu, jednostavnost i transparentnost cena, želimo da vaše putovanje
          započne bez stresa i komplikacija već pri prvoj rezervaciji.
        </p>

        <p className="about-text">
          Za dodatne informacije ili pitanja, posetite našu{" "}
          <a href="/kontakt" className="about-footer-link">Kontakt stranicu</a>.
        </p>
      </div>
    </div>
  );
};

export default About;
