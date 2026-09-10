import { X } from "lucide-react";

export default function ConfirmationModal({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  variant = "default",
}) {
  if (!isOpen) {
    return null;
  }

  const confirmButtonStyle =
    variant === "danger"
      ? "bg-red-500 hover:bg-red-600"
      : "bg-[#08C8B7] hover:bg-[#07B6A7]";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-5">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

            {description && (
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close confirmation modal"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col-reverse gap-3 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition ${confirmButtonStyle}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
