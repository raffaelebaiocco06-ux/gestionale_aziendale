import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <header className="flex h-20 items-center justify-between border-b bg-white px-8 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Pannello amministratore</h2>
            <p className="text-sm text-zinc-500">Gestisci azienda, contabilità e attività interne</p>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="rounded-xl bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-400"
          >
            Logout
          </button>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
