import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const flights = location.state?.flights || [];

  const [priceFilter, setPriceFilter] = useState([0, 10000]); 
  const [page, setPage] = useState(1);
  const resultsPerPage = 5;

  
  const filteredFlights = flights.filter(
    (f) => f.cena >= priceFilter[0] && f.cena <= priceFilter[1]
  );


  const totalPages = Math.ceil(filteredFlights.length / resultsPerPage);
  const displayedFlights = filteredFlights.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Rezultati pretrage</h2>

      {}
      <div className="flex space-x-4 mb-4">
        <input
          type="number"
          placeholder="Min cena"
          className="border p-2 rounded w-1/2"
          value={priceFilter[0]}
          onChange={(e) =>
            setPriceFilter([Number(e.target.value), priceFilter[1]])
          }
        />
        <input
          type="number"
          placeholder="Max cena"
          className="border p-2 rounded w-1/2"
          value={priceFilter[1]}
          onChange={(e) =>
            setPriceFilter([priceFilter[0], Number(e.target.value)])
          }
        />
      </div>

      {displayedFlights.length === 0 ? (
        <p>Nema letova</p>
      ) : (
        <ul className="space-y-4">
          {displayedFlights.map((letData) => (
            <li key={letData.id} className="p-4 border rounded shadow">
              <div>
                <strong>{letData.polaziste}</strong> → <strong>{letData.odrediste}</strong>
              </div>
              <div>Datum polaska: {letData.vreme_poletanja.split(" ")[0]}</div>
              <div>Vreme poletanja: {letData.vreme_poletanja.split(" ")[1]}</div>
              <div>Vreme sletanja: {letData.vreme_sletanja.split(" ")[1]}</div>
              <div>Cena: {letData.cena} EUR</div>

              <Link
                to={`/letovi/${letData.id}`}
                className="text-blue-500 underline mt-2 inline-block"
              >
                Pogledaj detalje
              </Link>
            </li>
          ))}
        </ul>
      )}

      
      {totalPages > 1 && (
        <div className="flex justify-between mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prethodna
          </button>

          <span>
            Stranica {page} od {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Sledeća
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
