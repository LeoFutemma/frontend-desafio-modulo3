import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/dindin-logo.png";
import "./styles.css";

const LogoHeader = () => {
  return (
    <div className="logo__container">
      <NavLink to="/" style={{ display:"flex", alignItems: "center", textDecoration: "none" }}>
        <div>
          <img className="logo" src={Logo} alt="Logo" />
        </div>
        <div className="logo__name">Dindin</div>
      </NavLink>
    </div>
  );
};

export default LogoHeader;
