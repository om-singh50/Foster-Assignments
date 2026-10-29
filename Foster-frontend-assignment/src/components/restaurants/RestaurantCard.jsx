import { useState } from "react";

export default function RestaurantCard({ restaurant }) {
  const [imageFailed, setImageFailed] = useState(false);

  const name = restaurant.restaurant_name || "Restaurant";
  const logo = restaurant.logo;

  const rawAddress = restaurant.address_complete;

  const address =
    typeof rawAddress === "string" &&
    rawAddress.trim() !== "" &&
    rawAddress.trim().toLowerCase() !== "null"
      ? rawAddress.trim()
      : "Address unavailable";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-300 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg cursor-pointer">
      <div className="relative flex h-48 items-center justify-center overflow-hidden border-b border-gray-300 bg-gray-50 p-6">
        {logo && !imageFailed ? (
          <img
            src={logo}
            alt={`${name} logo`}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl text-orange-600"
            aria-label="Restaurant logo unavailable"
          >
            🍽️
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-md border border-gray-200 bg-white/95 px-2.5 py-1 text-xs font-medium text-gray-600">
          Restaurant
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3
          className="line-clamp-2 min-h-14 text-lg font-bold leading-7 text-gray-900"
          title={name}
        >
          {name}
        </h3>

        <div className="mt-3 flex items-start gap-2.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 shrink-0 text-gray-400"
            aria-hidden="true"
          >
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>

          <p
            className="line-clamp-3 min-h-[3.75rem] text-sm leading-5 text-gray-500"
            title={address}
          >
            {address}
          </p>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Restaurant ID
            </span>

            <span className="rounded-md bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-700">
              #{restaurant.restaurant_id ?? "N/A"}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}