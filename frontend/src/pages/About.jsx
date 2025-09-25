import React from "react";
import Breadcrumbs from "../components/ui/Breadcrumbs";

const About = () => {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded shadow">
      <Breadcrumbs
        items={[
          { label: "Početna", to: "/" },
          { label: "O nama" }
        ]}
      />

      <h1 className="text-3xl font-bold mb-4">O nama</h1>

      <p className="mb-4 text-gray-700 leading-relaxed">
        Dobrodošli na <span className="font-semibold">AvioKarte</span> – vašu onlajn destinaciju za
        brzo i jednostavno pretraživanje i kupovinu avionskih karata širom sveta. Naša misija je
        da povežemo putnike sa najboljim ponudama letova, povoljnim cenama i fleksibilnim opcijama
        rezervacije.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Šta radimo</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        AvioKarte vam omogućava da na jednom mestu pronađete, uporedite i rezervišete letove svih
        većih aviokompanija. Naš sistem nudi pregled cena, filtere za destinacije i datume, kao i
        mogućnost biranja sedišta i dodavanja povratne karte – sve u jednoj aplikaciji.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Zašto nas izabrati</h2>
      <ul className="list-disc list-inside mb-4 text-gray-700 leading-relaxed">
        <li>Veliki izbor letova i destinacija</li>
        <li>Jednostavna rezervacija i pregled profila</li>
        <li>Filteri i paginacija za brzu pretragu</li>
        <li>Mogućnost biranja sedišta ili automatske dodele</li>
        <li>Povratne karte u jednom koraku</li>
        <li>Podrška dostupna radnim danima</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Naša vizija</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        Cilj nam je da modernizujemo način na koji putnici planiraju i kupuju svoje karte. Sa
        fokusom na brzinu, jednostavnost i transparentnost cena, želimo da vaše putovanje započne
        bez stresa i komplikacija već pri prvoj rezervaciji.
      </p>

      <p className="mt-6 text-gray-700">
        Za dodatne informacije ili pitanja, posetite našu{" "}
        <a href="/kontakt" className="text-blue-600 hover:underline">
          Kontakt stranicu
        </a>.
      </p>
    </div>
  );
};

export default About;
