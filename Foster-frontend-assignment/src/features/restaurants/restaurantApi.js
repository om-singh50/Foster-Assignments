import api from "../../api/client";

export function fetchRestaurants(token, cityId = 118) {
  return api.get("/v1/m/restaurant", {
    params: {
      city_id: cityId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}