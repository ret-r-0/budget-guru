"use client";

import { Currency } from "@/features/wallets/walletCurrencies";

type InfoModalProps = {
  open: boolean;
  title?: string;
  currency: Currency;
  balance: number;
  onClose: () => void;
};

export default function InfoModal({
  open,
  title = "Wallet Information",
  currency,
  balance,
  onClose,
}: InfoModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-2">
          <span className="font-semibold">Currency:</span> {currency}
        </p>
        <p className="mb-4">
          <span className="font-semibold">Balance:</span> {balance}
        </p>
        <button
          className="px-4 py-2 bg-teal-500 text-white rounded-lg"
          onClick={onClose}
        >
          Ohhh, I got it
        </button>
      </div>
    </div>
  );
}
