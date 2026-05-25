import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../js/axios";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errore, setErrore] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrore("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);

      localStorage.setItem("token", response.data.accessToken);

      navigate("/dashboard");
    } catch (error) {
      console.error(error.response?.data || error);
      setErrore("Email o password non corretti");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-zinc-900 text-center">Accedi</h1>

        <p className="mt-2 text-center text-zinc-500">Entra nel tuo gestionale aziendale</p>

        {errore && <div className="mt-6 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">{errore}</div>}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700">Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Inserisci la tua email"
              required
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700">Password</label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Inserisci la password"
              required
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 py-3 font-bold text-white transition hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Accesso in corso..." : "Accedi"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600">
          Non hai un account?{" "}
          <Link to="/registrazione" className="font-semibold text-emerald-600 hover:underline">
            Registrati
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
