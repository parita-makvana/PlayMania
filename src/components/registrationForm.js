import React, { useState } from "react";
import "./CSS/styles.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function RegistrationForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState("");

  const [value, setValue] = React.useState("buyer");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  let handleSubmit = async (e) => {
    // console.log("clicked");

    const data = {
      username: username,
      role: value,
      dob: startDate,
      email: email,
      password: password,
    };
    // console.log(data);
    // console.log(JSON.stringify(data));
    e.preventDefault();
    try {
      let res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      let resJson = await res.json();
      console.log(res);
      console.log(resJson);

      if (res.status === 200) {
        setUsername("");
        setEmail("");
        setPassword("");
        setStartDate("");
        setValue("buyer");

        console.log("User created successfully");
      } else {
        console.log("Some error occured");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="form">
      <div className="form-body">
        <div className="username">
          <label className="form__label">Username </label>
          <input
            className="form__input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>

        <div className="email">
          <label className="form__label">Email </label>
          <input
            type="email"
            className="form__input"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="role">
          <label className="form__label">Role</label>

          <select value={value} onChange={handleChange}>
            <option value="buyer">Buyer</option>

            <option value="seller">Seller</option>
          </select>

          {/* <input  type="email" id="role" className="form__input" placeholder="Role"/> */}
        </div>

        <div className="date">
          <label className="form__label">Date of Birth</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            required
          />
        </div>

        <div className="password">
          <label className="form__label">Password </label>
          <input
            className="form__input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
      </div>
      <div class="footer">
        <button type="button" class="btn" onClick={handleSubmit}>
          Register
        </button>
      </div>
    </div>
  );
}
export default RegistrationForm;
