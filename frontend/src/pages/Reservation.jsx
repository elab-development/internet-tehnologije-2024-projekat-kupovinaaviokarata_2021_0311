import React, { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function Reservation() {
  const { id } = useParams(); 
  const [imePutnika, setImePutnika] = useState("");
  const [email, setEmail] = useState("");
  const [brojSedista, setBrojSedista] = useState("");
  const [brojKarata, setBrojKarata] = useState(1);
  const [poruka, setPoruka] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPoruka("");

    try {
      const response = await api.post("/rezervacije", {
        ime_putnika: imePutnika,
        email: email,
        broj_sedista: Number(brojSedista),
        let_id: Number(id),
        broj_karata: Number(brojKarata),
      });

      setPoruka("Rezervacija uspešna!");
      console.log("Rezervacija:", response.data);
    } catch (error) {
      if (error.response && error.response.data.error) {
        setPoruka(error.response.data.error);
      } else {
        setPoruka("Došlo je do greške pri rezervaciji.");
      }
      console.error("Greška pri rezervaciji:", error);
    }
  };

  return (
    <div>
      <h2>Rezervacija leta #{id}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ime putnika:</label>
          <input
            type="text"
            value={imePutnika}
            onChange={(e) => setImePutnika(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Broj sedišta:</label>
          <input
            type="number"
            value={brojSedista}
            onChange={(e) => setBrojSedista(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Broj karata:</label>
          <input
            type="number"
            min="1"
            value={brojKarata}
            onChange={(e) => setBrojKarata(e.target.value)}
            required
          />
        </div>

        <button type="submit">Rezerviši</button>
      </form>

      {poruka && <p>{poruka}</p>}
    </div>
  );
}
