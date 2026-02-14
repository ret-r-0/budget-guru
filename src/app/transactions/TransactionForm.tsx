"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { Currency } from "@/features/wallets/walletCurrencies";

type TxType = "income" | "expense";

export type TransactionFormValues = {
  name: string;
  amount: number;
  date: string;
  type: TxType;
  currency: Currency;
};

type Props = {
  title: string;
  submitLabel: string;
  initialValues?: Partial<TransactionFormValues>;
  onSubmit: (values: TransactionFormValues) => void;
  onCancel: () => void;
};

export default function TransactionForm({
  title,
  submitLabel,
  initialValues,
  onSubmit,
  onCancel,
}: Props) {
  const [name, setName] = useState(initialValues?.name || "");
  const [amount, setAmount] = useState<number>(initialValues?.amount || 0);
  const [date, setDate] = useState(initialValues?.date || "");
  const [type, setType] = useState<TxType>(initialValues?.type || "income");

  const { walletId } = useParams<{ walletId: string }>();

  const wallet = useAppSelector((state) =>
    state.wallets.items.find((w) => w.id === walletId),
  );

  const [currency, setCurrency] = useState<Currency>(
    wallet?.currency || initialValues?.currency || "USD",
  );

  if (!wallet) {
    return <div>Wallet not found</div>;
  }

  useEffect(() => {
    setName(initialValues?.name ?? "");
    setAmount(initialValues?.amount != null ? initialValues.amount : 0);
    setDate(initialValues?.date ?? "");
    setType(initialValues?.type ?? "income");
    setCurrency(wallet?.currency || initialValues?.currency || "USD");
  }, [initialValues]);

  const isValid = name.trim().length > 0 && Number(amount) > 0;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;

    onSubmit({
      name: name.trim(),
      date,
      amount: Number(amount),
      type,
      currency: currency as Currency,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-500 to-blue-600 text-gray-800 px-6 py-12">
      <section className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-amber-200">
        <h1 className="max-w-full font-bold text-lg font-shadows bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600 mb-6 text-center mt-5">
          {title}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-4">
            <label className="font-shadows text-black mb-2">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              className="border-b font-shadows border-black focus:outline-0"
            />

            <label className="font-shadows text-black mb-2">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDate(e.target.value)
              }
              className="border-b font-shadows border-black focus:outline-0"
            />

            <label className="font-shadows text-black mb-2">Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAmount(Number(e.target.value))
              }
              className="border-b font-shadows border-black focus:outline-0"
            />

            <label className="font-shadows text-black mb-2">Type:</label>
            <select
              value={type}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setType(e.target.value as TxType)
              }
              className="border-0 border-black font-shadows text-black focus:ring-0 focus:border-none focus:outline-0"
            >
              <option value="income" className="font-shadows text-black">
                Income
              </option>
              <option value="expense" className="font-shadows text-black">
                Expense
              </option>
            </select>

            <div className="flex justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 bg-gray-500 text-white rounded-md focus:ring-2 hover:ring-2  hover:bg-gray-600 hover:scale-103"
              >
                Cancel
              </button>

              <button
                disabled={!isValid}
                type="submit"
                className="px-6 py-2 bg-[#BEFF00] hover:bg-lime-500 font-shadows hover:ring-2 focus:ring-2 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800 rounded-lg transition hover:scale-103 shadow-md disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-[#BEFF00] disabled:hover:ring-0"
              >
                {submitLabel}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
