import React, { useState, useEffect } from "react";
import "./CSS/styles.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function GameForm() {
  const [age, setAge] = useState("");
  const [game_name, setGame_Name] = useState("");
  const [game_description, setGame_Description] = useState("");

  const [game_type, setGame_Type] = useState("");

  const [categories, setCategories] = useState([]);

  const url = "http://localhost:8000/api/all_categories";

  const fetchTodos = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      //   console.log(data);
      setCategories(data);
      //   console.log(categories);

      setTimeout(() => {
        console.log(categories);
      }, 500);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="form">
      <div className="form-body">
        <div className="user_age_limit">
          <label className="form__label">User Age</label>

          <input
            className="form__input"
            type="number"
            placeholder="Age"
            required
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />
        </div>

        <div className="category_name">
          <label className="form__label">Game Name</label>
          <input
            className="form__input"
            type="text"
            placeholder="Game Name"
            value={game_name}
            required
            onChange={(event) => setGame_Name(event.target.value)}
          />
        </div>

        <div className="game_description">
          <label className="form__label">Game Description</label>
          <textarea
            rows="5"
            cols="50"
            className="form__input"
            type="text"
            placeholder="Game Description"
            value={game_description}
            required
            onChange={(event) => setGame_Description(event.target.value)}
          />
        </div>

        <div className="game_type">
          <label className="form__label">Game Type</label>
          <select
            className="form__input"
            value={game_type}
            onChange={(event) => setGame_Type(event.target.value)}
          >
            <option value="paid">Paid</option>

            <option value="free">Free</option>
          </select>
        </div>

        <div className="category">
          <label className="form__label">Category Name</label>

          <select name="category">
            {categories.map((category) => {
              return <option value={category}>{category.category_id}</option>;
            })}
          </select>

          {/* <select
            className="form__input"
            value={game_type}
            onChange={(event) => setGame_Type(event.target.value)}
          >
            <option value="paid">Paid</option>

            <option value="free">Free</option>
          </select> */}
        </div>
      </div>

      <div class="footer">
        <button type="button" class="btn">
          Submit
        </button>
      </div>
    </div>
  );
}
export default GameForm;
