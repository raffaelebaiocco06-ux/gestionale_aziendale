import { Routes, Route } from "react-router-dom";
import Home from "./Pagine/Home";
import Login from "./Pagine/auth/Login";
import Register from "./Pagine/auth/Register";
import Dashboard from "./Pagine/DashBoard";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Mezzi from "./Pagine/Mezzi";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrazione" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mezzi" element={<Mezzi />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
