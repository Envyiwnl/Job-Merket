export default function GoogleAuthButton({
  onClick,
  disabled = false,
  text = "Continue with Google",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="flex h-5 w-5 items-center justify-center text-base font-bold text-slate-700">
        G
      </span>

      {text}
    </button>
  );
}