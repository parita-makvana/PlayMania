import { Outlet, Link } from "react-router-dom";


function Navbar(){
    return (

    <>

    <nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="https://bulma.io">
      {/* <img src="https://media-cdn.tripadvisor.com/media/photo-s/22/e3/9e/1a/nando-s-logo.jpg" width="112" height="28"/> */}
      <h2><b>Playmania</b></h2>
    </a>

    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbarBasicExample" class="navbar-menu">
    <div class="navbar-start">
     
      <Link class="navbar-item" to="/addGame">Add Game</Link>
     
      <Link class="navbar-item" to="/addCategory">Add Category</Link>

      <Link class="navbar-item" to="/allGames">All Games</Link>
     
       


        
      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link">
          More
        </a>

        <div class="navbar-dropdown">
          <a class="navbar-item">
            About
          </a>
          <a class="navbar-item">
            Jobs
          </a>
          <a class="navbar-item">
            Contact
          </a>
          <hr class="navbar-divider"/>
          <a class="navbar-item">
            Report an issue
          </a>
        </div>
      </div>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <a class="button is-primary">
            <strong>Sign up</strong>
          </a>
          <a class="button is-light">
            Log in
          </a>
        </div>
      </div>
    </div>
  </div>
</nav>

</>

    )
}

export default Navbar;