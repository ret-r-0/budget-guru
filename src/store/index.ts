import { configureStore } from "@reduxjs/toolkit";
import transactionsReducer, {
  TransactionState,
} from "@/features/transactions/transactionSlice";
import walletReducer, { WalletState } from "@/features/wallets/walletSlice";

const isBrowser = typeof window !== "undefined";

type PreloadedState = { wallets: WalletState; transactions: TransactionState };

const STORAGE_KEY = "budgetGuruState";

const loadState = (): PreloadedState | undefined => {
  if (!isBrowser) return undefined;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;

    const parsed = JSON.parse(raw) as PreloadedState;

    if (!parsed.transactions || !parsed.wallets) {
      return undefined;
    }

    return parsed;
  } catch {
    return undefined;
  }
};

const preloaded = loadState();

export const store = configureStore({
  reducer: { wallets: walletReducer, transactions: transactionsReducer },
  preloadedState: preloaded,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const saveState = (state: RootState) => {
  if (!isBrowser) return;

  try {
    const stateToSave = {
      transactions: state.transactions,
      wallets: state.wallets,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (e) {
    return undefined;
  }
};

store.subscribe(() => {
  const state = store.getState();
  saveState(state);
});
