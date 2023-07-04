import React, { useState } from "react";
import "./CSS/styles.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CategoryForm() {
  const [age, setAge] = useState("");
  const [category_name, setCategory_Name] = useState("");
  const [category_description, setCategory_Description] = useState("");

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  let handleSubmit = async (e) => {
    const data = {
      user_age_limit: age,
      category_name: category_name,
      category_description: category_description,
    };

    e.preventDefault();
    try {
      let res = await fetch("http://localhost:8000/game/game_category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      let resJson = await res.json();
      console.log(res);
      //   console.log(resJson);

      if (res.status === 200) {
        setAge("");
        setCategory_Name("");
        setCategory_Description("");
        handleShowModal();


        console.log("Category Added successfully");
      } else {
        console.log("Some error occured");
      }
    } catch (err) {
      console.log(err);
    }
  };



  if (showModal ) 
    {
      return   (
        <div className="modal is-active">
          <div className="modal-background"></div>
          <div className="modal-content">
            <div className="box">
              <p>Game Created Successfully.</p>
            </div>
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={handleCloseModal}
          ></button>
        </div>
      );
    }

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
          <label className="form__label">Category Name</label>
          <input
            className="form__input"
            type="text"
            placeholder="Category Name"
            value={category_name}
            required
            onChange={(event) => setCategory_Name(event.target.value)}
          />
        </div>

        <div className="category_description">
          <label className="form__label">Category Description</label>
          <textarea
            rows="5"
            cols="50"
            className="form__input"
            type="text"
            placeholder="Category Description"
            value={category_description}
            required
            onChange={(event) => setCategory_Description(event.target.value)}
          />
        </div>
      </div>
      <div class="footer">
        <button type="button" class="btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
export default CategoryForm;
