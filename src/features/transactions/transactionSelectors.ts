import { RootState } from "@/store";
import { Transaction, TransactionState } from "./transactionSlice";

type filterType = "all" | "income" | "expense";

export type TotalsFilter = {
  from?: string;
  to?: string;
  filterType?: filterType;
};

const getDateRangeTs = (from?: string, to?: string) => {
  let fromTs = Number.NEGATIVE_INFINITY;
  let toTs = Number.POSITIVE_INFINITY;

  if (from) {
    const fromDate = new Date(from);
    if (!isNaN(fromDate.getTime())) {
      fromTs = new Date(
        fromDate.getFullYear(),
        fromDate.getMonth(),
        fromDate.getDate(),
        0,
        0,
        0,
        0
      ).getTime();
    }
  }

  if (to) {
    const toDate = new Date(to);
    if (!isNaN(toDate.getTime())) {
      toTs = new Date(
        toDate.getFullYear(),
        toDate.getMonth(),
        toDate.getDate(),
        23,
        59,
        59,
        999
      ).getTime();
    }
  }

  return { fromTs, toTs };
};

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

export const selectTotalsWithFilters = (
  state: RootState,
  { from, to, filterType }: TotalsFilter
): { income: number; expense: number; balance: number } => {
  const { fromTs, toTs } = getDateRangeTs(from, to);

  let income = 0;
  let expense = 0;

  for (const tx of state.transactions.items) {
    const ts = new Date(tx.date).getTime();
    if (isNaN(ts)) continue;

    if (ts < fromTs || ts > toTs) continue;

    if (filterType && filterType !== "all" && tx.type !== filterType) {
      continue;
    }

    if (tx.type === "income") income += tx.amount;
    if (tx.type === "expense") expense += tx.amount;
  }

  const balance = income - expense;

  return { income, expense, balance };
};

export const;
