import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  name?: string;
  date: string;
  walletId: string;
}

export interface TransactionState {
  items: Transaction[];
}

const initialState: TransactionState = { items: [] };

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction(
      state: TransactionState,
      action: PayloadAction<Transaction>
    ) {
      state.items.push(action.payload);
    },
    removeTransaction(
      state: TransactionState,
      action: PayloadAction<{
        id: string;
      }>
    ) {
      state.items = state.items.filter(
        (transaction) => transaction.id !== action.payload.id
      );
    },
    removeTransactionsByWallet(
      state: TransactionState,
      action: PayloadAction<{ walletId: string }>
    ) {
      state.items = state.items.filter(
        (tx) => tx.walletId !== action.payload.walletId
      );
    },
    editTransaction(
      state: TransactionState,
      action: PayloadAction<{
        id: string;
        changes: Partial<Omit<Transaction, "id">>;
      }>
    ) {
      const { id, changes } = action.payload;
      const tx = state.items.find((transaction) => transaction.id === id);
      if (!tx) return;
      Object.assign(tx, changes);
    },
    setTransactions(
      state: TransactionState,
      action: PayloadAction<Transaction[]>
    ) {
      state.items = action.payload;
    },
    clearAllTransactions(state: TransactionState) {
      state.items = [];
    },
  },
});

export const {
  addTransaction,
  removeTransaction,
  editTransaction,
  removeTransactionsByWallet,
  setTransactions,
  clearAllTransactions,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
