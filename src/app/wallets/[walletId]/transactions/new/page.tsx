"use client";
import React from "react";
import { addTransaction } from "@/features/transactions/transactionSlice";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TransactionForm from "@/app/transactions/TransactionForm";
import { Currency } from "@/features/wallets/walletCurrencies";

const AddTransactionForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { walletId } = useParams<{ walletId: string }>();

  const handleSubmit = (values: {
    name: string;
    date: string;
    amount: number;
    type: "income" | "expense";
    currency: Currency;
  }) => {
    dispatch(
      addTransaction({
        id: Date.now().toString(),
        walletId,
        ...values,
      })
    );
    router.push(`/wallets/${walletId}/transactions/`);
  };

  return (
    <div>
      <TransactionForm
        title="Add Transaction"
        onSubmit={handleSubmit}
        submitLabel="Add Transaction"
        onCancel={() => router.push(`/wallets/${walletId}/transactions/`)}
      />
    </div>
  );
};

export default AddTransactionForm;
