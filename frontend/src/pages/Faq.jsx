import React from "react";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import "./Faq.css";

const Faq = () => {
  const questions = [
    { q: "Kako da rezervišem let?", a: "Pretražite letove na početnoj stranici, pogledajte detalje i kliknite na dugme 'Rezerviši'." },
    { q: "Mogu li da izaberem sedište?", a: "Da, možete. Standardno sedišta se dodeljuju nasumično, a opcija za izbor sedišta dostupna je kao premium usluga." },
    { q: "Kako funkcioniše povratna karta?", a: "Tokom rezervacije možete izabrati povratni let, a sistem će kreirati rezervacije za oba smera." },
    { q: "Kako da otkažem rezervaciju?", a: "Na stranici Profil, u odeljku Moje rezervacije, kliknite na dugme 'Obriši' pored željene rezervacije." },
    { q: "Kome da se obratim za podršku?", a: "Možete nas kontaktirati preko stranice 'Kontakt' ili poslati email korisničkoj podršci na support@aviokarte.rs." }
  ];

  return (
    <div className="faq-container">
      <div className="faq-card">
        <Breadcrumbs items={[{ label: "Početna", to: "/" }, { label: "Česta pitanja" }]} />

        <h1 className="faq-title">Česta pitanja (FAQ)</h1>

        <p className="faq-intro">
          Na ovoj stranici možete pronaći odgovore na najčešća pitanja o kupovini
          avio karata, rezervacijama i dodatnim uslugama.
        </p>

        <div className="faq-list">
          {questions.map((item, index) => (
            <div key={index} className="faq-item">
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
