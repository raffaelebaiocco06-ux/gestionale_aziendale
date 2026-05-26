import { Routes, Route } from "react-router-dom";
import Home from "./Pagine/Home";
import Login from "./Pagine/auth/Login";
import Register from "./Pagine/auth/Register";
import Dashboard from "./Pagine/DashBoard";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Mezzi from "./Pagine/Mezzi";
import Protetti from "./Pagine/Protetti";
import Scadenze from "./Pagine/Scadenze";
import Movimenti from "./Pagine/Movimenti";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrazione" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <Protetti>
              <Dashboard />
            </Protetti>
          }
        />

        <Route
          path="/mezzi"
          element={
            <Protetti>
              <Mezzi />
            </Protetti>
          }
        />

        <Route
          path="/scadenze"
          element={
            <Protetti>
              <Scadenze />
            </Protetti>
          }
        />

        <Route
          path="/movimenti"
          element={
            <Protetti>
              <Movimenti />
            </Protetti>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
