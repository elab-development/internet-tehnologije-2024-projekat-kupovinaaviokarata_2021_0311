import React from "react";
import { Link } from "react-router-dom";
import "./FlightCard.css";

const FlightCard = ({ flight }) => {
  return (
    <div className="flight-card">
      <h3>
        {flight.polaziste} → {flight.odrediste}
      </h3>

      <p>
        Datum polaska: <strong>{flight.vreme_poletanja.split(" ")[0]}</strong>
      </p>

      <p>
        Poletanje: <strong>{flight.vreme_poletanja.split(" ")[1]}</strong> |{" "}
        Sletanje: <strong>{flight.vreme_sletanja.split(" ")[1]}</strong>
      </p>

      <div className="price">{flight.cena} €</div>

      <Link to={`/letovi/${flight.id}`}>
        <button>Pogledaj detalje ✈️</button>
      </Link>
    </div>
  );
};

export default FlightCard;

