import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`p-4 bg-white shadow-md rounded-xl border hover:shadow-lg hover:-translate-y-1 transition duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
