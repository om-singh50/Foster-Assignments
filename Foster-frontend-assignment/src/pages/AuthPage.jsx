import { useState } from "react";
import { registerUser, loginWithOtp } from "../features/auth/authApi";
import getErrorMessage from "../utils/getErrorMessage";
import PhoneForm from "../components/auth/PhoneForm";
import OtpForm from "../components/auth/OtpForm";

export default function AuthPage({ onLoginSuccess }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function handlePhoneChange(value) {
    setPhone(value.replace(/\D/g, "").slice(0, 10));
  }

  function handleOtpChange(value) {
    setOtp(value.replace(/\D/g, "").slice(0, 6));
  }

  async function handleRegister(event) {
  event.preventDefault();
  setError("");
  setNotice("");

  if (!/^\d{10}$/.test(phone)) {
    setError("Enter a valid 10-digit Indian mobile number.");
    return;
  }

  try {
    setIsSubmitting(true);

    const response = await registerUser({
      phone,
      dialCode: "+91",
    });

    if (
      response.data?.status !== "Success" ||
      response.data?.status_code !== 200
    ) {
      throw new Error(
        response.data?.message || "Registration failed."
      );
    }

    setStep("otp");
    setNotice(
      response.data.data === "otp sent"
        ? "OTP sent successfully. Enter the OTP to continue."
        : String(response.data.data || "Registration successful.")
    );
  } catch (requestError) {
    setError(getErrorMessage(requestError));
  } finally {
    setIsSubmitting(false);
  }
}

  async function handleLogin(event) {
  event.preventDefault();
  setError("");
  setNotice("");

  if (!/^\d{6}$/.test(otp)) {
    setError("Enter the 6-digit OTP.");
    return;
  }

  try {
    setIsSubmitting(true);

    const response = await loginWithOtp({
      phone,
      otp,
      dialCode: "+91",
    });

    if (
      response.data?.status !== "Success" ||
      response.data?.status_code !== 200
    ) {
      throw new Error(
        response.data?.message || "OTP verification failed."
      );
    }

    const token = response.data?.data?.token;

    if (!token) {
      throw new Error(
        "Login succeeded, but no authentication token was returned."
      );
    }

    onLoginSuccess(token);
  } catch (requestError) {
    setError(getErrorMessage(requestError));
  } finally {
    setIsSubmitting(false);
  }
}

  function handleBack() {
    setStep("phone");
    setOtp("");
    setError("");
    setNotice("");
  }

  return (
    <div className="mx-auto grid max-w-4xl overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm md:grid-cols-2">
      <section className="flex flex-col justify-between bg-gradient-to-br from-orange-500 to-red-900 p-8 text-white sm:p-10">
        <div>
          

          <h2 className=" text-3xl font-extrabold leading-tight sm:text-4xl">
            Good food.
            <br />
            Great discoveries.
          </h2>

          <p className="mt-4 leading-7 text-white/90">
            Sign in with your mobile number to discover
            restaurants around you.
          </p>
        </div>

        <p className="mt-12 text-sm text-white/80">
          Powered by the Fastor restaurant API
        </p>
      </section>

      <section className="p-7 sm:p-10">
        <h2 className="text-2xl font-bold">
          {step === "phone" ? "Welcome back" : "Verify your number"}
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {step === "phone"
            ? "Enter your mobile number to register and request an OTP."
            : "Enter the OTP to complete authentication."}
        </p>

        {step === "phone" ? (
          <PhoneForm
            phone={phone}
            onPhoneChange={handlePhoneChange}
            onSubmit={handleRegister}
            isSubmitting={isSubmitting}
            error={error}
          />
        ) : (
          <OtpForm
            phone={phone}
            otp={otp}
            onOtpChange={handleOtpChange}
            onSubmit={handleLogin}
            onBack={handleBack}
            isSubmitting={isSubmitting}
            error={error}
            notice={notice}
          />
        )}

        <p className="mt-6 text-center text-xs leading-5 text-gray-400">
          By continuing, you agree to the applicable terms and
          privacy policy.
        </p>
      </section>
    </div>
  );
}