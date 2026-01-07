"use client";

import { addTransaction } from "@/features/transactions/transactionSlice";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import TransactionForm from "./TransactionForm";
import { Currency } from "@/features/wallets/walletCurrencies";

export default function TransactionAddingForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams<{ walletId: string }>();
  const walletId = params.walletId;

  const handleSubmit = (values: {
    name: string;
    amount: number;
    date: string;
    type: "income" | "expense";
    currency: Currency;
  }) => {
    const transaction = {
      id: Date.now().toString(),
      ...values,
      walletId: walletId,
    };

    dispatch(addTransaction(transaction));
    router.push(`/wallets/${walletId}/transactions/`);
  };

  return (
    <TransactionForm
      title="Add Transaction Form"
      onSubmit={handleSubmit}
      submitLabel="Add Transaction"
      onCancel={() => router.push(`/wallets/${walletId}/transactions/`)}
    />
  );
}
