export default function AppHeader({ isAuthenticated, onLogout }) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-black text-xl font-black text-white">
            F
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight">
              Fastor
            </h1>
            <p className="text-xs text-gray-500">
              Discover your next favourite place
            </p>
          </div>
        </div>

        {isAuthenticated && (
          <button
            onClick={onLogout}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold transition hover:bg-red-600 cursor-pointer"
          >
            Log out
          </button>
        )}
      </div>
    </header>
  );
}