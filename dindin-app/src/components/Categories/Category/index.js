import React, { useState } from "react";
import "./styles.css";
import Add from "../../../assets/add-black.png";
import Remove from "../../../assets/close-white.png";

export const Category = ({ name }) => {
  const [selectedTag, setSelectedTag] = useState(false);

  return (
    <div onClick={() => setSelectedTag(!selectedTag)}>
      <div className={selectedTag ? "category--active" : "category--disable"}>
        <span>{name}</span>
        <img src={selectedTag ? Remove : Add} alt={name} />
      </div>
    </div>
  );
};
