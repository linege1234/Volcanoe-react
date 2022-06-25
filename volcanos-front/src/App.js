import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./screens/Homepage";
import Individual from "./screens/Individual";
import Join from "./screens/Join";
import Login from "./screens/Login";
import Volcanos from "./screens/Volcanos";
import NavBarElements from "./component/NavBarElements";

function App() {
  return (
    <Router>
      <NavBarElements />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Individual/" element={<Individual />} />
        <Route path="/Join" element={<Join />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Volcanos" element={<Volcanos />} />
        <Route path="/Join" element={<Join />} />
      </Routes>
    </Router>
  );
}
export default App;

//<div /> == <div> </div>
