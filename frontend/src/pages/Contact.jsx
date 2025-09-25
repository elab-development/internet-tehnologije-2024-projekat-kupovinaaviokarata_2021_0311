import React, { useState } from "react";

const Contact = () => {
  const [ime, setIme] = useState("");
  const [email, setEmail] = useState("");
  const [tema, setTema] = useState("");
  const [poruka, setPoruka] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setSuccessMsg("Hvala! Vaša poruka je uspešno poslata. Kontaktiraćemo Vas u najkraćem roku.");

    setIme("");
    setEmail("");
    setTema("");
    setPoruka("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Kontakt</h1>

      <p className="text-gray-600 mb-6">
        Dobrodošli na stranicu za kontakt podrške.  
        Ako imate pitanja u vezi sa rezervacijama, povratnim kartama ili problemima u aplikaciji –
        pošaljite nam poruku i naš tim podrške će vas kontaktirati u najkraćem mogućem roku.  
        Radno vreme korisničke podrške je radnim danima od 9 do 17h.
      </p>

      {successMsg && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-700">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full border p-2 rounded"
          placeholder="Ime i prezime"
          value={ime}
          onChange={(e) => setIme(e.target.value)}
          required
        />

        <input
          type="email"
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          className="w-full border p-2 rounded"
          placeholder="Tema poruke (Rezervacija, Povratna karta, Tehnička pomoć...)"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          required
        />

        <textarea
          className="w-full border p-2 rounded min-h-[140px]"
          placeholder="Detaljno opišite problem ili pitanje..."
          value={poruka}
          onChange={(e) => setPoruka(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Pošalji poruku
        </button>
      </form>


      <div className="mt-6 text-sm text-gray-600">
        <p>
          📧 Kontakt email: <span className="font-medium">support@aviokarte.app</span>
        </p>
        <p>
          🕘 Radno vreme podrške: <span className="font-medium">09–17h (radnim danima)</span>
        </p>
      </div>
    </div>
  );
};

export default Contact;
