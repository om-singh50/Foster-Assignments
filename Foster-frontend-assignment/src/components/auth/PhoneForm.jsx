export default function PhoneForm({
  phone,
  onPhoneChange,
  onSubmit,
  isSubmitting,
  error,
}) {
  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Mobile number
        </label>

        <div className="flex overflow-hidden rounded-xl border border-gray-300 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100">
          <span className="flex items-center border-r border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-600">
            +91
          </span>

          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            value={phone}
            onChange={(event) => onPhoneChange(event.target.value)}
            placeholder="Enter 10-digit number"
            maxLength={10}
            required
            className="min-w-0 flex-1 px-4 py-3 outline-none"
          />
        </div>
      </div>

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
        {isSubmitting ? "Please wait..." : "Register & Get OTP"}
      </button>
    </form>
  );
}