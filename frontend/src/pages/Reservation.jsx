import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Reservation = () => {
  const { id: letId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  // frontend cene sedišta
  const seatPrices = { 1: 5, 2: 5, 3: 10, 4: 0, 5: 0 }; // primer doplata

  const [loading, setLoading] = useState(true);
  const [letInfo, setLetInfo] = useState(null);
  const [slobodnaSedistaOdlazak, setSlobodnaSedistaOdlazak] = useState([]);
  const [slobodnaSedistaPovratak, setSlobodnaSedistaPovratak] = useState([]);
  const [brojKarata, setBrojKarata] = useState(1);

  // premium opcija
  const [birajSedišta, setBirajSedišta] = useState(false);

  // putnici
  const [putniciOdlazak, setPutniciOdlazak] = useState([
    { ime: user?.name || "", email: user?.email || "", sediste: null },
  ]);
  const [putniciPovratak, setPutniciPovratak] = useState([
    { sediste: null },
  ]);

  const [error, setError] = useState("");

  const [roundTrip, setRoundTrip] = useState(false);
  const [returnFlights, setReturnFlights] = useState([]);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);

  const dodatakOdlazak = birajSedišta
    ? putniciOdlazak.reduce(
        (sum, p) => sum + (seatPrices[p.sediste] || 0),
        0
      )
    : 0;
  const dodatakPovratak =
    birajSedišta && roundTrip
      ? putniciPovratak.reduce(
          (sum, p) => sum + (seatPrices[p.sediste] || 0),
          0
        )
      : 0;

  const ukupnaCena =
    (letInfo ? letInfo.cena * brojKarata : 0) +
    dodatakOdlazak +
    dodatakPovratak;

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
        setSlobodnaSedistaOdlazak(seatsResponse.data.slobodna_sedista || []);

        const allFlights = await axios.get("http://localhost:8000/api/letovi", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const flightsArray = allFlights.data.data || allFlights.data;

        const possibleReturns = flightsArray.filter(
          (f) =>
            f.polaziste === response.data.odrediste &&
            f.odrediste === response.data.polaziste
        );
        setReturnFlights(possibleReturns);
      } catch (err) {
        console.error(err);
        setError("Neuspešno učitavanje leta ili slobodnih sedista.");
      } finally {
        setLoading(false);
      }
    };
    fetchLet();
  }, [letId, token, user]);

  useEffect(() => {
    const noviOdlazak = [...putniciOdlazak];
    const noviPovratak = [...putniciPovratak];
    while (noviOdlazak.length < brojKarata) {
      noviOdlazak.push({ ime: "", email: "", sediste: null });
      noviPovratak.push({ sediste: null });
    }
    while (noviOdlazak.length > brojKarata) {
      noviOdlazak.pop();
      noviPovratak.pop();
    }
    setPutniciOdlazak(noviOdlazak);
    setPutniciPovratak(noviPovratak);
  }, [brojKarata]);

  useEffect(() => {
    if (selectedReturnFlight) {
      axios
        .get(
          `http://localhost:8000/api/slobodna-sedista?let_id=${selectedReturnFlight}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) =>
          setSlobodnaSedistaPovratak(res.data.slobodna_sedista || [])
        )
        .catch((err) => console.error(err));
    }
  }, [selectedReturnFlight, token]);

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
        setError("Morate izabrati sedišta ili koristiti random za sve putnike (odlazak).");
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
            broj_sedista: birajSedišta ? seatsOdlazak[i] : null,
            broj_karata: 1,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      if (roundTrip && selectedReturnFlight) {
        let seatsPovratak = [];
        if (!birajSedišta) {
          seatsPovratak = slobodnaSedistaPovratak.slice(0, brojKarata);
        } else {
          seatsPovratak = putniciPovratak.map((p) => Number(p.sediste));
        }

        if (birajSedišta && seatsPovratak.includes(null)) {
          setError("Morate izabrati sedišta ili koristiti random za sve putnike (povratak).");
          return;
        }

        if (birajSedišta) {
          for (const seat of seatsPovratak) {
            await axios.post(
              "http://localhost:8000/api/zakljucaj-sediste",
              { let_id: selectedReturnFlight, broj_sedista: seat },
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
              let_id: selectedReturnFlight,
              broj_sedista: birajSedišta ? seatsPovratak[i] : null,
              broj_karata: 1,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
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

  if (loading) return <p>Učitavanje...</p>;
  if (!user) return <p>Morate biti prijavljeni da rezervišete kartu.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        Rezervacija leta {letInfo?.broj_leta}
      </h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Broj karata"
          className="w-full border p-2 rounded"
          value={brojKarata}
          min={1}
          max={slobodnaSedistaOdlazak.length}
          onChange={(e) => setBrojKarata(Number(e.target.value))}
          required
        />

        <p className="text-lg font-semibold">
          Ukupna cena: {ukupnaCena} €
        </p>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={birajSedišta}
            onChange={(e) => setBirajSedišta(e.target.checked)}
          />
          <span>Želim da biram sedišta (premium)</span>
        </label>

        {putniciOdlazak.map((putnik, idx) => (
          <div key={idx} className="border p-3 rounded">
            <h4 className="font-semibold mb-2">Putnik {idx + 1} – odlazak</h4>
            <input
              type="text"
              placeholder="Ime putnika"
              className="w-full border p-2 rounded mb-2"
              value={putnik.ime}
              onChange={(e) => {
                const novi = [...putniciOdlazak];
                novi[idx].ime = e.target.value;
                setPutniciOdlazak(novi);
              }}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border p-2 rounded mb-2"
              value={putnik.email}
              onChange={(e) => {
                const novi = [...putniciOdlazak];
                novi[idx].email = e.target.value;
                setPutniciOdlazak(novi);
              }}
              required
            />
            {birajSedišta && (
              <select
                className="w-full border p-2 rounded"
                value={putnik.sediste || ""}
                onChange={(e) => {
                  const novi = [...putniciOdlazak];
                  novi[idx].sediste = Number(e.target.value);
                  setPutniciOdlazak(novi);
                }}
              >
                <option value="">Izaberi sedište odlazak</option>
                {slobodnaSedistaOdlazak.map((seat) => (
                  <option key={seat} value={seat}>
                    Sedište {seat} (+{seatPrices[seat] || 0}€)
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}

        <label className="flex items-center space-x-2 mt-4">
          <input
            type="checkbox"
            checked={roundTrip}
            onChange={(e) => setRoundTrip(e.target.checked)}
          />
          <span>Želim i povratnu kartu</span>
        </label>

        {roundTrip && (
          <select
            className="w-full border p-2 rounded mt-2"
            value={selectedReturnFlight || ""}
            onChange={(e) => setSelectedReturnFlight(Number(e.target.value))}
          >
            <option value="">-- Izaberi povratni let --</option>
            {returnFlights.map((f) => (
              <option key={f.id} value={f.id}>
                {f.polaziste} → {f.odrediste} ({f.broj_leta})
              </option>
            ))}
          </select>
        )}

        {roundTrip && birajSedišta && selectedReturnFlight && (
          <>
            {putniciPovratak.map((putnik, idx) => (
              <div key={idx} className="border p-3 rounded mt-2">
                <h4 className="font-semibold mb-2">
                  Putnik {idx + 1} – povratak
                </h4>
                <select
                  className="w-full border p-2 rounded"
                  value={putnik.sediste || ""}
                  onChange={(e) => {
                    const novi = [...putniciPovratak];
                    novi[idx].sediste = Number(e.target.value);
                    setPutniciPovratak(novi);
                  }}
                >
                  <option value="">Izaberi sedište povratak</option>
                  {slobodnaSedistaPovratak.map((seat) => (
                    <option key={seat} value={seat}>
                      Sedište {seat} (+{seatPrices[seat] || 0}€)
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Rezerviši
        </button>
      </form>
    </div>
  );
};

export default Reservation;



/*import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Reservation = () => {
  const { id: letId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [letInfo, setLetInfo] = useState(null);
  const [slobodnaSedista, setSlobodnaSedista] = useState([]);
  const [brojKarata, setBrojKarata] = useState(1);
  const [randomSeats, setRandomSeats] = useState(false);
  const [putnici, setPutnici] = useState([
    { ime: user?.name || "", email: user?.email || "", sediste: null },
  ]);
  const [error, setError] = useState("");

  const ukupnaCena = letInfo ? letInfo.cena * brojKarata : 0;

  const [roundTrip, setRoundTrip] = useState(false);
  const [returnFlights, setReturnFlights] = useState([]);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);

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
        setSlobodnaSedista(seatsResponse.data.slobodna_sedista || []);

        const allFlights = await axios.get("http://localhost:8000/api/letovi", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Laravel obično vraća { data: [...] }
        const flightsArray = allFlights.data.data || allFlights.data;

        const possibleReturns = flightsArray.filter(
          (f) =>
            f.polaziste === response.data.odrediste &&
            f.odrediste === response.data.polaziste
        );
        setReturnFlights(possibleReturns);
      } catch (err) {
        console.error(err);
        setError("Neuspešno učitavanje leta ili slobodnih sedista.");
      } finally {
        setLoading(false);
      }
    };
    fetchLet();
  }, [letId, token, user]);

  useEffect(() => {
    setPutnici((prev) => {
      const novi = [...prev];
      while (novi.length < brojKarata) {
        novi.push({ ime: "", email: "", sediste: null });
      }
      while (novi.length > brojKarata) {
        novi.pop();
      }
      return novi;
    });
  }, [brojKarata]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Morate biti prijavljeni.");
      return;
    }

    try {
      let seatsToUse = [];
      if (randomSeats) {
        seatsToUse = slobodnaSedista.slice(0, brojKarata);
      } else {
        seatsToUse = putnici.map((p) => Number(p.sediste));
      }

      if (seatsToUse.includes(null) || seatsToUse.length !== brojKarata) {
        setError("Morate izabrati sedišta za sve putnike.");
        return;
      }

      for (const seat of seatsToUse) {
        await axios.post(
          "http://localhost:8000/api/zakljucaj-sediste",
          { let_id: letId, broj_sedista: seat },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      for (let i = 0; i < brojKarata; i++) {
        await axios.post(
          "http://localhost:8000/api/rezervacije",
          {
            ime_putnika: putnici[i].ime,
            email: putnici[i].email,
            let_id: letId,
            broj_sedista: seatsToUse[i],
            broj_karata: 1,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      if (roundTrip && selectedReturnFlight) {
        for (let i = 0; i < brojKarata; i++) {
          await axios.post(
            "http://localhost:8000/api/rezervacije",
            {
              ime_putnika: putnici[i].ime,
              email: putnici[i].email,
              let_id: selectedReturnFlight,
              broj_sedista: null, 
              broj_karata: 1,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
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

  if (loading) return <p>Učitavanje...</p>;
  if (!user) return <p>Morate biti prijavljeni da rezervišete kartu.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        Rezervacija leta {letInfo?.broj_leta}
      </h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Broj karata"
          className="w-full border p-2 rounded"
          value={brojKarata}
          min={1}
          max={slobodnaSedista.length}
          onChange={(e) => setBrojKarata(Number(e.target.value))}
          required
        />

        <p className="text-lg font-semibold">Ukupna cena: {ukupnaCena} €</p>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={randomSeats}
            onChange={(e) => setRandomSeats(e.target.checked)}
          />
          <span>Dodeli random sedišta</span>
        </label>

        {!randomSeats &&
          putnici.map((putnik, idx) => (
            <div key={idx} className="border p-3 rounded">
              <h4 className="font-semibold mb-2">Putnik {idx + 1}</h4>
              <input
                type="text"
                placeholder="Ime putnika"
                className="w-full border p-2 rounded mb-2"
                value={putnik.ime}
                onChange={(e) => {
                  const novi = [...putnici];
                  novi[idx].ime = e.target.value;
                  setPutnici(novi);
                }}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border p-2 rounded mb-2"
                value={putnik.email}
                onChange={(e) => {
                  const novi = [...putnici];
                  novi[idx].email = e.target.value;
                  setPutnici(novi);
                }}
                required
              />
              <select
                className="w-full border p-2 rounded"
                value={putnik.sediste || ""}
                onChange={(e) => {
                  const novi = [...putnici];
                  novi[idx].sediste = Number(e.target.value);
                  setPutnici(novi);
                }}
              >
                <option value="">Izaberi sedište</option>
                {slobodnaSedista.map((seat) => (
                  <option key={seat} value={seat}>
                    Sedište {seat}
                  </option>
                ))}
              </select>
            </div>
          ))}

        <label className="flex items-center space-x-2 mt-4">
          <input
            type="checkbox"
            checked={roundTrip}
            onChange={(e) => setRoundTrip(e.target.checked)}
          />
          <span>Želim i povratnu kartu</span>
        </label>

        {roundTrip && (
          <select
            className="w-full border p-2 rounded mt-2"
            value={selectedReturnFlight || ""}
            onChange={(e) => setSelectedReturnFlight(Number(e.target.value))}
          >
            <option value="">-- Izaberi povratni let --</option>
            {returnFlights.map((f) => (
              <option key={f.id} value={f.id}>
                {f.polaziste} → {f.odrediste} ({f.broj_leta})
              </option>
            ))}
          </select>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Rezerviši
        </button>
      </form>
    </div>
  );
};

export default Reservation;
*/