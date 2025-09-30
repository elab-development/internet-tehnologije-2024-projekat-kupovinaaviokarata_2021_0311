import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { FaUser, FaEnvelope, FaChair } from "react-icons/fa";
import "./Reservation.css";

const Reservation = () => {
  const { id: letId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const seatPrices = { 1: 5, 2: 5, 3: 10, 4: 10, 5: 15 };
  const defaultExtra = 5;

  const [loading, setLoading] = useState(true);
  const [letInfo, setLetInfo] = useState(null);
  const [slobodnaSedistaOdlazak, setSlobodnaSedistaOdlazak] = useState([]);
  const [zauzetaSedistaOdlazak, setZauzetaSedistaOdlazak] = useState([]);
  const [brojKarata, setBrojKarata] = useState(1);
  const [birajSedišta, setBirajSedišta] = useState(false);
  const [putniciOdlazak, setPutniciOdlazak] = useState([
    { ime: user?.name || "", email: user?.email || "", sediste: null },
  ]);
  const [error, setError] = useState("");

  const dodatakOdlazak = birajSedišta
    ? putniciOdlazak.reduce(
        (sum, p) => sum + (seatPrices[p.sediste] || defaultExtra || 0),
        0
      )
    : 0;

  const ukupnaCena = (letInfo ? letInfo.cena * brojKarata : 0) + dodatakOdlazak;

  useEffect(() => {
    if (!user) return;

    const fetchLet = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/letovi/${letId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLetInfo(response.data);

        const seatsResponse = await axios.get(
          `http://localhost:8000/api/slobodna-sedista?let_id=${letId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const slobodna = seatsResponse.data.slobodna_sedista || [];
        setSlobodnaSedistaOdlazak(slobodna);

        const allSeats = Array.from(
          { length: response.data.broj_mesta },
          (_, i) => i + 1
        );
        const zauzeta = allSeats.filter((s) => !slobodna.includes(s));
        setZauzetaSedistaOdlazak(zauzeta);
      } catch (err) {
        console.error(err);
        setError("Neuspešno učitavanje leta ili sedišta.");
      } finally {
        setLoading(false);
      }
    };
    fetchLet();
  }, [letId, token, user]);

  useEffect(() => {
    const novi = [...putniciOdlazak];
    while (novi.length < brojKarata) {
      novi.push({ ime: "", email: "", sediste: null });
    }
    while (novi.length > brojKarata) {
      novi.pop();
    }
    if (novi[0]) {
      novi[0].ime = user?.name || "";
      novi[0].email = user?.email || "";
    }
    setPutniciOdlazak(novi);
  }, [brojKarata, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Morate biti prijavljeni.");
      return;
    }

    try {
      let seatsOdlazak = [];
      if (!birajSedišta) {
        seatsOdlazak = slobodnaSedistaOdlazak.slice(0, brojKarata);
      } else {
        seatsOdlazak = putniciOdlazak.map((p) => Number(p.sediste));
      }

      if (seatsOdlazak.includes(null) || seatsOdlazak.length !== brojKarata) {
        setError("Morate izabrati sedišta ili koristiti random za sve putnike.");
        return;
      }

      if (birajSedišta) {
        for (const seat of seatsOdlazak) {
          await axios.post(
            "http://localhost:8000/api/zakljucaj-sediste",
            { let_id: letId, broj_sedista: seat },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      for (let i = 0; i < brojKarata; i++) {
        await axios.post(
          "http://localhost:8000/api/rezervacije",
          {
            ime_putnika: putniciOdlazak[i].ime,
            email: putniciOdlazak[i].email,
            let_id: letId,
            broj_sedista: [seatsOdlazak[i]],
            broj_karata: 1,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      navigate("/success");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Greška pri rezervaciji. Proverite da li su sedišta još slobodna."
      );
    }
  };

  if (loading) return <p className="loading">Učitavanje...</p>;
  if (!user) return <p className="error">Morate biti prijavljeni da rezervišete kartu.</p>;

  return (
    <div className="reservation-container">
      <div className="reservation-card">
        <h2>Rezervacija leta {letInfo?.broj_leta}</h2>
        <p>
          <strong>Ruta:</strong> {letInfo?.polaziste} → {letInfo?.odrediste}
        </p>
        <p>
          <strong>Datum poletanja:</strong>{" "}
          {letInfo?.vreme_poletanja?.split(" ")[0]} u{" "}
          {letInfo?.vreme_poletanja?.split(" ")[1]}
        </p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit} className="reservation-form">
          <label>Broj karata:</label>
          <input
            type="number"
            value={brojKarata}
            min={1}
            max={slobodnaSedistaOdlazak.length}
            onChange={(e) => setBrojKarata(Number(e.target.value))}
            required
          />
<p className="price-highlight">
  Ukupna cena: <span>{ukupnaCena} €</span>
</p>

<div className="checkbox-row">
  <input
    type="checkbox"
    id="birajSedista"
    checked={birajSedišta}
    onChange={(e) => setBirajSedišta(e.target.checked)}
  />
  <label htmlFor="birajSedista">
    Želim da biram sedišta <small>(premium opcija)</small>
  </label>
</div>


          {putniciOdlazak.map((putnik, idx) => (
            <div key={idx} className="putnik-card">
              <h4>Putnik {idx + 1}</h4>
              <div className="form-group">
                <FaUser className="icon" />
                <input
                  type="text"
                  placeholder="Ime putnika"
                  value={putnik.ime}
                  onChange={(e) => {
                    const novi = [...putniciOdlazak];
                    novi[idx].ime = e.target.value;
                    setPutniciOdlazak(novi);
                  }}
                  required
                />
              </div>
              <div className="form-group">
                <FaEnvelope className="icon" />
                <input
                  type="email"
                  placeholder="Email"
                  value={putnik.email}
                  onChange={(e) => {
                    const novi = [...putniciOdlazak];
                    novi[idx].email = e.target.value;
                    setPutniciOdlazak(novi);
                  }}
                  required
                />
              </div>
              {birajSedišta && (
                <div className="form-group">
                  <FaChair className="icon" />
                  <select
                    value={putnik.sediste || ""}
                    onChange={(e) => {
                      const novi = [...putniciOdlazak];
                      novi[idx].sediste = Number(e.target.value);
                      setPutniciOdlazak(novi);
                    }}
                  >
                    <option value="">Izaberi sedište</option>
                    {Array.from(
                      { length: letInfo?.broj_mesta || 0 },
                      (_, i) => i + 1
                    ).map((seat) => {
                      const isZauzeto = zauzetaSedistaOdlazak.includes(seat);
                      const extraPrice = seatPrices[seat] ?? defaultExtra;
                      return (
                        <option
                          key={seat}
                          value={isZauzeto ? "" : seat}
                          disabled={isZauzeto}
                        >
                          {isZauzeto
                            ? `Sedište ${seat} (zauzeto)`
                            : `Sedište ${seat} (+${extraPrice}€)`}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            </div>
          ))}

          <button type="submit" className="reserve-button">
            Rezerviši ✈️
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reservation;
