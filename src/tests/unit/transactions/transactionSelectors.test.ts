import {
  selectTransactions,
  selectTransactionById,
  selectTotalsByType,
  selectTotalsWithFilters,
  selectTransactionsByWallet,
} from '@/features/transactions/transactionSelectors';

import type { Transaction } from '@/features/transactions/transactionSlice';
import type { RootState } from '@/store';

const createTx = (overrides: Partial<Transaction> = {}): Transaction => ({
  id: overrides.id ?? '1',
  type: overrides.type ?? 'income',
  amount: overrides.amount ?? 100,
  date: overrides.date ?? '2026-01-01',
  name: overrides.name,
  walletId: overrides.walletId ?? '1',
});

const createState = (items: Transaction[] = []): RootState =>
  ({
    transactions: { items },
  }) as RootState;

describe('transactionSelectors', () => {
  it('selectTransactions should return all transactions', () => {
    const tx1 = createTx();
    const tx2 = createTx({ id: '2', amount: 200 });

    const state = createState([tx1, tx2]);

    expect(selectTransactions(state)).toEqual([tx1, tx2]);
  });

  it('selectTransactionById should return transaction by id', () => {
    const tx1 = createTx();
    const tx2 = createTx({ id: '2', amount: 200 });

    const state = createState([tx1, tx2]);

    expect(selectTransactionById(state, '1')).toEqual(tx1);
    expect(selectTransactionById(state, '2')).toEqual(tx2);
  });

  it('selectTransactionById should return undefined if id does not exist', () => {
    const tx1 = createTx();
    const tx2 = createTx({ id: '2', amount: 200, type: 'expense' });

    const state = createState([tx1, tx2]);

    expect(selectTransactionById(state, '3')).toBeUndefined();
  });

  it('selectTotalsWithFilters should calculate totals without filters', () => {
    const tx1 = createTx({ date: '2025-12-19', amount: 500, walletId: '1' });
    const tx2 = createTx({
      id: '2',
      amount: 200,
      type: 'expense',
      date: '2025-12-25',
      walletId: '1',
    });
    const tx3 = createTx({
      id: '3',
      amount: 700,
      type: 'expense',
      date: '2026-01-05',
      walletId: '1',
    });
    const tx4 = createTx({
      id: '4',
      amount: 2100,
      date: '2025-12-27',
      walletId: '1',
    });

    const state = createState([tx1, tx2, tx3, tx4]);

    const { income, expense, balance } = selectTotalsWithFilters(state, {
      from: undefined,
      to: undefined,
      filterType: 'all',
      walletId: '1',
    });

    expect(income).toBe(2600);
    expect(expense).toBe(900);
    expect(balance).toBe(1700);
  });

  it('selectTotalsWithFilters should respect date range', () => {
    const tx1 = createTx({ date: '2025-12-19', amount: 500 });
    const tx2 = createTx({
      id: '2',
      amount: 200,
      type: 'expense',
      date: '2025-12-25',
    });
    const tx3 = createTx({
      id: '3',
      amount: 700,
      type: 'expense',
      date: '2026-01-05',
    });
    const tx4 = createTx({ id: '4', amount: 2100, date: '2025-12-27' });

    const state = createState([tx1, tx2, tx3, tx4]);

    const { income, expense, balance } = selectTotalsWithFilters(state, {
      from: '2025-12-01',
      to: '2025-12-31',
      walletId: '1',
    });

    expect(income).toBe(2600);
    expect(expense).toBe(200);
    expect(balance).toBe(2400);
  });

  it('selectTotalsWithFilters should apply filterType = income', () => {
    const tx1 = createTx({ date: '2025-12-19', amount: 500 });
    const tx2 = createTx({
      id: '2',
      amount: 200,
      type: 'expense',
      date: '2025-12-25',
    });
    const tx3 = createTx({
      id: '3',
      amount: 700,
      type: 'expense',
      date: '2026-01-05',
    });
    const tx4 = createTx({ id: '4', amount: 2100, date: '2025-12-27' });

    const state = createState([tx1, tx2, tx3, tx4]);

    const { income, expense, balance } = selectTotalsWithFilters(state, {
      filterType: 'income',
      walletId: '1',
    });

    expect(income).toBe(2600);
    expect(expense).toBe(0);
    expect(balance).toBe(2600);
  });

  it('selectTotalsWithFilters should apply filterType = expense', () => {
    const tx1 = createTx({ amount: 2600 });
    const tx2 = createTx({ id: '2', amount: 600, type: 'expense' });
    const tx3 = createTx({ id: '3', amount: 500, type: 'expense' });

    const state = createState([tx1, tx2, tx3]);

    const { income, expense, balance } = selectTotalsWithFilters(state, {
      filterType: 'expense',
      walletId: '1',
    });

    expect(income).toBe(0);
    expect(expense).toBe(1100);
    expect(balance).toBe(-1100);
  });

  it('selectTotalsByType should return 0 for invalid date range', () => {
    const tx1 = createTx({ amount: 500, date: '2025-12-19' });
    const tx2 = createTx({
      id: '2',
      amount: 200,
      type: 'expense',
      date: '2026-01-12',
    });
    const tx3 = createTx({
      id: '3',
      amount: 700,
      type: 'expense',
      date: '2025-12-06',
    });
    const tx4 = createTx({ id: '4', amount: 2100, date: '2025-12-27' });

    const state = createState([tx1, tx2, tx3, tx4]);

    const { income, expense } = selectTotalsByType(
      state,
      {
        from: '2025-12-40',
        to: '2026-01-38',
      },
      '1'
    );

    expect(income).toBe(0);
    expect(expense).toBe(0);
  });

  it('selectTotalsByType should ignore transactions with invalid transaction dates', () => {
    const tx1 = createTx({ amount: 300, type: 'income', date: '2025-12-30' });
    const tx2 = createTx({ amount: 200, type: 'expense', date: 'not-a-date' });
    const tx3 = createTx({ amount: 200, type: 'expense', date: '2025-12-27' });

    const state = createState([tx1, tx2, tx3]);

    const { income, expense } = selectTotalsByType(
      state,
      {
        from: '2025-12-01',
        to: '2025-12-31',
      },
      '1'
    );

    expect(income).toBe(300);
    expect(expense).toBe(200);
  });

  it('selectTotalsWithFilters should ignore transactions with invalid transaction dates', () => {
    const tx1 = createTx({ amount: 300, type: 'income', date: '2025-12-30' });
    const tx2 = createTx({ amount: 200, type: 'expense', date: 'not-a-date' });

    const state = createState([tx1, tx2]);

    const { income, expense, balance } = selectTotalsWithFilters(state, {
      from: '2025-12-01',
      to: '2025-12-31',
      filterType: 'all',
      walletId: '1',
    });

    expect(income).toBe(300);
    expect(expense).toBe(0);
    expect(balance).toBe(300);
  });

  it('selectTransactionsByWallet should return only wallet transactions', () => {
    const tx1 = createTx({ id: '1', walletId: '1', amount: 100 });
    const tx2 = createTx({ id: '2', walletId: '1', amount: 200 });
    const tx3 = createTx({ id: '3', walletId: '2', amount: 300 });
    const tx4 = createTx({ id: '4', walletId: '2', amount: 400 });

    const state = createState([tx1, tx2, tx3, tx4]);

    const wallet1Txs = selectTransactionsByWallet(state, '1');
    const wallet2Txs = selectTransactionsByWallet(state, '2');

    expect(wallet1Txs).toEqual([tx1, tx2]);
    expect(wallet2Txs).toEqual([tx3, tx4]);
  });

  it('selectTotalsByType should return transactions only for the specified wallet', () => {
    const tx1 = createTx({
      id: '1',
      walletId: '1',
      amount: 100,
      date: '2025-12-19',
    });
    const tx2 = createTx({
      id: '2',
      walletId: '1',
      amount: 200,
      type: 'expense',
      date: '2025-12-25',
    });
    const tx3 = createTx({
      id: '3',
      walletId: '2',
      amount: 300,
      date: '2025-12-27',
    });

    const state = createState([tx1, tx2, tx3]);

    const { income, expense } = selectTotalsByType(
      state,
      { from: '2025-12-01', to: '2025-12-31' },
      '1'
    );

    expect(income).toBe(100);
    expect(expense).toBe(200);
  });

  it('selectTotalsWithFilters should return transactions only for the specified wallet', () => {
    const tx1 = createTx({
      id: '1',
      walletId: '1',
      amount: 100,
      date: '2025-12-19',
    });
    const tx2 = createTx({
      id: '2',
      walletId: '1',
      amount: 200,
      type: 'expense',
      date: '2025-12-25',
    });
    const tx3 = createTx({
      id: '3',
      walletId: '2',
      amount: 300,
      date: '2025-12-27',
    });

    const state = createState([tx1, tx2, tx3]);

    const { income, expense, balance } = selectTotalsWithFilters(state, {
      from: '2025-12-01',
      to: '2025-12-31',
      filterType: 'all',
      walletId: '1',
    });

    expect(income).toBe(100);
    expect(expense).toBe(200);
    expect(balance).toBe(-100);
  });

  it('selectTotalsWithFilters should include transactions at day start and day end boundaries', () => {
    const tx1 = createTx({
      id: '1',
      walletId: '1',
      amount: 100,
      date: '2025-12-31T00:00:00.000',
    });
    const tx2 = createTx({
      id: '2',
      walletId: '1',
      amount: 40,
      type: 'expense',
      date: '2025-12-31T23:59:59.999',
    });
    const tx3 = createTx({
      id: '3',
      walletId: '1',
      amount: 999,
      type: 'expense',
      date: '2026-01-01T00:00:00.000',
    });

    const state = createState([tx1, tx2, tx3]);

    const { income, expense, balance } = selectTotalsWithFilters(state, {
      from: '2025-12-31',
      to: '2025-12-31',
      filterType: 'all',
      walletId: '1',
    });

    expect(income).toBe(100);
    expect(expense).toBe(40);
    expect(balance).toBe(60);
  });

  it('selectTotalsByType income and expense should be 0 if from date is later than to date', () => {
    const tx1 = createTx({ amount: 500, date: '2025-12-19' });
    const tx2 = createTx({
      id: '2',
      amount: 200,
      type: 'expense',
      date: '2025-12-25',
    });

    const state = createState([tx1, tx2]);

    const { income, expense } = selectTotalsByType(
      state,
      {
        from: '2025-12-31',
        to: '2025-12-01',
      },
      '1'
    );

    expect(income).toBe(0);
    expect(expense).toBe(0);
  });

  it('selectTotalsWithFilters income and expense should be 0 if from date is later than to date', () => {
    const tx1 = createTx({ amount: 500, date: '2025-12-19' });
    const tx2 = createTx({
      id: '2',
      amount: 200,
      type: 'expense',
      date: '2025-12-25',
    });

    const state = createState([tx1, tx2]);

    const { income, expense } = selectTotalsWithFilters(state, {
      from: '2025-12-31',
      to: '2025-12-01',
      filterType: 'all',
      walletId: '1',
    });

    expect(income).toBe(0);
    expect(expense).toBe(0);
  });
});
