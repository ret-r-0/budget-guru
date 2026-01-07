"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { Currency } from "@/features/wallets/walletCurrencies";

type TxType = "income" | "expense";

type TransactionFormValues = {
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
    state.wallets.items.find((w) => w.id === walletId)
  );

  const [currency, setCurrency] = useState<Currency>(
    wallet?.currency || initialValues?.currency || "USD"
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
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-amber-100 text-gray-800 px-6 py-12">
      <section className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-amber-200">
        <h1 className="max-w-full font-bold mb-6 text-center mt-5 font-serif text-amber-800">
          {title}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-4">
            <label className="font-serif text-amber-800 mb-2">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              className="border-b border-black focus:outline-0"
            />

            <label className="font-serif text-amber-800  mb-2">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDate(e.target.value)
              }
              className="border-b border-black focus:outline-0"
            />

            <label className="font-serif text-amber-800  mb-2">Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAmount(Number(e.target.value))
              }
              className="border-b border-black focus:outline-0"
            />

            <label className="font-serif text-amber-800  mb-2">Type:</label>
            <select
              value={type}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setType(e.target.value as TxType)
              }
              className="border-0 border-black font-serif text-black-800 focus:ring-0 focus:border-none focus:outline-0"
            >
              <option value="income" className="font-serif text-amber-800">
                Income
              </option>
              <option value="expense" className="font-serif text-amber-800">
                Expense
              </option>
            </select>

            <div className="flex justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>

              <button
                disabled={!isValid}
                type="submit"
                className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50"
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
