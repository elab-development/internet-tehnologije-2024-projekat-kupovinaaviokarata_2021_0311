import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import flightService from "../api/flightService";
import Button from "../components/ui/Button"; 
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import Hero from "../components/ui/Hero";

const Home = () => {
  const [polazna, setPolazna] = useState("");
  const [odrediste, setOdrediste] = useState("");
  const [datum, setDatum] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await flightService.getAllFlights();
      const flightsArray = response.data.data;

      const filteredFlights = flightsArray.filter((letObj) => {
        const letDatum = letObj.vreme_poletanja.split(" ")[0];
        return (
          letObj.polaziste.toLowerCase().includes(polazna.toLowerCase()) &&
          letObj.odrediste.toLowerCase().includes(odrediste.toLowerCase()) &&
          (datum === "" || letDatum === datum)
        );
      });

      navigate("/rezultati", { state: { flights: filteredFlights } });
    } catch (error) {
      console.error("Greška prilikom pretrage:", error);
    }
  };

  return (
    <>
  <Hero />

    <div id="search" className="max-w-2xl mx-auto mt-10">
  <h1 className="text-3xl font-bold mb-6 text-center">Kupovina avio karata</h1>
  <Card>
    <Input
      label="Polazna destinacija"
      placeholder="Unesite polaznu destinaciju"
      value={polazna}
      onChange={(e) => setPolazna(e.target.value)}
    />
    <Input
      label="Odredište"
      placeholder="Unesite odredište"
      value={odrediste}
      onChange={(e) => setOdrediste(e.target.value)}
    />
    <Input
      label="Datum polaska (opciono)"
      type="date"
      value={datum}
      onChange={(e) => setDatum(e.target.value)}
    />
    <Button onClick={handleSearch} className="mt-4 w-full">
      Pretraži
    </Button>
  </Card>
</div>
    </>
  );
};

export default Home;