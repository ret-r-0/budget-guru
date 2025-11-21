import { configureStore } from "@reduxjs/toolkit";
import transactionsReducer, {
  TransactionState,
} from "@/features/transactions/transactionSlice";

const isBrowser = typeof window !== "undefined";

type PreloadedState = { transactions: TransactionState };

const loadState = (): PreloadedState | undefined => {
  if (!isBrowser) return undefined;

  try {
    const data = localStorage.getItem("transactions");
    if (!data) return undefined;
    const transactions = JSON.parse(data) as TransactionState;
    return { transactions };
  } catch (e) {
    return undefined;
  }
};

const saveState = (state: RootState) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem("transactions", JSON.stringify(state.transactions));
  } catch (e) {}
};

const preloaded = loadState();

export const store = configureStore({
  reducer: { transactions: transactionsReducer },
  preloadedState: preloaded,
});

store.subscribe(() => saveState(store.getState()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
