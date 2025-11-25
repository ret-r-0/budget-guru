import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  categoryId: string;
  note?: string;
  date: string;
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
      action: PayloadAction<{
        id: string;
        type: "income" | "expense";
        amount: number;
        categoryId: string;
        date: string;
        note?: string;
      }>
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
    editTransaction(
      state: TransactionState,
      action: PayloadAction<{
        id: string;
        changes?: Partial<Transaction>;
      }>
    ) {
      const { id, changes } = action.payload;
      const index = state.items.findIndex(
        (transaction) => transaction.id === id
      );
      if (index !== -1) {
        Object.assign(state.items[index], changes);
      }
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
  setTransactions,
  clearAllTransactions,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
