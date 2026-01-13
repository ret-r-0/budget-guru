"use client";

import { editTransaction } from "@/features/transactions/transactionSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TransactionForm, {
  type TransactionFormValues,
} from "@/app/transactions/TransactionForm";

const EditTransactionForm = () => {
  const dispatch = useAppDispatch();

  const { walletId, transactionId } = useParams<{
    walletId: string;
    transactionId: string;
  }>();
  const transaction = useAppSelector((state) =>
    state.transactions.items.find(
      (tx) => tx.id === transactionId && tx.walletId === walletId
    )
  );

  const router = useRouter();

  if (!transaction) {
    return (
      <div className="p-6">
        <p className="text-center">Transaction not found</p>
        <div className="flex justify-center mt-4">
          <button
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            onClick={() => router.push(`/wallets/${walletId}/transactions`)}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (values: TransactionFormValues) => {
    dispatch(editTransaction({ id: transaction.id, changes: values }));
    router.push(`/wallets/${walletId}/transactions`);
  };

  return (
    <TransactionForm
      title="Edit Transaction"
      submitLabel="Save Changes"
      initialValues={{
        name: transaction.name ?? "",
        amount: transaction.amount,
        date: transaction.date,
        type: transaction.type,
        // currency можно НЕ передавать — форма сама возьмёт из кошелька
      }}
      onSubmit={handleSubmit}
      onCancel={() => router.push(`/wallets/${walletId}/transactions`)}
    />
  );
};

export default EditTransactionForm;
