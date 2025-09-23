import React, { useState, useEffect, useContext } from "react";
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
  const [ime, setIme] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [brojSedista, setBrojSedista] = useState([]);
  const [brojKarata, setBrojKarata] = useState(1);
  const [randomSeats, setRandomSeats] = useState(false);
  const [error, setError] = useState("");
  
  const ukupnaCena = letInfo ? letInfo.cena * brojKarata : 0;


  useEffect(() => {
    if (!user) return;

    const fetchLet = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/letovi/${letId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLetInfo(response.data);

        const seatsResponse = await axios.get(
          `http://localhost:8000/api/slobodna-sedista?let_id=${letId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSlobodnaSedista(seatsResponse.data.slobodna_sedista || []);
        setBrojSedista([seatsResponse.data.slobodna_sedista[0]] || []);
      } catch (err) {
        console.error(err);
        setError("Neuspešno učitavanje leta ili slobodnih sedista.");
      } finally {
        setLoading(false);
      }
    };
    fetchLet();
  }, [letId, token, user]);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!user) {
    setError("Morate biti prijavljeni.");
    return;
  }

  try {
    const seatsToReserve = randomSeats
      ? slobodnaSedista.slice(0, brojKarata)
      : brojSedista.slice(0, brojKarata);

    for (const seat of seatsToReserve) {
      await axios.post(
        "http://localhost:8000/api/zakljucaj-sediste",
        { let_id: letId, broj_sedista: seat },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    const response = await axios.post(
      "http://localhost:8000/api/rezervacije",
      {
        ime_putnika: ime,
        email,
        let_id: letId,
        broj_sedista: seatsToReserve,
        broj_karata: seatsToReserve.length,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log(response.data);
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
      <h2 className="text-2xl font-bold mb-4">Rezervacija leta {letInfo?.broj_leta}</h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Ime putnika"
          className="w-full border p-2 rounded"
          value={ime}
          onChange={(e) => setIme(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
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

        
<p className="text-lg font-semibold">
  Ukupna cena: {letInfo?.cena * brojKarata} €
</p>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={randomSeats}
            onChange={(e) => setRandomSeats(e.target.checked)}
          />
          <span>Dodeli random sedišta</span>
        </label>

        {!randomSeats && (
          <select
            className="w-full border p-2 rounded"
            multiple
            value={brojSedista}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, (option) =>
                Number(option.value)
              );
              setBrojSedista(selected);
            }}
          >
            {slobodnaSedista.map((seat) => (
              <option key={seat} value={seat}>
                Sedište {seat}
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


/*
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

const Reservation = () => {
  const { id: letId } = useParams();
  const navigate = useNavigate();
  const { user, token, loading } = useContext(AuthContext);

  const [letInfo, setLetInfo] = useState(null);
  const [slobodnaSedista, setSlobodnaSedista] = useState([]);
  const [ime, setIme] = useState("");
  const [email, setEmail] = useState("");
  const [brojKarata, setBrojKarata] = useState(1);
  const [randomSeats, setRandomSeats] = useState(true);
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      setIme(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    const fetchLet = async () => {
      try {
        const response = await api.get(`/letovi/${letId}`);
        setLetInfo(response.data);

        const seatsResponse = await api.get(`/slobodna-sedista?let_id=${letId}`);
        setSlobodnaSedista(seatsResponse.data.slobodna_sedista || []);
      } catch (err) {
        console.error("Greška pri učitavanju leta/slobodnih sedista:", err);
        setError("Neuspešno učitavanje leta ili slobodnih sedista.");
      } finally {
        setLoadingData(false);
      }
    };
    fetchLet();
  }, [letId]);

  const lockSeats = async () => {
    try {
      const promises = [];
      if (randomSeats) {
        promises.push(api.post("/zakljucaj-sediste", { let_id: letId, trajanje_min: 5, broj_sedista: brojKarata }));
      } else {
        for (let i = 0; i < brojKarata; i++) {
          promises.push(api.post("/zakljucaj-sediste", { let_id: letId, broj_sedista: slobodnaSedista[i], trajanje_min: 5 }));
        }
      }

      const results = await Promise.all(promises);
      return results.map(r => r.data.lock);
    } catch (err) {
      console.error("Greška pri zaključavanju sedišta:", err);
      throw new Error("Neuspešno zaključavanje sedišta.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const lockedSeats = await lockSeats();
      const seatNumbers = lockedSeats.map(s => s.broj_sedista);

      const reservationResponse = await api.post("/rezervacije", {
        ime_putnika: ime,
        email,
        let_id: letId,
        broj_karata: brojKarata,
        sedista: seatNumbers,
      });

      navigate("/success", { state: { reservation: reservationResponse.data } });
    } catch (err) {
      console.error("Greška pri rezervaciji:", err);
      setError(err.message || "Greška pri rezervaciji. Pokušajte ponovo.");
    }
  };

  if (loading || loadingData) return <p>Učitavanje...</p>;
  if (!user) return <p>Morate biti prijavljeni da rezervišete kartu.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Rezervacija leta {letInfo?.broj_leta}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Ime putnika"
          className="w-full border p-2 rounded"
          value={ime}
          onChange={(e) => setIme(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Broj karata"
          className="w-full border p-2 rounded"
          value={brojKarata}
          min={1}
          max={slobodnaSedista.length || 1}
          onChange={(e) => setBrojKarata(Number(e.target.value))}
          required
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={randomSeats}
            onChange={() => setRandomSeats(!randomSeats)}
            id="randomSeats"
          />
          <label htmlFor="randomSeats">Automatski dodeli sedišta</label>
        </div>

        {!randomSeats && (
          <select
            className="w-full border p-2 rounded"
            value={slobodnaSedista[0] || ""}
            onChange={(e) => setSlobodnaSedista([Number(e.target.value)])}
            multiple={true}
          >
            {slobodnaSedista.map((seat) => (
              <option key={seat} value={seat}>
                Sedište {seat}
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

