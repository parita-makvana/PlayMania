import "./App.css";
import CategoryForm from "./components/categoryForm";
import GameForm from "./components/gameForm";
import Header from "./components/header";
import Navbar from "./components/navbar";
import RegistrationForm from "./components/registrationForm";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AllGames from "./components/allGames";
import ProductDescriptionPage from "./components/productDescriptionPage";

function App() {
  return (


<BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/addGame" element={<GameForm/>}/>
        <Route path="/addCategory" element={<CategoryForm/>}/>
        <Route path="/allGames" element={<AllGames/>}/>
          {/* <Route index element={<Home />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} /> */}

         <Route path="/product" element={<ProductDescriptionPage/>}/>
      </Routes>
</BrowserRouter>



    // <div className="App">
    //   {/* <Header /> */}

    //   <Navbar/>
    //   {/* <RegistrationForm /> */}
    //   {/* <CategoryForm /> */}
    //   <GameForm />
    // </div>
  );
}

export default App;
