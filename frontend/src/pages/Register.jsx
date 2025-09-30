import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Register.css";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
      setSuccess("");

    try {
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });


  setSuccess("Registracija uspešna! Sada se možete prijaviti.");
    setTimeout(() => navigate("/login"), 2000); 
  } catch (err) {
    if (err.response && err.response.status === 422) {
      const messages = Object.values(err.response.data.errors)
        .flat()
        .join(" ");
      setError(messages);
    } else {
      setError("Registracija neuspešna. Pokušajte ponovo.");
    }
    console.error("Greška pri registraciji:", err);
  }
};;

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Registracija</h2>
{error && <div className="alert alert-error">{error}</div>}
{success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ime"
            className="register-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="register-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Lozinka"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Ponovi lozinku"
            className="register-input"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />

          <button type="submit" className="register-btn">
            Registruj se
          </button>
        </form>

        <p className="register-footer">
          Već imate nalog?{" "}
          <Link to="/login">Prijavite se</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
