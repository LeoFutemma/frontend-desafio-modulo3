import "../../Modal/styles.css";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Close from "../../../assets/close.png";
import { getLocalStorage, removeLocalStorage } from "../../../utils/storage";
import { Api } from "../../../services/api";
import InputMask from "react-input-mask";

const EditRegister = ({ onClose = () => {}, id = "modal" }) => {
  const [styleDeposit, setStyleDeposit] = useState("");
  const [styleWithdrawal, setStyleWithdrawal] = useState("");
  const idTransaction = getLocalStorage("transactionId");
  const token = getLocalStorage("token");
  const [advise, setAdvise] = useState({ message: "", show: false });
  const [select, setSelect] = useState("");
  const [categories, setCategories] = useState([]);
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");

  const handleLoadCategories = async () => {
    try {
      const response = await Api.get("/categoria", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoadTransaction = async () => {
    try {
      const response = await Api.get(`/transacao/${idTransaction}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelect(response.data[0].categoria_id);
      setDate(format(new Date(response.data[0].data), "dd/MM/yyyy"));
      setDescription(response.data[0].descricao);
      setType(response.data[0].tipo);
      setValue(response.data[0].valor);

      if (response.data[0].tipo === "entrada") {
        handleDepositChoice();
      } else {
        handleWithdrawalChoice();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleLoadTransaction();
    handleLoadCategories();
  }, []);

  const handleEditTransaction = async (event) => {
    event.preventDefault();

    try {
      const response = await Api.put(
        `/transacao/${idTransaction}`,
        {
          descricao: description,
          valor: value,
          data: date,
          categoria_id: select,
          tipo: type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onClose();
      removeLocalStorage("transactionId");
    } catch (error) {
      setAdvise({
        message: error.response.data.mensagem,
        show: true,
      });
      setTimeout(() => setAdvise({ message: "", show: false }), 5000);
      return;
    }
  };

  const handleWithdrawalChoice = () => {
    setStyleWithdrawal("button__withdrawal");
    setStyleDeposit("disabled");
    setType("saida");
  };

  const handleDepositChoice = () => {
    setStyleDeposit("button__deposit");
    setStyleWithdrawal("disabled");
    setType("entrada");
  };

  return (
    <div id={id} className="modal__container">
      <div className="modal__addRegister">
        <div className="modal__header">
          <h2 className="modal__title">Editar Registro</h2>
          <img
            className="modal__close"
            src={Close}
            alt="Fechar"
            onClick={onClose}
          />
        </div>
        <div className="modal__button">
          <button className={styleDeposit} onClick={handleDepositChoice}>
            Entrada
          </button>
          <button className={styleWithdrawal} onClick={handleWithdrawalChoice}>
            Saída
          </button>
        </div>
        <form className="modal__form" onSubmit={handleEditTransaction}>
          <div className="form__option">
            <label className="label__select" id="value" name="valor">
              Valor
            </label>
            <input
              className="input__select"
              type="number"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </div>
          <div className="form__option">
            <label
              className="label__select"
              id="categories"
              name="categoria_nome"
            >
              Categoria
            </label>
            <select
              className="input__select"
              value={select}
              onChange={(event) => setSelect(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.descricao}
                </option>
              ))}
            </select>
          </div>
          <div className="form__option">
            <label className="label__select" id="date" name="data">
              Data
            </label>
            <InputMask
              mask="99/99/9999"
              className="input__select"
              type="text"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
          <div className="form__option">
            <label className="label__select" id="description" name="descricao">
              Descrição
            </label>
            <input
              className="input__select"
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <button className="button__addRegister">Confirmar</button>
        </form>
      </div>
      <span className="error__modal--add">{advise.show && advise.message}</span>
    </div>
  );
};

export default EditRegister;
