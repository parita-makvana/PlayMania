import React, { useState } from 'react';
import "./CSS/styles.css"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";





function RegistrationForm() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [email, setEmail] = useState('')
    const [startDate, setStartDate] = useState('');


    const [value, setValue] = React.useState('buyer');

    const handleChange = (event) => {

        setValue(event.target.value);

    };


    


   
       

       


    let handleSubmit = async (e) => {
        e.preventDefault();
        try {
          let res = await fetch("https://httpbin.org/post", {
            method: "POST",
            body: JSON.stringify({
              name: username,
              password:password,
              role:role,
              email: email,
              dob:startDate
            }),
          });
          let resJson = await res.json();
          if (res.status === 200) {
            setName("");
            setEmail("");
            setMessage("User created successfully");
          } else {
            setMessage("Some error occured");
          }
        } catch (err) {
          console.log(err);
        }
      };

    return (
        <div className="form"   >
            <div className="form-body">
                
                <div className="username">
                    <label className="form__label" >Username </label>
                    <input className="form__input" type="text" placeholder="Username" value={username}
                        onChange={event => setUsername(event.target.value)} required />
                </div>


                <div className="email">
                    <label className="form__label" >Email </label>
                    <input type="email" className="form__input" placeholder="Email" value={email}
                        onChange={event => setEmail(event.target.value)} required/>
                </div>

                <div className="role">
                    <label className="form__label" >Role</label>

                    <select value={value} onChange={handleChange}  >

                        <option value="buyer">Buyer</option>

                        <option value="seller">Seller</option>



                    </select>


                    {/* <input  type="email" id="role" className="form__input" placeholder="Role"/> */}
                </div>


                <div className="date">
                    <label className="form__label" >Date of Birth</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)} required
                    />




                </div>



                <div className="password">
                    <label className="form__label" >Password </label>
                    <input className="form__input" type="password" placeholder="Password" value={password}
                        onChange={event => setPassword(event.target.value)}  required/>
                </div>



            </div>
            <div class="footer">
                <button type="button" class="btn" onClick={handleSubmit}>Register</button>
            </div>
        </div>
    )
}
export default RegistrationForm;