"use client";
import React from "react";
import { addTransaction } from "@/features/transactions/transactionSlice";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { text } from "stream/consumers";
import { string } from "zod";

const AddTransactionForm = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedType, setSelectedType] = useState<"income" | "expense">(
    "income"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("default");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const validateForm = () => {
    if (note && selectedType && date && parseFloat(amount) > 0) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    const transaction = {
      id: Date.now().toString(),
      type: selectedType,
      note,
      date,
      categoryId: selectedCategory || "default",
      amount: parseFloat(amount) || 0,
    };

    dispatch(addTransaction(transaction));
    router.push("/transactions");
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [note, date, amount, selectedType]);

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-amber-100 text-gray-800 px-6 py-12">
      <section className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-amber-200">
        <h1 className="max-w-full font-bold mb-6 text-center mt-5 font-serif text-amber-800">
          Form of Addition of New Transactions
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-4">
            <label htmlFor="note" className="font-serif text-amber-800 mb-2">
              Note:
            </label>
            <input
              id="note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border-b border-black focus:outline-0"
            />
            <label htmlFor="date" className="font-serif text-amber-800 mb-2">
              Date:
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-b border-black focus:outline-0"
            />
            <label htmlFor="amount" className="font-serif text-amber-800 mb-2">
              Amount:
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              min={0}
              onChange={(e) => setAmount(e.target.value)}
              className="border-b border-black focus:outline-0"
            />
            <label htmlFor="type" className="font-serif text-amber-800 mb-2">
              Type:
            </label>
            <select
              id="type"
              name="type"
              value={selectedType}
              onChange={(e) =>
                setSelectedType(e.target.value as "income" | "expense")
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
            <section className="flex justify-center mt-25">
              <button
                disabled={!isFormValid}
                type="submit"
                className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
              >
                Add the transaction
              </button>
            </section>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddTransactionForm;
