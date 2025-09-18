import React from "react";
import { useLocation } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const flights = location.state?.flights || [];

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Rezultati pretrage</h2>
      {flights.length === 0 ? (
        <p>Nema letova</p>
      ) : (
        <ul className="space-y-4">
          {flights.map((letData) => (
            <li key={letData.id} className="p-4 border rounded shadow">
              <div>
                <strong>{letData.polaziste}</strong> → <strong>{letData.odrediste}</strong>
              </div>
              <div>Datum polaska: {letData.vreme_poletanja.split(" ")[0]}</div>
              <div>Vreme poletanja: {letData.vreme_poletanja.split(" ")[1]}</div>
              <div>Vreme sletanja: {letData.vreme_sletanja.split(" ")[1]}</div>
              <div>Cena: {letData.cena} EUR</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
