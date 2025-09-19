import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import flightService from "../api/flightService";

const FlightDetails = () => {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const response = await flightService.getFlight(id);
        console.log("Flight response:", response.data);
        setFlight(response.data);
      } catch (error) {
        console.error("Greška prilikom dohvatanja leta:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();
  }, [id]);

  if (loading) {
    return <p>Učitavanje...</p>;
  }

  if (!flight) {
    return <p>Let nije pronađen.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Detalji leta</h2>
      <p><strong>Broj leta:</strong> {flight.broj_leta}</p>
      <p><strong>Polazište:</strong> {flight.polaziste}</p>
      <p><strong>Odredište:</strong> {flight.odrediste}</p>
      <p><strong>Datum polaska:</strong> {flight.vreme_poletanja.split(" ")[0]}</p>
      <p><strong>Vreme polaska:</strong> {flight.vreme_poletanja.split(" ")[1]}</p>
      <p><strong>Vreme sletanja:</strong> {flight.vreme_sletanja.split(" ")[1]}</p>
      <p><strong>Cena:</strong> {flight.cena} EUR</p>
    </div>
  );
};

export default FlightDetails;
