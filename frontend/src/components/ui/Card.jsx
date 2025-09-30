import React from "react";

const Card = ({ children, className = "" }) => {
  return (
  <div className={`p-6 bg-white/80 backdrop-blur-md shadow-lg rounded-2xl border ${className}`}>
  {children}
</div>

  );
};

export default Card;
