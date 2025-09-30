import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import "./AdminPanel.css";

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
    <div className="admin-container">
      <Breadcrumbs items={[{ label: "Početna", to: "/" }, { label: "Admin Panel" }]} />
      <h2 className="admin-title">Admin Panel</h2>

      <div className="admin-card">
        <h3 className="section-title">Dodaj novi let</h3>
        <form onSubmit={handleAddFlight} className="admin-form">
          <input type="text" placeholder="Broj leta" value={newFlight.broj_leta}
            onChange={(e) => setNewFlight({ ...newFlight, broj_leta: e.target.value })} required />
          <input type="text" placeholder="Polazište" value={newFlight.polaziste}
            onChange={(e) => setNewFlight({ ...newFlight, polaziste: e.target.value })} required />
          <input type="text" placeholder="Odredište" value={newFlight.odrediste}
            onChange={(e) => setNewFlight({ ...newFlight, odrediste: e.target.value })} required />
          <input type="datetime-local" value={newFlight.vreme_poletanja}
            onChange={(e) => setNewFlight({ ...newFlight, vreme_poletanja: e.target.value })} required />
          <input type="datetime-local" value={newFlight.vreme_sletanja}
            onChange={(e) => setNewFlight({ ...newFlight, vreme_sletanja: e.target.value })} required />
          <input type="number" placeholder="Cena (€)" value={newFlight.cena}
            onChange={(e) => setNewFlight({ ...newFlight, cena: e.target.value })} required />
          <input type="number" placeholder="Broj mesta" value={newFlight.broj_mesta}
            onChange={(e) => setNewFlight({ ...newFlight, broj_mesta: e.target.value })} required />
          <button type="submit" className="btn-primary">Dodaj let</button>
        </form>
      </div>

      <div className="admin-card">
        <h3 className="section-title">Svi letovi</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th><th>Broj leta</th><th>Polazište</th><th>Odredište</th><th>Cena</th><th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((f) => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.broj_leta}</td>
                <td>{f.polaziste}</td>
                <td>{f.odrediste}</td>
                <td>{f.cena} €</td>
                <td>
                  <button onClick={() => handleDeleteFlight(f.id)} className="btn-danger">
                    Obriši
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h3 className="section-title">Sve rezervacije</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th><th>Ime putnika</th><th>Let</th><th>Sedište</th><th>Email</th><th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((rez) => (
              <tr key={rez.id}>
                <td>{rez.id}</td>
                <td>{rez.ime_putnika}</td>
                <td>{rez.let?.broj_leta}</td>
                <td>{rez.broj_sedista}</td>
                <td>{rez.email}</td>
                <td>
                  <button onClick={() => handleDeleteReservation(rez.id)} className="btn-danger">
                    Obriši
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
