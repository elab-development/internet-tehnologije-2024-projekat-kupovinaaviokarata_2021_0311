import React from "react";
import { Link } from "react-router-dom";
import "./Success.css";

const Success = () => {
  return (
    <div className="success-container">
      <div className="success-content">
        <div className="success-card">
          <h1>Rezervacija uspešna 🎉</h1>
          <p>Vaša karta je uspešno rezervisana.</p>
          <p>
            Detalji o letu, izabranim sedištima, kao i{" "}
            <strong>informacije o plaćanju i instrukcije za čekiranje</strong>{" "}
            poslati su na Vaš email.
          </p>
          <p className="text-sm">
            Molimo Vas da proverite email (uključujući spam folder).
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mt-4"
          >
            Nazad na početnu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
