'use client';

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title = 'Are you sure?',
  message = 'This action cannot be undone',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold font-shadows text-gray-800 mb-2">
          {title}
        </h2>
        <p className="text-lg font-shadows text-gray-800 mb-2">{message}</p>
        <div className=" flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-shadows bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-shadows bg-red-600 text-white hover:bg-red-700 transition "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
