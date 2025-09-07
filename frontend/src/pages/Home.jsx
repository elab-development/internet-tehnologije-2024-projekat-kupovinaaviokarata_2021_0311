import React from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

const Home = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Pretraga letova</h2>

      <Card>
        <Input label="Polazna destinacija" placeholder="Beograd" />
        <Input label="Odredište" placeholder="Pariz" />
        <Input label="Datum polaska" type="date" />
        <Button onClick={() => alert("Pretraga pokrenuta!")}>Pretraži</Button>
      </Card>
    </div>
  );
};

export default Home;
