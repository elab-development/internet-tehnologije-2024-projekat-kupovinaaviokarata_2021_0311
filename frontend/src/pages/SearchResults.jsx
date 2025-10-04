import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import FlightCard from "../components/ui/FlightCard";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import "./SearchResults.css";

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
    <div className="search-results">
      <Breadcrumbs
        items={[
          { label: "Početna", to: "/" },
          { label: "Rezultati pretrage" },
        ]}
      />

      <h2>Rezultati pretrage</h2>

      <div className="filter-box">
        <h3>Filtriraj po ceni</h3>
        <div className="flex-filters">
          <div>
            <label>Cena od</label>
            <input
              type="number"
              value={priceFilter[0]}
              onChange={(e) =>
                setPriceFilter([Number(e.target.value), priceFilter[1]])
              }
            />
          </div>
          <div>
            <label>Cena do</label>
            <input
              type="number"
              value={priceFilter[1]}
              onChange={(e) =>
                setPriceFilter([priceFilter[0], Number(e.target.value)])
              }
            />
          </div>
        </div>

        <h3>Sortiraj po ceni</h3>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Cena (najniža prvo)</option>
          <option value="desc">Cena (najviša prvo)</option>
        </select>
      </div>

      {displayedFlights.length === 0 ? (
        <p className="no-results">Nema letova za zadate kriterijume</p>
      ) : (
        <div className="results-list">
          {displayedFlights.map((letData) => (
            <FlightCard key={letData.id} flight={letData} />
          ))}
        </div>
      )}

   {totalPages > 1 && (
  <div className="pagination">
    <button
      disabled={page === 1}
      onClick={() => {
        setPage(page - 1);
        window.scrollTo({ top: 0, behavior: "smooth" }); 
      }}
    >
      ⬅ Prethodna
    </button>

    <span>
      Stranica {page} od {totalPages}
    </span>

    <button
      disabled={page === totalPages}
      onClick={() => {
        setPage(page + 1);
        window.scrollTo({ top: 0, behavior: "smooth" }); 
      }}
    >
      Sledeća ➡
    </button>
  </div>
)}

    </div>
  );
};

export default SearchResults;
