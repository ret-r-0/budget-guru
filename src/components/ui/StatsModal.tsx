'use client';

import { Currency } from '@/features/wallets/walletCurrencies';

type StatsModalProps = {
  open: boolean;
  title?: string;
  currency: Currency;
  sum: number;
  onClose: () => void;
};

export default function StatsModal({
  open,
  title,
  currency,
  sum,
  onClose,
}: StatsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="mb-2">
          <span className="font-semibold font-shadows">
            {title}: {sum} {currency}{' '}
          </span>
        </p>
        <button
          className="px-4 py-2 bg-[#BEFF00] hover:bg-lime-500 font-shadows rounded-lg"
          onClick={onClose}
        >
          Ohhh, I got it
        </button>
      </div>
    </div>
  );
}
