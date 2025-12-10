import {
  selectTransactions,
  selectTransactionById,
  selectTotalsByType,
  selectTotalsWithFilters,
} from "@/features/transactions/transactionSelectors";

import type { Transaction } from "@/features/transactions/transactionSlice";
import type { RootState } from "@/store";

const createTx = (overrides: Partial<Transaction> = {}): Transaction => ({
  id: overrides.id ?? "1",
  type: overrides.type ?? "income",
  amount: overrides.amount ?? 100,
  categoryId: overrides.categoryId ?? "general",
  date: overrides.date ?? "2025-01-01",
  name: overrides.name,
  walletId: overrides.id ?? "1",
});

const createState = (items: Transaction[] = []): RootState =>
  ({
    transactions: { items },
  } as RootState);

describe("transactionSelectors", () => {
  it("selectTransactions should return all transactions", () => {
    const tx1 = createTx();
    const tx2 = createTx({ id: "2", amount: 200 });

    const state = createState([tx1, tx2]);

    expect(selectTransactions(state)).toEqual([tx1, tx2]);
  });

  it("selectTransactionById should return transaction by id", () => {
    const tx1 = createTx();
    const tx2 = createTx({ id: "2", amount: 200 });

    const state = createState([tx1, tx2]);

    expect(selectTransactionById(state, "1")).toEqual(tx1);
    expect(selectTransactionById(state, "2")).toEqual(tx2);
  });

  it("selectTransactionById should return undefined if id does not exist", () => {
    const tx1 = createTx();
    const tx2 = createTx({ id: "2", amount: 200, type: "expense" });

    const state = createState([tx1, tx2]);

    expect(selectTransactionById(state, "3")).toBeUndefined();
  });

  it("selectTotalsWithFilters should calculate totals without filters", () => {
    const tx1 = createTx({ date: "2025-12-19", amount: 500 });
    const tx2 = createTx({
      id: "2",
      amount: 200,
      type: "expense",
      date: "2025-12-25",
    });
    const tx3 = createTx({
      id: "3",
      amount: 700,
      type: "expense",
      date: "2026-01-05",
    });
    const tx4 = createTx({ id: "4", amount: 2100, date: "2025-12-27" });

    const state = createState([tx1, tx2, tx3, tx4]);

    const { income, expense, balance } = selectTotalsWithFilters(state, {});

    expect(income).toBe(2600);
    expect(expense).toBe(900);
    expect(balance).toBe(1700);
  });

  it("selectTotalsWithFilters should respect date range", () => {
    const tx1 = createTx({ date: "2025-12-19", amount: 500 });
    const tx2 = createTx({
      id: "2",
      amount: 200,
      type: "expense",
      date: "2025-12-25",
    });
    const tx3 = createTx({
      id: "3",
      amount: 700,
      type: "expense",
      date: "2026-01-05",
    });
    const tx4 = createTx({ id: "4", amount: 2100, date: "2025-12-27" });

    const state = createState([tx1, tx2, tx3, tx4]);

    const { income, expense, balance } = selectTotalsWithFilters(state, {
      from: "2025-12-01",
      to: "2025-12-31",
    });

    expect(income).toBe(2600);
    expect(expense).toBe(200);
    expect(balance).toBe(2400);
  });

  it("selectTotalsWithFilters should apply filterType = income", () => {
    const tx1 = createTx({ date: "2025-12-19", amount: 500 });
    const tx2 = createTx({
      id: "2",
      amount: 200,
      type: "expense",
      date: "2025-12-25",
    });
    const tx3 = createTx({
      id: "3",
      amount: 700,
      type: "expense",
      date: "2026-01-05",
    });
    const tx4 = createTx({ id: "4", amount: 2100, date: "2025-12-27" });

    const state = createState([tx1, tx2, tx3, tx4]);

    const { income, expense, balance } = selectTotalsWithFilters(state, {
      filterType: "income",
    });

    expect(income).toBe(2600);
    expect(expense).toBe(0);
    expect(balance).toBe(2600);
  });

  it("selectTotalsWithFilters should apply filterType = expense", () => {
    const tx1 = createTx({ amount: 2600 });
    const tx2 = createTx({ id: "2", amount: 600, type: "expense" });
    const tx3 = createTx({ id: "3", amount: 500, type: "expense" });

    const state = createState([tx1, tx2, tx3]);

    const { income, expense, balance } = selectTotalsWithFilters(state, {
      filterType: "expense",
    });

    expect(income).toBe(0);
    expect(expense).toBe(1100);
    expect(balance).toBe(-1100);
  });

  it("selectTotalsByType should count totals inside date range", () => {
    const tx1 = createTx({ amount: 500, date: "2025-12-19" });
    const tx2 = createTx({
      id: "2",
      amount: 200,
      type: "expense",
      date: "2026-01-12",
    });
    const tx3 = createTx({
      id: "3",
      amount: 700,
      type: "expense",
      date: "2025-12-06",
    });
    const tx4 = createTx({ id: "4", amount: 2100, date: "2025-12-27" });

    const state = createState([tx1, tx2, tx3, tx4]);

    const { income, expense } = selectTotalsByType(state, {
      from: "2025-12-01",
      to: "2025-12-31",
    });

    expect(income).toBe(2600);
    expect(expense).toBe(700);
  });
});
