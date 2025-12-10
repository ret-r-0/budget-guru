import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Currency } from "./walletCurrencies";

export interface Wallet {
  id: string;
  name: string;
  currency: Currency;
}

export interface WalletState {
  items: Wallet[];
}

const initialState: WalletState = { items: [] };

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    addWallet(state: WalletState, action: PayloadAction<Wallet>) {
      state.items.push(action.payload);
    },
    removeWallet(state: WalletState, action: PayloadAction<{ id: string }>) {
      state.items = state.items.filter(
        (wallet) => wallet.id !== action.payload.id
      );
    },
    updateWallet(
      state: WalletState,
      action: PayloadAction<{ id: string; changes: Partial<Wallet> }>
    ) {
      const { id, changes } = action.payload;
      const wallet = state.items.find((wallet) => wallet.id === id);
      if (!wallet) return;

      Object.assign(wallet, changes);
    },
  },
});

export const { addWallet, removeWallet, updateWallet } = walletSlice.actions;

export default walletSlice.reducer;
