import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { FaUser, FaEnvelope, FaChair, FaPlaneArrival } from "react-icons/fa";
import "./Reservation.css";

const Reservation = () => {
  const { id: letId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const seatPrices = { 1: 5, 2: 5, 3: 10, 4: 10, 5: 15 };
  const defaultExtra = 5;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [letInfo, setLetInfo] = useState(null);
  const [slobodnaSedistaOdlazak, setSlobodnaSedistaOdlazak] = useState([]);
  const [zauzetaSedistaOdlazak, setZauzetaSedistaOdlazak] = useState([]);

  const [returnFlights, setReturnFlights] = useState([]);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [slobodnaSedistaPovratak, setSlobodnaSedistaPovratak] = useState([]);
  const [zauzetaSedistaPovratak, setZauzetaSedistaPovratak] = useState([]);

  const [brojKarata, setBrojKarata] = useState(1);
  const [birajSedišta, setBirajSedišta] = useState(false);
  const [putnici, setPutnici] = useState([
    { ime: user?.name || "", email: user?.email || "", sedisteOdlazak: null, sedistePovratak: null },
  ]);

  const doplataOdlazak = birajSedišta
    ? putnici.reduce((sum, p) => sum + (p.sedisteOdlazak ? (seatPrices[p.sedisteOdlazak] ?? defaultExtra) : 0), 0)
    : 0;

  const doplataPovratak = selectedReturn && birajSedišta
    ? putnici.reduce((sum, p) => sum + (p.sedistePovratak ? (seatPrices[p.sedistePovratak] ?? defaultExtra) : 0), 0)
    : 0;

  const cenaOdlazak = letInfo ? (letInfo.cena || 0) * brojKarata : 0;
  const cenaPovratak = selectedReturn ? (selectedReturn.cena || 0) * brojKarata : 0;

  const ukupnaCena = cenaOdlazak + cenaPovratak + doplataOdlazak + doplataPovratak;


  useEffect(() => {
    const run = async () => {
      if (!user) return;
      try {
        const resLet = await axios.get(`http://localhost:8000/api/letovi/${letId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const letData = resLet.data;
        setLetInfo(letData);

        const resSeats = await axios.get(
          `http://localhost:8000/api/slobodna-sedista?let_id=${letId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const slobodna = resSeats.data.slobodna_sedista || [];
        setSlobodnaSedistaOdlazak(slobodna);

        const allSeats = Array.from({ length: letData.broj_mesta }, (_, i) => i + 1);
        setZauzetaSedistaOdlazak(allSeats.filter((s) => !slobodna.includes(s)));

        const resReturn = await axios.get(
          `http://localhost:8000/api/letovi`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              polaziste: letData.odrediste,
              odrediste: letData.polaziste,
            },
          }
        );
        const list = resReturn.data?.data || resReturn.data || [];
        setReturnFlights(list);
      } catch (err) {
        console.error(err);
        setError("Neuspešno učitavanje leta ili sedišta.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [letId, token, user]);

  useEffect(() => {
    const next = [...putnici];
    while (next.length < brojKarata) next.push({ ime: "", email: "", sedisteOdlazak: null, sedistePovratak: null });
    while (next.length > brojKarata) next.pop();

    if (next[0]) {
      next[0].ime = user?.name || "";
      next[0].email = user?.email || "";
    }
    setPutnici(next);
  }, [brojKarata, user]);

  useEffect(() => {
    const fetchReturnSeats = async () => {
      if (!selectedReturn) {
        setSlobodnaSedistaPovratak([]);
        setZauzetaSedistaPovratak([]);
        return;
      }
      try {
        const resSeats = await axios.get(
          `http://localhost:8000/api/slobodna-sedista?let_id=${selectedReturn.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const slobodna = resSeats.data.slobodna_sedista || [];
        setSlobodnaSedistaPovratak(slobodna);

        const allSeats = Array.from({ length: selectedReturn.broj_mesta }, (_, i) => i + 1);
        setZauzetaSedistaPovratak(allSeats.filter((s) => !slobodna.includes(s)));

        setPutnici((prev) => prev.map((p) => ({ ...p, sedistePovratak: null })));
      } catch (err) {
        console.error(err);
        setSlobodnaSedistaPovratak([]);
        setZauzetaSedistaPovratak([]);
      }
    };
    fetchReturnSeats();
  }, [selectedReturn, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Morate biti prijavljeni.");
      return;
    }

    try {
      let seatsOdlazak = [];
      if (birajSedišta) {
        seatsOdlazak = putnici.map((p) => Number(p.sedisteOdlazak)).filter((x) => Number.isInteger(x) && x > 0);
      } else {
        seatsOdlazak = slobodnaSedistaOdlazak.slice(0, brojKarata);
      }

      if (seatsOdlazak.length !== brojKarata) {
        setError("Morate izabrati sedišta (ili dozvoliti automatski izbor) za sve putnike (ODLAZAK).");
        return;
      }

      if (birajSedišta) {
        for (const s of seatsOdlazak) {
          await axios.post(
            "http://localhost:8000/api/zakljucaj-sediste",
            { let_id: letId, broj_sedista: s },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      
      for (let i = 0; i < brojKarata; i++) {
        await axios.post(
          "http://localhost:8000/api/rezervacije",
          {
            ime_putnika: putnici[i].ime,
            email: putnici[i].email,
            let_id: letId,
            broj_sedista: [seatsOdlazak[i]], 
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      if (selectedReturn) {
    
        let seatsPovratak = [];
        if (birajSedišta) {
          seatsPovratak = putnici
            .map((p) => Number(p.sedistePovratak))
            .filter((x) => Number.isInteger(x) && x > 0);
        } else {
          seatsPovratak = slobodnaSedistaPovratak.slice(0, brojKarata);
        }

        if (seatsPovratak.length !== brojKarata) {
          setError("Morate izabrati sedišta (ili automatski izbor) za sve putnike (POVRATAK).");
          return;
        }

        if (birajSedišta) {
          for (const s of seatsPovratak) {
            await axios.post(
              "http://localhost:8000/api/zakljucaj-sediste",
              { let_id: selectedReturn.id, broj_sedista: s },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }
        }

        for (let i = 0; i < brojKarata; i++) {
          await axios.post(
            "http://localhost:8000/api/rezervacije",
            {
              ime_putnika: putnici[i].ime,
              email: putnici[i].email,
              let_id: selectedReturn.id,
              broj_sedista: [seatsPovratak[i]], 
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      navigate("/success");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Greška pri rezervaciji. Proverite sedišta i pokušajte ponovo.");
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
          {letInfo?.vreme_poletanja?.split(" ")[0]} u {letInfo?.vreme_poletanja?.split(" ")[1]}
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
            Ukupna cena: <span>{ukupnaCena.toFixed(2)} €</span>
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

          {returnFlights.length > 0 && (
            <div className="return-flight-box">
              <label>Povratni let:</label>
              <div className="form-group">
                <FaPlaneArrival className="icon" />
                <select
                  value={selectedReturn?.id || ""}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    const found = returnFlights.find((f) => f.id === id) || null;
                    setSelectedReturn(found);
                  }}
                >
                  <option value="">Bez povratnog leta</option>
                  {returnFlights.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.polaziste} → {f.odrediste} • {f.vreme_poletanja?.split(" ")[0]} {f.vreme_poletanja?.split(" ")[1]} • {f.cena} €
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {putnici.map((p, idx) => (
            <div key={idx} className="putnik-card">
              <h4>Putnik {idx + 1}</h4>

              <div className="form-group">
                <FaUser className="icon" />
                <input
                  type="text"
                  placeholder="Ime putnika"
                  value={p.ime}
                  onChange={(e) => {
                    const next = [...putnici];
                    next[idx].ime = e.target.value;
                    setPutnici(next);
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <FaEnvelope className="icon" />
                <input
                  type="email"
                  placeholder="Email"
                  value={p.email}
                  onChange={(e) => {
                    const next = [...putnici];
                    next[idx].email = e.target.value;
                    setPutnici(next);
                  }}
                  required
                />
              </div>

              {birajSedišta && (
                <>
                  <div className="form-group">
                    <FaChair className="icon" />
                    <select
                      value={p.sedisteOdlazak || ""}
                      onChange={(e) => {
                        const next = [...putnici];
                        next[idx].sedisteOdlazak = Number(e.target.value) || null;
                        setPutnici(next);
                      }}
                    >
                      <option value="">Sedište za odlazak</option>
                      {Array.from({ length: letInfo?.broj_mesta || 0 }, (_, i) => i + 1).map((seat) => {
                        const isZauzeto = zauzetaSedistaOdlazak.includes(seat);
                        const extraPrice = seatPrices[seat] ?? defaultExtra;
                        return (
                          <option key={seat} value={isZauzeto ? "" : seat} disabled={isZauzeto}>
                            {isZauzeto ? `Sedište ${seat} (zauzeto)` : `Sedište ${seat} (+${extraPrice}€)`}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {selectedReturn && (
                    <div className="form-group">
                      <FaChair className="icon" />
                      <select
                        value={p.sedistePovratak || ""}
                        onChange={(e) => {
                          const next = [...putnici];
                          next[idx].sedistePovratak = Number(e.target.value) || null;
                          setPutnici(next);
                        }}
                      >
                        <option value="">Sedište za povratak</option>
                        {Array.from({ length: selectedReturn?.broj_mesta || 0 }, (_, i) => i + 1).map((seat) => {
                          const isZauzeto = zauzetaSedistaPovratak.includes(seat);
                          const extraPrice = seatPrices[seat] ?? defaultExtra;
                          return (
                            <option key={seat} value={isZauzeto ? "" : seat} disabled={isZauzeto}>
                              {isZauzeto ? `Sedište ${seat} (zauzeto)` : `Sedište ${seat} (+${extraPrice}€)`}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          <button type="submit" className="reserve-button">Rezerviši ✈️</button>
        </form>
      </div>
    </div>
  );
};

export default Reservation;
