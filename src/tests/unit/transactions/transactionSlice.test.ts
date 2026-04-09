import reducer, {
  addTransaction,
  removeTransaction,
  editTransaction,
  setTransactions,
  clearAllTransactions,
  removeTransactionsByWallet,
  TransactionState,
  Transaction,
} from '@/features/transactions/transactionSlice';

describe('transactionsSlice', () => {
  const createInitialState = (): TransactionState => ({
    items: [],
  });

  const createTx = (overrides: Partial<Transaction> = {}): Transaction => ({
    id: '1',
    type: 'income',
    amount: 1000,
    date: '2025-01-01',
    name: 'Test transaction',
    walletId: '11',
    ...overrides,
  });

  it('should return the initial state', () => {
    const initialState = createInitialState();
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addTransaction', () => {
    const initialState = createInitialState();

    const newTx = createTx();

    const nextState = reducer(initialState, addTransaction(newTx));

    expect(nextState.items).toHaveLength(1);

    expect(nextState.items[0]).toEqual(newTx);
  });

  it('should remove a transaction', () => {
    const initialState = createInitialState();

    const newTx1 = createTx();

    const newTx2 = createTx({
      id: '2',
      type: 'expense',
      amount: 500,
      walletId: '11',
    });

    const newTx3 = createTx({
      id: '3',
      type: 'income',
      amount: 200,
      walletId: '11',
    });

    const populatedState: TransactionState = {
      ...initialState,
      items: [newTx1, newTx2, newTx3],
    };

    const nextState = reducer(populatedState, removeTransaction({ id: '2' }));

    expect(nextState.items).toHaveLength(2);
    expect(nextState.items.find((tx) => tx.id === '2')).toBeUndefined();
    expect(nextState.items.find((tx) => tx.id === '1')).toEqual(newTx1);
    expect(nextState.items.find((tx) => tx.id === '3')).toEqual(newTx3);
  });

  it('should edit the particular property of the transaction', () => {
    const initialState = createInitialState();

    const newTx1 = createTx();

    const newTx2 = createTx({
      id: '2',
      type: 'income',
      amount: 500,
      walletId: '11',
    });

    const populatedState: TransactionState = {
      ...initialState,
      items: [newTx1, newTx2],
    };

    const nextState = reducer(
      populatedState,
      editTransaction({ id: '2', changes: { amount: 2100 } })
    );

    const updatedTx = nextState.items.find((tx) => tx.id === '2');

    expect(updatedTx?.amount).toBe(2100);
    expect(updatedTx?.type).toBe('income');
    expect(updatedTx?.walletId).toBe('11');
    expect(updatedTx?.name).toBe('Test transaction');

    expect(nextState.items.find((tx) => tx.id === '1')).toEqual(newTx1);
  });

  it('should edit multiple properties of the transaction', () => {
    const initialState = createInitialState();

    const newTx1 = createTx();

    const newTx2 = createTx({
      id: '2',
      type: 'income',
      amount: 500,
      walletId: '11',
    });

    const populatedState: TransactionState = {
      ...initialState,
      items: [newTx1, newTx2],
    };

    const nextState = reducer(
      populatedState,
      editTransaction({
        id: '2',
        changes: { amount: 100, type: 'expense', name: 'Updated Tx' },
      })
    );

    const updatedTx = nextState.items.find((tx) => tx.id === '2');

    expect(updatedTx?.amount).toBe(100);
    expect(updatedTx?.type).toBe('expense');
    expect(updatedTx?.walletId).toBe('11');
    expect(updatedTx?.name).toBe('Updated Tx');

    expect(nextState.items.find((tx) => tx.id === '1')).toEqual(newTx1);
  });

  it('should erase all the transactions', () => {
    const initialState = createInitialState();

    const newTx1 = createTx();

    const newTx2 = createTx({
      id: '2',
      type: 'expense',
      amount: 500,
      walletId: '11',
    });

    const populatedState: TransactionState = {
      ...initialState,
      items: [newTx1, newTx2],
    };

    const nextState = reducer(populatedState, clearAllTransactions());

    expect(nextState.items).toEqual([]);
  });

  it('should not change state if transaction id does not exist for editTransaction', () => {
    const initialState = createInitialState();

    const newTx1 = createTx();

    const newTx2 = createTx({
      id: '2',
      type: 'expense',
      amount: 500,
      walletId: '11',
    });

    const populatedState: TransactionState = {
      ...initialState,
      items: [newTx1, newTx2],
    };

    const nextState = reducer(
      populatedState,
      editTransaction({ id: '999', changes: { amount: 9999 } })
    );

    expect(nextState).toEqual(populatedState);
  });

  it('should not change state if transaction id does not exist for removeTransaction', () => {
    const initialState = createInitialState();

    const newTx1 = createTx();

    const newTx2 = createTx({
      id: '2',
      type: 'expense',
      walletId: '11',
      amount: 500,
    });

    const populatedState: TransactionState = {
      ...initialState,
      items: [newTx1, newTx2],
    };

    const nextState = reducer(populatedState, removeTransaction({ id: '999' }));

    expect(nextState).toEqual(populatedState);
  });

  it('should replace all transactions with setTransactions', () => {
    const initialState = createInitialState();

    const tx1 = createTx();

    const tx2 = createTx({
      id: '2',
      type: 'expense',
      amount: 500,
      walletId: '11',
    });

    const nextState = reducer(initialState, setTransactions([tx1, tx2]));

    expect(nextState.items).toHaveLength(2);
    expect(nextState.items).toEqual([tx1, tx2]);
  });

  it('should overwrite existing items when setTransactions is called', () => {
    const initialState: TransactionState = {
      items: [
        {
          id: 'old',
          type: 'income',
          amount: 50,
          date: '2025-01-01',
          walletId: '11',
        },
      ],
    };

    const newTx: Transaction = {
      id: 'new',
      type: 'expense',
      amount: 999,
      walletId: '11',
      date: '2025-02-02',
    };

    const nextState = reducer(initialState, setTransactions([newTx]));

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0]).toEqual(newTx);
  });

  it('should remove transactions by wallet id', () => {
    const initialState = createInitialState();

    const newTx1 = createTx();

    const newTx2 = createTx({
      id: '2',
      type: 'expense',
      amount: 500,
      walletId: '11',
    });

    const newTx3 = createTx({
      id: '3',
      type: 'income',
      amount: 200,
      walletId: '22',
    });

    const populatedState: TransactionState = {
      ...initialState,
      items: [newTx1, newTx2, newTx3],
    };

    const nextState = reducer(
      populatedState,
      removeTransactionsByWallet({ walletId: '11' })
    );

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0]).toEqual(newTx3);
    expect(nextState.items.find((tx) => tx.walletId === '11')).toBeUndefined();
  });

  it('should not change state if wallet id does not exist for removeTransactionsByWallet', () => {
    const initialState = createInitialState();

    const newTx1 = createTx();

    const newTx2 = createTx({
      id: '2',
      type: 'expense',
      amount: 500,
      walletId: '11',
    });

    const populatedState: TransactionState = {
      ...initialState,
      items: [newTx1, newTx2],
    };

    const nextState = reducer(
      populatedState,
      removeTransactionsByWallet({ walletId: '999' })
    );

    expect(nextState).toEqual(populatedState);
  });

  it('should leave state unchanged if clearAllTransactions is called on an already empty state', () => {
    const initialState = createInitialState();

    const nextState = reducer(initialState, clearAllTransactions());

    expect(nextState).toEqual(initialState);
  });
});
