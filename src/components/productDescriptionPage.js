import React from "react";
import { useLocation } from 'react-router-dom';


function ProductDescriptionPage() {

    const location = useLocation();
    // console.log(location.state);


    if(!location.state)
    {
        return (<p>Game not found</p>)
    }

   
        const game = location.state.game;
        console.log(game.game_name);

        let result = "http://localhost:8000/" + game.game_image;


    
    // const game = location.state?.game;
    // console.log(game);

  return (
    <div class="container ">

      <div class="columns">
        <div class="column is-two-fifths">
            
            <div class="box">
            <figure className="image">
                  <img src={result} alt="Product" />
            </figure>
            </div>
            
        </div>

        <div class="column">
        <h1 className="title">{game.game_name}</h1>
                
               
                <p className="price">Price{' $' + game.price}</p>
                <p className="game_size">Size {' ' + game.game_size}</p>
                <p className="game_type">Game-Type {' ' + game.game_type}</p>
                 
                
                <h3><b>Description :</b></h3>
                <p className="description">
                  {game.game_description}
                </p>

                <button className="button is-primary">Add to Cart</button>
            
        </div>
      </div>
      
    </div>
  );
}

export default ProductDescriptionPage;
