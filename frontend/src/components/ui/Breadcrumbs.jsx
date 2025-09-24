import React from "react";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ items = [] }) => {
 
  return (
    <nav className="text-sm mb-4">
      <ol className="flex text-gray-600 space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.to ? (
              <Link to={item.to} className="text-blue-600 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
            {index < items.length - 1 && <span className="mx-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
