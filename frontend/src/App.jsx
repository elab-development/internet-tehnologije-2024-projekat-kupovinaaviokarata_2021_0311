import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Layout/Header";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import FlightDetails from "./pages/FlightDetails";

function App() {
  return (
    <Router>
      <Header /> {/* Header će biti vidljiv na svim stranicama */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rezultati" element={<SearchResults />} />
        <Route path="/letovi/:id" element={<FlightDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
