import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import Card from "./Card";

const FlightCard = ({ flight }) => {
  return (
    <Card className="hover:shadow-xl hover:-translate-y-1 transition duration-300">
      <div className="space-y-3 text-center">
        <div className="text-xl font-bold text-blue-600">
          {flight.polaziste} → {flight.odrediste}
        </div>

        <div className="text-gray-700">
          Datum polaska: <strong>{flight.vreme_poletanja.split(" ")[0]}</strong>
        </div>
        <div className="text-gray-700">
          Poletanje: <strong>{flight.vreme_poletanja.split(" ")[1]}</strong> | Sletanje:{" "}
          <strong>{flight.vreme_sletanja.split(" ")[1]}</strong>
        </div>

        <div className="text-2xl font-bold text-blue-700">{flight.cena} €</div>

        <Link to={`/letovi/${flight.id}`}>
          <Button className="mt-2 w-full hover:scale-105 transition-transform">
            Pogledaj detalje
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default FlightCard;
