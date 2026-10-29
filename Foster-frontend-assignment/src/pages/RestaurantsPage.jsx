import { useEffect, useState } from "react";
import { fetchRestaurants } from "../features/restaurants/restaurantApi";
import RestaurantCard from "../components/restaurants/RestaurantCard";
import getErrorMessage from "../utils/getErrorMessage";

export default function RestaurantsPage({ token }) {
  const [restaurants, setRestaurants] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadRestaurants() {
      setLoading(true);
      setError("");

      try {
        const response = await fetchRestaurants(token, 118);
        const payload = response.data;

        if (
          payload?.status !== "Success" ||
          payload?.status_code !== 200 ||
          !Array.isArray(payload?.data?.results)
        ) {
          throw new Error(
            "The API returned an unexpected restaurant response."
          );
        }

        const { results, meta: responseMeta } = payload.data;

        if (!cancelled) {
          setRestaurants(results);
          setMeta(responseMeta ?? null);
        }
      } catch (requestError) {
        if (!cancelled) {
          setRestaurants([]);
          setMeta(null);
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRestaurants();

    return () => {
      cancelled = true;
    };
  }, [token, refreshCount]);

  function handleRefresh() {
    setRefreshCount((count) => count + 1);
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-orange-600">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Explore
          </div>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Discover Restaurants
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
            Explore restaurants, view their details, and find your
            next place to visit.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 7v5h-5" />
            <path d="M4 17v-5h5" />
            <path d="M5.6 9a7 7 0 0 1 11.9-2L20 12" />
            <path d="M18.4 15a7 7 0 0 1-11.9 2L4 12" />
          </svg>

          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-300 pb-4">
        <div>
          <h3 className="font-bold text-gray-900">
            Restaurant directory
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {loading
              ? "Retrieving restaurant details..."
              : error
                ? "Unable to retrieve restaurants."
                : `Showing ${restaurants.length} loaded restaurant${
                    restaurants.length === 1 ? "" : "s"
                  }`}
          </p>
        </div>

        {!loading && !error && meta?.total_count != null && (
          <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">
            {meta.total_count} total reported
          </span>
        )}
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-5 py-8 text-center"
        >
          <h3 className="font-bold text-red-800">
            Couldn't load restaurants
          </h3>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={handleRefresh}
            className="mt-5 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <div className="h-48 animate-pulse bg-gray-100" />

              <div className="space-y-4 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                <div className="border-t border-gray-100 pt-4">
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="text-4xl">🍽️</div>

          <h3 className="mt-4 text-lg font-bold text-gray-900">
            No restaurants found
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            No restaurants were returned for this city.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.restaurant_id}
              restaurant={restaurant}
            />
          ))}
        </div>
      )}

      {!loading && !error && restaurants.length > 0 && (
        <p className="text-center text-xs leading-5 text-gray-400">
          Restaurant information is provided by the Fastor API.
        </p>
      )}
    </section>
  );
}