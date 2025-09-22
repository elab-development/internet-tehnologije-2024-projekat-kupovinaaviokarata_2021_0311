import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import flightService from "../api/flightService";
import { AuthContext } from "../context/AuthContext"; 
import { Link } from "react-router-dom";

const FlightDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext); 

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

  const handleReservationClick = () => {
    if (!user) {
      navigate("/login"); 
    } else {
      navigate(`/rezervacija/${flight.id}`); 
    }
  };

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

      <button
        onClick={handleReservationClick}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Rezerviši
      </button>
    </div>
  );
};

export default FlightDetails;

/*
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
/**/