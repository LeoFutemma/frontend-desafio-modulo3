import React, { useState } from "react";
import "./styles.css";
import Edit from "../../assets/edit-pencil.png";
import Delete from "../../assets/trash-delete.png";
import Popup from "../Popup";
import EditRegister from "../Modal/EditRegister";
import { format } from "date-fns";
import { setLocalStorage } from "../../utils/storage";

export const Transaction = ({
  id,
  date,
  dayWeek,
  description,
  category,
  price,
  type,
  transactions,
  setTransactions,
  onClose = () => {},
}) => {
  const [openPopup, setOpenPopup] = useState(false);
  const [editRegister, setEditRegister] = useState(false);
  const newDate = format(new Date(date), "dd/MM/yy").toString();

  return (
    <div className="transaction">
      <div>
        <div className="date">{newDate}</div>
      </div>
      <div className="week">{dayWeek}</div>
      <div className="content">{description}</div>
      <div className="category">{category}</div>
      <div
        className={
          type === "entrada"
            ? "transaction__line--positive price"
            : "transaction__line--negative price"
        }
      >
        R$ {String((price / 1000).toFixed(2)).replace(".", ",")}
      </div>
      <div className="transaction__actions">
        <img
          className="transaction__edit"
          src={Edit}
          alt="Editar"
          onClick={() => {
            setEditRegister(true);
            setLocalStorage("transactionId", id);
          }}
        />
        <img
          className="transaction__delete"
          src={Delete}
          alt="Excluir"
          onClick={() => setOpenPopup(true)}
        />
      </div>
      {openPopup ? (
        <Popup
          id={id}
          transactions={transactions}
          setTransactions={setTransactions}
          onClose={() => setOpenPopup(false)}
        />
      ) : null}

      {editRegister ? (
        <EditRegister onClose={() => setEditRegister(false)} />
      ) : null}
    </div>
  );
};
