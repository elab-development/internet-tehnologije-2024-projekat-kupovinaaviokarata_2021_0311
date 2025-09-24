import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import FlightCard from "../components/ui/FlightCard";
import axios from "axios";
import Breadcrumbs from "../components/ui/Breadcrumbs";

const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const groupReservationsByFlight = (reservations) => {
    const grouped = {};

    reservations.forEach((rez) => {
      const flightId = rez.let.id;
      if (!grouped[flightId]) {
        grouped[flightId] = {
          flight: rez.let,
          broj_karata: rez.broj_karata,
          ukupna_cena: parseFloat(rez.ukupna_cena),
          sedista: [rez.broj_sedista],
        };
      } else {
        grouped[flightId].broj_karata += rez.broj_karata;
        grouped[flightId].ukupna_cena += parseFloat(rez.ukupna_cena);
        grouped[flightId].sedista.push(rez.broj_sedista);
      }
    });

    return Object.values(grouped);
  };

  useEffect(() => {
    if (user && token) {
      axios
        .get("http://localhost:8000/api/rezervacije", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Rezervacije sa backend-a:", res.data);
          const groupedReservations = groupReservationsByFlight(res.data.data || []);
          setReservations(groupedReservations);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user, token]);

  if (!user) return <p>Morate biti prijavljeni da vidite profil.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <Breadcrumbs items={[{ label: "Početna", to: "/" }, { label: "Profil" }]} />
      <h2 className="text-2xl font-bold mb-4">Profil korisnika</h2>
      <p className="mb-4">Ime: {user.name}</p>
      <p className="mb-4">Email: {user.email}</p>

      <h3 className="text-xl font-semibold mb-2">Moje rezervacije</h3>

      {loading ? (
        <p>Učitavanje rezervacija...</p>
      ) : reservations.length === 0 ? (
        <p>Nemate nijednu rezervaciju.</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((rez) => (
            <li key={rez.flight.id}>
              <FlightCard flight={rez.flight} />
              <div className="mt-2 ml-4">
                <p>Sedišta: {rez.sedista.join(", ")}</p>
                <p>Broj karata: {rez.broj_karata}</p>
                <p>Ukupna cena: {rez.ukupna_cena.toFixed(2)} RSD</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;


/*import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import FlightCard from "../components/ui/FlightCard";
import axios from "axios";
import Breadcrumbs from "../components/ui/Breadcrumbs";

const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

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
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user, token]);

  if (!user) return <p>Morate biti prijavljeni da vidite profil.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <Breadcrumbs items={[{ label: "Početna", to: "/" }, { label: "Profil" }]} />
      <h2 className="text-2xl font-bold mb-4">Profil korisnika</h2>
      <p className="mb-4">Ime: {user.name}</p>
      <p className="mb-4">Email: {user.email}</p>

      <h3 className="text-xl font-semibold mb-2">Moje rezervacije</h3>

      {loading ? (
        <p>Učitavanje rezervacija...</p>
      ) : reservations.length === 0 ? (
        <p>Nemate nijednu rezervaciju.</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((rez) => (
            <li key={rez.id}>
              
              <FlightCard flight={rez.let} />

              
              <div className="mt-2 ml-4">
                <p>Sedište: {rez.broj_sedista}</p>
                <p>Broj karata: {rez.broj_karata}</p>
                <p>Ukupna cena: {rez.ukupna_cena} RSD</p>
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