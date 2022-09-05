import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { getLocalStorage, setLocalStorage } from "../../utils/storage";
import "./styles.css";
import LogoHeader from "../../components/Logo/index";
import Input from "../../components/Input/index";
import { Api } from "../../services/api";

const SignIn = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [advise, setAdvise] = useState({ message: "", show: false });

  useEffect(() => {
    const token = getLocalStorage("token");

    if (token) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!email || !password) {
        setAdvise({
          message: "Preencha todos os campos!",
          show: true,
        });
        setTimeout(() => setAdvise({ message: "", show: false }), 5000);
        return;
      }

      const response = await Api.post("/login", {
        email: email,
        senha: password,
      });

      const { token, usuario } = response.data;
      setLocalStorage("token", token);
      setLocalStorage("userId", usuario.id);
      setLocalStorage("userName", usuario.nome)
      navigate("/");

    } catch (error) {
      setAdvise({
        message: error.response.data.mensagem,
        show: true,
      });
      setTimeout(() => setAdvise({ message: "", show: false }), 5000);
    }
  };

  return (
    <div className="container__login">
      <header>
        <LogoHeader />
      </header>
      <main className="main__login">
        <section>
          <h1 className="title">
            Controle suas <strong>finanças</strong>, sem planilha chata.
          </h1>
          <p className="description">
            Organizar as suas finanças nunca foi tão fácil, com o DINDIN, você
            tem tudo num único lugar e em um clique de distância.
          </p>
          <NavLink style={{ textDecoration: "none" }} to="/sign-up">
            <button className="register">Cadastre-se</button>
          </NavLink>
        </section>
        <div>
          <form className="form__login" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div className="email">
              <Input
                label={"E-mail"}
                type={"text"}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="password">
              <Input
                label={"Password"}
                type={"password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <span className="error" style={{ bottom: "30px" }}>{advise.show && advise.message}</span>
            <button className="login" type="submit">
              Entrar
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
