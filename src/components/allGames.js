import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function AllGames() {

    const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [games, setGames] = useState(null);
  // console.log(games.games);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/game/allGames/17/null"); // Replace '/api/data' with the actual API endpoint on your Node.js server
      //   console.log(response);
      setGames(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return;
    <p>Loading</p>;
  }



  const handleClick = (game) =>{

    console.log("clicked")
    // console.log(game);
    navigate('/product',{ state: { game } })
  }

  return (
    <>
      <div class="container ">
        {console.log(games.games)}
        <div class="columns is-multiline">
          {games.games.map((game) => {
            // here i want to get game_image of the game object and store it in result
            // after this want to append result with a string

            let result = "http://localhost:8000/" + game.game_image;
            // console.log(result);

            let desc = game.game_description;
            if(game.game_description.length > 30 )
            {
                 desc=game.game_description.substring(0,100) + "...";
                // game.game_description=game.game_description.substring(0,100);
            }

            return <div  class="column is-one-quarter">
              <code>
                <div key={game.category_id} class="card" >
                  <header class="card-header">
                    <p class="card-header-title">{game.game_name}</p>
                  </header>

                  <div class="card-image">
                    <figure class="image is-4by3">
                      <img src={result}
                        alt="Placeholder image"
                      />
                    </figure>
                  </div>

                  <div class="card-content">
                    <div class="content">{desc}</div>
                  </div>
                  <div class="buttons is-flex is-justify-content-space-around">
                  <button class="button is-info is-small " onClick={()=> handleClick(game)}>Details</button>
                  <button class="button is-link is-small "  >Add To Cart</button>
                  </div>
                  
                </div>
              </code>
            </div>;
          })}
        </div>
      </div>
    </>
  );
}

export default AllGames;
