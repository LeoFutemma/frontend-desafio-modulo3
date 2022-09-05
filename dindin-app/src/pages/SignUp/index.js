import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Api } from "../../services/api";
import "./styles.css";
import LogoHeader from "../../components/Logo";
import Input from "../../components/Input/index";

const SignUp = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const [advise, setAdvise] = useState({ message: "", show: false });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!name || !email || !password || !confirmation) {
        setAdvise({
          message: "Todos os campos são obrigatórios!",
          show: true,
        });
        setTimeout(() => setAdvise({ message: "", show: false }), 5000);
        return;
      }

      if (password !== confirmation) {        
        setAdvise({
          message:
            'Os campos "Senha" e "Confirmação de senha" devem ser iguais!',
          show: true,
        });
        setTimeout(() => setAdvise({ message: "", show: false }), 5000);
        return;
      }

      const response = await Api.post("/usuario", {
        nome: name,
        email: email,
        senha: password,
      });
      navigate("/sign-in");

    } catch (error) {
      setAdvise({
        message: error.response.data.mensagem,
        show: true,
      });
      setTimeout(() => setAdvise({ message: "", show: false }), 5000);
      return;
    }
  };

  return (
    <div className="container__register">
      <header>
        <LogoHeader />
      </header>
      <div className="form__box">
        <form onSubmit={handleSubmit}>
          <h2>Cadastre-se</h2>
          <div className="name">
            <Input
              label={"Nome"}
              id={"name"}
              type={"text"}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="email">
            <Input
              label={"E-mail"}
              id={"email"}
              type={"text"}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="password__register">
            <Input
              label={"Senha"}
              id={"password"}
              type={"password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="confirmation">
            <Input
              label={"Confirmação de Senha"}
              id={"confirmation"}
              type={"password"}
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
            />
          </div>
          <span className="error__register">
            {advise.show && advise.message}
          </span>
          <button className="register">Cadastrar</button>
          <NavLink
            to="/sign-in"
            style={{ marginTop: "12px", textDecoration: "none" }}
          >
            <span className="back__login">Já tem cadastro? Clique aqui!</span>
          </NavLink>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
