"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { editTransaction } from "@/features/transactions/transactionSlice";
import { useRouter, useParams } from "next/navigation";
import TransactionForm from "@/app/transactions/TransactionForm";
import { Currency } from "@/features/wallets/walletCurrencies";

export default function EditTransactionForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { walletId, transactionId } = useParams<{
    walletId: string;
    transactionId: string;
  }>();

  const wallet = useAppSelector((state) =>
    state.wallets.items.find((w) => w.id === walletId)
  );

  const transaction = useAppSelector((state) =>
    state.transactions.items.find(
      (tx) => tx.id === transactionId && tx.walletId === walletId
    )
  );

  const handleSubmit = (values: {
    name: string;
    date: string;
    amount: number;
    type: "income" | "expense";
    currency: Currency;
  }) => {
    if (transaction) {
      dispatch(editTransaction({ id: transaction.id, changes: { ...values } }));
    }
    router.push(`/wallets/${walletId}/transactions/`);
  };

  return (
    transaction && (
      <TransactionForm
        title="Edit Transaction"
        submitLabel="Save Changes"
        initialValues={{
          name: transaction.name,
          amount: transaction.amount,
          date: transaction.date,
          type: transaction.type,
          currency: wallet?.currency,
        }}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/wallets/${walletId}/transactions/`)}
      />
    )
  );
}
