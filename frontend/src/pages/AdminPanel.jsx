import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Breadcrumbs from "../components/ui/Breadcrumbs";

const AdminPanel = () => {
  const { user, token } = useContext(AuthContext);

  const [flights, setFlights] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newFlight, setNewFlight] = useState({
    broj_leta: "",
    polaziste: "",
    odrediste: "",
    vreme_poletanja: "",
    vreme_sletanja: "",
    cena: "",
    broj_mesta: "",
  });

  useEffect(() => {
    if (user?.role === "admin" && token) {
      Promise.all([
        axios.get("http://localhost:8000/api/letovi", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8000/api/rezervacije", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])
        .then(([flightsRes, resRes]) => {
          const flightsArray = flightsRes.data.data || flightsRes.data;
          setFlights(flightsArray);
          setReservations(resRes.data.data || resRes.data);
        })
        .catch((err) => console.error("Greška u učitavanju admin podataka", err))
        .finally(() => setLoading(false));
    }
  }, [user, token]);

  const handleAddFlight = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/letovi", newFlight, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const addedFlight = res.data.data || res.data;
      setFlights((prev) => [...prev, addedFlight]);
      setNewFlight({
        broj_leta: "",
        polaziste: "",
        odrediste: "",
        vreme_poletanja: "",
        vreme_sletanja: "",
        cena: "",
        broj_mesta: "",
      });
      alert("Let uspešno dodat!");
    } catch (err) {
      console.error(err);
      alert("Greška pri dodavanju leta.");
    }
  };

  const handleDeleteFlight = async (id) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete ovaj let?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/letovi/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlights((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
      alert("Greška pri brisanju leta.");
    }
  };

  const handleDeleteReservation = async (id) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete ovu rezervaciju?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/rezervacije/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("Greška pri brisanju rezervacije.");
    }
  };

  if (!user || user.role !== "admin") {
    return <p>Nemate pristup ovoj stranici.</p>;
  }

  if (loading) return <p>Učitavanje...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <Breadcrumbs
        items={[
          { label: "Početna", to: "/" },
          { label: "Admin Panel" },
        ]}
      />
      <h2 className="text-3xl font-bold mb-6">Admin Panel</h2>

      <h3 className="text-xl font-semibold mt-6 mb-4">Dodaj novi let</h3>
      <form onSubmit={handleAddFlight} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input
          type="text"
          placeholder="Broj leta"
          className="border p-2 rounded"
          value={newFlight.broj_leta}
          onChange={(e) => setNewFlight({ ...newFlight, broj_leta: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Polazište"
          className="border p-2 rounded"
          value={newFlight.polaziste}
          onChange={(e) => setNewFlight({ ...newFlight, polaziste: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Odredište"
          className="border p-2 rounded"
          value={newFlight.odrediste}
          onChange={(e) => setNewFlight({ ...newFlight, odrediste: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          placeholder="Vreme poletanja"
          className="border p-2 rounded"
          value={newFlight.vreme_poletanja}
          onChange={(e) => setNewFlight({ ...newFlight, vreme_poletanja: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          placeholder="Vreme sletanja"
          className="border p-2 rounded"
          value={newFlight.vreme_sletanja}
          onChange={(e) => setNewFlight({ ...newFlight, vreme_sletanja: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Cena (€)"
          className="border p-2 rounded"
          value={newFlight.cena}
          onChange={(e) => setNewFlight({ ...newFlight, cena: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Broj mesta"
          className="border p-2 rounded"
          value={newFlight.broj_mesta}
          onChange={(e) => setNewFlight({ ...newFlight, broj_mesta: e.target.value })}
          required
        />
        <button
          type="submit"
          className="md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Dodaj let
        </button>
      </form>

      <h3 className="text-xl font-semibold mt-6 mb-4">Svi letovi</h3>
      <table className="w-full border mb-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Broj leta</th>
            <th className="border p-2">Polazište</th>
            <th className="border p-2">Odredište</th>
            <th className="border p-2">Cena</th>
            <th className="border p-2">Akcije</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((f) => (
            <tr key={f.id}>
              <td className="border p-2">{f.id}</td>
              <td className="border p-2">{f.broj_leta}</td>
              <td className="border p-2">{f.polaziste}</td>
              <td className="border p-2">{f.odrediste}</td>
              <td className="border p-2">{f.cena}€</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => handleDeleteFlight(f.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Obriši
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-xl font-semibold mb-4">Sve rezervacije</h3>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Ime putnika</th>
            <th className="border p-2">Let</th>
            <th className="border p-2">Sedište</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Akcije</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((rez) => (
            <tr key={rez.id}>
              <td className="border p-2">{rez.id}</td>
              <td className="border p-2">{rez.ime_putnika}</td>
              <td className="border p-2">{rez.let?.broj_leta}</td>
              <td className="border p-2">{rez.broj_sedista}</td>
              <td className="border p-2">{rez.email}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => handleDeleteReservation(rez.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Obriši
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;

