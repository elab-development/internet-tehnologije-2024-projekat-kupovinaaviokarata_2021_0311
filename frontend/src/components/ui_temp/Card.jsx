import React from "react";

const Card = ({ children }) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-xl border">
      {children}
    </div>
  );
};

export default Card;
