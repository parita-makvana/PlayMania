import "./App.css";
import CategoryForm from "./components/categoryForm";
import GameForm from "./components/gameForm";
import Header from "./components/header";
import RegistrationForm from "./components/registrationForm";

function App() {
  return (
    <div className="App">
      <Header />
      {/* <RegistrationForm /> */}
      {/* <CategoryForm /> */}
      <GameForm />
    </div>
  );
}

export default App;
