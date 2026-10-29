import { useState } from "react";
import AppHeader from "./components/layout/AppHeader";
import AuthPage from "./pages/AuthPage";
import RestaurantsPage from "./pages/RestaurantsPage";

export default function App() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("fastor_token") || ""
  );

  function handleLoginSuccess(jwt) {
    sessionStorage.setItem("fastor_token", jwt);
    setToken(jwt);
  }

  function handleLogout() {
    sessionStorage.removeItem("fastor_token");
    setToken("");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AppHeader
        isAuthenticated={Boolean(token)}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        {token ? (
          <RestaurantsPage token={token} />
        ) : (
          <AuthPage onLoginSuccess={handleLoginSuccess} />
        )}
      </main>
    </div>
  );
}