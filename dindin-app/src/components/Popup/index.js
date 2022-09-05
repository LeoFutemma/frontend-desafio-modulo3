import React from 'react';
import "./styles.css";
import ArrowBallon from "../../assets/arrow-balloon.png";
import Ballon from "../../assets/balloon.png";
import { getLocalStorage } from "../../utils/storage";
import { Api } from "../../services/api";

const Popup = ({ id, transactions, setTransactions, onClose = () => { } }) => {

  async function deleteTransaction(id) {
    const token = getLocalStorage("token");

    try {
      await Api.delete(`/transacao/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const localTransactions = [...transactions];
      const indexTransaction = localTransactions.findIndex((transaction) =>
        transaction.id === id);

      localTransactions.splice(1, indexTransaction);
      setTransactions(localTransactions);
      onClose();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="popup">
      <img src={ArrowBallon} className="popup__arrow-ballon" alt="pop-up" />
      <img className="popup__content" src={Ballon} alt="pop-up" />
      <span className="question">Apagar item?</span>
      <div className="options">
        <button className="options__yes" onClick={() => deleteTransaction(id)}>Sim</button>
        <button className="options__no" onClick={onClose}>Não</button>
      </div>
    </div>
  )
}

export default Popup;