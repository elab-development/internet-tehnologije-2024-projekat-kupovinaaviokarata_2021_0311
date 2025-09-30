import React, { useState } from "react";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import "./Contact.css";


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
  <div className="contact-container">
    <div className="contact-card">
      <Breadcrumbs
        items={[
          { label: "Početna", to: "/" },
          { label: "Kontakt" }
        ]}
      />

      <h1 className="contact-title">Kontakt</h1>
      <p className="contact-desc">
        Dobrodošli na stranicu za kontakt podrške. Ako imate pitanja u vezi sa rezervacijama, povratnim kartama ili problemima u aplikaciji – pošaljite nam poruku i naš tim podrške će vas kontaktirati u najkraćem mogućem roku.  
        Radno vreme korisničke podrške je radnim danima od 9 do 17h.
      </p>

      {successMsg && <div className="contact-success">{successMsg}</div>}

      <form onSubmit={handleSubmit} className="contact-form">
        <input type="text" placeholder="Ime i prezime" className="contact-input" value={ime} onChange={(e) => setIme(e.target.value)} required />
        <input type="email" placeholder="Email" className="contact-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Tema poruke (Rezervacija, Povratna karta, Tehnička pomoć...)" className="contact-input" value={tema} onChange={(e) => setTema(e.target.value)} required />
        <textarea placeholder="Detaljno opišite problem ili pitanje..." className="contact-textarea" value={poruka} onChange={(e) => setPoruka(e.target.value)} required />

        <button type="submit" className="contact-btn">Pošalji poruku</button>
      </form>

      <div className="contact-info">
        <p>📧 Kontakt email: <span>support@aviokarte.app</span></p>
        <p>🕘 Radno vreme podrške: <span>09–17h (radnim danima)</span></p>
      </div>
    </div>
  </div>
);

};

export default Contact;
