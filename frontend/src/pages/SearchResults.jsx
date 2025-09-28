import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import FlightCard from "../components/ui/FlightCard";
import Breadcrumbs from "../components/ui/Breadcrumbs";

const SearchResults = () => {
  const location = useLocation();
  const flights = location.state?.flights || [];

  const [priceFilter, setPriceFilter] = useState([0, 10000]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const resultsPerPage = 5;

  let filteredFlights = flights.filter(
    (f) => f.cena >= priceFilter[0] && f.cena <= priceFilter[1]
  );


  filteredFlights = filteredFlights.sort((a, b) =>
    sortOrder === "asc" ? a.cena - b.cena : b.cena - a.cena
  );

  const totalPages = Math.ceil(filteredFlights.length / resultsPerPage);
  const displayedFlights = filteredFlights.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Breadcrumbs
        items={[
          { label: "Početna", to: "/" },
          { label: "Rezultati pretrage" },
        ]}
      />

      <h2 className="text-2xl font-bold mb-6 text-center">Rezultati pretrage</h2>

      <div className="mb-6 bg-white shadow p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Filtriraj po ceni</h3>
        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
            <label className="block text-sm text-gray-600 mb-1">Cena od</label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={priceFilter[0]}
              onChange={(e) =>
                setPriceFilter([Number(e.target.value), priceFilter[1]])
              }
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm text-gray-600 mb-1">Cena do</label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={priceFilter[1]}
              onChange={(e) =>
                setPriceFilter([priceFilter[0], Number(e.target.value)])
              }
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2">Sortiraj po ceni</h3>
        <select
          className="border rounded-lg p-2 w-full"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Cena (najniža prvo)</option>
          <option value="desc">Cena (najviša prvo)</option>
        </select>
      </div>

      {displayedFlights.length === 0 ? (
        <p className="text-center text-gray-600">Nema letova</p>
      ) : (
        <ul className="space-y-4">
          {displayedFlights.map((letData) => (
            <li key={letData.id}>
              <FlightCard flight={letData} />
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prethodna
          </button>

          <span className="text-sm">
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
