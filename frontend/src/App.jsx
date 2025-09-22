import React from "react";
import Reservation from "./pages/Reservation"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Success from "./pages/Success";

import Header from "./components/Layout/Header";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import FlightDetails from "./pages/FlightDetails";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rezultati" element={<SearchResults />} />
          <Route path="/letovi/:id" element={<FlightDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rezervacija/:id" element={<Reservation />} />
          <Route path="/" element={<Reservation />} />
         <Route path="/success" element={<Success />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
