import React from "react";
import Breadcrumbs from "../components/ui/Breadcrumbs";

const Faq = () => {
  const questions = [
    {
      q: "Kako da rezervišem let?",
      a: "Pretražite letove na početnoj stranici, pogledajte detalje i kliknite na dugme 'Rezerviši'."
    },
    {
      q: "Mogu li da izaberem sedište?",
      a: "Da, možete. Standardno sedišta se dodeljuju nasumično, a opcija za izbor sedišta dostupna je kao premium usluga."
    },
    {
      q: "Kako funkcioniše povratna karta?",
      a: "Tokom rezervacije možete izabrati povratni let, a sistem će kreirati rezervacije za oba smera."
    },
    {
      q: "Kako da otkažem rezervaciju?",
      a: "Na stranici Profil, u odeljku Moje rezervacije, kliknite na dugme 'Obriši' pored željene rezervacije."
    },
    {
      q: "Kome da se obratim za podršku?",
      a: "Možete nas kontaktirati preko stranice 'Kontakt' ili poslati email korisničkoj podršci na support@aviokarte.rs."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <Breadcrumbs
        items={[{ label: "Početna", to: "/" }, { label: "Česta pitanja" }]}
      />

      <h1 className="text-3xl font-bold mb-6">Česta pitanja (FAQ)</h1>

      <p className="text-gray-600 mb-6">
        Na ovoj stranici možete pronaći odgovore na najčešća pitanja o kupovini
        avio karata, rezervacijama i dodatnim uslugama.
      </p>

      <div className="space-y-4">
        {questions.map((item, index) => (
          <div key={index} className="border p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{item.q}</h3>
            <p className="text-gray-700">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
