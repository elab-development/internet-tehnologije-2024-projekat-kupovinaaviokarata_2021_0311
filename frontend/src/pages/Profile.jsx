import React, { useContext, useEffect, useState } from "react";
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
        .get("/api/rezervacije", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setReservations(res.data); 
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user, token]);

  if (!user) return <p>Morate biti prijavljeni da vidite profil.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <Breadcrumbs paths={[{ name: "Početna", href: "/" }, { name: "Profil" }]} />
      <h2 className="text-2xl font-bold mb-4">Profil korisnika</h2>
      <p className="mb-4">Ime: {user.name}</p>
      <p className="mb-4">Email: {user.email}</p>

      <h3 className="text-xl font-semibold mb-2">Moje rezervacije</h3>
      {loading ? (
        <p>Učitavanje...</p>
      ) : reservations.length === 0 ? (
        <p>Nemate nijednu rezervaciju.</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((rez) => (
            <li key={rez.id}>
              <FlightCard flight={rez.flight} />
              <p>Sedište: {rez.seat}</p>
              <p>Broj karata: {rez.broj_karata}</p>
              {}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;
