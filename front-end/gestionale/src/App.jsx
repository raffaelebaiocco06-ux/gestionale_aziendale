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
import Clienti from "./Pagine/Clienti";
import Fornitori from "./Pagine/Fornitore";
import Layout from "./Components/Layout";
function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        }
      />

      <Route
        path="/login"
        element={
          <>
            <Navbar />
            <Login />
            <Footer />
          </>
        }
      />

      <Route
        path="/registrazione"
        element={
          <>
            <Navbar />
            <Register />
            <Footer />
          </>
        }
      />

      <Route
        path="/dashboard"
        element={
          <Protetti>
            <Layout>
              <Dashboard />
            </Layout>
          </Protetti>
        }
      />

      <Route
        path="/movimenti"
        element={
          <Protetti>
            <Layout>
              <Movimenti />
            </Layout>
          </Protetti>
        }
      />

      <Route
        path="/clienti"
        element={
          <Protetti>
            <Layout>
              <Clienti />
            </Layout>
          </Protetti>
        }
      />

      <Route
        path="/fornitori"
        element={
          <Protetti>
            <Layout>
              <Fornitori />
            </Layout>
          </Protetti>
        }
      />

      <Route
        path="/mezzi"
        element={
          <Protetti>
            <Layout>
              <Mezzi />
            </Layout>
          </Protetti>
        }
      />

      <Route
        path="/scadenze"
        element={
          <Protetti>
            <Layout>
              <Scadenze />
            </Layout>
          </Protetti>
        }
      />
    </Routes>
  );
}

export default App;
