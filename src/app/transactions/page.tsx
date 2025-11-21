"use client";

import { useAppSelector } from "@/store/hooks";
import { removeTransaction } from "@/features/transactions/transactionSlice";
import Link from "next/link";
import { useDispatch } from "react-redux";
import {
  selectTotalsByType,
  selectTransactionById,
  selectTransactions,
} from "@/features/transactions/transactionSelectors";
import { useState } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function TransactionPage() {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"All" | "income" | "expense">(
    "All"
  );

  const transactions = useAppSelector(selectTransactions);

  const { income, expense } = useAppSelector((state) =>
    selectTotalsByType(state, {
      from: "1970-01-01",
      to: "2100-01-01",
    })
  );

  const balance = income - expense;

  const dispatch = useDispatch();

  const filteredTransactions =
    filterType === "All"
      ? transactions
      : transactions.filter((tx) => tx.type === filterType);

  const handleDeletion = (id: string) => {
    setSelectedId(id);
    setModalOpen(true);
    /*   dispatch(removeTransaction({ id })); */
  };

  const confirmDelete = () => {
    if (selectedId) {
      dispatch(removeTransaction({ id: selectedId }));
      setModalOpen(false);
      setSelectedId(null);
    } else {
      return;
    }
  };

  const cancelDelete = () => {
    setModalOpen(false);
    setSelectedId(null);
  };

  if (transactions === null) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-amber-100 text-gray-800 px-6 py-12">
      <section className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-amber-200">
        <h1 className="text-4xl font-extrabold text-amber-800 mb-6 text-center">
          Transactions
        </h1>
        {transactions.length === 0 ? (
          <div>
            <p className="text-lg font-bold text-center">No Transactions</p>
            <div className="flex justify-center">
              <Link href="/transactions/new">
                <button className="px-6 py-3 mt-2.5 bg-amber-400 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 ">
                  Add New Transaction
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <ul>
              <li className="grid grid-cols-5 items-center p-3 bg-gray-500 text-white font-semibold rounded-t-lg">
                <span className="text-left">Type</span>
                <span className="text-center">Subject</span>
                <span className="text-center">Amount</span>
                <span className="text-center">Date</span>
                <span className="text-right">Actions</span>
              </li>
              {transactions.map((tx) => (
                <li
                  key={tx.id}
                  className={`grid grid-cols-5 items-center p-3 text-white ${
                    tx.type === "income" ? "bg-green-400" : "bg-red-600"
                  }`}
                >
                  <span className="font-semibold text-left">{tx.type}</span>
                  <span className="text-center">
                    <Link href={`/transactions/${tx.id}/edit`}>
                      <button className="text-center underline hover:text-gray-400">
                        {tx.note}
                      </button>
                    </Link>
                  </span>
                  <span className="text-center">{tx.amount}</span>
                  <span className="text-center text-sm">{tx.date}</span>
                  <button
                    className="justify-self-end px-3 bg-gray-500 rounded-2xl font-sans tracking-tight transition-transform duration-350 hover:bg-amber-300 hover:scale-110"
                    onClick={() => {
                      handleDeletion(tx.id);
                    }}
                  >
                    Delete Transaction
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-6 px-5 gap-x-4">
              <div className="flex gap-y-1 flex-col flex-1 bg-green-400 rounded-full border-2">
                <p className="text-sm font-medium text-center">Income:</p>
                <p className="text-xl font-bold text-center">
                  {income.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col gap-y-1 flex-1 bg-red-500 rounded-full border-2">
                <p className="text-sm font-medium text-center">Expense:</p>
                <p className="text-xl font-bold text-center">
                  {expense.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col gap-y-1 flex-1 bg-blue-400 rounded-full border-2">
                <p className="text-sm font-medium text-center">Total:</p>
                <p className="text-xl font-bold text-center">
                  {balance.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Link href="/transactions/new">
                <button className="px-6 py-3 mt-6 bg-gray-500 hover:bg-amber-400 text-white font-semibold rounded-xl shadow-md transition-all duration-200 ">
                  Add New Transaction
                </button>
              </Link>
            </div>
          </div>
        )}
      </section>
      <ConfirmModal
        open={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Delete transaction"
        message="Are you sure you want to delete this transaction?"
      />
    </div>
  );
}
