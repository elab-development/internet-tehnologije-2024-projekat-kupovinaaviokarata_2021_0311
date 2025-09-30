import React from "react";
import { Link } from "react-router-dom";
import "./Breadcrumbs.css";

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="breadcrumbs">
      {items.map((item, index) => (
        <span key={index}>
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span>{item.label}</span>
          )}
          {index < items.length - 1 && (
            <span className="breadcrumbs-separator">✈</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
