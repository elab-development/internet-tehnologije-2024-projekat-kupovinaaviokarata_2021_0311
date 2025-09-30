import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import flightService from "../api/flightService";
import { AuthContext } from "../context/AuthContext";
import "./FlightDetails.css";

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
    return <p className="loading">Učitavanje...</p>;
  }

  if (!flight) {
    return <p className="error">Let nije pronađen.</p>;
  }

  const handleReservationClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/rezervacija/${flight.id}`);
    }
  };

  return (
    <div className="flight-details-container">
      <div className="flight-card">
        <div className="flight-content">
          <h2>Detalji leta</h2>
          <p><strong>Broj leta:</strong> {flight.broj_leta}</p>
          <p><strong>Polazište:</strong> {flight.polaziste}</p>
          <p><strong>Odredište:</strong> {flight.odrediste}</p>
          <p><strong>Datum polaska:</strong> {flight.vreme_poletanja.split(" ")[0]}</p>
          <p><strong>Vreme polaska:</strong> {flight.vreme_poletanja.split(" ")[1]}</p>
          <p><strong>Vreme sletanja:</strong> {flight.vreme_sletanja.split(" ")[1]}</p>
          <p className="price">Cena: {flight.cena} EUR</p>

          <button
            onClick={handleReservationClick}
            className="reserve-button"
          >
            Rezerviši ✈️
          </button>
        </div>
      </div>
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