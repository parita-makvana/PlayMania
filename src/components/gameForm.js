import React, { useState, useEffect } from "react";
import "./CSS/styles.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function GameForm() {
  const [price, setPrice] = useState("");
  const [game_name, setGame_Name] = useState("");
  const [game_description, setGame_Description] = useState("");

  const [game_size, setGame_Size] = useState("");

  const [game_datatype, setGame_DataType] = useState("");




  const [game_type, setGame_Type] = useState("");

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [cat_id, setCat_Id] = useState();

  const [image, setImage] = useState({ preview: '', data: '' })



  const url = "http://localhost:8000/api/all_categories";



  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(url); // Replace '/api/data' with the appropriate endpoint of your Node.js backend
      const jsonData = await response.json();
      setCategories(jsonData.categories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };






  let handleSubmit = async (e) => {
    // console.log("clicked");

    // const data = {
    //   username: username,
    //   role: value,
    //   dob: startDate,
    //   email: email,
    //   password: password,
    // };
    // console.log(data);
    // console.log(JSON.stringify(data));
    e.preventDefault();

    // console.log(cat_id);

    const game_Size = game_size + " " + game_datatype;

   
    // let formData = new FormData();
   
    
    // formData.append('game_name', game_name)
    // formData.append('game_description', game_description)
    // formData.append('game_size', game_Size)
    // formData.append('price', price)
    // formData.append('game_type', game_type)
    // formData.append('category_id', cat_id)
    // formData.append('image', image.data);

    // console.log(formData);
   

    // console.log(game_name);

    // console.log(game_description);

    // console.log(game_Size);

    // console.log(price);

    // console.log(game_type);

    // console.log(cat_id);
    
    // console.log(image.data);



     const data = {

      game_name:game_name , 
      game_description:game_description, 
      game_size:game_Size,
       price: price, 
       game_type:game_type, 
       category_id: cat_id,
      //  game_image:formData
  }

     
  // console.log(formData.keys);


    
    try {
      // for (const [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }
      let res = await fetch("http://localhost:8000/game/683cab79-3fbb-4993-b107-56f3f8e4d879", {
        method: "POST",

        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      let resJson = await res.json();
      // console.log(res);
      // console.log(resJson);

      if (res.status === 200) {
        // setUsername("");
        // setEmail("");
        // setPassword("");
        // setStartDate("");
        // setValue("buyer");

        console.log("Game created successfully");
      } else {
        console.log("Some error occured");
      }


    } catch (err) {
      console.log(err);
    }


  



  };

  const handleFileChange = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    }
    setImage(img)
  }



  if (loading) {
    return <p>Loading...</p>;
  }




  return (
    <div className="form">
      <div className="form-body">
        


      <h1>Upload to server</h1>
      {image.preview && <img src={image.preview} width='100' height='100' />}
      <hr></hr>

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


        <div className="Game Size">
          <label className="form__label">Game Size</label>

          <input
            className="form__input"
            type="number"
            placeholder="Game Size"
            required
            value={game_size}
            onChange={(event) => setGame_Size(event.target.value)}
          />



          <select
            className="form__input"
            value={game_datatype}
            onChange={(event) => setGame_DataType(event.target.value)}
          >
            <option value="GB">GB</option>

            <option value="MB">MB</option>

            <option value="KB">KB</option>
          </select>
        </div>


        <div className="price">
          <label className="form__label">Price</label>

          <input
            className="form__input"
            type="number"
            placeholder="Price"
            required
            value={price}
            onChange={(event) => setPrice(event.target.value)}
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

          <select className="form__input" onChange={(event) => setCat_Id(event.target.value)}>
            {categories.map(item => (
              <option key={item.category_id} value={item.category_id}>
                {item.category_name}
              </option>
            ))}
          </select>



        </div>



        <div className="game_image">
          <label className="form__label">Game Image</label>
         

          <input type='file' name='file' onChange={handleFileChange}></input>
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
export default GameForm;
