import reducer, {
  addTransaction,
  removeTransaction,
  editTransaction,
  setTransactions,
  clearAllTransactions,
  TransactionState,
  Transaction,
} from "@/features/transactions/transactionSlice";

describe("transactionsSlice", () => {
  const createInitialState = (): TransactionState => ({
    items: [],
  });

  const createTx = (overrides: Partial<Transaction> = {}): Transaction => ({
    id: "1",
    type: "income",
    amount: 100,
    categoryId: "salary",
    date: "2025-01-01",
    name: "Test transaction",
    ...overrides,
  });

  it("should handle addTransaction", () => {
    const initialState = createInitialState();

    const newTx = createTx();

    const nextState = reducer(initialState, addTransaction(newTx));

    expect(nextState.items).toHaveLength(1);

    expect(nextState.items[0]).toEqual(newTx);
  });

  it("should remove a transaction", () => {
    const initialState = createInitialState();

    const newTx1 = createTx();

    const newTx2 = createTx({
      id: "2",
      type: "expense",
      categoryId: "food",
      amount: 500,
    });

    const newTx3 = createTx({
      id: "3",
      type: "income",
      amount: 200,
      categoryId: "lessons",
    });

    const populatedState: TransactionState = {
      ...initialState,
      items: [newTx1, newTx2, newTx3],
    };

    const nextState = reducer(populatedState, removeTransaction({ id: "2" }));

    expect(nextState.items).toHaveLength(2);
    expect(nextState.items.find((tx) => tx.id === "2")).toBeUndefined();
    expect(nextState.items.find((tx) => tx.id === "1")).toEqual(newTx1);
    expect(nextState.items.find((tx) => tx.id === "3")).toEqual(newTx3);
  });

  it("should edit the particular property of the transaction", () => {
    const initialState = createInitialState();

    const newTx1 = createTx();

    const newTx2 = createTx({
      id: "2",
      type: "expense",
      categoryId: "food",
      amount: 500,
    });

    const populatedState: TransactionState = {
      ...initialState,
      items: [newTx1, newTx2],
    };

    const nextState = reducer(
      populatedState,
      editTransaction({ id: "1", changes: { amount: 2100 } })
    );

    const updatedTx = nextState.items.find((tx) => tx.id === "1");

    expect(updatedTx?.amount).toBe(2100);
    expect(updatedTx?.type).toBe("income");
    expect(updatedTx?.categoryId).toBe("salary");
    expect(updatedTx?.name).toBe("Test transaction");

    expect(nextState.items.find((tx) => tx.id === "2")).toEqual(newTx2);
  });

  it("should erase all the transactions", () => {
    const initialState = createInitialState();

    const newTx1 = createTx();

    const newTx2 = createTx({
      id: "2",
      type: "expense",
      categoryId: "food",
      amount: 500,
    });

    const populatedState: TransactionState = {
      ...initialState,
      items: [newTx1, newTx2],
    };

    const nextState = reducer(populatedState, clearAllTransactions());

    expect(nextState.items).toEqual([]);
  });

  it("should not change state if transaction id does not exist for editTransaction", () => {
    const initialState = createInitialState();

    const newTx1 = createTx();

    const newTx2 = createTx({
      id: "2",
      type: "expense",
      categoryId: "food",
      amount: 500,
    });

    const populatedState: TransactionState = {
      ...initialState,
      items: [newTx1, newTx2],
    };

    const nextState = reducer(
      populatedState,
      editTransaction({ id: "999", changes: { amount: 9999 } })
    );

    expect(nextState).toEqual(populatedState);
  });

  it("should not change state if transaction id does not exist for removeTransaction", () => {
    const initialState = createInitialState();

    const newTx1 = createTx();

    const newTx2 = createTx({
      id: "2",
      type: "expense",
      categoryId: "food",
      amount: 500,
    });

    const populatedState: TransactionState = {
      ...initialState,
      items: [newTx1, newTx2],
    };

    const nextState = reducer(populatedState, removeTransaction({ id: "999" }));

    expect(nextState).toEqual(populatedState);
  });

  it("should replace all transactions with setTransactions", () => {
    const initialState = createInitialState();

    const tx1 = createTx();

    const tx2 = createTx({
      id: "2",
      type: "expense",
      categoryId: "food",
      amount: 500,
    });

    const nextState = reducer(initialState, setTransactions([tx1, tx2]));

    expect(nextState.items).toHaveLength(2);
    expect(nextState.items).toEqual([tx1, tx2]);
  });

  it("should overwrite existing items when setTransactions is called", () => {
    const initialState: TransactionState = {
      items: [
        {
          id: "old",
          type: "income",
          amount: 50,
          categoryId: "test",
          date: "2025-01-01",
        },
      ],
    };

    const newTx: Transaction = {
      id: "new",
      type: "expense",
      amount: 999,
      categoryId: "other",
      date: "2025-02-02",
    };

    const nextState = reducer(initialState, setTransactions([newTx]));

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0]).toEqual(newTx);
  });
});
