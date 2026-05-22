import { Routes, Route } from "react-router-dom";
import Home from "./Pagine/Home";
import Login from "./Pagine/auth/Login";
import Register from "./Pagine/auth/Register";
import Dashboard from "./Pagine/DashBoard";
import Navbar from "./Components/Navbar";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrazione" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
