import { RootState } from "@/store";
import { Wallet } from "./walletSlice";
import { Currency } from "./walletCurrencies";
import { selectTotalsWithFilters } from "../transactions/transactionSelectors";

export type WalletTotals = {
  income: number;
  expense: number;
  balance: number;
};

export type WalletWithTotals = {
  wallet: Wallet;
} & WalletTotals;

export const selectWallets = (state: RootState): Wallet[] => {
  return state.wallets.items;
};

export const selectWalletById = (
  state: RootState,
  id: string
): Wallet | undefined => {
  if (!id) return undefined;
  return state.wallets.items.find((wallet) => wallet.id === id);
};

export const selectWalletExists = (state: RootState, id: string): boolean => {
  const match = state.wallets.items.find((wallet) => wallet.id === id);
  if (!match) {
    return false;
  } else {
    return true;
  }
};

export const selectWalletOptions = (
  state: RootState
): Array<{ id: string; currency: Currency }> =>
  /*   const walletsInShort: Array<{ id: string; currency: Currency }> = [];
  for (const wallet of state.wallets.items) {
    walletsInShort.push({ id: wallet.id, currency: wallet.currency });
  }
  return walletsInShort; */

  state.wallets.items.map((wallet) => ({
    id: wallet.id,
    currency: wallet.currency,
  }));

export const selectWalletTotals = (
  state: RootState,
  walletId: string
): WalletTotals => {
  return selectTotalsWithFilters(state, { walletId });
};

export const selectWalletWithTotals = (
  state: RootState,
  walletId: string
): WalletWithTotals | undefined => {
  const wallet = selectWalletById(state, walletId);
  if (!wallet) return undefined;

  const totals = selectWalletTotals(state, walletId);

  return {
    wallet,
    ...totals,
  };
};

export const selectWalletsWithTotals = (
  state: RootState
): WalletWithTotals[] => {
  const wallets = selectWallets(state);

  return wallets.map((wallet) => {
    const totals = selectWalletTotals(state, wallet.id);
    return { wallet, ...totals };
  });
};
