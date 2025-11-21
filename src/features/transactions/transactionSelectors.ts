import { RootState } from "@/store";
import { Transaction, TransactionState } from "./transactionSlice";

export const selectTransactions = (state: RootState): Transaction[] => {
  return state.transactions.items;
};

export const selectTransactionById = (
  state: RootState,
  id: string
): Transaction | undefined => {
  return state.transactions.items.find((item) => item.id === id);
};

type DateRange = { from: string; to: string };

export const selectTotalsByType = (
  state: RootState,
  { from, to }: DateRange
): { income: number; expense: number } => {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    return { income: 0, expense: 0 };
  }

  const startOfDayTs = new Date(
    fromDate.getFullYear(),
    fromDate.getMonth(),
    fromDate.getDate(),
    0,
    0,
    0,
    0
  ).getTime();

  const endOfDayTs = new Date(
    toDate.getFullYear(),
    toDate.getMonth(),
    toDate.getDate(),
    23,
    59,
    59,
    999
  ).getTime();

  let income = 0;
  let expense = 0;

  for (const tx of state.transactions.items) {
    const ts = new Date(tx.date).getTime();
    if (ts >= startOfDayTs && ts <= endOfDayTs) {
      if (tx.type === "income") income += tx.amount;
      else if (tx.type === "expense") expense += tx.amount;
    }
  }

  return { income, expense };
};
