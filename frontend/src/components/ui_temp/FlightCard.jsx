import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import Card from "./Card";


const FlightCard = ({ flight }) => {
  return (
    <Card>
      <div className="space-y-2">
        <div className="text-lg font-semibold">
          {flight.polaziste} → {flight.odrediste}
        </div>
        <div>Datum polaska: {flight.vreme_poletanja.split(" ")[0]}</div>
        <div>Vreme poletanja: {flight.vreme_poletanja.split(" ")[1]}</div>
        <div>Vreme sletanja: {flight.vreme_sletanja.split(" ")[1]}</div>
        <div className="font-bold text-blue-600">{flight.cena} EUR</div>

        <Link to={`/letovi/${flight.id}`}>
          <Button className="mt-2 w-full">Pogledaj detalje</Button>
        </Link>
      </div>
    </Card>
  );
};

export default FlightCard;
