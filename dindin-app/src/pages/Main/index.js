import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeLocalStorage } from "../../utils/storage";
import { getLocalStorage } from "../../utils/storage";
import { format } from "date-fns";
import "./styles.css";
import LogoHeader from "../../components/Logo/index";
import Profile from "../../assets/photo-profile.png";
import Logout from "../../assets/logout.png";
import Filter from "../../assets/filter.png";
import Arrow from "../../assets/arrow.png";
import ArrowInverted from "../../assets/arrow-inverted.png";
import Categories from "../../components/Categories";
import AddRegister from "../../components/Modal/AddRegister/index";
import { Transaction } from "../../components/Transactions";
import EditUser from "../../components/Modal/EditUser";
import { Api } from "../../services/api";

const Main = () => {

  const [addRegister, setAddRegister] = useState(false);
  const [addFilter, setAddFilter] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [summaryTransactions, setSummaryTransactions] = useState({});
  const [sorted, setSorted] = useState(false);
  const userName = getLocalStorage("userName");

  const handleCloseCategories = (event) => {
    if (!event) {
      setAddFilter(true);
    } else {
      setAddFilter(false);
    }
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    removeLocalStorage("token");
    removeLocalStorage("userId");
    navigate("/sign-in");
  };

  async function loadTransactions() {
    const token = getLocalStorage("token");

    try {
      const response = await Api.get('/transacao', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setTransactions(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSummaryTransaction() {
    const token = getLocalStorage("token");

    try {
      const { data } = await Api.get('/transacao/extrato', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const deposit = String((data.entrada / 1000).toFixed(2)).replace(".", ",");
      const withdrawl = String((data.saida / 1000).toFixed(2)).replace(".", ",");
      const balance = String(((data.entrada - data.saida) / 1000).toFixed(2)).replace(".", ",");

      setSummaryTransactions({ deposit, withdrawl, balance });
    } catch (error) {
      console.log(error);
    }
  }

  function handleSortDate() {
    const localTransactions = [...transactions];

    localTransactions.forEach(transaction => {
      transaction.data = format(new Date(transaction.data), "yyyy/MM/dd");
    });

    if (!sorted) {
      localTransactions.sort((a, b) => {
        return new Date(a.data).getTime() - new Date(b.data).getTime();
      })
    } else {
      localTransactions.sort((a, b) => {
        return new Date(b.data).getTime() - new Date(a.data).getTime();
      })
    }

    setSorted(!sorted);
    setTransactions(localTransactions);
  }

  useEffect(() => {
    loadTransactions();
    handleSummaryTransaction();
  }, [transactions]);

  return (
    <div className="container__home">
      <header className="header__home">
        <LogoHeader />
        <div className="profile__home" onClick={() => setEditUser(true)}>
          <img
            src={Profile}
            alt="Perfil"
          />
          <div className="name__profile">{userName}</div>
          <img
            className="exit"
            src={Logout}
            alt="Sair"
            onClick={handleLogout}
          />
        </div>
      </header>
      <main className="main__informations">
        <button
          className="filter"
          onClick={() => handleCloseCategories(addFilter)}
        >
          <div>
            <img className="filter__img" src={Filter} alt="Filtrar" />
          </div>
          <div>Filtrar</div>
        </button>
        <div className="transactions">
          <div className="main__transaction">
            <div className="categories">
              {addFilter ? (
                <Categories onClose={() => setAddFilter(false)}
                />
              ) : null}
            </div>
            <div className="transactions__informations">
              <div className="transactions__header">
                <div className="transactions__column">
                  <div className="column__data" onClick={handleSortDate}>
                    Data
                    <img className="data__img" src={sorted ? Arrow : ArrowInverted} alt="Data" />
                  </div>
                </div>
                <div className="transactions__column">Dia da semana</div>
                <div className="transactions__column">Descrição</div>
                <div className="transactions__column">Categoria</div>
                <div className="transactions__column">Valor</div>
                <div className="transactions__actions"></div>
              </div>
              <div className="transactions__items">
                {transactions.map((transaction) =>
                  <Transaction
                    key={transaction.id}
                    id={transaction.id}
                    date={transaction.data}
                    dayWeek={transaction.dia_semana}
                    description={transaction.descricao}
                    category={transaction.categoria_nome}
                    price={transaction.valor}
                    type={transaction.tipo}
                    transactions={transactions}
                    setTransactions={setTransactions}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="summary">
            <aside className="summary__informations">
              <span className="summary__title">Resumo</span>
              <div className="deposits">
                <div className="deposits__label">Entradas</div>
                <div className="deposits__value">R$ {summaryTransactions.deposit}</div>
              </div>
              <div className="withdrawals">
                <div className="withdrawals__label">Saídas</div>
                <div className="withdrawals__value">R$ {summaryTransactions.withdrawl}</div>
              </div>
              <div className="divider" />
              <div className="balance">
                <div className="balance__label">Saldo</div>
                <div className="balance__value">R$ {summaryTransactions.balance}</div>
              </div>
            </aside>
            <div className="open__modal">
              <button
                style={{
                  width: "236px",
                  marginLeft: "40px",
                  marginTop: "16px",
                }}
                className="login"
                onClick={() => setAddRegister(true)}
              >
                Adicionar Registro
              </button>
              {addRegister ? (
                <AddRegister onClose={() => setAddRegister(false)} />
              ) : null}
              {editUser ? (
                <EditUser onClose={() => setEditUser(false)} />
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;