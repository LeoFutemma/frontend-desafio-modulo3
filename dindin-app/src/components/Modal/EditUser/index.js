import "../../Modal/styles.css";
import React, { useState, useEffect } from "react";
import Close from "../../../assets/close.png";
import { Api } from "../../../services/api";
import { getLocalStorage, setLocalStorage } from "../../../utils/storage";

const EditUser = ({ onClose = () => { }, id = "modal" }) => {
  const token = getLocalStorage("token");
  const [advise, setAdvise] = useState({ message: "", show: false });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const loadUsers = async () => {
    try {
      const response = await Api.get("/usuario", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setName(response.data.nome);
      setEmail(response.data.email);
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdateUser = async (event) => {
    event.preventDefault();

    try {
      if (password !== confirmation) {
        setAdvise({
          message:
            'Os campos "Senha" e "Confirmação de senha" devem ser iguais!',
          show: true,
        });
        setTimeout(() => setAdvise({ message: "", show: false }), 5000);
        return;
      }

      const response = await Api.put(
        "/usuario",
        {
          nome: name,
          email: email,
          senha: password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLocalStorage("userName", name);
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
    loadUsers();
  }, []);

  return (
    <div className="modal__container">
      <div className="modal__addRegister">
        <div className="modal__header">
          <h2 className="modal__title">Editar Perfil</h2>
          <img
            className="modal__close"
            src={Close}
            alt="Fechar"
            onClick={onClose}
          />
        </div>
        <form
          className="modal__form"
          style={{ paddingTop: "0" }}
          onSubmit={handleUpdateUser}
        >
          <div className="form__option">
            <label className="label__select" id="name" name="nome">
              Nome
            </label>
            <input
              className="input__select"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="form__option">
            <label className="label__select" id="email" name="email">
              Email
            </label>
            <input
              className="input__select"
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="form__option">
            <label className="label__select" id="password" name="senha">
              Senha
            </label>
            <input
              className="input__select"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="form__option">
            <label className="label__select" id="description" name="descricao">
              Confirmação de senha
            </label>
            <input
              className="input__select"
              type="password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
            />
          </div>
          <button
            id={id}
            className="button__addRegister"
          >
            Confirmar
          </button>
        </form>
      </div>
      <div className="error__modal">{advise.show && advise.message}</div>
    </div>
  );
};

export default EditUser;
