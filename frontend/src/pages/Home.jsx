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


   <section id="search" className="bg-gray-50 py-20">
  <div className="max-w-2xl mx-auto">
    <h1 className="text-3xl font-bold mb-6 text-center">Kupovina avio karata</h1>

    <Card className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <Input
        label="Polazna destinacija"
        placeholder="Unesite polaznu destinaciju"
        value={polazna}
        onChange={(e) => setPolazna(e.target.value)}
        className="mb-4 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
      />
      <Input
        label="Odredište"
        placeholder="Unesite odredište"
        value={odrediste}
        onChange={(e) => setOdrediste(e.target.value)}
        className="mb-4 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
      />
      <Input
        label="Datum polaska (opciono)"
        type="date"
        value={datum}
        onChange={(e) => setDatum(e.target.value)}
        className="mb-4 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
      />
      <Button
        onClick={handleSearch}
        className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
      >
        Pretraži
      </Button>
    </Card>
  </div>
</section>
    </>
  );
};

export default Home;