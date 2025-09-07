import React, { useEffect, useState } from "react";
import { getFlights } from "../api/flightService";

const SearchResults = () => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    getFlights()
      .then((res) => setFlights(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Rezultati pretrage</h2>
      {flights.length === 0 ? (
        <p>Nema letova</p>
      ) : (
        <ul>
          {flights.map((letData) => (
            <li key={letData.id}>
              {letData.polaziste} → {letData.odrediste} ({letData.datum})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
