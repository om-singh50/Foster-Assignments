import api from "../../api/client";

const formHeaders = {
  "Content-Type": "application/x-www-form-urlencoded",
};

export function registerUser({ phone, dialCode }) {
  const body = new URLSearchParams({
    phone,
    dial_code: dialCode,
  });

  return api.post("/v1/pwa/user/register", body, {
    headers: formHeaders,
  });
}

export function loginWithOtp({ phone, otp, dialCode }) {
  const body = new URLSearchParams({
    phone,
    otp,
    dial_code: dialCode,
  });

  return api.post("/v1/pwa/user/login", body, {
    headers: formHeaders,
  });
}