import React, { useEffect, useState } from "react";
import "./styles.css";
import { Category } from "./Category";
import { getLocalStorage } from "../../utils/storage";
import { Api } from "../../services/api";

const Categories = () => {
  const [listCategories, setListCategories] = useState([]);

  async function loadCategorias() {
    const token = getLocalStorage("token");

    try {
      const { data } = await Api.get('/categoria', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setListCategories(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadCategorias();
  }, []);

  return (
    <div className="categories__component">
      <div className="categories__title">Categoria</div>
      <div className="categories__tags">
        {listCategories.map((category) =>
          <Category
            key={category.id}
            name={category.descricao}
          />
        )}
      </div>
      <div className="buttons">
        <button className="clean__filter">Limpar Filtros</button>
        <button className="apply__filter">Aplicar Filtros</button>
      </div>
    </div>
  );
};

export default Categories;
