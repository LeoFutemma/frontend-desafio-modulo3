import "../../Modal/styles.css";
import React, { useState, useEffect } from "react";
import Close from "../../../assets/close.png";
import { Api } from "../../../services/api";
import { getLocalStorage } from "../../../utils/storage";
import InputMask from "react-input-mask";

const AddRegister = ({ onClose = () => {}, id = "modal" }) => {
  const [advise, setAdvise] = useState({ message: "", show: false });
  const [styleDeposit, setStyleDeposit] = useState("disabled");
  const [styleWithdrawal, setStyleWithdrawal] = useState("button__withdrawal");
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("saida");
  const [select, setSelect] = useState("");
  const token = getLocalStorage("token");

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

  const handleAddTransaction = async (event) => {
    event.preventDefault();

    try {
      const response = await Api.post(
        "/transacao",
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
    } catch (error) {
      setAdvise({
        message: error.response.data.mensagem,
        show: true,
      });
      setTimeout(() => setAdvise({ message: "", show: false }), 5000);
      return;
    }
  };

  useEffect(() => {
    handleLoadCategories();
  }, []);

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
          <h2 className="modal__title">Adicionar Registro</h2>
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
        <form className="modal__form" onSubmit={handleAddTransaction}>
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
              <option defaultValue=""></option>
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
            <label
              className="label__select"
              id="description"
              type="text"
              name="descricao"
            >
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

export default AddRegister;
