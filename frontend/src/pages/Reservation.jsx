import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Reservation = () => {
  const { id: letId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const seatPrices = {
    1: 5, 2: 5, 3: 10, 4: 10, 5: 15
  };
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

  const ukupnaCena =
    (letInfo ? letInfo.cena * brojKarata : 0) + dodatakOdlazak;

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

  if (loading) return <p>Učitavanje...</p>;
  if (!user) return <p>Morate biti prijavljeni da rezervišete kartu.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-2">
        Rezervacija leta {letInfo?.broj_leta}
      </h2>
      <p className="text-gray-700 mb-2">
        <strong>Ruta:</strong> {letInfo?.polaziste} → {letInfo?.odrediste}
      </p>
      <p className="text-gray-700 mb-4">
        <strong>Datum poletanja:</strong>{" "}
        {letInfo?.vreme_poletanja?.split(" ")[0]} u{" "}
        {letInfo?.vreme_poletanja?.split(" ")[1]}
      </p>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block font-semibold">Broj karata:</label>
        <input
          type="number"
          className="w-full border p-2 rounded"
          value={brojKarata}
          min={1}
          max={slobodnaSedistaOdlazak.length}
          onChange={(e) => setBrojKarata(Number(e.target.value))}
          required
        />

        <p className="text-lg font-semibold">Ukupna cena: {ukupnaCena} €</p>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={birajSedišta}
            onChange={(e) => setBirajSedišta(e.target.checked)}
          />
          <span>Želim da biram sedišta (premium opcija)</span>
        </label>

        {birajSedišta && (
          <small className="text-gray-500 block mb-1">
            Odabir sedišta se dodatno naplaćuje.
          </small>
        )}

        {putniciOdlazak.map((putnik, idx) => (
          <div key={idx} className="border p-3 rounded">
            <h4 className="font-semibold mb-2">Putnik {idx + 1}</h4>
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
                      className={
                        isZauzeto ? "text-red-500" : "text-green-700"
                      }
                    >
                      {isZauzeto
                        ? `Sedište ${seat} (zauzeto)`
                        : `Sedište ${seat} (+${extraPrice}€)`}
                    </option>
                  );
                })}
              </select>
            )}
          </div>
        ))}

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
import axios from "axios";

const Reservation = () => {
  const { id: letId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

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

  const ukupnaCena = letInfo ? letInfo.cena * brojKarata : 0;

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
    setPutniciOdlazak(novi);
  }, [brojKarata]);

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
            broj_sedista: birajSedišta ? seatsOdlazak[i] : null,
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

  if (loading) return <p>Učitavanje...</p>;
  if (!user) return <p>Morate biti prijavljeni da rezervišete kartu.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        Rezervacija leta {letInfo?.broj_leta}
      </h2>
    <p className="mb-2 text-gray-700">
  <strong>Ruta:</strong> {letInfo?.polaziste} → {letInfo?.odrediste}
</p>
<p className="mb-4 text-gray-700">
  <strong>Datum poletanja:</strong>{" "}
  {letInfo?.vreme_poletanja?.split(" ")[0]} u {letInfo?.vreme_poletanja?.split(" ")[1]}
</p>
<p className="mb-4 text-gray-700">
  <strong>Vreme sletanja:</strong>{" "}
  {letInfo?.vreme_sletanja?.split(" ")[1]}
</p>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block font-semibold">Broj karata:</label>
<input
  type="number"
  className="w-full border p-2 rounded"
  value={brojKarata}
  min={1}
  max={slobodnaSedistaOdlazak.length}
  onChange={(e) => setBrojKarata(Number(e.target.value))}
  required
/>


        <p className="text-lg font-semibold">Ukupna cena: {ukupnaCena} €</p>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={birajSedišta}
            onChange={(e) => setBirajSedišta(e.target.checked)}
          />
          <span>Želim da biram sedišta</span>
        </label>

        {putniciOdlazak.map((putnik, idx) => (
          <div key={idx} className="border p-3 rounded">
            <h4 className="font-semibold mb-2">Putnik {idx + 1}</h4>
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
                <option value="">Izaberi sedište</option>
                {Array.from(
                  { length: letInfo?.broj_mesta || 0 },
                  (_, i) => i + 1
                ).map((seat) => {
                  const isZauzeto = zauzetaSedistaOdlazak.includes(seat);
                  return (
                    <option
                      key={seat}
                      value={isZauzeto ? "" : seat}
                      disabled={isZauzeto}
                      className={
                        isZauzeto ? "text-red-500" : "text-green-700"
                      }
                    >
                      {isZauzeto
                        ? `Sedište ${seat} (zauzeto)`
                        : `Sedište ${seat}`}
                    </option>
                  );
                })}
              </select>
            )}
          </div>
        ))}

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