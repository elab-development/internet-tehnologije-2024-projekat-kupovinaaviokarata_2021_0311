import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import FlightCard from "../components/ui/FlightCard";
import axios from "axios";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    if (user && token) {
      axios
        .get("http://localhost:8000/api/rezervacije", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Rezervacije sa backend-a:", res.data);
          setReservations(res.data.data || []);
        })
        .catch((err) =>
          console.error("Greška pri učitavanju rezervacija:", err)
        )
        .finally(() => setLoading(false));
    }
  }, [user, token]);

  const handleDelete = async (id) => {
    if (
      !window.confirm("Da li ste sigurni da želite da obrišete ovu rezervaciju?")
    )
      return;
    try {
      await axios.delete(`http://localhost:8000/api/rezervacije/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations((prev) => prev.filter((rez) => rez.id !== id));
    } catch (error) {
      console.error("Greška pri brisanju rezervacije:", error);
    }
  };

  if (!user) return <p>Morate biti prijavljeni da vidite profil.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <Breadcrumbs
        items={[{ label: "Početna", to: "/" }, { label: "Profil" }]}
      />

      <h2 className="text-2xl font-bold mb-4">Profil korisnika</h2>
      <p className="mb-2">Ime: {user.name}</p>
      <p className="mb-4">Email: {user.email}</p>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Odjavi se
      </button>

      <h3 className="text-xl font-semibold mt-6 mb-2">Moje rezervacije</h3>

      {loading ? (
        <p>Učitavanje rezervacija...</p>
      ) : reservations.length === 0 ? (
        <p>Nemate nijednu rezervaciju.</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((rez) => (
            <li key={rez.id} className="border p-4 rounded shadow">
              {/* flight info */}
              {rez.let && <FlightCard flight={rez.let} />}

              <div className="mt-2 ml-4">
                <p>
                  <strong>Ime putnika:</strong> {rez.ime_putnika}
                </p>
                <p>
                  <strong>Sedišta:</strong>{" "}
                  {Array.isArray(rez.broj_sedista)
                    ? rez.broj_sedista.join(", ")
                    : rez.broj_sedista}
                </p>
                <p>
                  <strong>Broj karata:</strong> {rez.broj_karata}
                </p>
                {rez.ukupna_cena && (
                  <p>
                    <strong>Ukupna cena:</strong>{" "}
                    {parseFloat(rez.ukupna_cena).toFixed(2)} RSD
                  </p>
                )}
                <button
                  onClick={() => handleDelete(rez.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mt-2"
                >
                  Obriši
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;

/*
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import FlightCard from "../components/ui/FlightCard";
import axios from "axios";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    if (user && token) {
      axios
        .get("http://localhost:8000/api/rezervacije", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Rezervacije sa backend-a:", res.data);
          setReservations(res.data.data || []);
        })
        .catch((err) => console.error("Greška pri učitavanju rezervacija:", err))
        .finally(() => setLoading(false));
    }
  }, [user, token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete ovu rezervaciju?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/rezervacije/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations((prev) => prev.filter((rez) => rez.id !== id));
    } catch (error) {
      console.error("Greška pri brisanju rezervacije:", error);
    }
  };

  if (!user) return <p>Morate biti prijavljeni da vidite profil.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <Breadcrumbs items={[{ label: "Početna", to: "/" }, { label: "Profil" }]} />

      <h2 className="text-2xl font-bold mb-4">Profil korisnika</h2>
      <p className="mb-2">Ime: {user.name}</p>
      <p className="mb-4">Email: {user.email}</p>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Odjavi se
      </button>

      <h3 className="text-xl font-semibold mt-6 mb-2">Moje rezervacije</h3>

      {loading ? (
        <p>Učitavanje rezervacija...</p>
      ) : reservations.length === 0 ? (
        <p>Nemate nijednu rezervaciju.</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((rez) => (
            <li key={rez.id} className="border p-4 rounded shadow">
              <FlightCard flight={rez.let} />
              <div className="mt-2 ml-4">
                  <p><strong>Ime putnika:</strong> {rez.ime_putnika}</p>

                <p><strong>Sedište:</strong> {rez.broj_sedista}</p>
                <p><strong>Broj karata:</strong> {rez.broj_karata}</p>
                <p><strong>Ukupna cena:</strong> {parseFloat(rez.ukupna_cena).toFixed(2)} RSD</p>
                <button
                  onClick={() => handleDelete(rez.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mt-2"
                >
                  Obriši
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;

*/

