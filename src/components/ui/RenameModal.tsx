"use client";

import { useState, useEffect } from "react";

type RenameModalProps = {
  open: boolean;
  currentName: string;
  title?: string;
  message?: string;
  onConfirm: (newName: string) => void;
  onCancel: () => void;
};

export default function RenameModal({
  open,
  currentName,
  title = "Rename the item",
  message = "Enter a new name for your item",
  onConfirm,
  onCancel,
}: RenameModalProps) {
  const [newName, setNewName] = useState<string>(currentName);

  useEffect(() => {
    if (open) {
      setNewName(currentName);
    }
  }, [open, currentName]);

  if (!open) return null;

  const handleConfirm = () => {
    if (newName.trim()) {
      onConfirm(newName.trim());
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-lg font-semibold text-gray-800 mb-2">{message}</p>
        <div className=" flex justify-end gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder={currentName}
          />
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 transition "
          >
            Rename
          </button>
        </div>
      </div>
    </div>
  );
}
