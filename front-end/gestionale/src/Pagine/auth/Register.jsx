import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../js/axios";
import { Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", cognome: "", email: "", password: "" });
  const [errore, setErrore] = useState("");
  const [loading, setLoading] = useState(false);
  const [successo, setSuccesso] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrore("");
    setSuccesso("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);
      setSuccesso("Registrazione completata! Ora puoi accedere.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error(error.response?.data || error);
      setErrore("Errore durante la registrazione");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-zinc-900 text-center">Registrazione</h1>

        <p className="mt-2 text-center text-zinc-500">Crea il tuo account aziendale</p>

        {errore && <div className="mt-6 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">{errore}</div>}

        {successo && <div className="mt-6 rounded-xl bg-green-100 px-4 py-3 text-sm text-green-700">{successo}</div>}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Nome"
            required
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="text"
            name="cognome"
            value={form.cognome}
            onChange={handleChange}
            placeholder="Cognome"
            required
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 py-3 font-bold text-white transition hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Registrazione..." : "Registrati"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600">
          Hai già un account?{" "}
          <Link to="/login" className="font-semibold text-emerald-600 hover:underline">
            Accedi
          </Link>
        </p>
      </div>
    </main>
  );
}
export default Register;
