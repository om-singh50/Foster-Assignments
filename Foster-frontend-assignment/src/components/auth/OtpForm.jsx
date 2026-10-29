export default function OtpForm({
  phone,
  otp,
  onOtpChange,
  onSubmit,
  onBack,
  isSubmitting,
  error,
  notice,
}) {
  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="otp"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          One-time password
        </label>

        <input
          id="otp"
          name="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={otp}
          onChange={(event) => onOtpChange(event.target.value)}
          placeholder="123456"
          maxLength={6}
          required
          className="w-full rounded-xl border border-gray-300 px-4 py-3 tracking-[0.3em] outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />

        <p className="mt-2 text-xs text-gray-500">
          Verifying +91 {phone}.
        </p>
      </div>

      {notice && (
        <p
          role="status"
          className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          {notice}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-orange-500 px-4 py-3.5 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Please wait..." : "Verify OTP & Login"}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="text-sm font-semibold text-orange-600 hover:text-orange-700"
      >
        ← Change mobile number
      </button>
    </form>
  );
}